
// Send OTP Edge Function using Twilio

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Twilio } from "https://esm.sh/twilio@4.19.3";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Get Supabase and Twilio credentials from environment variables
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const TWILIO_ACCOUNT_SID = Deno.env.get("TWILIO_ACCOUNT_SID");
const TWILIO_AUTH_TOKEN = Deno.env.get("TWILIO_AUTH_TOKEN");
const TWILIO_PHONE_NUMBER = Deno.env.get("TWILIO_PHONE_NUMBER");

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
  return Math.floor(100000 + Math.random() * 900000).toString();
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

    // Check if Twilio is configured
    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Twilio configuration missing",
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

    // Send OTP via Twilio
    try {
      const message = `Your MWAP verification code is ${otp}. Valid for 10 minutes. Do not share this code with anyone.`;
      
      const client = new Twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
      
      const result = await client.messages.create({
        body: message,
        from: TWILIO_PHONE_NUMBER,
        to: formattedTo,
      });

      console.log(`Twilio message SID: ${result.sid}`);

      // Return success response with OTP (for testing only, remove in production)
      return new Response(
        JSON.stringify({
          success: true,
          message: "OTP sent successfully",
          otp: otp, // For testing - remove in production
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    } catch (twilioError) {
      console.error("Twilio error:", twilioError);
      
      // Even if Twilio fails, we'll return the OTP for testing in development
      return new Response(
        JSON.stringify({
          success: true, // Still return success for testing
          message: "OTP generated but SMS failed (for testing only)",
          otp: otp, // For testing - remove in production
          twilioError: twilioError.message,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
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
