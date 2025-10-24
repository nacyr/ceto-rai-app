import { createClient } from '@supabase/supabase-js';

// Get env vars
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Runtime validation (so your app fails gracefully if vars are missing)
if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
}

if (!supabaseAnonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable');
}

// Now TS knows they're not undefined (due to runtime guards)
export const supabase = createClient(supabaseUrl as string, supabaseAnonKey as string, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  global: {
    headers: {
      'X-Client-Info': 'save-life-foundation-app',
    },
  },
});

// //original code
// import { createClient } from '@supabase/supabase-js'

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// // Validate environment variables
// if (!supabaseUrl) {
//   throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
// }

// if (!supabaseAnonKey) {
//   throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable')
// }

// export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
//   auth: {
//     autoRefreshToken: true,
//     persistSession: true,
//     detectSessionInUrl: true
//   },
//   global: {
//     headers: {
//       'X-Client-Info': 'ceto-rai-app'
//     }
//   }
// })


// import { createClient, SupabaseClient } from '@supabase/supabase-js'

// // --- fallback values (so app never crashes) ---
// const fallbackUrl = 'https://placeholder-project.supabase.co'
// const fallbackAnonKey =
//   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder.token.key'

// // --- read env or fallback ---
// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || fallbackUrl
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || fallbackAnonKey

// if (
//   (!process.env.NEXT_PUBLIC_SUPABASE_URL ||
//     !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) &&
//   process.env.NODE_ENV === 'development'
// ) {
//   console.warn('⚠️ Using fallback Supabase client — read-only mock mode.')
// }

// export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
//   auth: {
//     autoRefreshToken: true,
//     persistSession: true,
//     detectSessionInUrl: true,
//   },
//   global: {
//     headers: { 'X-Client-Info': 'ceto-rai-app' },
//   },
//.. })

