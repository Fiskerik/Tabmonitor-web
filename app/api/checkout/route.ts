// app/api/billing/checkout/route.ts
// Handles both regular checkout and 3-day free trial (card required, no charge for 3 days)

import { NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getAuthenticatedEmail } from '@/lib/auth';
import { getStripeServerClient } from '@/lib/stripe-server';

const PLAN_PRICE_ENV: Record<string, string> = {
  monthly: 'STRIPE_PRICE_MONTHLY',
  yearly: 'STRIPE_PRICE_YEARLY',
  lifetime: 'STRIPE_PRICE_LIFETIME',
};

function normalizePlan(plan: unknown) {
  const normalized = typeof plan === 'string' ? plan.toLowerCase().trim() : 'monthly';
  return normalized in PLAN_PRICE_ENV ? normalized : 'monthly';
}

export async function POST(req: Request) {
  const stripe = getStripeServerClient();
  try {
    const { email, plan = 'monthly', trial = false } = await req.json();
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });
    const normalizedPlan = normalizePlan(plan);

    const authenticatedEmail = await getAuthenticatedEmail(req);
    if (!authenticatedEmail) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const cleanEmail = email.trim().toLowerCase();
    if (cleanEmail !== authenticatedEmail) {
      return NextResponse.json({ error: 'Email mismatch' }, { status: 403 });
    }
    const origin = new URL(req.url).origin;

    const priceId = process.env[PLAN_PRICE_ENV[normalizedPlan]];

    if (!priceId) return NextResponse.json({ error: 'Stripe price ID not configured' }, { status: 500 });

    // Ensure user row exists in Supabase
    await supabaseAdmin
      .from('licenses')
      .upsert({ email: cleanEmail }, { onConflict: 'email', ignoreDuplicates: true });

    // Fetch or create Stripe customer
    const { data: license } = await supabaseAdmin
      .from('licenses')
      .select('stripe_customer_id')
      .eq('email', cleanEmail)
      .single();

    let customerId = license?.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({ email: cleanEmail });
      customerId = customer.id;
      await supabaseAdmin
        .from('licenses')
        .update({ stripe_customer_id: customerId })
        .eq('email', cleanEmail);
    }

    // Build checkout session params
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: normalizedPlan === 'lifetime' ? 'payment' : 'subscription',
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${origin}/`,
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      metadata: { plan: normalizedPlan },
    };

    // 3-day trial: card required upfront, no charge for 3 days
    if (trial && normalizedPlan !== 'lifetime') {
      sessionParams.subscription_data = {
        trial_period_days: 3,
        trial_settings: {
          end_behavior: {
            missing_payment_method: 'cancel', // auto-cancel if card fails after trial
          },
        },
      };
      // Must collect payment method upfront for trial
      sessionParams.payment_method_collection = 'always';
    }

    const session = await stripe.checkout.sessions.create(sessionParams);
    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('checkout error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
