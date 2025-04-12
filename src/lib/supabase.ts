
import { createClient } from '@supabase/supabase-js';

// Use the direct values from our connected Supabase project
const supabaseUrl = "https://nabiallhpijzwrpgqhla.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hYmlhbGxocGlqendycGdxaGxhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0NDEwMzgsImV4cCI6MjA2MDAxNzAzOH0.ZACNJ_s5FKNAb1e6qDmK0zupkpuPT5r4eME9pCPOmKw";

// Create a single supabase client for the entire app
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl) && Boolean(supabaseAnonKey);
};

// Since we're now using direct values, Supabase is always configured
if (!isSupabaseConfigured()) {
  console.warn(
    "Supabase environment variables are missing. Some functionality will be limited. " +
    "Please connect your Supabase project via the Lovable interface to enable all features."
  );
}
