import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

const TRIAL_DAYS = 7;

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

    const cleanEmail = email.trim().toLowerCase();

    // Ensure user exists
    await supabaseAdmin
      .from('licenses')
      .upsert({ email: cleanEmail, updated_at: new Date().toISOString() }, { onConflict: 'email', ignoreDuplicates: true });

    // Fetch current license
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from('licenses')
      .select('*')
      .eq('email', cleanEmail)
      .single();

    if (fetchError) throw fetchError;

    // Already started trial — just return current state
    if (existing.trial_started_at) {
      return NextResponse.json(buildPayload(existing));
    }

    // Start trial
    const now = new Date();
    const trialEnd = new Date(now.getTime() + TRIAL_DAYS * 24 * 60 * 60 * 1000);

    const { data, error } = await supabaseAdmin
      .from('licenses')
      .update({
        trial_started_at: now.toISOString(),
        trial_ends_at: trialEnd.toISOString(),
        updated_at: now.toISOString(),
      })
      .eq('email', cleanEmail)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(buildPayload(data));
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

function buildPayload(row: any) {
  const now = Math.floor(Date.now() / 1000);
  const trialEndsAt = row.trial_ends_at ? Math.floor(new Date(row.trial_ends_at).getTime() / 1000) : null;
  const trialActive = trialEndsAt ? trialEndsAt > now : false;
  const active = row.is_active || trialActive;

  return {
    plan: active ? 'pro' : 'free',
    isActive: active,
    trialStartedAt: row.trial_started_at ? Math.floor(new Date(row.trial_started_at).getTime() / 1000) : null,
    trialEndsAt,
    currentPeriodEnd: row.current_period_end ? Math.floor(new Date(row.current_period_end).getTime() / 1000) : null,
    features: {
      advancedStats: active,
      rulesEngine: active,
      weeklyReports: active,
      csvExport: active,
    },
    checkedAt: now,
  };
}
