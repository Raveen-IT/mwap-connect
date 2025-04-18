
import { supabase } from "@/integrations/supabase/client";

/**
 * Sends an OTP SMS to the specified mobile number via the Supabase edge function.
 * @param mobile - The phone number (string, 10-digits for India).
 * @param otp - OTP code to send (string).
 * @returns Promise<{ success: boolean, error?: string }>
 */
export async function sendOtpSms(mobile: string, otp: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { data, error } = await supabase.functions.invoke("send-otp-sms", {
      body: { to: mobile, otp },
    });
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Unknown error" };
  }
}
