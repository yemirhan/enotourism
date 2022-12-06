import { createClient } from '@supabase/supabase-js'
import { env } from 'env/server.mjs'

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_JWT

export const supabase = createClient(supabaseUrl, supabaseAnonKey)