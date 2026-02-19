import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

function getRequiredEnv(name: 'STRIPE_SECRET_KEY' | 'STRIPE_PRICE_ID') {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export async function POST(request: NextRequest) {
  try {
    const stripeSecretKey = getRequiredEnv('STRIPE_SECRET_KEY');
    const stripePriceId = getRequiredEnv('STRIPE_PRICE_ID');

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16' as any,
    });

    const origin = new URL(request.url).origin;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: stripePriceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/success`,
      cancel_url: `${origin}/`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown checkout error';
    console.error('Checkout session error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
