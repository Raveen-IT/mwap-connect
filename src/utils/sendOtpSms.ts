
/**
 * Simulates sending an OTP SMS to the specified mobile number.
 * @param mobile - The phone number (string, 10-digits for India).
 * @param otp - OTP code to send (string).
 * @returns Promise<{ success: boolean, error?: string }>
 */
export async function sendOtpSms(mobile: string, otp: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log(`[SIMULATED SMS] OTP code ${otp} sent to ${mobile}`);
    
    // In a real implementation, this would call an API to send the actual SMS
    return { success: true };
  } catch (err: any) {
    console.error("Exception in sendOtpSms:", err);
    return { success: false, error: err.message || "Unknown error" };
  }
}
