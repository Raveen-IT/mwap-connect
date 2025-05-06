
import { supabase } from "@/integrations/supabase/client";

/**
 * Sends an OTP SMS to the specified mobile number using Supabase Edge Function with Vonage.
 * @param mobile - The phone number (string, 10-digits for India).
 * @param otp - OTP code to send (string).
 * @returns Promise<{ success: boolean, error?: string }>
 */
export async function sendOtpSms(mobile: string, otp: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Format phone number for Vonage (add +91 prefix for India if not present)
    const formattedMobile = mobile.startsWith("+") ? mobile : `+91${mobile}`;
    
    console.log(`Sending OTP to ${formattedMobile}`);
    
    // Call the Supabase edge function to send SMS
    const { data, error } = await supabase.functions.invoke('send-otp-sms', {
      body: { 
        to: formattedMobile, 
        otp 
      }
    });
    
    if (error) {
      console.error("Error in sendOtpSms:", error);
      return { success: false, error: error.message };
    }
    
    if (!data?.success) {
      console.error("API Error in sendOtpSms:", data);
      return { success: false, error: data?.error || "Failed to send OTP" };
    }
    
    console.log("OTP sent via Vonage:", { to: formattedMobile, success: true });
    return { success: true };
  } catch (err: any) {
    console.error("Exception in sendOtpSms:", err);
    return { success: false, error: err.message || "Unknown error" };
  }
}
