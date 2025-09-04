import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://oaqqkgbzmtknlpjpkczz.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hcXFrZ2J6bXRrbmxwanBrY3p6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2NzcxMTMsImV4cCI6MjA3MjI1MzExM30.sRVZTPrFmFuNxJhTE5Tb86-X8Nm1f1oBMljnMlvxheY'

export const supabase = createClient(supabaseUrl, supabaseKey)