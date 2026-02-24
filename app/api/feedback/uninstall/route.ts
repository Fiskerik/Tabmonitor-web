import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(req: Request) {
  try {
    const { reason, details, email } = await req.json();

    const { error } = await supabaseAdmin
      .from('uninstall_feedback')
      .insert([
        { 
          email: email?.toLowerCase().trim(), 
          reason, 
          details 
        }
      ]);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[uninstall-feedback] Error:', err.message);
    return NextResponse.json({ error: 'Failed to save feedback' }, { status: 500 });
  }
}
