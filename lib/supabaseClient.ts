import { createClient, SupabaseClient, AuthChangeEvent, Session } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

/**
 * Define a type-safe mock Supabase client for demo mode
 */
function createMockSupabaseClient(): SupabaseClient {
  console.warn('⚠️ Running in DEMO MODE — using mock Supabase client.')

  return {
    from: () => ({
      select: async () => ({ data: [], error: null }),
      insert: async () => ({ data: [], error: null }),
      update: async () => ({ data: [], error: null }),
      delete: async () => ({ data: [], error: null }),
      eq: async () => ({ data: [], error: null }),
      order: async () => ({ data: [], error: null }),
      gte: async () => ({ data: [], error: null }),
      lte: async () => ({ data: [], error: null }),
      single: async () => ({ data: null, error: null }),
    }),

    // Implement the auth interface to prevent runtime crashes
    auth: {
      async getSession() {
        return { data: { session: null }, error: null }
      },

      onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void) {
        callback('SIGNED_OUT', null)
        return { data: { subscription: { unsubscribe: () => undefined } } }
      },

      async signInWithPassword() {
        return { data: { session: null, user: null }, error: null }
      },

      async signUp() {
        return { data: { user: { id: 'mock-user-id', email: 'mock@example.com' } }, error: null }
      },

      async signOut() {
        return { error: null }
      },
    },
  } as unknown as SupabaseClient
}

/**
 * Export the Supabase client (real or mock)
 */
export const supabase: SupabaseClient =
  isDemoMode || !supabaseUrl || !supabaseAnonKey
    ? createMockSupabaseClient()
    : createClient(supabaseUrl, supabaseAnonKey)
