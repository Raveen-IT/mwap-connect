import { useState, useRef, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { getCurrentUser } from "@/utils/storage";
import { User } from "@/types/user";
import { Info, MessageSquare, HelpCircle, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLanguage } from "@/context/LanguageContext";

// Import refactored components
import MessageList from "@/components/chatbot/MessageList";
import CategorySelector from "@/components/chatbot/CategorySelector";
import SchemesList from "@/components/chatbot/SchemesList";
import ChatInput from "@/components/chatbot/ChatInput";
import { Message, SchemeCategory, Scheme, StateScheme } from "@/components/chatbot/types";

const Chatbot = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hello! I'm your MWAP assistant. Please select a category below to explore benefits and schemes for migrant workers, or ask me any specific questions.",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
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
  
  const handleSchemeSelect = (scheme: Scheme) => {
    const botResponse: Message = {
      id: Date.now().toString(),
      content: `${scheme.name}:\n\n${scheme.description}\n\nEligibility: ${scheme.eligibility}\n\nBenefits: ${scheme.benefits}`,
      sender: "bot",
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, botResponse]);
  };
  
  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      
      setMessages(prev => [
        ...prev,
        {
          id: "personal-welcome",
          content: `Welcome back, ${currentUser.name}! I'm your MWAP assistant. Please select a benefit category below to explore schemes for migrant workers, or ask me any specific questions.`,
          sender: "bot",
          timestamp: new Date(),
        }
      ]);
    }
  }, []);
  
  const handleSendMessage = async (input: string) => {
    if (!input.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      // Call the OpenRouter proxy edge function
      const { data, error } = await supabase.functions.invoke('openrouter-proxy', {
        body: { prompt: input }
      });
      
      if (error) {
        throw new Error(`Edge function error: ${error.message}`);
      }
      
      if (!data || !data.response) {
        throw new Error('Received invalid response from OpenRouter');
      }

      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        sender: "bot",
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botResponse]);
      
    } catch (error) {
      console.error("Error in handleSendMessage:", error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, something went wrong. Please try again later.",
        sender: "bot",
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process your message.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Layout>
      <section className="section-container py-8 flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <div className="w-full max-w-4xl mx-auto">
          <Card className="border shadow-lg overflow-hidden">
            <CardHeader className="border-b bg-muted/30 py-4">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-primary text-2xl">{t("chatbot.title")}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {t("chatbot.subtitle")}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-4 h-[calc(100vh-16rem)] max-h-[600px]">
              <CategorySelector
                categories={schemeCategories}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                onSchemeSelect={handleSchemeSelect}
                rights={rights}
              />
              
              <div className={`${selectedCategory ? "col-span-3" : "col-span-4"} flex flex-col h-full bg-background`}>
                <CardContent className="flex-1 p-0 overflow-hidden flex flex-col">
                  <MessageList
                    messages={messages}
                    isLoading={isLoading}
                    user={user}
                    schemeCategories={schemeCategories}
                    setSelectedCategory={setSelectedCategory}
                    messagesEndRef={messagesEndRef}
                    scrollAreaRef={scrollAreaRef}
                    isMobile={isMobile}
                  />
                  
                  <SchemesList
                    selectedCategory={selectedCategory}
                    schemeCategories={schemeCategories}
                    rights={rights}
                    handleSchemeSelect={handleSchemeSelect}
                    setMessages={setMessages}
                    isMobile={isMobile}
                  />
                </CardContent>
              </div>
            </div>
            
            <CardFooter className="p-4 border-t bg-muted/30 flex-shrink-0">
              <ChatInput 
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
              />
            </CardFooter>
          </Card>
        </div>
      </section>
    </Layout>
  );
};

export default Chatbot;
