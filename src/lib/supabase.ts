
import { createClient } from '@supabase/supabase-js';

// These environment variables are automatically injected by Lovable
// after you connect your Supabase project via the integration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Make sure you have connected your Supabase project via the Lovable interface.');
}

// Create a single supabase client for the entire app
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
