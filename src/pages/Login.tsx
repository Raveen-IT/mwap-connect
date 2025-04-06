
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Phone, LogIn, Key } from "lucide-react";
import { validateMobileNumber } from "@/utils/form-validators";
import { getUserByMobile, setCurrentUser } from "@/utils/storage";
import { generateOTP } from "@/utils/id-generator";
import { useLanguage } from "@/context/LanguageContext";

type LoginStep = 'mobile' | 'verification';

const Login = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<LoginStep>('mobile');
  const [loading, setLoading] = useState(false);
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const { t } = useLanguage();

  const handleMobileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateMobileNumber(mobile)) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }
    
    const user = getUserByMobile(mobile);
    if (!user) {
      toast.error("No account found with this mobile number. Please register first.");
      return;
    }
    
    setLoading(true);
    
    // Generate OTP
    const newOtp = generateOTP();
    setGeneratedOtp(newOtp);
    
    // Simulate sending OTP
    setTimeout(() => {
      toast.success(`OTP sent to your mobile: ${newOtp}`);
      setStep('verification');
      setLoading(false);
    }, 1500);
  };

  const handleVerificationSubmit = (e: React.FormEvent) => {
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
    
    const user = getUserByMobile(mobile);
    
    // Simulate API call
    setTimeout(() => {
      if (user) {
        setCurrentUser(user);
        
        // Dispatch storage event to notify other components
        window.dispatchEvent(new Event("storage"));
        
        toast.success("Login successful!");
        navigate('/dashboard');
      } else {
        toast.error("An error occurred. Please try again.");
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <Layout>
      <section className="py-16">
        <div className="section-container">
          <div className="text-center mb-12 animate-fade-up">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{t("welcome.title")}</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("welcome.subtitle")}
            </p>
          </div>

          <div className="w-full max-w-md mx-auto">
            {step === 'mobile' && (
              <div className="glass-effect rounded-xl p-8 animate-fade-up">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <LogIn className="h-6 w-6" /> {t("navbar.login")}
                </h2>
                <form onSubmit={handleMobileSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="mobile" className="flex items-center gap-1">
                      <Phone className="h-4 w-4" /> {t("login.mobile")}
                    </Label>
                    <Input
                      id="mobile"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="Enter your 10-digit mobile number"
                      required
                      autoFocus
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? "Sending OTP..." : t("login.continueBtn")}
                  </Button>
                  
                  <div className="text-center pt-2">
                    <p className="text-sm text-muted-foreground">
                      {t("login.accountQuestion")}{" "}
                      <a 
                        href="/register" 
                        className="text-primary hover:underline font-medium"
                      >
                        {t("login.registerLink")}
                      </a>
                    </p>
                  </div>
                </form>
              </div>
            )}
            
            {step === 'verification' && (
              <div className="glass-effect rounded-xl p-8 animate-fade-up">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Key className="h-6 w-6" /> {t("login.otpVerification")}
                </h2>
                <p className="mb-6 text-muted-foreground">
                  {t("login.enterOTP")} {mobile}
                </p>
                
                <form onSubmit={handleVerificationSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="otp">Enter OTP</Label>
                    <Input
                      id="otp"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder={t("login.otpPlaceholder")}
                      maxLength={4}
                      autoFocus
                      required
                    />
                  </div>
                  
                  <div className="text-center text-sm">
                    <button 
                      type="button" 
                      className="text-primary hover:underline"
                      onClick={() => {
                        toast.success(`OTP resent: ${generatedOtp}`);
                      }}
                    >
                      {t("login.resendOTP")}
                    </button>
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? "Verifying..." : t("login.loginBtn")}
                  </Button>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Login;
