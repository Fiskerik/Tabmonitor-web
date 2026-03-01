import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()

    // Get authenticated user
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) {
      return NextResponse.json(
        { error: 'Unauthorized', plan: 'free', isActive: false },
        { status: 401 }
      )
    }

    const email = user.email
    if (!email) {
      return NextResponse.json(
        { error: 'No email found', plan: 'free', isActive: false },
        { status: 400 }
      )
    }

    // Check license in database
    const { data: existingLicense, error: selectError } = await supabaseAdmin
      .from('licenses')
      .select(
        'plan, stripe_customer_id, is_active, trial_started_at, trial_ends_at, current_period_end, stripe_subscription_id, auth_user_id'
      )
      .eq('email', email)
      .maybeSingle()

    if (selectError) {
      throw selectError
    }

    if (!existingLicense) {
      // Create new FREE user
      const { error: upsertError } = await supabaseAdmin.from('licenses').upsert(
        {
          email,
          plan: 'free',
          is_active: false,
          auth_user_id: user.id,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'email' }
      )

      if (upsertError) {
        throw upsertError
      }

      return NextResponse.json({
        plan: 'free',
        isActive: false,
        features: {
          advancedStats: false,
          rulesEngine: false,
          autoSuspend: false,
          dupAlerts: false,
        },
      })
    }

    // Update auth_user_id if not set
    if (!existingLicense.auth_user_id) {
      const { error: updateError } = await supabaseAdmin
        .from('licenses')
        .update({ auth_user_id: user.id, updated_at: new Date().toISOString() })
        .eq('email', email)

      if (updateError) {
        throw updateError
      }
    }

    const isPro = existingLicense.plan === 'pro' && existingLicense.is_active

    return NextResponse.json({
      plan: existingLicense.plan,
      isActive: existingLicense.is_active,
      currentPeriodEnd: existingLicense.current_period_end,
      trialEndsAt: existingLicense.trial_ends_at,
      features: {
        advancedStats: isPro,
        rulesEngine: isPro,
        autoSuspend: isPro,
        dupAlerts: isPro,
      },
    })
  } catch (error) {
    console.error('Verify auth error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
