
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import {
  FileText,
  GraduationCap,
  HeartPulse,
  Home,
  MessageSquare,
  UserPlus,
  Briefcase,
  Users,
  Handshake,
  MessageCircle
} from "lucide-react";

const Services = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-accent py-16 md:py-24">
        <div className="section-container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Services</h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Comprehensive support services designed specifically for migrant workers in Tamil Nadu
            </p>
            <Button 
              size="lg" 
              onClick={() => navigate("/register")}
            >
              Register for Services
            </Button>
          </div>
        </div>
      </section>

      {/* Core Services */}
      <section className="py-16 md:py-24 bg-background">
        <div className="section-container">
          <h2 className="text-3xl font-bold mb-12 text-center">Core Services</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Service 1 */}
            <div className="glass-effect rounded-xl overflow-hidden">
              <div className="p-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <UserPlus className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Worker Registration</h3>
                <p className="text-muted-foreground mb-4">
                  Secure registration with Aadhaar verification to create a unique worker ID and profile
                </p>
                <Button variant="outline" size="sm" className="mt-2">
                  <Link to="/register">Register Now</Link>
                </Button>
              </div>
            </div>

            {/* Service 2 */}
            <div className="glass-effect rounded-xl overflow-hidden">
              <div className="p-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Government Schemes</h3>
                <p className="text-muted-foreground mb-4">
                  Information and assistance with Tamil Nadu government welfare schemes for migrant workers
                </p>
                <Button variant="outline" size="sm" className="mt-2">
                  <Link to="/chatbot">Explore Schemes</Link>
                </Button>
              </div>
            </div>

            {/* Service 3 */}
            <div className="glass-effect rounded-xl overflow-hidden">
              <div className="p-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">AI Assistance</h3>
                <p className="text-muted-foreground mb-4">
                  24/7 chatbot support to answer questions about schemes, benefits, and services
                </p>
                <Button variant="outline" size="sm" className="mt-2">
                  <Link to="/chatbot">Chat Now</Link>
                </Button>
              </div>
            </div>

            {/* Service 4 */}
            <div className="glass-effect rounded-xl overflow-hidden">
              <div className="p-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <HeartPulse className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Healthcare Support</h3>
                <p className="text-muted-foreground mb-4">
                  Information on healthcare facilities, insurance schemes, and medical assistance
                </p>
                <Button variant="outline" size="sm" className="mt-2">
                  <Link to="/services">Learn More</Link>
                </Button>
              </div>
            </div>

            {/* Service 5 */}
            <div className="glass-effect rounded-xl overflow-hidden">
              <div className="p-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <GraduationCap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Skill Development</h3>
                <p className="text-muted-foreground mb-4">
                  Training programs and resources to enhance job skills and employability
                </p>
                <Button variant="outline" size="sm" className="mt-2">
                  <Link to="/services">View Programs</Link>
                </Button>
              </div>
            </div>

            {/* Service 6 */}
            <div className="glass-effect rounded-xl overflow-hidden">
              <div className="p-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Home className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Housing Assistance</h3>
                <p className="text-muted-foreground mb-4">
                  Information on affordable housing options and rental assistance programs
                </p>
                <Button variant="outline" size="sm" className="mt-2">
                  <Link to="/services">Find Housing</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-16 md:py-24 bg-accent">
        <div className="section-container">
          <h2 className="text-3xl font-bold mb-12 text-center">Additional Support</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="glass-effect p-8 rounded-xl">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Briefcase className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3">Employment Opportunities</h3>
                  <p className="text-muted-foreground mb-4">
                    We connect registered workers with verified employers across various sectors in Tamil Nadu. Our platform helps match your skills with suitable job opportunities and ensures fair labor practices.
                  </p>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Job listings across multiple sectors</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Verified employers and fair wage practices</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Resume building and interview preparation</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="glass-effect p-8 rounded-xl">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3">Community Support</h3>
                  <p className="text-muted-foreground mb-4">
                    We foster a sense of community among migrant workers through various initiatives. Our community programs help workers connect with others from similar backgrounds and access local support networks.
                  </p>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Regional worker community groups</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Cultural events and celebrations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Peer support and mentoring</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="glass-effect p-8 rounded-xl">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Handshake className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3">Legal Assistance</h3>
                  <p className="text-muted-foreground mb-4">
                    Our partners provide legal guidance and support for migrant workers facing workplace issues, documentation problems, or other legal challenges. We ensure workers understand their rights and have access to proper representation.
                  </p>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Free legal consultations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Documentation and paperwork assistance</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Workplace rights education</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="glass-effect p-8 rounded-xl">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3">Multilingual Support</h3>
                  <p className="text-muted-foreground mb-4">
                    We provide support in multiple languages to ensure all migrant workers can access our services regardless of language barriers. Our team includes speakers of several Indian languages to facilitate clear communication.
                  </p>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Support in Hindi, Tamil, Telugu, Bengali, and more</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Translated resources and materials</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Language classes for local integration</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="section-container">
          <div className="glass-effect p-10 md:p-16 rounded-2xl text-center max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Register today to access all our services and receive personalized assistance 
              for your needs as a migrant worker in Tamil Nadu.
            </p>
            <Button 
              variant="glass" 
              size="lg" 
              className="px-8" 
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

export default Services;
