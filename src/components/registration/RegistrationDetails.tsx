
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
import { validateMobileNumber, validateAadhaar } from "@/utils/form-validators";
import { getUserByMobile, getUserByAadhaar } from "@/utils/storage";
import { supabase } from "@/integrations/supabase/client";

interface RegistrationDetailsProps {
  formData: Partial<User>;
  loading: boolean;
  onSubmit: (formData: Partial<User>) => void;
}

export const RegistrationDetails = ({ formData: initialFormData, loading, onSubmit }: RegistrationDetailsProps) => {
  const [formData, setFormData] = useState<Partial<User>>(initialFormData);

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

  const handleSubmit = async (e: React.FormEvent) => {
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
    
    onSubmit(formData);
  };

  return (
    <div className="glass-effect rounded-xl p-8 animate-fade-up">
      <h2 className="text-2xl font-bold mb-6">Registration</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
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
            onValueChange={(value) => handleSelectChange("gender", value as Gender)}
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
            onValueChange={(value) => handleSelectChange("workingType", value as WorkingType)}
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
  );
};
