
import { Layout } from "@/components/layout/Layout";

const About = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-mwap-700/30 to-mwap-900/30" />
          <div className="h-full w-full bg-[url('https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-30" />
        </div>
        <div className="relative z-10 section-container flex flex-col items-center justify-center min-h-[50vh] text-center">
          <div className="animate-fade-up">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About MWAP</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Learn about our mission, vision, and the team behind the Migrant Worker Assistance Platform
            </p>
          </div>
        </div>
      </section>

      {/* About Content */}
      <section className="py-16">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-up">
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground mb-6">
                MWAP is dedicated to supporting migrant workers in Tamil Nadu by providing them with essential resources, documentation assistance, and access to government schemes.
              </p>
              <p className="text-lg text-muted-foreground mb-6">
                We believe that every worker deserves dignity, fair treatment, and equal access to services regardless of their origin or socioeconomic status.
              </p>
              <p className="text-lg text-muted-foreground">
                By streamlining the registration and verification process, we aim to remove barriers that prevent migrant workers from accessing the support and benefits they are entitled to.
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-xl animate-fade-up" style={{ animationDelay: "100ms" }}>
              <img
                src="https://images.unsplash.com/photo-1593113630400-ea4288922497?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="Migrant workers"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-16 bg-accent">
        <div className="section-container">
          <div className="text-center mb-12 animate-fade-up">
            <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              We envision a future where all migrant workers have seamless access to social security, healthcare, and support services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Inclusive Access",
                description: "Create an ecosystem where all workers, regardless of their language or tech literacy, can access services"
              },
              {
                title: "Policy Advocacy",
                description: "Work with government bodies to develop and implement worker-friendly policies and schemes"
              },
              {
                title: "Community Building",
                description: "Foster a strong community where workers can share experiences and support each other"
              }
            ].map((item, index) => (
              <div 
                key={index} 
                className="glass-effect rounded-xl p-6 h-full animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="section-container">
          <div className="text-center mb-12 animate-fade-up">
            <h2 className="text-3xl font-bold mb-4">Our Team</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Meet the dedicated professionals working to make a difference in the lives of migrant workers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Priya Sharma",
                role: "Founder & Director",
                image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1976&q=80"
              },
              {
                name: "Rajesh Kumar",
                role: "Legal Advisor",
                image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80"
              },
              {
                name: "Anjali Patel",
                role: "Community Outreach",
                image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1961&q=80"
              },
              {
                name: "Vikram Singh",
                role: "Technology Lead",
                image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80"
              }
            ].map((member, index) => (
              <div 
                key={index} 
                className="animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="glass-effect rounded-xl overflow-hidden transition-all duration-300 hover:shadow-glass-hover group">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-5 text-center">
                    <h3 className="font-semibold text-lg">{member.name}</h3>
                    <p className="text-muted-foreground">{member.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
