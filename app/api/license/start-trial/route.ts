// app/api/license/start-trial/route.ts
// Place this file at: app/api/license/start-trial/route.ts

import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

const TRIAL_DAYS = 7;

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = (body.email || '').trim().toLowerCase();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
    }

    // Upsert the user row (create if not exists)
    const { error: upsertError } = await supabaseAdmin
      .from('licenses')
      .upsert(
        { email, plan: 'free', is_active: false },
        { onConflict: 'email', ignoreDuplicates: true }
      );
    if (upsertError) throw upsertError;

    // Fetch current license state
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from('licenses')
      .select('*')
      .eq('email', email)
      .single();
    if (fetchError) throw fetchError;

    // Already trialed or is active pro — return current state
    if (existing.trial_started_at) {
      const trialEnd = existing.trial_ends_at ? new Date(existing.trial_ends_at).getTime() : 0;
      const trialActive = trialEnd > Date.now();

      if (!trialActive && !existing.is_active) {
        return NextResponse.json(
          { error: 'Your 7-day trial has already been used.' },
          { status: 409 }
        );
      }
      return NextResponse.json(buildPayload(existing));
    }

    // Activate trial
    const now      = new Date();
    const trialEnd = new Date(now.getTime() + TRIAL_DAYS * 24 * 60 * 60 * 1000);

    const { data, error: updateError } = await supabaseAdmin
      .from('licenses')
      .update({
        trial_started_at: now.toISOString(),
        trial_ends_at:    trialEnd.toISOString(),
        plan:             'pro',
        is_active:        true,
      })
      .eq('email', email)
      .select()
      .single();

    if (updateError) throw updateError;

    return NextResponse.json(buildPayload(data));
  } catch (err: any) {
    console.error('start-trial error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}

// Return 405 for anything other than POST
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

function buildPayload(row: any) {
  const now          = Math.floor(Date.now() / 1000);
  const trialEndsAt  = row.trial_ends_at  ? Math.floor(new Date(row.trial_ends_at).getTime()  / 1000) : null;
  const periodEnd    = row.current_period_end ? Math.floor(new Date(row.current_period_end).getTime() / 1000) : null;
  const trialActive  = trialEndsAt ? trialEndsAt > now : false;
  const isActive     = row.is_active || trialActive;

  return {
    plan:             isActive ? 'pro' : 'free',
    isActive,
    trialStartedAt:  row.trial_started_at ? Math.floor(new Date(row.trial_started_at).getTime() / 1000) : null,
    trialEndsAt,
    currentPeriodEnd: periodEnd,
    features: {
      advancedStats:  isActive,
      rulesEngine:    isActive,
      weeklyReports:  isActive,
      csvExport:      isActive,
    },
    checkedAt: now,
  };
}
