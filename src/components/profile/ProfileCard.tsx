
import { User } from "@/types/user";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "react-router-dom";

interface ProfileCardProps {
  user: User;
}

export const ProfileCard = ({ user }: ProfileCardProps) => {
  // Generate initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Get translated working type for display
  const getWorkTypeDisplay = (type: string) => {
    const workTypes: Record<string, string> = {
      construction: "Construction Worker",
      agriculture: "Agricultural Worker",
      manufacturing: "Manufacturing Worker",
      domestic: "Domestic Worker",
      hospitality: "Hospitality Worker",
      other: "Other Worker"
    };
    
    return workTypes[type] || "Worker";
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>Worker Profile</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <Avatar className="h-24 w-24 mb-4">
          {user.profileImage ? (
            <img src={user.profileImage} alt={user.name} />
          ) : (
            <AvatarFallback className="text-xl bg-primary text-primary-foreground">
              {getInitials(user.name)}
            </AvatarFallback>
          )}
        </Avatar>
        
        <h3 className="text-xl font-bold">{user.name}</h3>
        <p className="text-sm text-muted-foreground mb-4">{getWorkTypeDisplay(user.workingType)}</p>
        
        <div className="bg-muted p-3 rounded-md w-full mb-4">
          <p className="text-xs text-muted-foreground">Worker ID</p>
          <p className="text-sm font-mono">{user.id}</p>
        </div>
        
        <div className="w-full space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Age</span>
            <span className="text-sm">{user.age} years</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Gender</span>
            <span className="text-sm capitalize">{user.gender}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Location</span>
            <span className="text-sm">{user.migrationPlace}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Mobile</span>
            <span className="text-sm">{user.mobile}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button size="sm" variant="outline" className="w-full">
          <Link to="/chatbot">Ask About Schemes</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
