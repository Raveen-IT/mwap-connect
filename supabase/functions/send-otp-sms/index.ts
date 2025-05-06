
// Send OTP SMS Edge Function using Vonage

import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Get Vonage API credentials from environment variables
// or use the hardcoded values if environment variables are not set
const VONAGE_API_KEY = Deno.env.get("VONAGE_API_KEY") || "da487b75";
const VONAGE_API_SECRET = Deno.env.get("VONAGE_API_SECRET") || "q71GwNEjXBXs0dIa";
const VONAGE_BRAND_NAME = Deno.env.get("VONAGE_BRAND_NAME") || "MWAP";

console.log("Vonage API Key: ", VONAGE_API_KEY ? "Set" : "Not set");
console.log("Vonage API Secret: ", VONAGE_API_SECRET ? "Set" : "Not set");

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Make sure the required credentials are available
    if (!VONAGE_API_KEY || !VONAGE_API_SECRET) {
      console.error("Missing Vonage credentials");
      return new Response(
        JSON.stringify({ 
          error: "Vonage configuration missing. Please set VONAGE_API_KEY and VONAGE_API_SECRET" 
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { to, otp } = await req.json();

    if (!to || !otp) {
      return new Response(JSON.stringify({ error: "Missing phone or otp" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Sending OTP ${otp} to ${to}`);

    // Format phone number if needed
    let formattedNumber = to;
    if (!to.startsWith("+")) {
      formattedNumber = `+${to}`;
    }

    // Construct the request to Vonage API
    const url = "https://rest.nexmo.com/sms/json";

    // Build request body according to Vonage API
    const data = {
      api_key: VONAGE_API_KEY,
      api_secret: VONAGE_API_SECRET,
      from: VONAGE_BRAND_NAME,
      to: formattedNumber,
      text: `Your OTP verification code is: ${otp}`,
      channel: "sms"
    };

    console.log("Sending request to Vonage:", { ...data, api_secret: "[REDACTED]" });

    const vonageResponse = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseBody = await vonageResponse.json();
    console.log("Vonage API response:", responseBody);

    if (!vonageResponse.ok) {
      console.error("Vonage API error:", responseBody);
      return new Response(JSON.stringify({ error: responseBody.message || "Vonage API error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ success: true, response: responseBody }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Error in send-otp-sms function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
