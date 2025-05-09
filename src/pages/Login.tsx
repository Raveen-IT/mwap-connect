
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Phone, LogIn, Key, AlertCircle, Mail, Globe } from "lucide-react";
import { validateMobileNumber } from "@/utils/form-validators";
import { getUserByMobile, setCurrentUser } from "@/utils/storage";
import { generateOTP } from "@/utils/id-generator";
import { useLanguage } from "@/context/LanguageContext";
import { useSupabase } from "@/context/SupabaseContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LoadingPage } from "@/components/ui/loading-page";
import { sendOTP, verifyOTP, formatPhoneNumberE164 } from "@/utils/otpService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

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
  const { signIn, isConfigured, supabase } = useSupabase();

  if (loading) {
    return <LoadingPage message="Authenticating..." />;
  }

  // Handle mobile input separately to only accept 10 digits
  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    // Only allow up to 10 digits
    const digitsOnly = value.replace(/\D/g, '').slice(0, 10);
    setMobile(digitsOnly);
  };

  const handleMobileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateMobileNumber(mobile)) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }
    
    setLoading(true);
    
    try {
      // Format phone number to E.164 format before checking or sending
      const formattedPhone = formatPhoneNumberE164(mobile);
      
      // First, check if the user exists in Supabase
      const { data: users, error } = await supabase
        .from('user_data')
        .select('*')
        .eq('mobile_number', formattedPhone)
        .limit(1);
      
      if (error) {
        throw error;
      }
      
      if (!users || users.length === 0) {
        // Fallback to local storage check
        const localUser = getUserByMobile(mobile);
        if (!localUser) {
          toast.error("No account found with this mobile number. Please register first.");
          setLoading(false);
          return;
        }
      }
      
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
      console.error("Error checking user or sending OTP:", error);
      toast.error(error.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    
    try {
      // Format phone number to E.164 format
      const formattedPhone = formatPhoneNumberE164(mobile);
      
      // Send OTP using Twilio via Edge Function
      const result = await sendOTP(formattedPhone);
      
      if (result.success) {
        toast.success("A new OTP has been sent to your mobile");
        
        // For testing - in production, don't show this
        if (result.otp) {
          setGeneratedOtp(result.otp);
          toast.info(`For testing, your new OTP is: ${result.otp}`);
        }
      } else {
        toast.error("Failed to resend OTP: " + (result.error || "Unexpected error"));
      }
    } catch (error: any) {
      console.error("Error resending OTP:", error);
      toast.error(`Error: ${error.message || "Failed to resend OTP"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp || otp.trim() === "") {
      toast.error("Please enter the OTP");
      return;
    }
    
    setLoading(true);
    
    try {
      // Format phone number to E.164 format
      const formattedPhone = formatPhoneNumberE164(mobile);
      
      // Verify the OTP with our backend
      const result = await verifyOTP(formattedPhone, otp);
      
      if (!result.valid) {
        toast.error(result.error || "Invalid OTP. Please try again");
        setLoading(false);
        return;
      }
      
      // First try to find the user in Supabase
      const { data: users, error } = await supabase
        .from('user_data')
        .select('*')
        .eq('mobile_number', formattedPhone)
        .limit(1);
      
      if (error) {
        throw error;
      }
      
      if (users && users.length > 0) {
        // User found in Supabase
        const supabaseUser = users[0];
        
        // Convert Supabase user to local user format for compatibility
        const localUserFormat = {
          id: supabaseUser.id,
          name: supabaseUser.name,
          age: supabaseUser.age,
          gender: supabaseUser.gender as any,
          workingType: supabaseUser.working_type as any,
          migrationPlace: supabaseUser.migration_place,
          mobile: supabaseUser.mobile_number,
          aadhaarNumber: supabaseUser.aadhaar_number,
          email: supabaseUser.email || undefined,
          isVerified: supabaseUser.is_verified || false,
          registrationDate: supabaseUser.created_at || new Date().toISOString()
        };
        
        // Set this user as the current user
        setCurrentUser(localUserFormat);
        
        // Update last login time in Supabase (no need to await)
        try {
          // Record login event
          await supabase.functions.invoke('record-user-login', {
            body: { user_mobile: mobile }
          });
        } catch (loginUpdateError) {
          console.error('Error recording login event:', loginUpdateError);
        }
        
        toast.success("Login successful!");
        navigate('/dashboard');
      } else {
        // Fallback to local storage
        const localUser = getUserByMobile(mobile);
        
        if (localUser) {
          setCurrentUser(localUser);
          window.dispatchEvent(new Event("storage"));
          toast.success("Login successful!");
          navigate('/dashboard');
        } else {
          toast.error("User not found. Please register first.");
        }
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
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

  const handleGoogleSignIn = async () => {
    if (!isConfigured) {
      toast.error("Supabase integration is not configured. Please connect via Lovable interface.");
      return;
    }
    
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/dashboard'
        }
      });
      
      if (error) {
        throw error;
      }
      
      // Auth redirection will happen automatically
      // No need for toast as user will be redirected away
    } catch (error: any) {
      console.error("Google sign-in error:", error);
      toast.error(error.message || "Failed to sign in with Google. Please try again.");
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
                          <div className="flex">
                            <div className="flex-shrink-0 flex items-center justify-center border border-r-0 rounded-l-md bg-muted px-3 text-muted-foreground">
                              +91
                            </div>
                            <Input
                              id="mobile"
                              value={mobile}
                              onChange={handleMobileChange}
                              placeholder="Enter your 10-digit mobile number"
                              required
                              autoFocus
                              className="rounded-l-none"
                              maxLength={10}
                              inputMode="numeric"
                              pattern="[0-9]{10}"
                              title="Please enter exactly 10 digits"
                            />
                          </div>
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
                        {t("login.enterOTP")} {mobile.startsWith('+91') ? mobile : `+91-${mobile}`}
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
                      
                      <Separator className="my-4">
                        <span className="mx-2 text-xs text-muted-foreground">OR</span>
                      </Separator>
                      
                      <Button 
                        type="button"
                        variant="outline"
                        className="w-full flex items-center gap-2 justify-center"
                        onClick={handleGoogleSignIn}
                        disabled={loading}
                      >
                        <Globe className="h-4 w-4" />
                        Sign in with Google
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
                        <div className="flex">
                          <div className="flex-shrink-0 flex items-center justify-center border border-r-0 rounded-l-md bg-muted px-3 text-muted-foreground">
                            +91
                          </div>
                          <Input
                            id="mobile"
                            value={mobile}
                            onChange={handleMobileChange}
                            placeholder="Enter your 10-digit mobile number"
                            required
                            autoFocus
                            className="rounded-l-none"
                            maxLength={10}
                            inputMode="numeric"
                            pattern="[0-9]{10}"
                            title="Please enter exactly 10 digits"
                          />
                        </div>
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
                      {t("login.enterOTP")} {mobile.startsWith('+91') ? mobile : `+91-${mobile}`}
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
