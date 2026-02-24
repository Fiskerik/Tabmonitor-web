import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(req: Request) {
  try {
    const { email, deviceId } = await req.json();
    if (!email || !deviceId) {
      return NextResponse.json({ error: 'Email and deviceId required' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Verifiera licensen
    const { data: license } = await supabaseAdmin
      .from('licenses').select('is_active').eq('email', cleanEmail).single();
    if (!license?.is_active) {
      return NextResponse.json({ error: 'No active license' }, { status: 403 });
    }

    const { error } = await supabaseAdmin
      .from('license_devices')
      .delete()
      .eq('license_email', cleanEmail)
      .eq('device_id', deviceId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
