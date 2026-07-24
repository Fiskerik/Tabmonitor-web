// app/api/billing/portal/route.ts
// Fix: Payment Link users have stripe_customer_id = NULL in Supabase.
// Fall back to looking up customer by email in Stripe directly.

import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getAuthenticatedEmail } from '@/lib/auth';
import { getStripeServerClient } from '@/lib/stripe-server';

const ACTIVE_SUBSCRIPTION_STATUSES = new Set(['active', 'trialing', 'past_due']);

async function findCustomerForPortal(stripe: ReturnType<typeof getStripeServerClient>, email: string, storedCustomerId?: string | null, storedSubscriptionId?: string | null) {
  if (storedSubscriptionId) {
    try {
      const subscription = await stripe.subscriptions.retrieve(storedSubscriptionId);
      if (typeof subscription.customer === 'string') {
        return {
          customerId: subscription.customer,
          subscriptionId: subscription.id,
        };
      }
    } catch (error: any) {
      console.log('[billing/portal] Stored subscription lookup failed', {
        email,
        subscriptionId: storedSubscriptionId,
        error: error?.message,
      });
    }
  }

  const customers = await stripe.customers.list({ email, limit: 10 });
  let fallbackCustomerId = storedCustomerId || customers.data[0]?.id || null;
  let fallbackSubscriptionId: string | null = null;

  for (const customer of customers.data) {
    const subs = await stripe.subscriptions.list({ customer: customer.id, status: 'all', limit: 10 });
    const activeSub = subs.data.find(sub => ACTIVE_SUBSCRIPTION_STATUSES.has(sub.status));
    if (activeSub) {
      return {
        customerId: customer.id,
        subscriptionId: activeSub.id,
      };
    }
    if (!fallbackSubscriptionId && subs.data[0]) {
      fallbackCustomerId = customer.id;
      fallbackSubscriptionId = subs.data[0].id;
    }
  }

  if (storedCustomerId) {
    try {
      const subs = await stripe.subscriptions.list({ customer: storedCustomerId, status: 'all', limit: 10 });
      const activeSub = subs.data.find(sub => ACTIVE_SUBSCRIPTION_STATUSES.has(sub.status));
      return {
        customerId: storedCustomerId,
        subscriptionId: activeSub?.id || subs.data[0]?.id || fallbackSubscriptionId,
      };
    } catch (error: any) {
      console.log('[billing/portal] Stored customer lookup failed', {
        email,
        customerId: storedCustomerId,
        error: error?.message,
      });
    }
  }

  return {
    customerId: fallbackCustomerId,
    subscriptionId: fallbackSubscriptionId,
  };
}

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
      .select('stripe_customer_id, stripe_subscription_id, plan, is_active')
      .eq('email', cleanEmail)
      .single();

    const portalTarget = await findCustomerForPortal(
      stripe,
      cleanEmail,
      license?.stripe_customer_id,
      license?.stripe_subscription_id,
    );
    const customerId = portalTarget.customerId;

    if (!customerId) {
      const proWithoutStripe = !!license?.is_active || ['pro', 'lifetime'].includes(String(license?.plan || '').toLowerCase());
      return NextResponse.json(
        {
          error: proWithoutStripe
            ? 'This Pro license is active, but no Stripe billing account is linked to it.'
            : 'No Stripe account found for this email. Have you subscribed yet?',
          code: proWithoutStripe ? 'PRO_WITHOUT_STRIPE_BILLING' : 'NO_STRIPE_CUSTOMER',
        },
        { status: 404 }
      );
    }

    await supabaseAdmin
      .from('licenses')
      .update({
        stripe_customer_id: customerId,
        stripe_subscription_id: portalTarget.subscriptionId || license?.stripe_subscription_id || null,
        updated_at: new Date().toISOString(),
      })
      .eq('email', cleanEmail);

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${origin}/`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
