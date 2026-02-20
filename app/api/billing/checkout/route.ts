import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '@/lib/supabase-admin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' as any });

export async function POST(req: Request) {
  try {
    const { email, plan = 'monthly' } = await req.json();
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

    const cleanEmail = email.trim().toLowerCase();
    const origin = new URL(req.url).origin;

    const priceId = plan === 'yearly'
      ? process.env.STRIPE_PRICE_YEARLY
      : process.env.STRIPE_PRICE_MONTHLY;

    if (!priceId) return NextResponse.json({ error: 'Stripe price ID not configured' }, { status: 500 });

    // Ensure user exists
    await supabaseAdmin
      .from('licenses')
      .upsert({ email: cleanEmail, updated_at: new Date().toISOString() }, { onConflict: 'email', ignoreDuplicates: true });

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

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/success`,
      cancel_url: `${origin}/`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
