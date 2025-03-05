
import { Layout } from "@/components/layout/Layout";
import { FileText, Users, MessageSquare, Shield, BookOpen, Building } from "lucide-react";
import { CustomButton } from "@/components/ui/custom-button";
import { Link } from "react-router-dom";

const Services = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-mwap-700/30 to-mwap-900/30" />
          <div className="h-full w-full bg-[url('https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80')] bg-cover bg-center opacity-30" />
        </div>
        <div className="relative z-10 section-container flex flex-col items-center justify-center min-h-[50vh] text-center">
          <div className="animate-fade-up">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Services</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive support for migrant workers across Tamil Nadu
            </p>
          </div>
        </div>
      </section>

      {/* Main Services Section */}
      <section className="py-16">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <FileText className="h-12 w-12 text-primary" />,
                title: "Documentation Assistance",
                description: "We help workers obtain and process necessary documents including work permits, identification cards, and residence certificates.",
                link: "/register"
              },
              {
                icon: <Users className="h-12 w-12 text-primary" />,
                title: "Registration & ID Generation",
                description: "Quick registration process with verification and issuance of a unique worker ID for accessing various services and benefits.",
                link: "/register"
              },
              {
                icon: <MessageSquare className="h-12 w-12 text-primary" />,
                title: "Information Chatbot",
                description: "AI-powered chatbot that provides information about Tamil Nadu government schemes specifically designed for migrant workers.",
                link: "/dashboard"
              },
              {
                icon: <Shield className="h-12 w-12 text-primary" />,
                title: "Legal Advisory",
                description: "Basic legal guidance regarding worker rights, wage disputes, and harassment issues in the workplace.",
                link: "/services"
              },
              {
                icon: <BookOpen className="h-12 w-12 text-primary" />,
                title: "Educational Resources",
                description: "Access to information about skill development programs, language courses, and vocational training opportunities.",
                link: "/services"
              },
              {
                icon: <Building className="h-12 w-12 text-primary" />,
                title: "Housing Support",
                description: "Information about affordable housing options and temporary accommodation facilities for newly arrived workers.",
                link: "/services"
              }
            ].map((service, index) => (
              <div 
                key={index} 
                className="glass-effect rounded-xl p-8 h-full flex flex-col animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                <p className="text-muted-foreground mb-5 flex-grow">{service.description}</p>
                <CustomButton variant="outline" size="sm" asChild className="mt-auto self-start">
                  <Link to={service.link}>Learn More</Link>
                </CustomButton>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 bg-accent">
        <div className="section-container">
          <div className="text-center mb-16 animate-fade-up">
            <h2 className="text-3xl font-bold mb-4">Our Process</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              We've streamlined our service delivery to ensure migrant workers can quickly and easily access the support they need
            </p>
          </div>

          <div className="relative">
            {/* Timeline connector */}
            <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-1 bg-primary/20 hidden md:block"></div>
            
            {/* Steps */}
            <div className="space-y-12 relative">
              {[
                {
                  number: "01",
                  title: "Registration",
                  description: "Complete a simple registration form with your personal details and work information."
                },
                {
                  number: "02",
                  title: "Verification",
                  description: "Your Aadhaar number is verified through OTP to ensure security and prevent fraud."
                },
                {
                  number: "03",
                  title: "ID Generation",
                  description: "A unique worker ID is generated that you can use to access all services on our platform."
                },
                {
                  number: "04",
                  title: "Profile Creation",
                  description: "Your digital profile is created containing all your information for easy access."
                },
                {
                  number: "05",
                  title: "Service Access",
                  description: "With your profile and ID, you can now access all services and support resources."
                }
              ].map((step, index) => (
                <div 
                  key={index}
                  className="relative animate-fade-up" 
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`md:flex items-center ${index % 2 === 0 ? '' : 'md:flex-row-reverse'}`}>
                    <div className="md:w-1/2 p-4 flex justify-center">
                      <div className="glass-effect w-16 h-16 rounded-full flex items-center justify-center text-primary text-2xl font-bold z-10 relative">
                        {step.number}
                      </div>
                    </div>
                    <div className={`md:w-1/2 p-4 glass-effect rounded-xl ${index % 2 === 0 ? 'text-left' : 'text-right'}`}>
                      <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-mwap-600 to-mwap-800 text-white">
        <div className="section-container text-center">
          <div className="max-w-3xl mx-auto animate-fade-up">
            <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-lg opacity-90 mb-8">
              Join thousands of migrant workers who have already benefited from our services. 
              Registration is quick, simple, and opens the door to numerous benefits.
            </p>
            <CustomButton 
              variant="glass" 
              size="lg" 
              className="bg-white/10 hover:bg-white/20"
              asChild
            >
              <Link to="/register">Register Now</Link>
            </CustomButton>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Services;
