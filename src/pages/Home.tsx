
import { Layout } from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { ArrowRight, Users, FileCheck, MessageSquare, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomButton } from "@/components/ui/custom-button";

const Home = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-mwap-700/20 to-mwap-900/20" />
          <div className="h-full w-full bg-[url('https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-20" />
        </div>
        <div className="relative z-10 section-container flex flex-col items-center justify-center min-h-[90vh] text-center">
          <div className="animate-fade-up">
            <div className="inline-block px-3 py-1 mb-6 rounded-full bg-primary/10 text-primary text-sm font-medium">
              Empowering Migrant Workers
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold max-w-4xl leading-tight mb-6">
              Supporting Migrant Workers with Dignity and Care
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              MWAP helps migrant workers access essential services, navigate legal processes, and connect with government schemes in Tamil Nadu.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CustomButton size="lg" asChild>
                <Link to="/register">Register Now</Link>
              </CustomButton>
              <CustomButton size="lg" variant="outline" asChild>
                <Link to="/services">Explore Services</Link>
              </CustomButton>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-accent">
        <div className="section-container">
          <div className="text-center mb-16 animate-fade-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How We Help</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our platform provides comprehensive support for migrant workers through these key services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Users className="h-10 w-10 text-primary" />,
                title: "Registration",
                description: "Easy registration process with unique ID generation for each worker"
              },
              {
                icon: <FileCheck className="h-10 w-10 text-primary" />,
                title: "Documentation",
                description: "Assistance with legal documentation and verification processes"
              },
              {
                icon: <MessageSquare className="h-10 w-10 text-primary" />,
                title: "Information",
                description: "Chatbot support to access Tamil Nadu government schemes"
              },
              {
                icon: <CheckCircle className="h-10 w-10 text-primary" />,
                title: "Verification",
                description: "Secure verification through Aadhaar and OTP validation"
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                className="glass-effect rounded-xl p-6 hover:translate-y-[-5px] transition-transform duration-300 animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-mwap-700 to-mwap-900 text-white">
        <div className="section-container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-up">Ready to Get Started?</h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8 animate-fade-up" style={{ animationDelay: "100ms" }}>
            Join thousands of migrant workers who have already benefited from our services.
            Registration is quick, simple, and opens the door to numerous benefits.
          </p>
          <div className="animate-fade-up" style={{ animationDelay: "200ms" }}>
            <CustomButton 
              size="lg" 
              variant="glass" 
              className="bg-white/10 hover:bg-white/20"
              asChild
            >
              <Link to="/register">
                Register Now <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </CustomButton>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
