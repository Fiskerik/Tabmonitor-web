import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' as any });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.STRIPE_SUPABASE_SERVICE_ROLE_KEY!); 
// Notera: Använd SERVICE_ROLE_KEY för att kunna skriva till DB från servern

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature')!;

  try {
    const event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const userEmail = session.customer_details?.email;

      // Uppdatera användaren i Supabase baserat på e-post
      const { error } = await supabase
        .from('profiles')
        .update({ is_premium: true, stripe_customer_id: session.customer as string })
        .eq('email', userEmail);

      if (error) throw error;
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}