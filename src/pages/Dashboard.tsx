
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCurrentUser, clearCurrentUser } from "@/utils/storage";
import { User } from "@/types/user";
import { toast } from "sonner";
import { CalendarDays, FileText, MessageSquare, User as UserIcon } from "lucide-react";
import { ProfileCard } from "@/components/profile/ProfileCard";
import { supabase } from "@/lib/supabase";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const currentUser = getCurrentUser();
    if (!currentUser) {
      toast.error("Please login to access the dashboard");
      navigate("/");
      return;
    }
    
    setUser(currentUser);
    
    // Record user login in Supabase (if possible)
    const recordLoginActivity = async () => {
      try {
        await supabase.functions.invoke('record-user-login', {
          body: { user_mobile: currentUser.mobile }
        });
      } catch (error) {
        console.error("Error recording login activity:", error);
        // Non-critical error, so we don't show a toast or redirect
      }
    };
    
    recordLoginActivity();
  }, [navigate]);
  
  const handleLogout = () => {
    clearCurrentUser();
    toast.success("You have been logged out successfully");
    navigate("/");
  };

  const handleViewSchemes = () => {
    // Set the active tab to "schemes"
    const schemesTab = document.querySelector('[value="schemes"]') as HTMLElement;
    if (schemesTab) {
      schemesTab.click();
    }
  };
  
  const handleDownloadIdCard = () => {
    setIsLoading(true);
    
    // Simulate download delay
    setTimeout(() => {
      setIsLoading(false);
      
      // Create a simple text representation of the ID card
      if (user) {
        const idCardContent = `
MIGRANT WORKER ASSISTANCE PORTAL
---------------------------------------
WORKER ID: ${user.id}
NAME: ${user.name}
AGE: ${user.age}
GENDER: ${user.gender}
MOBILE: ${user.mobile}
WORKER TYPE: ${user.workingType}
LOCATION: ${user.migrationPlace}
---------------------------------------
Registration Date: ${new Date(user.registrationDate).toLocaleDateString('en-IN')}
Status: ${user.isVerified ? "Verified" : "Pending Verification"}
        `.trim();
        
        // Create a blob and download it
        const blob = new Blob([idCardContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `MWAP_ID_${user.id}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        toast.success("ID Card downloaded successfully");
      }
    }, 1500);
  };
  
  const handleAskQuestions = () => {
    navigate("/chatbot");
  };

  if (!user) {
    return null; // Will redirect due to the useEffect
  }

  return (
    <Layout>
      <section className="section-container py-12">
        <div className="flex flex-col md:flex-row justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome, {user.name}</h1>
            <p className="text-muted-foreground">Worker ID: {user.id}</p>
          </div>
          <Button 
            variant="outline" 
            className="mt-4 md:mt-0"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
        
        <div className="grid md:grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-4 lg:col-span-3">
            <ProfileCard user={user} />
          </div>
          
          {/* Main Content */}
          <div className="md:col-span-8 lg:col-span-9">
            <Tabs defaultValue="dashboard">
              <TabsList className="grid grid-cols-4 mb-8">
                <TabsTrigger value="dashboard" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </TabsTrigger>
                <TabsTrigger value="profile" className="flex items-center gap-2">
                  <UserIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Profile</span>
                </TabsTrigger>
                <TabsTrigger value="schemes" className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  <span className="hidden sm:inline">Schemes</span>
                </TabsTrigger>
                <TabsTrigger value="chatbot" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  <span className="hidden sm:inline">Chatbot</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="dashboard">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Account Overview</CardTitle>
                      <CardDescription>Your registration details and status</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium">Registration Date</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(user.registrationDate).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Verification Status</p>
                          <div className="flex items-center gap-2">
                            <div className={`h-2 w-2 rounded-full ${user.isVerified ? "bg-green-500" : "bg-yellow-500"}`}></div>
                            <p className="text-sm text-muted-foreground">
                              {user.isVerified ? "Verified" : "Pending Verification"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="sm" className="w-full" onClick={handleAskQuestions}>
                        Get Help
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Actions</CardTitle>
                      <CardDescription>Access frequently used features</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full justify-start"
                        onClick={handleViewSchemes}
                      >
                        <CalendarDays className="mr-2 h-4 w-4" />
                        View Available Schemes
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full justify-start"
                        onClick={handleDownloadIdCard}
                        disabled={isLoading}
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        {isLoading ? "Generating..." : "Download ID Card"}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full justify-start"
                        onClick={handleAskQuestions}
                      >
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Ask Questions
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Profile</CardTitle>
                    <CardDescription>Manage your personal information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium">Full Name</p>
                          <p className="text-sm text-muted-foreground">{user.name}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Age</p>
                          <p className="text-sm text-muted-foreground">{user.age} years</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Gender</p>
                          <p className="text-sm text-muted-foreground">
                            {user.gender.charAt(0).toUpperCase() + user.gender.slice(1)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Mobile Number</p>
                          <p className="text-sm text-muted-foreground">{user.mobile}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Worker Type</p>
                          <p className="text-sm text-muted-foreground">
                            {user.workingType.charAt(0).toUpperCase() + user.workingType.slice(1)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Migration Place</p>
                          <p className="text-sm text-muted-foreground">{user.migrationPlace}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Email</p>
                          <p className="text-sm text-muted-foreground">{user.email || "Not provided"}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Aadhaar</p>
                          <p className="text-sm text-muted-foreground">
                            ********{user.aadhaarNumber.slice(-4)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm">Update Information</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="schemes">
                <Card>
                  <CardHeader>
                    <CardTitle>Government Schemes</CardTitle>
                    <CardDescription>
                      Tamil Nadu government schemes for migrant workers
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Button className="w-full" onClick={() => navigate("/chatbot")}>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Open Chatbot for Scheme Information
                      </Button>
                      <p className="text-sm text-muted-foreground">
                        Use our AI-powered chatbot to learn about Tamil Nadu government schemes 
                        available for migrant workers like you.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="chatbot">
                <Card>
                  <CardHeader>
                    <CardTitle>MWAP Chatbot</CardTitle>
                    <CardDescription>
                      Ask questions about Tamil Nadu government schemes
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full" onClick={() => navigate("/chatbot")}>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Open Chatbot
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Dashboard;
