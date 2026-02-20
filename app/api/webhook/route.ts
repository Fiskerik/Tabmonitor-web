import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '@/lib/supabase-admin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' as any });

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook error: ${err.message}` }, { status: 400 });
  }

  const data = event.data.object as any;

  try {
    if (event.type === 'checkout.session.completed') {
      const customerId = data.customer as string;
      const subscriptionId = data.subscription as string;

      // Get subscription details for period end
      let periodEnd: number | null = null;
      if (subscriptionId) {
        const sub = await stripe.subscriptions.retrieve(subscriptionId);
        periodEnd = sub.current_period_end;
      }

      await supabaseAdmin
        .from('licenses')
        .update({
          is_active: true,
          plan: 'pro',
          stripe_subscription_id: subscriptionId,
          current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
          updated_at: new Date().toISOString(),
        })
        .eq('stripe_customer_id', customerId);
    }

    if (event.type === 'customer.subscription.updated') {
      const activeStatuses = ['active', 'trialing'];
      const isActive = activeStatuses.includes(data.status);

      await supabaseAdmin
        .from('licenses')
        .update({
          is_active: isActive,
          plan: isActive ? 'pro' : 'free',
          stripe_subscription_id: data.id,
          current_period_end: new Date(data.current_period_end * 1000).toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('stripe_customer_id', data.customer);
    }

    if (event.type === 'customer.subscription.deleted') {
      await supabaseAdmin
        .from('licenses')
        .update({
          is_active: false,
          plan: 'free',
          stripe_subscription_id: null,
          current_period_end: null,
          updated_at: new Date().toISOString(),
        })
        .eq('stripe_customer_id', data.customer);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
