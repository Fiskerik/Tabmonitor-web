// app/api/license/status/route.ts
// Fix: When stripe_customer_id is NULL (Payment Link users), look up Stripe by email
// to find any active subscription and backfill the customer ID.

import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '@/lib/supabase-admin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' as any });

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

    const cleanEmail = email.trim().toLowerCase();

    // Ensure row exists
    await supabaseAdmin
      .from('licenses')
      .upsert({ email: cleanEmail, updated_at: new Date().toISOString() }, { onConflict: 'email', ignoreDuplicates: true });

    // Fetch current license row
    const { data: row, error } = await supabaseAdmin
      .from('licenses')
      .select('*')
      .eq('email', cleanEmail)
      .single();

    if (error) throw error;

    // If stripe_customer_id is missing, try to find in Stripe by email
    // This covers users who subscribed via Payment Link (our 3-day trial link)
    if (!row.stripe_customer_id) {
      await syncFromStripe(cleanEmail, row);
      // Re-fetch after potential update
      const { data: updated } = await supabaseAdmin
        .from('licenses')
        .select('*')
        .eq('email', cleanEmail)
        .single();
      if (updated) return NextResponse.json(buildPayload(updated));
    }

    return NextResponse.json(buildPayload(row));
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

async function syncFromStripe(email: string, currentRow: any) {
  try {
    // Search Stripe for customers with this email
    const customers = await stripe.customers.list({ email, limit: 10 });
    if (!customers.data.length) return;

    // Find the customer with the most relevant active/trialing subscription
    let bestCustomerId: string | null = null;
    let bestSub: any = null;

    for (const customer of customers.data) {
      const subs = await stripe.subscriptions.list({
        customer: customer.id,
        status: 'all',
        limit: 5,
      });
      for (const sub of subs.data) {
        if (['active', 'trialing'].includes(sub.status)) {
          bestCustomerId = customer.id;
          bestSub = sub;
          break;
        }
        // Keep as fallback even if cancelled
        if (!bestCustomerId) {
          bestCustomerId = customer.id;
          bestSub = sub;
        }
      }
      if (bestSub?.status === 'active' || bestSub?.status === 'trialing') break;
    }

    if (!bestCustomerId) return;

    // Build update fields from Stripe subscription
    const fields: Record<string, any> = {
      stripe_customer_id: bestCustomerId,
      updated_at: new Date().toISOString(),
    };

    if (bestSub) {
      const isActive = ['active', 'trialing'].includes(bestSub.status);
      fields.is_active = isActive;
      fields.plan = isActive ? 'pro' : 'free';
      fields.stripe_subscription_id = bestSub.id;
      fields.current_period_end = new Date(bestSub.current_period_end * 1000).toISOString();
      if (bestSub.trial_end) {
        fields.trial_ends_at = new Date(bestSub.trial_end * 1000).toISOString();
      }
    }

    await supabaseAdmin.from('licenses').update(fields).eq('email', email);
    console.log(`[license/status] Backfilled Stripe data for ${email} → customer ${bestCustomerId}`);
  } catch (err) {
    console.error('[license/status] Stripe sync failed:', err);
  }
}

function buildPayload(row: any) {
  const now = Math.floor(Date.now() / 1000);
  const trialEndsAt = row.trial_ends_at
    ? Math.floor(new Date(row.trial_ends_at).getTime() / 1000)
    : null;
  const trialActive = trialEndsAt ? trialEndsAt > now : false;
  const active = row.is_active || trialActive;

  return {
    plan: active ? 'pro' : 'free',
    isActive: active,
    trialEndsAt,
    currentPeriodEnd: row.current_period_end
      ? Math.floor(new Date(row.current_period_end).getTime() / 1000)
      : null,
    features: {
      advancedStats:  active,
      rulesEngine:    active,
      weeklyReports:  active,
      csvExport:      active,
    },
    checkedAt: now,
  };
}
