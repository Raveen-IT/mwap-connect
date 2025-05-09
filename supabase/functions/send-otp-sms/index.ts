
// Send OTP Edge Function using Fast2SMS (fallback to direct OTP return for testing)

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Get Supabase and API credentials from environment variables
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

// Initialize Supabase client
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

// Generate a random 6-digit OTP
const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check if Supabase is configured
    if (!supabase) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Supabase configuration missing",
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Parse request body
    const { to } = await req.json();

    if (!to) {
      return new Response(
        JSON.stringify({ success: false, error: "Phone number is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Format the phone number to E.164 format
    const formattedTo = formatPhoneNumberE164(to);
    
    console.log(`Sending OTP to ${formattedTo}`);

    // Generate OTP
    const otp = generateOTP();
    console.log(`Generated OTP: ${otp}`);

    // Calculate expiry time (10 minutes from now)
    const expiryTime = new Date();
    expiryTime.setMinutes(expiryTime.getMinutes() + 10);

    // Store OTP in Supabase
    const { error: insertError } = await supabase.from("otp_codes").insert({
      phone_number: formattedTo,
      otp_code: otp,
      expires_at: expiryTime.toISOString(),
      verified: false,
    });

    if (insertError) {
      console.error("Error storing OTP:", insertError);
      return new Response(
        JSON.stringify({
          success: false,
          error: `Failed to store OTP: ${insertError.message}`,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // In production, you would send the OTP via an SMS service like Twilio or Fast2SMS here
    // For now, we'll just return the OTP for testing purposes
    
    // For development/testing, return success with the OTP
    console.log("OTP generated successfully for testing:", otp);
    
    return new Response(
      JSON.stringify({
        success: true,
        message: "OTP generated successfully (for testing only)",
        otp: otp, // For testing - remove in production
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in send-otp function:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
