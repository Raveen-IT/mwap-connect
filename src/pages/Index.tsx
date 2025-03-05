
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { Users, BarChart4, MessageSquareHeart, ShieldCheck } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-28 bg-gradient-to-b from-background to-accent">
        <div className="section-container">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-up">
              Migrant Worker Assistance Platform
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 animate-fade-up animation-delay-100">
              Supporting migrant workers with essential services, information, and assistance
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up animation-delay-200">
              <Button 
                size="lg" 
                onClick={() => navigate("/register")}
              >
                Register Now
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => navigate("/about")}
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="section-container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">How We Help</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="glass-effect p-6 rounded-xl text-center hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Easy Registration</h3>
              <p className="text-muted-foreground">Simple registration process with secure verification for migrant workers</p>
            </div>

            {/* Feature 2 */}
            <div className="glass-effect p-6 rounded-xl text-center hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <ShieldCheck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Verified Profiles</h3>
              <p className="text-muted-foreground">Secure identity verification with Aadhaar and mobile OTP</p>
            </div>

            {/* Feature 3 */}
            <div className="glass-effect p-6 rounded-xl text-center hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <BarChart4 className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Government Schemes</h3>
              <p className="text-muted-foreground">Access to Tamil Nadu government welfare schemes for migrant workers</p>
            </div>

            {/* Feature 4 */}
            <div className="glass-effect p-6 rounded-xl text-center hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <MessageSquareHeart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">AI Assistance</h3>
              <p className="text-muted-foreground">Intelligent chatbot to answer your questions about available schemes</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-accent">
        <div className="section-container">
          <div className="glass-effect p-10 md:p-16 rounded-2xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of migrant workers who have already benefited from our platform. Register today and access all services.
            </p>
            <Button 
              size="lg" 
              className="px-8 py-6 text-lg" 
              onClick={() => navigate("/register")}
            >
              Register Now
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
