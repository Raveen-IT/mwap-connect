
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, CheckCircle, Users, FileText, HelpCircle } from "lucide-react";

const Home = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary/5 to-background pt-24 pb-20">
        <div className="section-container">
          <div className="grid gap-12 md:grid-cols-2 md:gap-8 items-center">
            <div className="space-y-6 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Empowering Migrant Workers in Tamil Nadu
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto md:mx-0">
                MWAP connects migrant workers with essential services, information, and support systems.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Button size="lg">
                  <Link to="/register" className="flex items-center gap-2">
                    Register Now <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline">
                  <Link to="/about" className="flex items-center gap-2">
                    Learn More <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-3xl transform rotate-3"></div>
                <img 
                  src="/placeholder.svg" 
                  alt="Migrant Workers" 
                  className="relative z-10 rounded-3xl shadow-lg w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-accent/30">
        <div className="section-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How We Help</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our platform offers comprehensive support for migrant workers across multiple dimensions
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: <Users className="h-10 w-10 text-primary" />,
                title: "Identity & Registration",
                description: "Secure registration process with unique ID generation for accessing government services"
              },
              {
                icon: <FileText className="h-10 w-10 text-primary" />,
                title: "Scheme Information",
                description: "Access to information about Tamil Nadu government welfare schemes and benefits"
              },
              {
                icon: <HelpCircle className="h-10 w-10 text-primary" />,
                title: "Guidance & Support",
                description: "AI-powered chatbot to answer queries about available government schemes and eligibility"
              }
            ].map((feature, index) => (
              <Card key={index} className="bg-card/50 border-border/50">
                <CardContent className="pt-6">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary/5">
        <div className="section-container">
          <div className="glass-effect rounded-xl p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Register on our platform to access information about government schemes, generate your unique worker ID, and get personalized support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="rounded-full">
                <Link to="/register" className="flex items-center gap-2">
                  Register Now <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full">
                <Link to="/chatbot" className="flex items-center gap-2">
                  Try Our Chatbot <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="section-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose MWAP?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We're dedicated to improving the lives of migrant workers through technology and support
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: <CheckCircle className="h-6 w-6 text-primary" />,
                title: "Easy Registration",
                description: "Simple and secure registration process"
              },
              {
                icon: <CheckCircle className="h-6 w-6 text-primary" />,
                title: "Unique Worker ID",
                description: "Digital identity for accessing services"
              },
              {
                icon: <CheckCircle className="h-6 w-6 text-primary" />,
                title: "Multi-language Support",
                description: "Information in multiple languages"
              },
              {
                icon: <CheckCircle className="h-6 w-6 text-primary" />,
                title: "24/7 AI Assistance",
                description: "Get answers anytime through our chatbot"
              }
            ].map((benefit, index) => (
              <div key={index} className="flex gap-3 p-4">
                <div className="shrink-0 mt-1">{benefit.icon}</div>
                <div>
                  <h3 className="font-bold mb-1">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
