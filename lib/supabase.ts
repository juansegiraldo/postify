import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { createClient } from '@supabase/supabase-js'

export function createBrowserClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Missing Supabase configuration in environment variables')
      // Return a mock client in development
      return {
        auth: {
          onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
          signInWithPassword: () => Promise.resolve({ error: { message: 'Missing Supabase config' } }),
          signOut: () => Promise.resolve({ error: null })
        },
        from: () => ({ select: () => Promise.resolve({ data: [], error: null }) })
      } as any
    }
    throw new Error('Missing Supabase configuration in environment variables')
  }

  return createClientComponentClient({
    supabaseClient: createClient(supabaseUrl, supabaseAnonKey)
  })
}

export function getSupabaseBrowserClient() {
  return createBrowserClient()
}
