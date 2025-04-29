import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Phone, LogIn, Key, AlertCircle, Mail } from "lucide-react";
import { validateMobileNumber } from "@/utils/form-validators";
import { getUserByMobile, setCurrentUser } from "@/utils/storage";
import { generateOTP } from "@/utils/id-generator";
import { useLanguage } from "@/context/LanguageContext";
import { useSupabase } from "@/context/SupabaseContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LoadingPage } from "@/components/ui/loading-page";
import { sendOtpSms } from "@/utils/sendOtpSms";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type LoginStep = 'mobile' | 'verification' | 'email';

const Login = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<LoginStep>('mobile');
  const [activeTab, setActiveTab] = useState<string>("mobile");
  const [loading, setLoading] = useState(false);
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { t } = useLanguage();
  const { signIn, isConfigured } = useSupabase();

  if (loading) {
    return <LoadingPage message="Authenticating..." />;
  }

  const handleMobileSubmit = async (e: React.FormEvent) => {
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

    try {
      // Send OTP via SMS
      const result = await sendOtpSms(mobile, newOtp);
      if (result.success) {
        toast.success("OTP sent to your mobile.");
        setStep('verification');
      } else {
        toast.error("Failed to send OTP: " + (result.error || "Unexpected error"));
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    const newOtp = generateOTP();
    setGeneratedOtp(newOtp);
    
    try {
      const result = await sendOtpSms(mobile, newOtp);
      if (result.success) {
        toast.success("A new OTP has been sent to your mobile.");
      } else {
        toast.error("Failed to resend OTP: " + (result.error || "Unexpected error"));
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
      toast.error("Failed to resend OTP. Please try again.");
    } finally {
      setLoading(false);
    }
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
        
        // Also store login event to Supabase if possible
        try {
          if (isConfigured) {
            const { supabase } = useSupabase();
            // Use a try-catch block for the Supabase operation
            try {
              supabase.from('user_data')
                .update({ last_login: new Date().toISOString() })
                .eq('mobile_number', mobile)
                .then(() => {
                  console.log('Login event recorded in Supabase');
                })
                .catch(error => {
                  console.error('Error recording login event:', error);
                });
            } catch (error) {
              console.error('Error with Supabase operation:', error);
            }
          }
        } catch (error) {
          console.error('Error with Supabase logging:', error);
        }
        
        toast.success("Login successful!");
        navigate('/dashboard');
      } else {
        toast.error("An error occurred. Please try again.");
      }
      setLoading(false);
    }, 1000);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }
    
    setLoading(true);
    
    try {
      await signIn(email, password);
      toast.success("Login successful!");
      navigate('/dashboard');
    } catch (error: any) {
      // Error is handled in the signIn function but we catch it here too
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === "mobile") {
      setStep("mobile");
    }
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
            {isConfigured && (
              <Tabs
                defaultValue="mobile"
                value={activeTab} 
                onValueChange={handleTabChange}
                className="mb-6"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="mobile" className="flex items-center gap-1">
                    <Phone className="h-4 w-4" /> Mobile OTP
                  </TabsTrigger>
                  <TabsTrigger value="email" className="flex items-center gap-1">
                    <Mail className="h-4 w-4" /> Email
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="mobile" className="mt-4">
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
                            onClick={handleResendOtp}
                            disabled={loading}
                          >
                            {loading ? "Resending OTP..." : t("login.resendOTP")}
                          </button>
                        </div>
                        
                        <Button 
                          type="submit" 
                          disabled={loading}
                          className="w-full"
                        >
                          {loading ? "Verifying..." : t("login.loginBtn")}
                        </Button>

                        <div className="text-center pt-2">
                          <button
                            type="button"
                            onClick={() => setStep('mobile')}
                            className="text-sm text-primary hover:underline"
                          >
                            Back to mobile entry
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="email" className="mt-4">
                  <div className="glass-effect rounded-xl p-8 animate-fade-up">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                      <Mail className="h-6 w-6" /> Email Login
                    </h2>
                    <form onSubmit={handleEmailSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email"
                          required
                          autoFocus
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your password"
                          required
                        />
                      </div>
                      
                      <Button 
                        type="submit" 
                        disabled={loading}
                        className="w-full"
                      >
                        {loading ? "Logging in..." : "Log in"}
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
                </TabsContent>
              </Tabs>
            )}
            
            {!isConfigured && (
              <>
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Supabase Not Connected</AlertTitle>
                  <AlertDescription>
                    Supabase integration is not configured. Please connect via the Lovable interface.
                    Login with mobile is available as a fallback.
                  </AlertDescription>
                </Alert>

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
                          onClick={handleResendOtp}
                          disabled={loading}
                        >
                          {loading ? "Resending OTP..." : t("login.resendOTP")}
                        </button>
                      </div>
                      
                      <Button 
                        type="submit" 
                        disabled={loading}
                        className="w-full"
                      >
                        {loading ? "Verifying..." : t("login.loginBtn")}
                      </Button>

                      <div className="text-center pt-2">
                        <button
                          type="button"
                          onClick={() => setStep('mobile')}
                          className="text-sm text-primary hover:underline"
                        >
                          Back to mobile entry
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Login;
