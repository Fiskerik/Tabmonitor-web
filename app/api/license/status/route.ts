import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '@/lib/supabase-admin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' as any });
const MAX_DEVICES_PRO = 3;
const MAX_DEVICES_FREE = 1;
const REVOKED_LAST_SEEN_AT = '1970-01-01T00:00:00.000Z';

type DeviceCheckResult = {
  success: boolean;
  reason?: 'DEVICE_LIMIT_REACHED' | 'DEVICE_REVOKED';
};

export async function POST(req: Request) {
  try {
    const { email, deviceId } = await req.json();
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

    const cleanEmail = email.trim().toLowerCase();

    await supabaseAdmin
      .from('licenses')
      .upsert({ email: cleanEmail }, { onConflict: 'email', ignoreDuplicates: true });

    const { data: row, error } = await supabaseAdmin
      .from('licenses')
      .select('*')
      .eq('email', cleanEmail)
      .single();

    if (error || !row) throw new Error('Could not fetch license row');

    await supabaseAdmin
      .from('licenses')
      .update({ last_login_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .eq('email', cleanEmail);

    let finalRow = row;
    if (!row.stripe_customer_id) {
      await syncFromStripe(cleanEmail);
      const { data: updated } = await supabaseAdmin
        .from('licenses').select('*').eq('email', cleanEmail).single();
      if (updated) finalRow = updated;
    }

    const payload = buildPayload(finalRow);
    const maxDevices = payload.isActive ? MAX_DEVICES_PRO : MAX_DEVICES_FREE;

    if (deviceId) {
      const deviceCheck = await handleDeviceRegistration(cleanEmail, deviceId, maxDevices);
      if (!deviceCheck.success) {
        const isRevoked = deviceCheck.reason === 'DEVICE_REVOKED';
        console.log('[license/status] Device authorization denied', {
          email: cleanEmail,
          deviceId,
          reason: deviceCheck.reason,
          maxDevices,
        });

        return NextResponse.json({
          error: isRevoked ? 'Device revoked' : 'Device limit reached',
          code: deviceCheck.reason,
          maxDevices,
          message: isRevoked
            ? 'This device was removed from your account. Please sign in again from the extension.'
            : `This account is already active on ${maxDevices} device${maxDevices > 1 ? 's' : ''}. Remove a device to continue.`,
        }, { status: 403 });
      }
    }

    return NextResponse.json({ ...payload, maxDevices });
  } catch (err: any) {
    console.error('[license/status]', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

async function handleDeviceRegistration(email: string, deviceId: string, maxDevices: number): Promise<DeviceCheckResult> {
  const { data: devices, error: devicesError } = await supabaseAdmin
    .from('license_devices')
    .select('device_id, last_seen_at')
    .eq('license_email', email);

  if (devicesError) {
    console.error('[license/status] Failed to fetch device list', {
      email,
      deviceId,
      error: devicesError.message,
    });
    return { success: false, reason: 'DEVICE_LIMIT_REACHED' };
  }

  const knownDevice = (devices || []).find(d => d.device_id === deviceId);

  if (knownDevice) {
    if (knownDevice.last_seen_at === REVOKED_LAST_SEEN_AT) {
      return { success: false, reason: 'DEVICE_REVOKED' };
    }

    const { error: updateError } = await supabaseAdmin
      .from('license_devices')
      .update({ last_seen_at: new Date().toISOString() })
      .eq('license_email', email)
      .eq('device_id', deviceId);

    if (updateError) {
      console.error('[license/status] Failed to update known device', {
        email,
        deviceId,
        error: updateError.message,
      });
      return { success: false, reason: 'DEVICE_LIMIT_REACHED' };
    }

    return { success: true };
  }

  const activeDevices = (devices || []).filter(d => d.last_seen_at !== REVOKED_LAST_SEEN_AT);
  if (activeDevices.length >= maxDevices) {
    return { success: false, reason: 'DEVICE_LIMIT_REACHED' };
  }

  const { error: insertError } = await supabaseAdmin.from('license_devices').insert({
    license_email: email,
    device_id: deviceId,
    last_seen_at: new Date().toISOString(),
  });

  if (insertError) {
    console.error('[license/status] Failed to insert new device', {
      email,
      deviceId,
      error: insertError.message,
    });
    return { success: false, reason: 'DEVICE_LIMIT_REACHED' };
  }

  return { success: true };
}

async function syncFromStripe(email: string) {
  try {
    const customers = await stripe.customers.list({ email, limit: 5 });
    if (!customers.data.length) return;

    let bestCustomerId: string | null = null;
    let bestSub: any = null;

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
