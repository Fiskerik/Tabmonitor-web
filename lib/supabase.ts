import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321'
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'anon-key-not-configured'

export const supabase = createBrowserClient(supabaseUrl, anonKey)
