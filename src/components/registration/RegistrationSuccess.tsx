
import { CheckCircle } from "lucide-react";
import { CustomButton } from "@/components/ui/custom-button";

interface RegistrationSuccessProps {
  userId: string;
  onGoToDashboard: () => void;
}

export const RegistrationSuccess = ({ userId, onGoToDashboard }: RegistrationSuccessProps) => {
  return (
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
        onClick={onGoToDashboard}
        className="w-full"
      >
        Go to Dashboard
      </CustomButton>
    </div>
  );
};
