import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  try {
    const { reason, details, email, rating } = await req.json();
    const normalizedDetails = typeof details === 'string' ? details.trim() : '';
    const normalizedEmail = typeof email === 'string' ? email.toLowerCase().trim() : '';
    const parsedRating = typeof rating === 'number' && Number.isInteger(rating) && rating >= 1 && rating <= 5
      ? rating
      : null;

    console.log('[uninstall-feedback] payload', {
      hasReason: !!reason,
      detailLength: normalizedDetails.length,
      hasEmail: !!normalizedEmail,
      rating: parsedRating,
    });

    if (!reason) {
      return NextResponse.json({ error: 'A reason is required.' }, { status: 400 });
    }

    if (!EMAIL_REGEX.test(normalizedEmail)) {
      return NextResponse.json({ error: 'A valid email is required.' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('uninstall_feedback')
      .insert([
        { 
          email: normalizedEmail, 
          reason, 
          details: normalizedDetails,
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
