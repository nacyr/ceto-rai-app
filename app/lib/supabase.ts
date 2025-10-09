import { createClient } from '@supabase/supabase-js'

// const supabaseUrl = ''
// const supabaseKey = ''

export const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// export const supabase = createClient(supabaseUrl, supabaseKey)