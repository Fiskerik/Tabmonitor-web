// app/api/billing/portal/route.ts
// Fix: Payment Link users have stripe_customer_id = NULL in Supabase.
// Fall back to looking up customer by email in Stripe directly.

import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getAuthenticatedEmail } from '@/lib/auth';
import { getStripeServerClient } from '@/lib/stripe-server';


export async function POST(req: Request) {
  const stripe = getStripeServerClient();
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

    const authenticatedEmail = await getAuthenticatedEmail(req);
    if (!authenticatedEmail) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const cleanEmail = email.trim().toLowerCase();
    if (cleanEmail !== authenticatedEmail) {
      return NextResponse.json({ error: 'Email mismatch' }, { status: 403 });
    }
    const origin = new URL(req.url).origin;

    // 1. Look up license row
    const { data: license } = await supabaseAdmin
      .from('licenses')
      .select('stripe_customer_id')
      .eq('email', cleanEmail)
      .single();

    let customerId = license?.stripe_customer_id || null;

    // 2. If no customer ID stored (Payment Link flow), search Stripe by email
    if (!customerId) {
      const customers = await stripe.customers.list({ email: cleanEmail, limit: 5 });
      // Pick the customer with an active subscription if multiple exist
      for (const c of customers.data) {
        const subs = await stripe.subscriptions.list({ customer: c.id, status: 'all', limit: 1 });
        if (subs.data.length > 0) {
          customerId = c.id;
          // Backfill stripe_customer_id so future lookups are instant
          await supabaseAdmin
            .from('licenses')
            .update({ stripe_customer_id: customerId, updated_at: new Date().toISOString() })
            .eq('email', cleanEmail);
          break;
        }
      }
      // If still nothing, just use first customer found
      if (!customerId && customers.data.length > 0) {
        customerId = customers.data[0].id;
        await supabaseAdmin
          .from('licenses')
          .update({ stripe_customer_id: customerId, updated_at: new Date().toISOString() })
          .eq('email', cleanEmail);
      }
    }

    if (!customerId) {
      return NextResponse.json(
        { error: 'No Stripe account found for this email. Have you subscribed yet?' },
        { status: 404 }
      );
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${origin}/`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
