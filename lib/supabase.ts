import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { createClient } from '@supabase/supabase-js'

export function createBrowserClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase configuration in environment variables')
  }

  return createClientComponentClient({
    supabaseClient: createClient(supabaseUrl, supabaseAnonKey)
  })
}

export function getSupabaseBrowserClient() {
  return createBrowserClient()
}
