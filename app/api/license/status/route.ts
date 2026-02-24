import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '@/lib/supabase-admin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' as any });

// Konfiguration
const MAX_DEVICES = 2;

export async function POST(req: Request) {
  try {
    const { email, deviceId } = await req.json();
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

    const cleanEmail = email.trim().toLowerCase();

    // 1. Säkerställ att raden finns i licenses
    await supabaseAdmin
      .from('licenses')
      .upsert({ email: cleanEmail, updated_at: new Date().toISOString() }, { onConflict: 'email', ignoreDuplicates: true });

    // 2. Hämta licensdatan
    let { data: row, error } = await supabaseAdmin
      .from('licenses')
      .select('*')
      .eq('email', cleanEmail)
      .update({ 
      last_login_at: new Date().toISOString(),
      updated_at: new Date().toISOString()})
      .single();

    if (error) throw error;

    // 3. Om Stripe-ID saknas (Payment Link-användare), synka från Stripe
    if (!row.stripe_customer_id) {
      await syncFromStripe(cleanEmail, row);
      const { data: updated } = await supabaseAdmin.from('licenses').select('*').eq('email', cleanEmail).single();
      row = updated || row;
    }

    // 4. Enhetskontroll (Device Management)
    // Vi kollar status först. Om användaren är Pro, begränsa enheter.
    const isPro = buildPayload(row).isActive;
    
    if (isPro && deviceId) {
      const deviceCheck = await handleDeviceRegistration(cleanEmail, deviceId);
      if (!deviceCheck.success) {
        return NextResponse.json({ 
          error: 'Too many devices', 
          code: 'DEVICE_LIMIT_REACHED',
          maxDevices: MAX_DEVICES 
        }, { status: 403 });
      }
    }

    return NextResponse.json(buildPayload(row));
  } catch (err: any) {
    console.error('[license/status] Error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/**
 * Hanterar logiken för att registrera och begränsa enheter
 */
async function handleDeviceRegistration(email: string, deviceId: string) {
  // Hämta alla registrerade enheter för denna e-post
  const { data: devices } = await supabaseAdmin
    .from('license_devices')
    .select('device_id')
    .eq('license_email', email);

  const deviceIds = devices?.map(d => d.device_id) || [];

  // Om enheten redan är registrerad, uppdatera "last seen"
  if (deviceIds.includes(deviceId)) {
    await supabaseAdmin
      .from('license_devices')
      .update({ last_seen_at: new Date().toISOString() })
      .eq('license_email', email)
      .eq('device_id', deviceId);
    return { success: true };
  }

  // Om det är en ny enhet, kolla om vi nått gränsen
  if (deviceIds.length >= MAX_DEVICES) {
    return { success: false };
  }

  // Registrera den nya enheten
  await supabaseAdmin.from('license_devices').insert({
    license_email: email,
    device_id: deviceId,
    last_seen_at: new Date().toISOString()
  });

  return { success: true };
}

async function syncFromStripe(email: string, currentRow: any) {
  try {
    const customers = await stripe.customers.list({ email, limit: 5 });
    if (!customers.data.length) return;

    let bestCustomerId: string | null = null;
    let bestSub: any = null;

    for (const customer of customers.data) {
      const subs = await stripe.subscriptions.list({
        customer: customer.id,
        status: 'all',
        limit: 5,
      });
      for (const sub of subs.data) {
        if (['active', 'trialing'].includes(sub.status)) {
          bestCustomerId = customer.id;
          bestSub = sub;
          break;
        }
        if (!bestCustomerId) {
          bestCustomerId = customer.id;
          bestSub = sub;
        }
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
      fields.current_period_end = new Date(bestSub.current_period_end * 1000).toISOString();
      if (bestSub.trial_end) {
        fields.trial_ends_at = new Date(bestSub.trial_end * 1000).toISOString();
      }
    }

    await supabaseAdmin.from('licenses').update(fields).eq('email', email);
  } catch (err) {
    console.error('[license/status] Stripe sync failed:', err);
  }
}

function buildPayload(row: any) {
  const now = Math.floor(Date.now() / 1000);
  const trialEndsAt = row.trial_ends_at ? Math.floor(new Date(row.trial_ends_at).getTime() / 1000) : null;
  const trialActive = trialEndsAt ? trialEndsAt > now : false;
  const active = row.is_active || trialActive;

  return {
    plan: active ? 'pro' : 'free',
    isActive: !!active,
    trialEndsAt,
    currentPeriodEnd: row.current_period_end ? Math.floor(new Date(row.current_period_end).getTime() / 1000) : null,
    features: {
      advancedStats: !!active,
      rulesEngine: !!active,
      weeklyReports: !!active,
      csvExport: !!active,
    },
    checkedAt: now,
  };
}
