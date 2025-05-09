
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

// Helper function to format phone numbers to E.164 format
export const formatPhoneNumberE164 = (phoneNumber: string): string => {
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

// OTP Generation function (for client-side reference only)
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Function to send OTP via Supabase Edge Function
export const sendOTP = async (phoneNumber: string): Promise<{success: boolean, otp?: string, error?: string}> => {
  try {
    // Format phone number to E.164 format for Twilio
    const formattedPhone = formatPhoneNumberE164(phoneNumber);
    
    const { data, error } = await supabase.functions.invoke("send-otp-sms", {
      body: { to: formattedPhone }
    });

    if (error) {
      console.error("Error sending OTP:", error);
      return { success: false, error: error.message };
    }

    if (!data.success) {
      return { success: false, error: data.error || "Failed to send OTP" };
    }

    return { 
      success: true, 
      otp: data.otp, // For testing - in production, this shouldn't be returned
      error: undefined 
    };
  } catch (error: any) {
    console.error("Exception sending OTP:", error);
    return { success: false, error: error.message };
  }
};

// Function to verify OTP
export const verifyOTP = async (phoneNumber: string, otpCode: string): Promise<{valid: boolean, error?: string}> => {
  try {
    // Format phone number to E.164 format for Twilio
    const formattedPhone = formatPhoneNumberE164(phoneNumber);
    
    const { data, error } = await supabase.functions.invoke("verify-otp", {
      body: { 
        phone_number: formattedPhone, 
        otp_code: otpCode 
      }
    });

    if (error) {
      console.error("Error verifying OTP:", error);
      return { valid: false, error: error.message };
    }

    return { 
      valid: data.valid, 
      error: data.valid ? undefined : (data.error || "Invalid OTP code") 
    };
  } catch (error: any) {
    console.error("Exception verifying OTP:", error);
    return { valid: false, error: error.message };
  }
};
