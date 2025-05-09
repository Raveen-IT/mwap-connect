
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

// Function to send OTP via Supabase Edge Function with retry mechanism
export const sendOTP = async (phoneNumber: string, retryCount = 0): Promise<{success: boolean, otp?: string, error?: string}> => {
  try {
    // Format phone number to E.164 format
    const formattedPhone = formatPhoneNumberE164(phoneNumber);
    
    console.log(`Attempting to send OTP to ${formattedPhone}, attempt ${retryCount + 1}`);
    
    // Call the Supabase edge function to send SMS
    const { data, error } = await supabase.functions.invoke("send-otp-sms", {
      body: { to: formattedPhone }
    });

    if (error) {
      console.error(`Error sending OTP (attempt ${retryCount + 1}):`, error);
      
      // Implement retry mechanism for network-related errors
      if (retryCount < 2 && (error.message.includes("Failed to fetch") || error.message.includes("Network"))) {
        console.log(`Retrying sendOTP... (${retryCount + 1}/2)`);
        // Wait for 1 second before retrying
        await new Promise(resolve => setTimeout(resolve, 1000));
        return sendOTP(phoneNumber, retryCount + 1);
      }
      
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
    console.error(`Exception sending OTP (attempt ${retryCount + 1}):`, error);
    
    // Retry on exceptions as well
    if (retryCount < 2) {
      console.log(`Retrying sendOTP after exception... (${retryCount + 1}/2)`);
      // Wait for 1 second before retrying
      await new Promise(resolve => setTimeout(resolve, 1000));
      return sendOTP(phoneNumber, retryCount + 1);
    }
    
    return { success: false, error: error.message };
  }
};

// Function to verify OTP with retry mechanism
export const verifyOTP = async (phoneNumber: string, otpCode: string, retryCount = 0): Promise<{valid: boolean, error?: string}> => {
  try {
    // Format phone number to E.164 format
    const formattedPhone = formatPhoneNumberE164(phoneNumber);
    
    console.log(`Attempting to verify OTP for ${formattedPhone}, attempt ${retryCount + 1}`);
    
    const { data, error } = await supabase.functions.invoke("verify-otp", {
      body: { 
        phone_number: formattedPhone, 
        otp_code: otpCode 
      }
    });

    if (error) {
      console.error(`Error verifying OTP (attempt ${retryCount + 1}):`, error);
      
      // Implement retry mechanism
      if (retryCount < 2 && (error.message.includes("Failed to fetch") || error.message.includes("Network"))) {
        console.log(`Retrying verifyOTP... (${retryCount + 1}/2)`);
        // Wait for 1 second before retrying
        await new Promise(resolve => setTimeout(resolve, 1000));
        return verifyOTP(phoneNumber, otpCode, retryCount + 1);
      }
      
      return { valid: false, error: error.message };
    }

    return { 
      valid: data.valid, 
      error: data.valid ? undefined : (data.error || "Invalid OTP code") 
    };
  } catch (error: any) {
    console.error(`Exception verifying OTP (attempt ${retryCount + 1}):`, error);
    
    // Retry on exceptions as well
    if (retryCount < 2) {
      console.log(`Retrying verifyOTP after exception... (${retryCount + 1}/2)`);
      // Wait for 1 second before retrying
      await new Promise(resolve => setTimeout(resolve, 1000));
      return verifyOTP(phoneNumber, otpCode, retryCount + 1);
    }
    
    return { valid: false, error: error.message };
  }
};
