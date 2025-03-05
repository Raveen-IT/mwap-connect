
import { useState, useRef, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send } from "lucide-react";
import { getCurrentUser } from "@/utils/storage";
import { User } from "@/types/user";

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const Chatbot = () => {
  const [user, setUser] = useState<User | null>(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hello! I'm your MWAP assistant. Ask me anything about Tamil Nadu government schemes for migrant workers.",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Sample schemes data (in a real app, this would come from a backend)
  const schemes = [
    {
      name: "Tamil Nadu Construction Workers Welfare Scheme",
      description: "Provides financial assistance, healthcare, and education benefits to registered construction workers.",
      eligibility: "Migrant workers employed in the construction sector in Tamil Nadu for at least 90 days.",
    },
    {
      name: "Migrant Workers Health Insurance Scheme",
      description: "Covers medical expenses up to ₹5 lakhs for migrant workers and their families.",
      eligibility: "All registered migrant workers residing in Tamil Nadu.",
    },
    {
      name: "Pradhan Mantri Shram Yogi Maandhan (PM-SYM)",
      description: "Pension scheme for unorganized workers with monthly income up to ₹15,000.",
      eligibility: "Workers aged 18-40 years in the unorganized sector.",
    },
    {
      name: "One Nation One Ration Card",
      description: "Allows migrant workers to access PDS benefits across the country using their ration card.",
      eligibility: "Migrant workers with valid ration cards.",
    },
    {
      name: "Tamil Nadu Skill Development Corporation Training",
      description: "Free skill training programs for migrant workers to enhance employment opportunities.",
      eligibility: "Any migrant worker residing in Tamil Nadu.",
    },
  ];
  
  // Simple keyword-based response system
  const getBotResponse = (question: string): string => {
    const lowercaseQuestion = question.toLowerCase();
    
    // Check for greetings
    if (lowercaseQuestion.includes("hello") || lowercaseQuestion.includes("hi")) {
      return `Hello${user ? ` ${user.name}` : ""}! How can I help you today?`;
    }
    
    // Check for scheme-related queries
    if (
      lowercaseQuestion.includes("scheme") || 
      lowercaseQuestion.includes("benefit") || 
      lowercaseQuestion.includes("welfare") ||
      lowercaseQuestion.includes("help") ||
      lowercaseQuestion.includes("support")
    ) {
      const matchingSchemes = schemes.filter(scheme => 
        lowercaseQuestion.includes(scheme.name.toLowerCase()) ||
        scheme.description.toLowerCase().split(" ").some(word => lowercaseQuestion.includes(word))
      );
      
      if (matchingSchemes.length > 0) {
        const scheme = matchingSchemes[0];
        return `${scheme.name}: ${scheme.description}\n\nEligibility: ${scheme.eligibility}`;
      } else {
        return `Here are some Tamil Nadu government schemes for migrant workers:\n\n${schemes.map(s => `• ${s.name}`).join("\n")}.\n\nAsk me about any specific scheme for more details.`;
      }
    }
    
    // Check for eligibility queries
    if (lowercaseQuestion.includes("eligible") || lowercaseQuestion.includes("eligibility") || lowercaseQuestion.includes("qualify")) {
      return "Eligibility varies by scheme. Most schemes require registration as a migrant worker in Tamil Nadu. Some schemes are specific to certain types of work like construction or agriculture. Would you like information about a specific scheme?";
    }
    
    // Check for registration queries
    if (lowercaseQuestion.includes("register") || lowercaseQuestion.includes("registration") || lowercaseQuestion.includes("sign up")) {
      return "To register for Tamil Nadu government schemes, you need to visit the nearest Labor Welfare Office with your ID proof, address proof, and work certificate. For construction workers, registration with the Tamil Nadu Construction Workers Welfare Board is required.";
    }
    
    // Check for benefit amount queries
    if (lowercaseQuestion.includes("amount") || lowercaseQuestion.includes("money") || lowercaseQuestion.includes("fund") || lowercaseQuestion.includes("payment")) {
      return "Benefit amounts vary by scheme. For example, the Construction Workers Welfare Scheme provides accident coverage up to ₹5 lakhs, education scholarships ranging from ₹1,000 to ₹10,000 for workers' children, and maternity benefits of ₹15,000.";
    }
    
    // Default response for unrecognized queries
    return "I don't have specific information about that. Would you like to know about available government schemes for migrant workers in Tamil Nadu?";
  };
  
  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  // Load user data
  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      
      // Add personalized greeting if user is logged in
      setMessages(prev => [
        ...prev,
        {
          id: "personal-welcome",
          content: `Welcome back, ${currentUser.name}! How can I help you today?`,
          sender: "bot",
          timestamp: new Date(),
        }
      ]);
    }
  }, []);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    
    // Simulate bot thinking time
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: getBotResponse(input),
        sender: "bot",
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsLoading(false);
    }, 1000);
  };
  
  return (
    <Layout>
      <section className="section-container py-12">
        <div className="max-w-4xl mx-auto">
          <Card className="h-[calc(100vh-12rem)]">
            <CardHeader>
              <CardTitle>MWAP Assistant</CardTitle>
              <CardDescription>
                Ask questions about Tamil Nadu government schemes for migrant workers
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-20rem)] px-4">
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
                  
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </CardContent>
            
            <CardFooter className="p-4 pt-0">
              <form onSubmit={handleSendMessage} className="flex w-full gap-2">
                <Input
                  placeholder="Type your message..."
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
