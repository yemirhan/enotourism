import { createClient } from '@supabase/supabase-js'
import { env } from 'env/server.mjs'

const supabaseUrl = "https://fkwfhkcrxekvhrlushwa.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrd2Zoa2NyeGVrdmhybHVzaHdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Njk5NzY2MzIsImV4cCI6MTk4NTU1MjYzMn0.apP-moKjbk5PDkH9YYby0loU0jUQqMxl1dwpD5OlmSI"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)