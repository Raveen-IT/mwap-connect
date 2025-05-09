
// Verify OTP Edge Function

import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Get Supabase credentials
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

// Initialize the Supabase client with the service role key
const supabase = SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY 
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
  : null;

// Helper function to format phone numbers to E.164 format
const formatPhoneNumberE164 = (phoneNumber: string): string => {
  // Remove any non-digit characters
  const digitsOnly = phoneNumber.replace(/\D/g, '');
  
  // If the number already starts with +91, return as is
  if (phoneNumber.startsWith('+91')) {
    return phoneNumber;
  }
  
  // If the number starts with 91, add a plus sign
  if (phoneNumber.startsWith('91')) {
    return `+${phoneNumber}`;
  }
  
  // If it's a 10 digit Indian number, add +91 prefix
  if (digitsOnly.length === 10) {
    return `+91${digitsOnly}`;
  }
  
  // If it's already in some other format, add + if needed
  return phoneNumber.startsWith("+") ? phoneNumber : `+${phoneNumber}`;
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check if Supabase is configured
    if (!supabase) {
      console.error("Missing Supabase credentials");
      return new Response(
        JSON.stringify({ 
          error: "Supabase configuration missing. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY" 
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { phone_number, otp_code } = await req.json();

    if (!phone_number || !otp_code) {
      return new Response(JSON.stringify({ error: "Missing phone number or OTP code" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Format phone number to E.164 format if not already
    const formattedPhone = formatPhoneNumberE164(phone_number);

    console.log(`Verifying OTP ${otp_code} for ${formattedPhone}`);

    // Find the most recent OTP for this phone number
    const { data: otpData, error: fetchError } = await supabase
      .from('otp_codes')
      .select('*')
      .eq('phone_number', formattedPhone)
      .eq('otp_code', otp_code)
      .eq('verified', false)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (fetchError) {
      console.error("Error fetching OTP:", fetchError);
      if (fetchError.code === 'PGRST116') { // No rows found error
        return new Response(JSON.stringify({ 
          valid: false, 
          error: "Invalid OTP code" 
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } else {
        return new Response(JSON.stringify({ 
          valid: false, 
          error: `Failed to verify OTP: ${fetchError.message}` 
        }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // Check if the OTP has expired
    const now = new Date();
    const expiresAt = new Date(otpData.expires_at);
    
    if (now > expiresAt) {
      return new Response(JSON.stringify({ 
        valid: false, 
        error: "OTP has expired" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Mark the OTP as verified
    const { error: updateError } = await supabase
      .from('otp_codes')
      .update({ verified: true })
      .eq('id', otpData.id);

    if (updateError) {
      console.error("Error updating OTP:", updateError);
      return new Response(JSON.stringify({ 
        valid: false, 
        error: `Failed to update OTP status: ${updateError.message}` 
      }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Return success
    return new Response(
      JSON.stringify({ 
        valid: true,
        message: "OTP verified successfully" 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Error in verify-otp function:", error);
    return new Response(
      JSON.stringify({ valid: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
