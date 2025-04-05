import { createClient } from '@supabase/supabase-js'
// import type { Database } from './database.types' // Will be generated later

// Use VITE_ prefix for client-side accessible env vars
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  // Changed error message slightly for clarity
  throw new Error('Supabase URL and Anon Key must be provided in VITE_ environment variables')
}

// Create a single supabase client for interacting with your database
// Use Database type assertion once types are generated
// export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
