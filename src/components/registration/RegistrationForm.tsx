
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { CustomButton } from "@/components/ui/custom-button";
import { toast } from "sonner";
import { User, Gender, WorkingType } from "@/types/user";
import { generateWorkerId, generateOTP } from "@/utils/id-generator";
import { validateMobileNumber, validateAadhaar } from "@/utils/form-validators";
import { addUser, getUserByMobile, getUserByAadhaar, setCurrentUser } from "@/utils/storage";
import { supabase } from "@/lib/supabase";
import { sendOtpSms } from "@/utils/sendOtpSms";

type RegistrationStep = 'details' | 'verification' | 'success';

export const RegistrationForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<RegistrationStep>('details');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>({
    name: "",
    age: 0,
    gender: "male" as Gender,
    workingType: "construction" as WorkingType,
    migrationPlace: "",
    mobile: "",
    aadhaarNumber: "",
    email: "",
  });
  
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [userId, setUserId] = useState("");

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numberValue = value === "" ? 0 : parseInt(value);
    setFormData({ ...formData, [name]: numberValue });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const validateDetailsForm = () => {
    if (!formData.name || formData.name.trim() === "") {
      toast.error("Please enter your name");
      return false;
    }
    
    if (!formData.age || formData.age < 18) {
      toast.error("You must be at least 18 years old to register");
      return false;
    }
    
    if (!formData.migrationPlace || formData.migrationPlace.trim() === "") {
      toast.error("Please enter your place of migration");
      return false;
    }
    
    if (!formData.mobile || !validateMobileNumber(formData.mobile)) {
      toast.error("Please enter a valid 10-digit mobile number");
      return false;
    }
    
    if (!formData.aadhaarNumber || !validateAadhaar(formData.aadhaarNumber)) {
      toast.error("Please enter a valid 12-digit Aadhaar number");
      return false;
    }
    
    const existingUserByMobile = getUserByMobile(formData.mobile);
    if (existingUserByMobile) {
      toast.error("This mobile number is already registered");
      return false;
    }
    
    const existingUserByAadhaar = getUserByAadhaar(formData.aadhaarNumber);
    if (existingUserByAadhaar) {
      toast.error("This Aadhaar number is already registered");
      return false;
    }
    
    return true;
  };

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateDetailsForm()) {
      return;
    }
    
    // Check if the mobile or aadhaar exists in Supabase
    try {
      const { data: existingMobile } = await supabase
        .from('registration_details')
        .select('id')
        .eq('mobile', formData.mobile)
        .single();
        
      if (existingMobile) {
        toast.error("This mobile number is already registered in our system");
        return;
      }
      
      const { data: existingAadhaar } = await supabase
        .from('registration_details')
        .select('id')
        .eq('aadhaar_number', formData.aadhaarNumber)
        .single();
        
      if (existingAadhaar) {
        toast.error("This Aadhaar number is already registered in our system");
        return;
      }
    } catch (error) {
      // If error is "No rows found" then we can proceed
      // This is expected since we want to verify these don't exist
      console.log("Validation passed: No existing records found");
    }
    
    setLoading(true);
    const newOtp = generateOTP();
    setGeneratedOtp(newOtp);

    // Simulate OTP sending
    const result = await sendOtpSms(formData.mobile as string, newOtp);
    if (result.success) {
      toast.success("OTP sent to your mobile (simulated)");
      toast.info(`For testing, your OTP is: ${newOtp}`);
      setStep('verification');
    } else {
      toast.error("Failed to send OTP: " + (result.error || "Unexpected error"));
    }
    setLoading(false);
  };

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp || otp.trim() === "") {
      toast.error("Please enter the OTP");
      return;
    }
    
    if (otp !== generatedOtp) {
      toast.error("Invalid OTP. Please try again");
      return;
    }
    
    setLoading(true);
    
    try {
      const newUserId = generateWorkerId();
      setUserId(newUserId);
      
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
          mobile_number: formData.mobile,
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
          mobile: formData.mobile,
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

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {step === 'details' && (
        <div className="glass-effect rounded-xl p-8 animate-fade-up">
          <h2 className="text-2xl font-bold mb-6">Registration</h2>
          <form onSubmit={handleDetailsSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleTextChange}
                placeholder="Enter your full name"
                required
                autoFocus
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                name="age"
                type="number"
                min="18"
                max="100"
                value={formData.age === 0 ? "" : formData.age}
                onChange={handleNumberChange}
                placeholder="Enter your age"
                required
              />
            </div>
            
            <div className="space-y-3">
              <Label>Gender</Label>
              <RadioGroup 
                defaultValue={formData.gender} 
                onValueChange={(value) => handleSelectChange("gender", value)}
                className="flex space-x-8"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male" className="cursor-pointer">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female" className="cursor-pointer">Female</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other" className="cursor-pointer">Other</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="workingType">Type of Work</Label>
              <Select 
                value={formData.workingType} 
                onValueChange={(value) => handleSelectChange("workingType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select work type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="construction">Construction</SelectItem>
                  <SelectItem value="agriculture">Agriculture</SelectItem>
                  <SelectItem value="manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="domestic">Domestic Work</SelectItem>
                  <SelectItem value="hospitality">Hospitality</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="migrationPlace">Place of Migration</Label>
              <Input
                id="migrationPlace"
                name="migrationPlace"
                value={formData.migrationPlace}
                onChange={handleTextChange}
                placeholder="Where are you migrating to?"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile Number</Label>
              <Input
                id="mobile"
                name="mobile"
                value={formData.mobile}
                onChange={handleTextChange}
                placeholder="10-digit mobile number"
                required
              />
              <p className="text-xs text-muted-foreground">
                We'll send a verification OTP to this number
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="aadhaarNumber">Aadhaar Number</Label>
              <Input
                id="aadhaarNumber"
                name="aadhaarNumber"
                value={formData.aadhaarNumber}
                onChange={handleTextChange}
                placeholder="12-digit Aadhaar number"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address (Optional)</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleTextChange}
                placeholder="Your email address"
              />
            </div>
            
            <CustomButton 
              type="submit" 
              disabled={loading}
              className="w-full"
            >
              {loading ? "Processing..." : "Continue to Verification"}
            </CustomButton>
          </form>
        </div>
      )}
      
      {step === 'verification' && (
        <div className="glass-effect rounded-xl p-8 animate-fade-up">
          <h2 className="text-2xl font-bold mb-6">OTP Verification</h2>
          <p className="mb-6 text-muted-foreground">
            Please enter the OTP sent to your mobile number {formData.mobile}
          </p>
          
          <div className="mb-6 p-4 bg-primary/10 rounded-lg text-center">
            <p className="font-medium">Test OTP: {generatedOtp}</p>
            <p className="text-xs text-muted-foreground mt-1">
              This is displayed for testing purposes only
            </p>
          </div>
          
          <form onSubmit={handleVerificationSubmit} className="space-y-6">
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
                onClick={() => {
                  toast.success(`OTP resent (simulated): ${generatedOtp}`);
                }}
              >
                Didn't receive OTP? Resend
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
      )}
      
      {step === 'success' && (
        <div className="glass-effect rounded-xl p-8 text-center animate-fade-up">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <CheckCircle className="h-8 w-8 text-primary" />
          </div>
          
          <h2 className="text-2xl font-bold mb-4">Registration Successful!</h2>
          <p className="text-muted-foreground mb-6">
            Your account has been created successfully. Your unique worker ID is:
          </p>
          
          <div className="bg-accent p-4 rounded-lg mb-8">
            <p className="text-xl font-mono font-medium">{userId}</p>
          </div>
          
          <p className="text-sm text-muted-foreground mb-8">
            Please save this ID for future reference. You will need it to access our services.
          </p>
          
          <CustomButton 
            onClick={handleGoToDashboard}
            className="w-full"
          >
            Go to Dashboard
          </CustomButton>
        </div>
      )}
    </div>
  );
};
