
import { createClient } from '@supabase/supabase-js';

// These environment variables are automatically injected by Lovable
// after you connect your Supabase project via the integration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create a single supabase client for the entire app
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl) && Boolean(supabaseAnonKey);
};
