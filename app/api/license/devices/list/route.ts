import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

    const cleanEmail = email.trim().toLowerCase();

    // Verifiera att licensen är aktiv
    const { data: license } = await supabaseAdmin
      .from('licenses')
      .select('is_active, trial_ends_at')
      .eq('email', cleanEmail)
      .single();

    const now = Date.now();
    const trialActive = license?.trial_ends_at
      ? new Date(license.trial_ends_at).getTime() > now : false;
    
    if (!license?.is_active && !trialActive) {
      return NextResponse.json({ error: 'No active license' }, { status: 403 });
    }

    const { data: devices } = await supabaseAdmin
      .from('license_devices')
      .select('device_id, first_seen_at, last_seen_at, label')
      .eq('license_email', cleanEmail)
      .order('last_seen_at', { ascending: false });

    return NextResponse.json({ devices: devices || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
