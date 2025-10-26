import { createClient, SupabaseClient, Session, AuthChangeEvent } from '@supabase/supabase-js'

/**
 * Environment variables
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

/**
 * Type-safe Auth callback type
 */
type AuthChangeCallback = (
  event: AuthChangeEvent,
  session: { user: unknown; session: Session | null }
) => void

/**
 * Creates a type-safe mock Supabase client (no `any` used)
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

    // Auth mock implementation
    auth: {
      onAuthStateChange: (callback: AuthChangeCallback) => {
        const mockSession = { user: null, session: null }
        callback('SIGNED_OUT', mockSession)
        return { data: { subscription: { unsubscribe: () => undefined } } }
      },
      getSession: async () => ({
        data: { session: null },
        error: null,
      }),
      signInWithPassword: async () => ({
        data: { session: null, user: null },
        error: null,
      }),
      signUp: async () => ({
        data: { user: { id: 'mock-user-id' } },
        error: null,
      }),
      signOut: async () => ({ error: null }),
    },
  } as unknown as SupabaseClient
}

/**
 * Exported Supabase client (real or mock)
 */
export const supabase: SupabaseClient =
  isDemoMode || !supabaseUrl || !supabaseAnonKey
    ? createMockSupabaseClient()
    : createClient(supabaseUrl, supabaseAnonKey)
