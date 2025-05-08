
// Send OTP SMS Edge Function using Fast2SMS

import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Get Fast2SMS API credentials from environment variables
const FAST2SMS_API_KEY = Deno.env.get("FAST2SMS_API_KEY");

console.log("Fast2SMS API Key: ", FAST2SMS_API_KEY ? "Set" : "Not set");

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Make sure the required credentials are available
    if (!FAST2SMS_API_KEY) {
      console.error("Missing Fast2SMS credentials");
      return new Response(
        JSON.stringify({ 
          error: "Fast2SMS configuration missing. Please set FAST2SMS_API_KEY" 
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

    // Format phone number if needed (remove + sign if present as Fast2SMS doesn't require it)
    let formattedNumber = to;
    if (to.startsWith("+")) {
      formattedNumber = to.substring(1); // Remove the + sign
    }
    
    // For Indian numbers, ensure we remove the country code if present
    if (formattedNumber.startsWith("91") && formattedNumber.length > 10) {
      formattedNumber = formattedNumber.substring(2);
    }

    // Construct the request to Fast2SMS API
    const url = "https://www.fast2sms.com/dev/bulkV2";

    // Build request headers and body according to Fast2SMS API
    const headers = {
      "Authorization": FAST2SMS_API_KEY,
      "Content-Type": "application/json"
    };

    // Build request body according to Fast2SMS API
    const data = {
      route: "otp",
      variables_values: otp,
      numbers: formattedNumber,
      flash: 0
    };

    console.log("Sending request to Fast2SMS:", { ...data, authorization: "[REDACTED]" });

    const smsResponse = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data),
    });

    const responseBody = await smsResponse.json();
    console.log("Fast2SMS API response:", responseBody);

    if (!smsResponse.ok || !responseBody.return) {
      console.error("Fast2SMS API error:", responseBody);
      return new Response(JSON.stringify({ error: responseBody.message || "Fast2SMS API error" }), {
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
