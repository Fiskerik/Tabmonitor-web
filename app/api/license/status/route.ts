import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '@/lib/supabase-admin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' as any });
const MAX_DEVICES = 3;

export async function POST(req: Request) {
  try {
    const { email, deviceId } = await req.json();
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

    const cleanEmail = email.trim().toLowerCase();

    // 1. Skapa rad om den inte finns (ignorera om den redan finns)
    await supabaseAdmin
      .from('licenses')
      .upsert({ email: cleanEmail }, { onConflict: 'email', ignoreDuplicates: true });

    // 2. Hämta licensdata
    const { data: row, error } = await supabaseAdmin
      .from('licenses')
      .select('*')
      .eq('email', cleanEmail)
      .single();

    if (error || !row) throw new Error('Could not fetch license row');

    // 3. Uppdatera last_login_at separat
    await supabaseAdmin
      .from('licenses')
      .update({ last_login_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .eq('email', cleanEmail);

    // 4. Om Stripe-ID saknas, synka från Stripe
    let finalRow = row;
    if (!row.stripe_customer_id) {
      await syncFromStripe(cleanEmail);
      const { data: updated } = await supabaseAdmin
        .from('licenses').select('*').eq('email', cleanEmail).single();
      if (updated) finalRow = updated;
    }

    // 5. Enhetskontroll — bara för aktiva Pro-användare
    const payload = buildPayload(finalRow);
    if (payload.isActive && deviceId) {
      const deviceCheck = await handleDeviceRegistration(cleanEmail, deviceId);
      if (!deviceCheck.success) {
        return NextResponse.json({
          error: 'Device limit reached',
          code: 'DEVICE_LIMIT_REACHED',
          maxDevices: MAX_DEVICES,
          // Skicka med listan så UI kan visa vilka som är registrerade
          message: `This license is already active on ${MAX_DEVICES} devices. Remove a device in the billing portal.`
        }, { status: 403 });
      }
    }

    return NextResponse.json(payload);
  } catch (err: any) {
    console.error('[license/status]', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

async function handleDeviceRegistration(email: string, deviceId: string): Promise<{ success: boolean }> {
  const { data: devices } = await supabaseAdmin
    .from('license_devices')
    .select('device_id')
    .eq('license_email', email);

  const knownIds = (devices || []).map(d => d.device_id);

  // Känd enhet → uppdatera last_seen och godkänn
  if (knownIds.includes(deviceId)) {
    await supabaseAdmin
      .from('license_devices')
      .update({ last_seen_at: new Date().toISOString() })
      .eq('license_email', email)
      .eq('device_id', deviceId);
    return { success: true };
  }

  // Ny enhet men fullt → neka
  if (knownIds.length >= MAX_DEVICES) {
    return { success: false };
  }

  // Ny enhet inom gränsen → registrera
  await supabaseAdmin.from('license_devices').insert({
    license_email: email,
    device_id: deviceId,
    first_seen_at: new Date().toISOString(),
    last_seen_at: new Date().toISOString(),
  });

  return { success: true };
}

async function syncFromStripe(email: string) {
  try {
    const customers = await stripe.customers.list({ email, limit: 5 });
    if (!customers.data.length) return;

    let bestCustomerId: string | null = null;
    let bestSub: any = null; // Ändra från Stripe.Subscription till any

    for (const customer of customers.data) {
      const subs = await stripe.subscriptions.list({ customer: customer.id, status: 'all', limit: 5 });
      for (const sub of subs.data) {
        if (['active', 'trialing'].includes(sub.status)) {
          bestCustomerId = customer.id;
          bestSub = sub;
          break;
        }
        if (!bestCustomerId) { bestCustomerId = customer.id; bestSub = sub; }
      }
      if (bestSub?.status === 'active' || bestSub?.status === 'trialing') break;
    }

    if (!bestCustomerId) return;

    const fields: Record<string, any> = {
      stripe_customer_id: bestCustomerId,
      updated_at: new Date().toISOString(),
    };

    if (bestSub) {
      const isActive = ['active', 'trialing'].includes(bestSub.status);
      fields.is_active = isActive;
      fields.plan = isActive ? 'pro' : 'free';
      fields.stripe_subscription_id = bestSub.id;
      
      // Vi castar bestSub till 'any' här för att bypassa den strikta typkontrollen
      const subData = bestSub as any;
    
      if (subData.current_period_end) {
        fields.current_period_end = new Date(subData.current_period_end * 1000).toISOString();
      }
      
      if (subData.trial_end) {
        fields.trial_ends_at = new Date(subData.trial_end * 1000).toISOString();
      }
    }

    await supabaseAdmin.from('licenses').update(fields).eq('email', email);
  } catch (err) {
    console.error('[syncFromStripe]', err);
  }
}

function buildPayload(row: any) {
  const now = Math.floor(Date.now() / 1000);
  const trialEndsAt = row.trial_ends_at
    ? Math.floor(new Date(row.trial_ends_at).getTime() / 1000) : null;
  const trialActive = trialEndsAt ? trialEndsAt > now : false;
  const active = row.is_active || trialActive;

  return {
    plan: active ? 'pro' : 'free',
    isActive: !!active,
    trialEndsAt,
    currentPeriodEnd: row.current_period_end
      ? Math.floor(new Date(row.current_period_end).getTime() / 1000) : null,
    features: {
      advancedStats: !!active,
      rulesEngine: !!active,
      weeklyReports: !!active,
      csvExport: !!active,
    },
    checkedAt: now,
  };
}
