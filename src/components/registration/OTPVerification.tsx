
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CustomButton } from "@/components/ui/custom-button";
import { verifyOTP } from "@/utils/otpService";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface OTPVerificationProps {
  loading: boolean;
  generatedOtp: string; // For testing only
  mobile: string;
  onSubmit: (otp: string) => void;
  onResendOtp: () => void;
}

export const OTPVerification = ({
  loading,
  generatedOtp, // For testing only
  mobile,
  onSubmit,
  onResendOtp
}: OTPVerificationProps) => {
  const [otp, setOtp] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!otp || otp.trim().length < 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }
    
    setVerifying(true);
    
    try {
      // First verify the OTP with our backend
      const result = await verifyOTP(mobile, otp);
      
      if (result.valid) {
        // If valid, call the onSubmit handler from parent
        onSubmit(otp);
      } else {
        setError(result.error || "Invalid OTP. Please try again");
      }
    } catch (err: any) {
      setError(err.message || "Failed to verify OTP. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="glass-effect rounded-xl p-8 animate-fade-up">
      <h2 className="text-2xl font-bold mb-6">OTP Verification</h2>
      <p className="mb-6 text-muted-foreground">
        Please enter the OTP sent to your mobile number {mobile}
      </p>
      
      {generatedOtp && (
        <div className="mb-6 p-4 bg-primary/10 rounded-lg text-center">
          <p className="font-medium">Test OTP: {generatedOtp}</p>
          <p className="text-xs text-muted-foreground mt-1">
            This is displayed for testing purposes only
          </p>
        </div>
      )}
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
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
            disabled={loading || verifying}
          >
            {loading ? "Resending OTP..." : "Didn't receive OTP? Resend"}
          </button>
        </div>
        
        <CustomButton 
          type="submit" 
          disabled={loading || verifying || !otp}
          className="w-full"
        >
          {verifying ? "Verifying..." : loading ? "Processing..." : "Verify & Complete Registration"}
        </CustomButton>
      </form>
    </div>
  );
};
