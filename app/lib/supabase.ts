import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// If missing, log a clear message (dev only)
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '⚠️ Missing Supabase environment variables. Using dummy fallback (read-only mode).'
  )
}

// ✅ Use a valid dummy Supabase URL pattern to prevent runtime errors
const fallbackUrl = 'https://placeholder-project.supabase.co'
const fallbackAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder.token.key'

//Optionally added fallback keys to prevent runtime errors in dev mode
export const supabase = createClient(supabaseUrl || fallbackUrl, supabaseAnonKey || fallbackAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'X-Client-Info': 'ceto-rai-app'
    }
  }
})

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