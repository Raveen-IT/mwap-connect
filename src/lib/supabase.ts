
import { supabase } from '@/integrations/supabase/client';

// Function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return true; // Since we're using the configured client from integrations
};

// Re-export the supabase client
export { supabase };
