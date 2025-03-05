
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Users,
  CheckCircle,
  ShieldCheck,
  GraduationCap,
  Heart,
  Award
} from "lucide-react";

const About = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-accent py-16 md:py-24">
        <div className="section-container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About MWAP</h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              The Migrant Worker Assistance Platform (MWAP) is dedicated to supporting and
              empowering migrant workers across Tamil Nadu through accessible services,
              resources, and advocacy.
            </p>
            <Button
              size="lg"
              onClick={() => navigate("/register")}
            >
              Join Us Today
            </Button>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 md:py-24 bg-background">
        <div className="section-container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground mb-8">
                To create a supportive ecosystem for migrant workers in Tamil Nadu that
                ensures their dignity, rights, and well-being through technology-enabled
                solutions, community building, and partnerships with government agencies.
              </p>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0" />
                  <p>Connect workers with essential government services</p>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0" />
                  <p>Provide accurate information about welfare schemes</p>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0" />
                  <p>Create a secure identification system for migrant workers</p>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0" />
                  <p>Advocate for policies that support migrant workers' rights</p>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Vision</h2>
              <p className="text-lg text-muted-foreground mb-8">
                We envision a Tamil Nadu where all migrant workers are recognized,
                respected, and fully integrated into society with equal access to
                opportunities, healthcare, education, and social security.
              </p>
              <div className="glass-effect p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-3">Our Impact</h3>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-3xl font-bold text-primary">50,000+</p>
                    <p className="text-sm text-muted-foreground">Workers Registered</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-primary">30+</p>
                    <p className="text-sm text-muted-foreground">Government Schemes</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-primary">15+</p>
                    <p className="text-sm text-muted-foreground">Districts Covered</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-primary">24/7</p>
                    <p className="text-sm text-muted-foreground">Support Available</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-24 bg-accent">
        <div className="section-container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Core Values</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              These principles guide our work and ensure we remain focused on creating
              meaningful impact for migrant workers.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-effect p-6 rounded-xl text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Inclusivity</h3>
              <p className="text-muted-foreground">
                We embrace diversity and ensure our services are accessible to all
                migrant workers regardless of their background, language, or skill level.
              </p>
            </div>

            <div className="glass-effect p-6 rounded-xl text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <ShieldCheck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Trust & Security</h3>
              <p className="text-muted-foreground">
                We prioritize the privacy and security of workers' information,
                building trust through transparent and ethical practices.
              </p>
            </div>

            <div className="glass-effect p-6 rounded-xl text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <GraduationCap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Empowerment</h3>
              <p className="text-muted-foreground">
                We believe in equipping workers with knowledge, resources, and support
                to make informed decisions and improve their quality of life.
              </p>
            </div>

            <div className="glass-effect p-6 rounded-xl text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Compassion</h3>
              <p className="text-muted-foreground">
                We approach our work with empathy and understanding of the unique
                challenges faced by migrant workers and their families.
              </p>
            </div>

            <div className="glass-effect p-6 rounded-xl text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Excellence</h3>
              <p className="text-muted-foreground">
                We strive for excellence in all our initiatives, continuously improving
                our services to meet the evolving needs of migrant workers.
              </p>
            </div>

            <div className="glass-effect p-6 rounded-xl text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Accountability</h3>
              <p className="text-muted-foreground">
                We take responsibility for our actions and remain accountable to the
                migrant worker community and all our stakeholders.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="section-container">
          <div className="glass-effect p-10 md:p-16 rounded-2xl text-center max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Join Our Mission</h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Whether you're a migrant worker seeking assistance or an organization looking to partner with us,
              we invite you to be part of our journey to create a better future for migrant workers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => navigate("/register")}
              >
                Register Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/contact")}
              >
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
