// app/api/webhook/route.ts
// CRITICAL FIX: Payment Links create new Stripe customers that aren't pre-linked in Supabase.
// We must fall back to email lookup when stripe_customer_id match finds 0 rows.

import { NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getStripeServerClient } from '@/lib/stripe-server';


// Helper: update license by customer ID, falling back to email if no rows matched
async function updateLicenseByCustomer(
  customerId: string,
  email: string | null | undefined,
  fields: Record<string, any>
) {
  const stripe = getStripeServerClient();

  // 1. Try by stripe_customer_id (normal checkout flow)
  const { data: byId, error: idErr } = await supabaseAdmin
    .from('licenses')
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq('stripe_customer_id', customerId)
    .select('email');

  if (byId && byId.length > 0) {
    console.log(`[webhook] Updated license for customer ${customerId}`);
    return;
  }

  // 2. Payment Link flow: no pre-existing row with this customer_id.
  //    Fall back to email from checkout.session.customer_details.email
  if (!email) {
    // Last resort: fetch customer from Stripe to get email
    try {
      const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
      email = customer.email;
    } catch (e) {
      console.error('[webhook] Could not retrieve customer email from Stripe', e);
    }
  }

  if (!email) {
    console.error(`[webhook] No email found for customer ${customerId} — cannot update license`);
    return;
  }

  const cleanEmail = email.trim().toLowerCase();

  // Upsert: create row if it doesn't exist, otherwise update
  const { error: upsertErr } = await supabaseAdmin
    .from('licenses')
    .upsert(
      {
        email: cleanEmail,
        stripe_customer_id: customerId, // link for future events
        ...fields,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'email' }
    );

  if (upsertErr) {
    console.error('[webhook] Upsert by email failed:', upsertErr);
  } else {
    console.log(`[webhook] Updated/created license for email ${cleanEmail}`);
  }
}

export async function POST(req: Request) {
  const stripe = getStripeServerClient();
  const body = await req.text();
  const signature = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    console.error('[webhook] Signature verification failed:', err.message);
    return NextResponse.json({ error: `Webhook error: ${err.message}` }, { status: 400 });
  }

  const data = event.data.object as any;

  try {
    // ── checkout.session.completed ──────────────────────────────────────────
    // Fires for both normal checkout AND Payment Links (3-day trial link)
    if (event.type === 'checkout.session.completed') {
      const customerId    = data.customer as string;
      const subscriptionId = data.subscription as string;
      // email is in customer_details for Payment Links
      const email = data.customer_details?.email || data.customer_email || null;

      let periodEnd: number | null = null;
      let trialEnd:  number | null = null;
      let isTrialing = false;

      if (subscriptionId) {
        const sub = await stripe.subscriptions.retrieve(subscriptionId) as any;
        periodEnd  = sub.current_period_end ?? null;
        trialEnd   = sub.trial_end ?? null;
        isTrialing = sub.status === 'trialing';
      }

      await updateLicenseByCustomer(customerId, email, {
        is_active:            true,
        plan:                 'pro',
        stripe_subscription_id: subscriptionId,
        current_period_end: data.current_period_end 
          ? new Date(data.current_period_end * 1000).toISOString() 
          : null,
        // Store trial end so the extension can show "Trial active until X"
        trial_ends_at: trialEnd 
          ? new Date(trialEnd * 1000).toISOString() 
          : null,
        stripe_customer_id:   customerId, // ensure it's always stored
      });
    }

    // ── customer.subscription.updated ──────────────────────────────────────
    // Fires when trial converts to paid, or subscription changes
    if (event.type === 'customer.subscription.updated') {
      const activeStatuses = ['active', 'trialing'];
      const isActive = activeStatuses.includes(data.status);
      const trialEnd = data.trial_end ?? null;

      // Get customer email as fallback
      let email: string | null = null;
      try {
        const customer = await stripe.customers.retrieve(data.customer) as Stripe.Customer;
        email = customer.email;
      } catch {}

      await updateLicenseByCustomer(data.customer, email, {
        is_active:            isActive,
        plan:                 isActive ? 'pro' : 'free',
        stripe_subscription_id: data.id,
        current_period_end:   new Date(data.current_period_end * 1000).toISOString(),
        trial_ends_at:        trialEnd ? new Date(trialEnd * 1000).toISOString() : null,
      });
    }

    // ── customer.subscription.deleted ──────────────────────────────────────
    if (event.type === 'customer.subscription.deleted') {
      let email: string | null = null;
      try {
        const customer = await stripe.customers.retrieve(data.customer) as Stripe.Customer;
        email = customer.email;
      } catch {}

      await updateLicenseByCustomer(data.customer, email, {
        is_active:            false,
        plan:                 'free',
        stripe_subscription_id: null,
        current_period_end:   null,
        trial_ends_at:        null,
      });
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error('[webhook] Handler error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
