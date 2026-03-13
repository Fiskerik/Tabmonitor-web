import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getAuthenticatedEmail } from '@/lib/auth';

const MIN_LOGGED_IN_DAYS = 3;
const DAY_IN_MS = 24 * 60 * 60 * 1000;

function getEligibleAt(createdAt: string) {
  return new Date(new Date(createdAt).getTime() + (MIN_LOGGED_IN_DAYS * DAY_IN_MS));
}

export async function GET(req: Request) {
  try {
    const authenticatedEmail = await getAuthenticatedEmail(req);
    if (!authenticatedEmail) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: license, error: licenseError } = await supabaseAdmin
      .from('licenses')
      .select('created_at')
      .eq('email', authenticatedEmail)
      .single();

    if (licenseError || !license?.created_at) {
      console.error('[feedback-rating] Failed to find license row', {
        email: authenticatedEmail,
        error: licenseError?.message,
      });
      return NextResponse.json({ error: 'License row not found' }, { status: 404 });
    }

    const now = new Date();
    const eligibleAt = getEligibleAt(license.created_at);
    const canRate = now >= eligibleAt;
    const remainingMs = Math.max(eligibleAt.getTime() - now.getTime(), 0);
    const daysRemaining = Math.ceil(remainingMs / DAY_IN_MS);

    const { data: existingFeedback } = await supabaseAdmin
      .from('user_rating_feedback')
      .select('rating, details, created_at')
      .eq('email', authenticatedEmail)
      .maybeSingle();

    console.log('[feedback-rating] eligibility', {
      email: authenticatedEmail,
      canRate,
      daysRemaining,
      hasExistingFeedback: !!existingFeedback,
    });

    return NextResponse.json({
      canRate,
      daysRemaining,
      eligibleAt: eligibleAt.toISOString(),
      existingFeedback,
    });
  } catch (err: any) {
    console.error('[feedback-rating] GET error:', err.message);
    return NextResponse.json({ error: 'Failed to load feedback status' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const authenticatedEmail = await getAuthenticatedEmail(req);
    if (!authenticatedEmail) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { rating, details } = await req.json();
    const parsedRating = typeof rating === 'number' && Number.isInteger(rating) && rating >= 1 && rating <= 5
      ? rating
      : null;

    if (!parsedRating) {
      return NextResponse.json({ error: 'Rating must be an integer between 1 and 5' }, { status: 400 });
    }

    const { data: license, error: licenseError } = await supabaseAdmin
      .from('licenses')
      .select('created_at')
      .eq('email', authenticatedEmail)
      .single();

    if (licenseError || !license?.created_at) {
      console.error('[feedback-rating] Failed to find license before insert', {
        email: authenticatedEmail,
        error: licenseError?.message,
      });
      return NextResponse.json({ error: 'License row not found' }, { status: 404 });
    }

    const canRate = new Date() >= getEligibleAt(license.created_at);
    if (!canRate) {
      return NextResponse.json({ error: 'Feedback is only available after 3 days of login' }, { status: 403 });
    }

    const cleanDetails = typeof details === 'string' ? details.trim() : null;

    const { error: upsertError } = await supabaseAdmin
      .from('user_rating_feedback')
      .upsert({
        email: authenticatedEmail,
        rating: parsedRating,
        details: cleanDetails,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'email' });

    if (upsertError) throw upsertError;

    console.log('[feedback-rating] feedback saved', {
      email: authenticatedEmail,
      rating: parsedRating,
      hasDetails: !!cleanDetails,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[feedback-rating] POST error:', err.message);
    return NextResponse.json({ error: 'Failed to save feedback' }, { status: 500 });
  }
}
