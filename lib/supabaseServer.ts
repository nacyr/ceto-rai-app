import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

let supabase: SupabaseClient | null = null

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase server variables missing — using mock supabase client.')

  supabase = {
    from: () => ({
      select: () => Promise.resolve({ data: [], error: null }),
      insert: () => Promise.resolve({ data: [], error: null }),
      update: () => Promise.resolve({ data: [], error: null }),
      delete: () => Promise.resolve({ data: [], error: null }),
      eq: () => Promise.resolve({ data: [], error: null }),
      order: () => Promise.resolve({ data: [], error: null }),
      gte: () => Promise.resolve({ data: [], error: null }),
      lte: () => Promise.resolve({ data: [], error: null }),
      single: () => Promise.resolve({ data: null, error: null }),
    }),
  } as unknown as SupabaseClient
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey)
}

export { supabase }

// import { createClient } from '@supabase/supabase-js';

// // Get env vars
// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// // Runtime validation (so your app fails gracefully if vars are missing)
// if (!supabaseUrl) {
//   throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
// }

// if (!supabaseAnonKey) {
//   throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable');
// }

// // Now TS knows they're not undefined (due to runtime guards)
// export const supabase = createClient(supabaseUrl as string, supabaseAnonKey as string, {
//   auth: {
//     autoRefreshToken: true,
//     persistSession: true,
//     detectSessionInUrl: true,
//   },
//   global: {
//     headers: {
//       'X-Client-Info': 'save-life-foundation-app',
//     },
//   },
// });

// // import { createClient } from '@supabase/supabase-js'

// // const supabaseUrl = process.env.NEXT_SUPABASE_URL!
// // const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// // export const supabaseServer = createClient(supabaseUrl, supabaseServiceKey, {
// //   auth: { persistSession: false }
// // })
