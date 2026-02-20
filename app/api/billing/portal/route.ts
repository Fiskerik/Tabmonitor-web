import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '@/lib/supabase-admin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' as any });

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

    const cleanEmail = email.trim().toLowerCase();
    const origin = new URL(req.url).origin;

    const { data: license, error } = await supabaseAdmin
      .from('licenses')
      .select('stripe_customer_id')
      .eq('email', cleanEmail)
      .single();

    if (error || !license?.stripe_customer_id) {
      return NextResponse.json({ error: 'No billing account found for this email' }, { status: 404 });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: license.stripe_customer_id,
      return_url: `${origin}/`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
