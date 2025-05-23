import { useState } from "react";
import { User } from "@/types/user";
import { RegistrationDetails } from "./RegistrationDetails";
import { OTPVerification } from "./OTPVerification";
import { RegistrationSuccess } from "./RegistrationSuccess";
import { sendOTP, formatPhoneNumberE164 } from "@/utils/otpService";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { generateWorkerId } from "@/utils/id-generator";

type RegistrationStep = 'details' | 'verification' | 'success';

export const RegistrationForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<RegistrationStep>('details');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>({
    name: "",
    age: 0,
    gender: "male",
    workingType: "construction",
    migrationPlace: "",
    mobile: "",
    aadhaarNumber: "",
    email: "",
  });
  
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [userId, setUserId] = useState("");

  const handleDetailsSubmit = async (validatedFormData: Partial<User>) => {
    setFormData(validatedFormData);
    setLoading(true);
    
    try {
      // Format the phone number to include +91 before sending OTP
      const formattedPhone = formatPhoneNumberE164(validatedFormData.mobile as string);
      
      // Send OTP using Twilio via Edge Function
      const result = await sendOTP(formattedPhone);
      
      if (result.success) {
        toast.success("OTP sent to your mobile");
        
        // For testing - in production, don't show this
        if (result.otp) {
          setGeneratedOtp(result.otp);
          toast.info(`For testing, your OTP is: ${result.otp}`);
        }
        
        setStep('verification');
      } else {
        toast.error("Failed to send OTP: " + (result.error || "Unexpected error"));
      }
    } catch (error: any) {
      toast.error(`Error: ${error.message || "Failed to send OTP"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationSubmit = async (submittedOtp: string) => {
    setLoading(true);
    
    try {
      const newUserId = generateWorkerId();
      setUserId(newUserId);
      
      // Format the phone number to E.164 format
      const formattedPhone = formatPhoneNumberE164(formData.mobile as string);
      
      // Insert into the user_data table (existing)
      const { error: userDataError } = await supabase
        .from('user_data')
        .insert({
          id: newUserId,
          name: formData.name,
          age: formData.age,
          gender: formData.gender,
          working_type: formData.workingType,
          migration_place: formData.migrationPlace,
          mobile_number: formattedPhone,
          aadhaar_number: formData.aadhaarNumber,
          email: formData.email,
          is_verified: true
        });

      if (userDataError) {
        throw userDataError;
      }
      
      // Also insert into the new registration_details table
      const { error: regDetailsError } = await supabase
        .from('registration_details')
        .insert({
          name: formData.name,
          age: formData.age,
          gender: formData.gender,
          working_type: formData.workingType,
          migration_place: formData.migrationPlace,
          mobile: formattedPhone,
          aadhaar_number: formData.aadhaarNumber,
          email: formData.email,
          registration_date: new Date().toISOString()
        });
        
      if (regDetailsError) {
        console.error("Error saving to registration_details table:", regDetailsError);
        // Still continue as user_data was successful
      }
      
      setStep('success');
      toast.success('Registration completed successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to complete registration');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    
    try {
      // Format the phone number to include +91
      const formattedPhone = formatPhoneNumberE164(formData.mobile as string);
      
      // Send OTP using Twilio via Edge Function
      const result = await sendOTP(formattedPhone);
      
      if (result.success) {
        toast.success("OTP resent to your mobile");
        
        // For testing - in production, don't show this
        if (result.otp) {
          setGeneratedOtp(result.otp);
          toast.info(`For testing, your new OTP is: ${result.otp}`);
        }
      } else {
        toast.error("Failed to resend OTP: " + (result.error || "Unexpected error"));
      }
    } catch (error: any) {
      toast.error(`Error: ${error.message || "Failed to resend OTP"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {step === 'details' && (
        <RegistrationDetails 
          formData={formData} 
          loading={loading} 
          onSubmit={handleDetailsSubmit}
        />
      )}
      
      {step === 'verification' && (
        <OTPVerification
          loading={loading}
          generatedOtp={generatedOtp}
          mobile={formData.mobile as string}
          onSubmit={handleVerificationSubmit}
          onResendOtp={handleResendOtp}
        />
      )}
      
      {step === 'success' && (
        <RegistrationSuccess 
          userId={userId} 
          onGoToDashboard={handleGoToDashboard} 
        />
      )}
    </div>
  );
};
