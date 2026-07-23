import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getAuthenticatedEmail } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { email, deviceId, device_id, rowId, id } = await req.json();
    const targetDeviceId = String(deviceId || device_id || '').trim();
    const targetRowId = String(rowId || id || '').trim();
    if (!email || (!targetDeviceId && !targetRowId)) {
      return NextResponse.json({ error: 'Email and deviceId or rowId required' }, { status: 400 });
    }

    const authenticatedEmail = await getAuthenticatedEmail(req);
    if (!authenticatedEmail) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const cleanEmail = email.trim().toLowerCase();
    if (cleanEmail !== authenticatedEmail) {
      return NextResponse.json({ error: 'Email mismatch' }, { status: 403 });
    }

    const { data: license } = await supabaseAdmin
      .from('licenses').select('email').eq('email', cleanEmail).single();

    if (!license?.email) {
      return NextResponse.json({ error: 'License not found' }, { status: 404 });
    }

    let deleteQuery = supabaseAdmin
      .from('license_devices')
      .delete()
      .eq('license_email', cleanEmail);

    deleteQuery = targetRowId
      ? deleteQuery.eq('id', targetRowId)
      : deleteQuery.eq('device_id', targetDeviceId);

    const { data: deletedRows, error } = await deleteQuery.select('id, device_id');

    if (error) throw error;
    if (!deletedRows?.length) {
      return NextResponse.json({
        error: 'No device row was deleted. Check device_id/id/email match.',
        deletedCount: 0,
      }, { status: 404 });
    }

    console.log('[license/devices/remove] Device deleted', {
      email: cleanEmail,
      deviceId: targetDeviceId || null,
      rowId: targetRowId || null,
      deletedCount: deletedRows.length,
    });
    return NextResponse.json({ success: true, deletedCount: deletedRows.length, deleted: deletedRows });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
