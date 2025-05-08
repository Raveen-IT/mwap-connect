
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CustomButton } from "@/components/ui/custom-button";

interface OTPVerificationProps {
  loading: boolean;
  generatedOtp: string;
  mobile: string;
  onSubmit: (otp: string) => void;
  onResendOtp: () => void;
}

export const OTPVerification = ({
  loading,
  generatedOtp,
  mobile,
  onSubmit,
  onResendOtp
}: OTPVerificationProps) => {
  const [otp, setOtp] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(otp);
  };

  return (
    <div className="glass-effect rounded-xl p-8 animate-fade-up">
      <h2 className="text-2xl font-bold mb-6">OTP Verification</h2>
      <p className="mb-6 text-muted-foreground">
        Please enter the OTP sent to your mobile number {mobile}
      </p>
      
      <div className="mb-6 p-4 bg-primary/10 rounded-lg text-center">
        <p className="font-medium">Test OTP: {generatedOtp}</p>
        <p className="text-xs text-muted-foreground mt-1">
          This is displayed for testing purposes only
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="otp">Enter OTP</Label>
          <Input
            id="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter 6-digit OTP"
            maxLength={6}
            autoFocus
            required
          />
        </div>
        
        <div className="text-center text-sm">
          <button 
            type="button" 
            className="text-primary hover:underline"
            onClick={onResendOtp}
            disabled={loading}
          >
            {loading ? "Resending OTP..." : "Didn't receive OTP? Resend"}
          </button>
        </div>
        
        <CustomButton 
          type="submit" 
          disabled={loading}
          className="w-full"
        >
          {loading ? "Verifying..." : "Verify & Complete Registration"}
        </CustomButton>
      </form>
    </div>
  );
};
