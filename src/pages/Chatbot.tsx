import { useState, useRef, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Info, MessageSquare, HelpCircle, AlertCircle } from "lucide-react";
import { getCurrentUser } from "@/utils/storage";
import { User } from "@/types/user";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useLanguage } from "@/context/LanguageContext";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { getGeminiResponse } from "@/utils/geminiApi";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface SchemeCategory {
  id: string;
  name: string;
  icon: JSX.Element;
  schemes: Scheme[];
}

interface Scheme {
  name: string;
  description: string;
  eligibility: string;
  benefits: string;
}

interface StateScheme {
  name: string;
  description: string;
  benefits: string;
}

const Chatbot = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hello! I'm your MWAP assistant powered by Gemini AI. Please select a category below to explore benefits and schemes for migrant workers, or ask me any specific questions.",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const schemeCategories: SchemeCategory[] = [
    {
      id: "national",
      name: "National Schemes",
      icon: <Info className="h-5 w-5 text-blue-500" />,
      schemes: [
        {
          name: "One Nation One Ration Card",
          description: "Allows migrant workers to access PDS benefits across the country using their ration card.",
          eligibility: "Migrant workers with valid ration cards.",
          benefits: "Access to subsidized food grains from any Fair Price Shop across India, regardless of the state where the ration card was issued."
        },
        {
          name: "Pradhan Mantri Shram Yogi Maandhan (PM-SYM)",
          description: "Pension scheme for unorganized workers with monthly income up to ₹15,000.",
          eligibility: "Workers aged 18-40 years in the unorganized sector.",
          benefits: "Assured monthly pension of ₹3,000 after the age of 60 years with a minimal contribution."
        },
        {
          name: "Ayushman Bharat",
          description: "Health insurance scheme providing coverage up to ₹5 lakhs per family per year.",
          eligibility: "Poor and vulnerable families as identified by Socio-Economic Caste Census data.",
          benefits: "Cashless and paperless access to healthcare services at empaneled hospitals."
        },
        {
          name: "PM Garib Kalyan Yojana",
          description: "Comprehensive relief package during crisis situations.",
          eligibility: "Workers in unorganized sector, including migrants.",
          benefits: "Free food grains, direct benefit transfers, and increased wages under MGNREGA."
        },
        {
          name: "Pradhan Mantri Awas Yojana",
          description: "Housing scheme for urban and rural populations.",
          eligibility: "Economically weaker sections and low-income groups.",
          benefits: "Financial assistance for house construction or enhancement."
        },
        {
          name: "Jan Dhan Yojana",
          description: "Financial inclusion program providing access to banking services.",
          eligibility: "All Indian citizens, including migrant workers.",
          benefits: "No-frills bank accounts, RuPay debit card, accident insurance cover, and overdraft facility."
        },
      ]
    },
    {
      id: "labour",
      name: "Labor Protection",
      icon: <HelpCircle className="h-5 w-5 text-green-500" />,
      schemes: [
        {
          name: "Inter-State Migrant Workmen Act",
          description: "Regulates employment of inter-state migrant workers and provides for their conditions of service.",
          eligibility: "Any worker employed by a contractor in one state but working in another state.",
          benefits: "Legal protection, minimum wages, suitable accommodation, medical facilities, and displacement allowance."
        },
        {
          name: "Building and Other Construction Workers Act",
          description: "Regulates employment and conditions of service for construction workers.",
          eligibility: "Workers engaged in building or construction work for more than 90 days in a year.",
          benefits: "Social security, safety measures, and welfare provisions."
        },
        {
          name: "Construction Workers Welfare Schemes",
          description: "State-specific welfare schemes for construction workers administered through welfare boards.",
          eligibility: "Registered construction workers.",
          benefits: "Accident coverage, education scholarships for children, maternity benefits, pension, and housing assistance."
        },
      ]
    },
    {
      id: "family",
      name: "Family & Children Benefits",
      icon: <MessageSquare className="h-5 w-5 text-purple-500" />,
      schemes: [
        {
          name: "National Child Labour Project",
          description: "Rehabilitation of child workers and education for children of migrant workers.",
          eligibility: "Children of migrant workers and rescued child laborers.",
          benefits: "Educational support, vocational training, and mainstreaming into formal education."
        },
        {
          name: "Integrated Child Development Services (ICDS)",
          description: "Development program for children and their mothers.",
          eligibility: "Children below 6 years of age and pregnant/lactating mothers.",
          benefits: "Supplementary nutrition, immunization, health check-ups, referral services, pre-school education."
        },
        {
          name: "Mid-Day Meal Scheme",
          description: "School meal program in primary and upper primary schools.",
          eligibility: "Children attending government and government-aided schools.",
          benefits: "Free cooked meals to enhance enrollment, retention, and attendance while improving nutritional status."
        }
      ]
    },
    {
      id: "skill",
      name: "Skill Development",
      icon: <MessageSquare className="h-5 w-5 text-orange-500" />,
      schemes: [
        {
          name: "Pradhan Mantri Kaushal Vikas Yojana (PMKVY)",
          description: "Skill development initiative to enable Indian youth to take up industry-relevant skill training.",
          eligibility: "Any Indian citizen above 18 years of age.",
          benefits: "Free short-term training, certification, monetary reward, and job placement assistance."
        },
        {
          name: "Deen Dayal Upadhyaya Grameen Kaushalya Yojana",
          description: "Skill development program specifically for rural youth.",
          eligibility: "Rural youth aged 15-35 from poor families.",
          benefits: "Training, certification, placement assistance, post-placement support."
        },
        {
          name: "Recognition of Prior Learning (RPL)",
          description: "Program to recognize and certify existing skills of workers.",
          eligibility: "Workers with prior experience but no formal certification.",
          benefits: "Assessment, certification, bridge training, and improved employment opportunities."
        }
      ]
    },
  ];
  
  const stateSchemes: Record<string, StateScheme[]> = {
    "maharashtra": [
      {
        name: "Mahatma Jyotiba Phule Jan Arogya Yojana",
        description: "Health insurance scheme in Maharashtra covering migrant workers.",
        benefits: "Cashless treatment up to ₹1.5 lakhs per family per year."
      }
    ],
    "kerala": [
      {
        name: "Aawaz Health Insurance Scheme",
        description: "Health insurance for migrant workers in Kerala.",
        benefits: "Coverage up to ₹15,000 per year for outpatient care and hospitalization."
      }
    ],
    "delhi": [
      {
        name: "Delhi Building and Other Construction Workers Welfare Board",
        description: "Welfare initiatives for construction workers in Delhi.",
        benefits: "Financial assistance for education, healthcare, and pension."
      }
    ]
  };
  
  const rights = [
    "Minimum Wages Act: Right to receive minimum wages as notified by the government.",
    "Equal Remuneration Act: Right to equal pay for equal work regardless of gender.",
    "Payment of Wages Act: Right to timely payment of wages without unauthorized deductions.",
    "Contract Labor Act: Regulations for employment of contract labor and their working conditions.",
    "Trade Unions Act: Right to form and join trade unions.",
    "Industrial Disputes Act: Framework for investigation and settlement of industrial disputes.",
    "Employees' State Insurance Act: Medical and cash benefits in case of sickness, maternity, and injury.",
    "Employees' Provident Fund: Retirement benefit scheme for organized sector workers."
  ];
  
  const getBotResponse = (question: string): string => {
    const lowercaseQuestion = question.toLowerCase();
    
    if (lowercaseQuestion.includes("hello") || lowercaseQuestion.includes("hi")) {
      return `Hello${user ? ` ${user.name}` : ""}! How can I help you today? You can ask me about government schemes, benefits, or rights for migrant workers across India.`;
    }
    
    for (const state in stateSchemes) {
      if (lowercaseQuestion.includes(state)) {
        const stateSpecificSchemes = stateSchemes[state as keyof typeof stateSchemes];
        return `Here are some specific schemes for migrant workers in ${state.charAt(0).toUpperCase() + state.slice(1)}:\n\n${stateSpecificSchemes.map(scheme => `• ${scheme.name}: ${scheme.description}\n  Benefits: ${scheme.benefits}`).join("\n\n")}`;
      }
    }
    
    if (
      lowercaseQuestion.includes("right") || 
      lowercaseQuestion.includes("legal") || 
      lowercaseQuestion.includes("protection") ||
      lowercaseQuestion.includes("law")
    ) {
      return `Migrant workers in India have several legal rights and protections:\n\n${rights.map(right => `• ${right}`).join("\n\n")}`;
    }
    
    if (
      lowercaseQuestion.includes("scheme") || 
      lowercaseQuestion.includes("benefit") || 
      lowercaseQuestion.includes("welfare") ||
      lowercaseQuestion.includes("help") ||
      lowercaseQuestion.includes("support")
    ) {
      let matchedScheme: Scheme | undefined;
      
      for (const category of schemeCategories) {
        const found = category.schemes.find(scheme => 
          lowercaseQuestion.includes(scheme.name.toLowerCase()) ||
          scheme.description.toLowerCase().split(" ").some(word => lowercaseQuestion.includes(word))
        );
        
        if (found) {
          matchedScheme = found;
          break;
        }
      }
      
      if (matchedScheme) {
        return `${matchedScheme.name}: ${matchedScheme.description}\n\nEligibility: ${matchedScheme.eligibility}\n\nBenefits: ${matchedScheme.benefits}`;
      } else {
        return "I can provide information on various schemes and benefits for migrant workers. Please select a category from the options below or ask about a specific scheme.";
      }
    }
    
    if (lowercaseQuestion.includes("eligible") || lowercaseQuestion.includes("eligibility") || lowercaseQuestion.includes("qualify")) {
      return "Eligibility varies by scheme. Most schemes require proper identification documents like Aadhaar card, voter ID, or ration card. Some schemes are specific to certain types of work like construction or agriculture. Would you like information about a specific scheme?";
    }
    
    if (lowercaseQuestion.includes("register") || lowercaseQuestion.includes("registration") || lowercaseQuestion.includes("sign up")) {
      return "Registration processes for various schemes differ by state and scheme type. For most welfare schemes, you need to visit the nearest Labor Welfare Office or Common Service Center with your ID proof, address proof, and work certificate. For construction workers, registration with the state Construction Workers Welfare Board is required. Many states now offer online registration facilities as well.";
    }
    
    if (lowercaseQuestion.includes("amount") || lowercaseQuestion.includes("money") || lowercaseQuestion.includes("fund") || lowercaseQuestion.includes("payment")) {
      return "Benefit amounts vary by scheme. For example:\n\n• PM-SYM provides a monthly pension of ₹3,000 after retirement\n• Construction Workers Welfare Schemes offer accident coverage up to ₹5 lakhs\n• Ayushman Bharat provides health coverage of ₹5 lakhs per family per year\n• Education scholarships for workers' children range from ₹1,000 to ₹25,000 depending on the state and education level";
    }
    
    if (lowercaseQuestion.includes("document") || lowercaseQuestion.includes("id") || lowercaseQuestion.includes("aadhaar") || lowercaseQuestion.includes("identification")) {
      return "Important documents for migrant workers include:\n\n• Aadhaar Card (essential for most schemes)\n• Voter ID\n• Ration Card (important for PDS benefits)\n• Bank Account (for direct benefit transfers)\n• Labor Card/Construction Worker Registration (for specific welfare schemes)\n• Domicile Certificate (for state-specific benefits)\n\nIf you need assistance with documentation, many states have migrant resource centers that can help.";
    }
    
    return "I don't have specific information about that. Please select one of the benefit categories below or ask about government schemes for migrant workers across India, your legal rights, or how to access specific benefits.";
  };

  const handleSchemeSelect = (scheme: Scheme) => {
    const botResponse: Message = {
      id: Date.now().toString(),
      content: `${scheme.name}:\n\n${scheme.description}\n\nEligibility: ${scheme.eligibility}\n\nBenefits: ${scheme.benefits}`,
      sender: "bot",
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, botResponse]);
    setApiError(null);
  };
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      
      setMessages(prev => [
        ...prev,
        {
          id: "personal-welcome",
          content: `Welcome back, ${currentUser.name}! I'm your MWAP assistant powered by Gemini AI. Please select a benefit category below to explore schemes for migrant workers, or ask me any specific questions.`,
          sender: "bot",
          timestamp: new Date(),
        }
      ]);
    }
  }, []);
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    setApiError(null);
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    
    try {
      const categoryContent = selectedCategory === "rights" 
        ? `Legal Rights & Protections for Migrant Workers:\n\n${rights.join("\n\n")}`
        : schemeCategories.find(cat => cat.id === selectedCategory)?.schemes.map(
            scheme => `${scheme.name}: ${scheme.description}\nEligibility: ${scheme.eligibility}\nBenefits: ${scheme.benefits}`
          )?.join("\n\n") || "";
      
      const prompt = selectedCategory 
        ? `${input}\n\nContext: ${categoryContent}`
        : input;
      
      console.log("Calling Gemini API...");
      const response = await getGeminiResponse(prompt);
      console.log("Gemini API response:", response);
      
      if (response.error) {
        console.error("Gemini API error:", response.error);
        setApiError(response.error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "There was an issue connecting to the AI assistant.",
        });
      }
      
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: response.text,
        sender: "bot",
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error("Error in handleSendMessage:", error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I encountered an error while processing your request. Please try again later.",
        sender: "bot",
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get response from the AI assistant.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleTestConnection = async () => {
    setIsLoading(true);
    setApiError(null);
    
    try {
      const testResponse = await getGeminiResponse("Hello, just testing the connection.");
      if (!testResponse.error) {
        toast({
          title: "Success",
          description: "Connection to AI assistant is working!",
        });
      } else {
        setApiError(testResponse.error);
        toast({
          variant: "destructive",
          title: "Connection Error",
          description: testResponse.error,
        });
      }
    } catch (error) {
      console.error("Test connection error:", error);
      setApiError(error instanceof Error ? error.message : "Unknown error");
      toast({
        variant: "destructive",
        title: "Connection Error",
        description: "Failed to connect to the AI assistant",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Layout>
      <section className="section-container py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="h-[calc(100vh-10rem)]">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-primary">{t("chatbot.title")}</CardTitle>
                  <CardDescription>
                    {t("chatbot.subtitle")}
                  </CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleTestConnection}
                  disabled={isLoading}
                >
                  Test Connection
                </Button>
              </div>
              
              {apiError && (
                <Alert variant="destructive" className="mt-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Connection Error</AlertTitle>
                  <AlertDescription>
                    {apiError}
                  </AlertDescription>
                </Alert>
              )}
            </CardHeader>
            
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-4 h-full">
                <div className="border-r p-4 hidden md:block">
                  <h3 className="font-semibold mb-4">Select a Category</h3>
                  <RadioGroup value={selectedCategory || ""} onValueChange={setSelectedCategory} className="space-y-3">
                    {schemeCategories.map((category) => (
                      <div key={category.id} className="flex items-center space-x-2">
                        <RadioGroupItem value={category.id} id={category.id} />
                        <label htmlFor={category.id} className="flex items-center cursor-pointer">
                          {category.icon}
                          <span className="ml-2 text-sm">{category.name}</span>
                        </label>
                      </div>
                    ))}
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="rights" id="rights" />
                      <label htmlFor="rights" className="flex items-center cursor-pointer">
                        <Info className="h-5 w-5 text-red-500" />
                        <span className="ml-2 text-sm">Legal Rights</span>
                      </label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className={`${selectedCategory ? "col-span-3" : "col-span-4"} flex flex-col h-[calc(100vh-18rem)]`}>
                  <ScrollArea className="flex-1 px-4">
                    <div className="space-y-4 py-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div className={`flex gap-3 max-w-[80%] ${message.sender === "user" ? "flex-row-reverse" : ""}`}>
                            {message.sender === "bot" && (
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-primary text-primary-foreground">
                                  M
                                </AvatarFallback>
                              </Avatar>
                            )}
                            
                            <div
                              className={`rounded-lg p-4 text-sm ${
                                message.sender === "user"
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-secondary"
                              }`}
                            >
                              {message.content.split("\n").map((text, i) => (
                                <p key={i} className={i > 0 ? "mt-2" : ""}>
                                  {text}
                                </p>
                              ))}
                              <div className="text-xs mt-2 opacity-70">
                                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </div>
                            
                            {message.sender === "user" && user && (
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-accent text-accent-foreground">
                                  {user.name.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                            )}
                          </div>
                        </div>
                      ))}
                      
                      {isLoading && (
                        <div className="flex justify-start">
                          <div className="flex gap-3 max-w-[80%]">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-primary text-primary-foreground">
                                M
                              </AvatarFallback>
                            </Avatar>
                            <div className="rounded-lg p-4 text-sm bg-secondary">
                              <span className="flex gap-1">
                                <span className="animate-pulse">●</span>
                                <span className="animate-pulse animation-delay-100">●</span>
                                <span className="animate-pulse animation-delay-200">●</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {messages.length <= 2 && !isLoading && (
                        <div className="flex md:hidden flex-col space-y-4 py-4">
                          <div className="font-medium text-center">Explore Benefits by Category</div>
                          <div className="grid grid-cols-2 gap-2">
                            {schemeCategories.map((category) => (
                              <Button
                                key={category.id}
                                variant="outline"
                                className="flex flex-col h-20 items-center justify-center text-xs p-2 text-center"
                                onClick={() => setSelectedCategory(category.id)}
                              >
                                {category.icon}
                                <span className="mt-2">{category.name}</span>
                              </Button>
                            ))}
                            <Button
                              variant="outline"
                              className="flex flex-col h-20 items-center justify-center text-xs p-2 text-center"
                              onClick={() => setSelectedCategory("rights")}
                            >
                              <Info className="h-5 w-5 text-red-500" />
                              <span className="mt-2">Legal Rights</span>
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>
                  
                  {selectedCategory && (
                    <div className="border-t p-4 mt-auto">
                      <h3 className="font-medium mb-3">
                        {selectedCategory === "rights" 
                          ? "Legal Rights & Protections" 
                          : schemeCategories.find(cat => cat.id === selectedCategory)?.name || ""}
                      </h3>
                      <ScrollArea className="h-48">
                        {selectedCategory === "rights" ? (
                          <div className="space-y-2">
                            {rights.map((right, index) => (
                              <div key={index} className="p-2 border rounded hover:bg-muted cursor-pointer" onClick={() => {
                                setMessages(prev => [...prev, {
                                  id: Date.now().toString(),
                                  content: right,
                                  sender: "bot",
                                  timestamp: new Date()
                                }]);
                              }}>
                                {right.split(':')[0]}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {schemeCategories
                              .find(cat => cat.id === selectedCategory)
                              ?.schemes.map((scheme, index) => (
                                <div 
                                  key={index}
                                  className="p-2 border rounded hover:bg-muted cursor-pointer"
                                  onClick={() => handleSchemeSelect(scheme)}
                                >
                                  <div className="font-medium">{scheme.name}</div>
                                  <div className="text-xs text-muted-foreground line-clamp-1">{scheme.description}</div>
                                </div>
                              ))}
                          </div>
                        )}
                      </ScrollArea>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="p-4 pt-0">
              <form onSubmit={handleSendMessage} className="flex w-full gap-2">
                <Input
                  placeholder={t("chatbot.messagePlaceholder")}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </CardFooter>
          </Card>
        </div>
      </section>
    </Layout>
  );
};

export default Chatbot;
