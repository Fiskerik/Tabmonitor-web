import { createClient, createAdminClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient()
    
    // Get authenticated user
    const { data: { user }, error } = await supabase.auth.getUser()
    
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
    const result = await query(
      `SELECT 
        plan, 
        stripe_customer_id,
        is_active,
        trial_started_at,
        trial_ends_at,
        current_period_end,
        stripe_subscription_id,
        auth_user_id
      FROM licenses 
      WHERE email = $1`,
      [email]
    )
    
    if (result.rows.length === 0) {
      // Create new FREE user
      await query(
        `INSERT INTO licenses (
          email, 
          plan, 
          is_active, 
          auth_user_id, 
          updated_at
        ) VALUES ($1, 'free', false, $2, NOW())
        ON CONFLICT (email) DO UPDATE
        SET auth_user_id = $2, updated_at = NOW()`,
        [email, user.id]
      )
      
      return NextResponse.json({
        plan: 'free',
        isActive: false,
        features: {
          advancedStats: false,
          rulesEngine: false,
          autoSuspend: false,
          dupAlerts: false,
        }
      })
    }
    
    const license = result.rows[0]
    
    // Update auth_user_id if not set
    if (!license.auth_user_id) {
      await query(
        `UPDATE licenses 
         SET auth_user_id = $1, updated_at = NOW()
         WHERE email = $2`,
        [user.id, email]
      )
    }
    
    const isPro = license.plan === 'pro' && license.is_active
    
    return NextResponse.json({
      plan: license.plan,
      isActive: license.is_active,
      currentPeriodEnd: license.current_period_end,
      trialEndsAt: license.trial_ends_at,
      features: {
        advancedStats: isPro,
        rulesEngine: isPro,
        autoSuspend: isPro,
        dupAlerts: isPro,
      }
    })
    
  } catch (error) {
    console.error('Verify auth error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
