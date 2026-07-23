import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

const REVOKED_LAST_SEEN_AT = '1970-01-01T00:00:00.000Z';

function isRevokedLastSeen(value: string | null): boolean {
  if (!value) return false;
  const timestamp = new Date(value).getTime();
  return Number.isFinite(timestamp) && timestamp <= new Date(REVOKED_LAST_SEEN_AT).getTime();
}

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

    const cleanEmail = email.trim().toLowerCase();

    const { data: license } = await supabaseAdmin
      .from('licenses')
      .select('email')
      .eq('email', cleanEmail)
      .single();

    if (!license?.email) {
      return NextResponse.json({ error: 'License not found' }, { status: 404 });
    }

    await supabaseAdmin
      .from('license_devices')
      .delete()
      .eq('license_email', cleanEmail)
      .lte('last_seen_at', REVOKED_LAST_SEEN_AT);

    const { data: devices, error: devicesError } = await supabaseAdmin
      .from('license_devices')
      .select('id, device_id, last_seen_at')
      .eq('license_email', cleanEmail)
      .order('last_seen_at', { ascending: false });

    if (devicesError) {
      console.error('[license/devices/list] Failed to fetch devices', {
        email: cleanEmail,
        error: devicesError.message,
      });
      return NextResponse.json({ error: 'Failed to fetch devices' }, { status: 500 });
    }

    const visibleDevices = (devices || []).filter(d => !isRevokedLastSeen(d.last_seen_at));
    return NextResponse.json({ devices: visibleDevices });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
