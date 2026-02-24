import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

const REVOKED_LAST_SEEN_AT = '1970-01-01T00:00:00.000Z';

export async function POST(req: Request) {
  try {
    const { email, deviceId } = await req.json();
    if (!email || !deviceId) {
      return NextResponse.json({ error: 'Email and deviceId required' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    const { data: license } = await supabaseAdmin
      .from('licenses').select('email').eq('email', cleanEmail).single();

    if (!license?.email) {
      return NextResponse.json({ error: 'License not found' }, { status: 404 });
    }

    const { error } = await supabaseAdmin
      .from('license_devices')
      .update({ last_seen_at: REVOKED_LAST_SEEN_AT })
      .eq('license_email', cleanEmail)
      .eq('device_id', deviceId);

    if (error) throw error;

    console.log('[license/devices/remove] Device revoked', { email: cleanEmail, deviceId });
    return NextResponse.json({ success: true, deviceRevoked: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
