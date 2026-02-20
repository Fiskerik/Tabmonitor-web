import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

const TRIAL_DAYS = 7;

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

    const cleanEmail = email.trim().toLowerCase();

    // Upsert user
    const { error: upsertError } = await supabaseAdmin
      .from('licenses')
      .upsert({ email: cleanEmail, updated_at: new Date().toISOString() }, { onConflict: 'email', ignoreDuplicates: true });

    if (upsertError) throw upsertError;

    // Fetch license
    const { data, error } = await supabaseAdmin
      .from('licenses')
      .select('*')
      .eq('email', cleanEmail)
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
