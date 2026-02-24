import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(req: Request) {
  try {
    const { reason, details, email, rating } = await req.json();
    const parsedRating = typeof rating === 'number' && Number.isInteger(rating) && rating >= 1 && rating <= 5
      ? rating
      : null;

    console.log('[uninstall-feedback] payload', {
      hasReason: !!reason,
      hasDetails: typeof details === 'string' && details.trim().length > 0,
      hasEmail: !!email,
      rating: parsedRating,
    });

    const { error } = await supabaseAdmin
      .from('uninstall_feedback')
      .insert([
        { 
          email: email?.toLowerCase().trim(), 
          reason, 
          details,
          rating: parsedRating,
        }
      ]);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[uninstall-feedback] Error:', err.message);
    return NextResponse.json({ error: 'Failed to save feedback' }, { status: 500 });
  }
}
