// app/api/billing/checkout/route.ts
// Handles both regular checkout and 3-day free trial (card required, no charge for 3 days)

import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '@/lib/supabase-admin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' as any });

export async function POST(req: Request) {
  try {
    const { email, plan = 'monthly', trial = false } = await req.json();
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

    const cleanEmail = email.trim().toLowerCase();
    const origin = new URL(req.url).origin;

    const priceId = plan === 'yearly'
      ? process.env.STRIPE_PRICE_YEARLY
      : process.env.STRIPE_PRICE_MONTHLY;

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
      mode: 'subscription',
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${origin}/`,
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
    };

    // 3-day trial: card required upfront, no charge for 3 days
    if (trial) {
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
