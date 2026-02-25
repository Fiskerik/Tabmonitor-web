import { createClient, createAdminClient } from '@/supabase/server'

export async function getAuthenticatedEmail(req: Request): Promise<string | null> {
  const authHeader = req.headers.get('authorization')
  const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : null

  if (bearerToken) {
    const adminClient = createAdminClient()
    const { data, error } = await adminClient.auth.getUser(bearerToken)
    if (error || !data.user?.email) {
      console.log('[auth] Bearer token authentication failed', { hasToken: true, error: error?.message })
      return null
    }

    return data.user.email.trim().toLowerCase()
  }

  const supabase = createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data.user?.email) {
    console.log('[auth] Cookie authentication failed', { error: error?.message })
    return null
  }

  return data.user.email.trim().toLowerCase()
}
