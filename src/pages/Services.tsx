
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListChecks, Home, Backpack, Construction, Tractor, Factory, Book, Heart, FileText } from "lucide-react";
import { Link } from "react-router-dom";

const Services = () => {
  return (
    <Layout>
      <section className="bg-gradient-to-b from-primary/5 to-background pt-24 pb-12">
        <div className="section-container text-center">
          <h1 className="text-4xl font-bold mb-4">Our Services</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            MWAP provides a range of services to support migrant workers in Tamil Nadu
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="section-container">
          <Tabs defaultValue="welfare" className="space-y-8">
            <TabsList className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 w-full">
              <TabsTrigger value="welfare" className="flex items-center gap-2">
                <ListChecks className="h-4 w-4" />
                Welfare Schemes
              </TabsTrigger>
              <TabsTrigger value="housing" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Housing Support
              </TabsTrigger>
              <TabsTrigger value="education" className="flex items-center gap-2">
                <Book className="h-4 w-4" />
                Education
              </TabsTrigger>
              <TabsTrigger value="healthcare" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Healthcare
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="welfare">
              <div className="space-y-6">
                <div className="bg-accent/30 rounded-lg p-6">
                  <h2 className="text-2xl font-bold mb-4">Tamil Nadu Welfare Schemes</h2>
                  <p className="text-muted-foreground mb-6">
                    The Tamil Nadu government offers several welfare schemes specifically designed to support migrant workers in the state. These schemes aim to provide financial assistance, healthcare benefits, housing support, and more.
                  </p>
                  
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[
                      {
                        title: "Construction Workers Welfare",
                        description: "Financial assistance, accident coverage, and education scholarships for construction workers",
                        icon: <Construction className="h-8 w-8 text-primary" />,
                      },
                      {
                        title: "Agricultural Laborers Support",
                        description: "Subsidies, equipment support, and insurance for agricultural migrant workers",
                        icon: <Tractor className="h-8 w-8 text-primary" />,
                      },
                      {
                        title: "Industrial Workers Program",
                        description: "Health insurance, skill development, and safety training for factory workers",
                        icon: <Factory className="h-8 w-8 text-primary" />,
                      },
                    ].map((scheme, index) => (
                      <Card key={index} className="overflow-hidden bg-card/50 border-border/50">
                        <CardHeader className="pb-3">
                          <div className="mb-2">{scheme.icon}</div>
                          <CardTitle>{scheme.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <CardDescription className="text-foreground/80">{scheme.description}</CardDescription>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  <div className="mt-8 text-center">
                    <Button>
                      <Link to="/chatbot" className="flex items-center gap-2">
                        Ask Our Chatbot About Schemes <FileText className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>How to Apply for Welfare Schemes</CardTitle>
                    <CardDescription>
                      Follow these steps to apply for Tamil Nadu government welfare schemes
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ol className="space-y-4 list-decimal list-inside">
                      <li className="text-foreground">
                        <span className="font-medium">Register on MWAP</span>
                        <p className="text-muted-foreground mt-1 ml-6">
                          Complete the registration process to get your unique worker ID
                        </p>
                      </li>
                      <li className="text-foreground">
                        <span className="font-medium">Verify Your Documents</span>
                        <p className="text-muted-foreground mt-1 ml-6">
                          Ensure your identification documents like Aadhaar are verified
                        </p>
                      </li>
                      <li className="text-foreground">
                        <span className="font-medium">Check Eligibility</span>
                        <p className="text-muted-foreground mt-1 ml-6">
                          Use our chatbot to check your eligibility for different schemes
                        </p>
                      </li>
                      <li className="text-foreground">
                        <span className="font-medium">Submit Application</span>
                        <p className="text-muted-foreground mt-1 ml-6">
                          Visit the nearest Labor Welfare Office with your MWAP ID and documents
                        </p>
                      </li>
                      <li className="text-foreground">
                        <span className="font-medium">Track Status</span>
                        <p className="text-muted-foreground mt-1 ml-6">
                          Track your application status through your MWAP dashboard
                        </p>
                      </li>
                    </ol>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="housing">
              <Card>
                <CardHeader>
                  <div className="mb-2">
                    <Home className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>Housing Support Services</CardTitle>
                  <CardDescription>
                    Housing assistance and temporary accommodation services for migrant workers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p>
                      MWAP helps migrant workers find safe and affordable housing in Tamil Nadu. Our services include:
                    </p>
                    <ul className="space-y-2 list-disc list-inside">
                      <li>Information about government housing schemes</li>
                      <li>Temporary accommodation assistance</li>
                      <li>Rental support programs</li>
                      <li>Connection to affordable housing options</li>
                      <li>Guidance on housing rights and regulations</li>
                    </ul>
                    <div className="mt-6">
                      <Button variant="outline">
                        <Link to="/chatbot">Ask About Housing Schemes</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="education">
              <Card>
                <CardHeader>
                  <div className="mb-2">
                    <Book className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>Education Services</CardTitle>
                  <CardDescription>
                    Educational support for migrant workers and their children
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p>
                      MWAP provides educational support services to help migrant workers and their families access learning opportunities:
                    </p>
                    <ul className="space-y-2 list-disc list-inside">
                      <li>Information about educational scholarships</li>
                      <li>School enrollment assistance for children</li>
                      <li>Adult literacy programs</li>
                      <li>Vocational training opportunities</li>
                      <li>Language classes for better integration</li>
                    </ul>
                    <div className="mt-6">
                      <Button variant="outline">
                        <Link to="/chatbot">Ask About Education Schemes</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="healthcare">
              <Card>
                <CardHeader>
                  <div className="mb-2">
                    <Heart className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>Healthcare Services</CardTitle>
                  <CardDescription>
                    Healthcare support and medical assistance for migrant workers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p>
                      MWAP connects migrant workers with healthcare services and support:
                    </p>
                    <ul className="space-y-2 list-disc list-inside">
                      <li>Information about health insurance schemes</li>
                      <li>Access to government healthcare facilities</li>
                      <li>Health check-up camps</li>
                      <li>Mental health support</li>
                      <li>Maternal and child healthcare services</li>
                    </ul>
                    <div className="mt-6">
                      <Button variant="outline">
                        <Link to="/chatbot">Ask About Healthcare Schemes</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
      
      <section className="py-12 bg-primary/5">
        <div className="section-container text-center">
          <h2 className="text-3xl font-bold mb-4">Need Help with Services?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Our AI-powered chatbot can help you navigate available services and answer your questions
          </p>
          <Button>
            <Link to="/chatbot" className="flex items-center gap-2">
              <Backpack className="h-4 w-4" /> Talk to Our Assistant
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Services;
