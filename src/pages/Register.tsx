
import { Layout } from "@/components/layout/Layout";
import { RegistrationForm } from "@/components/registration/RegistrationForm";

const Register = () => {
  return (
    <Layout>
      <section className="py-16">
        <div className="section-container">
          <div className="text-center mb-12 animate-fade-up">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Join MWAP</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Register to access services, information, and support for migrant workers
            </p>
          </div>

          <RegistrationForm />
        </div>
      </section>
    </Layout>
  );
};

export default Register;
