
// Send OTP via SMS Edge Function using Twilio

import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Get Supabase credentials from environment variables
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

// Get Twilio credentials from environment variables
const TWILIO_ACCOUNT_SID = Deno.env.get("TWILIO_ACCOUNT_SID");
const TWILIO_AUTH_TOKEN = Deno.env.get("TWILIO_AUTH_TOKEN");
const TWILIO_PHONE_NUMBER = Deno.env.get("TWILIO_PHONE_NUMBER");

// Initialize Supabase client with service role key for database access
const supabase = SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
  : null;

// Function to generate a 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Function to send SMS via Twilio
async function sendSMS(to: string, body: string) {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
    throw new Error("Twilio credentials are not configured correctly");
  }

  const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
  
  const auth = btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`);
  
  const formData = new URLSearchParams();
  formData.append("To", to);
  formData.append("From", TWILIO_PHONE_NUMBER);
  formData.append("Body", body);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData.toString(),
  });

  const result = await response.json();
  
  if (!response.ok) {
    console.error("Twilio API error:", result);
    throw new Error(`Twilio API error: ${result.message || "Unknown error"}`);
  }
  
  return result;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check if Supabase is configured
    if (!supabase) {
      console.error("Supabase configuration missing");
      return new Response(
        JSON.stringify({
          success: false,
          error: "Server configuration error",
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

    // Format phone number to E.164 format if not already (adding + if needed)
    const formattedPhone = to.startsWith("+") ? to : `+${to}`;
    
    // Generate OTP
    const otp = generateOTP();
    
    // Set expiration time (10 minutes from now)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
    
    console.log(`Generated OTP ${otp} for ${formattedPhone}, expires at ${expiresAt}`);
    
    // Store OTP in database
    const { error: dbError } = await supabase
      .from('otp_codes')
      .insert({
        phone_number: formattedPhone,
        otp_code: otp,
        expires_at: expiresAt,
        verified: false
      });

    if (dbError) {
      console.error("Database error storing OTP:", dbError);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to store OTP" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Send OTP via SMS
    try {
      const smsBody = `Your verification code is: ${otp}. Valid for 10 minutes.`;
      await sendSMS(formattedPhone, smsBody);
      
      console.log(`OTP sent successfully to ${formattedPhone}`);
      
      // For development/testing, return the OTP
      // In production, you should remove this
      return new Response(
        JSON.stringify({ success: true, otp }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
      
    } catch (smsError: any) {
      console.error("SMS sending error:", smsError);
      return new Response(
        JSON.stringify({ success: false, error: `Failed to send SMS: ${smsError.message}` }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

  } catch (error) {
    console.error("Error in send-otp-sms function:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
