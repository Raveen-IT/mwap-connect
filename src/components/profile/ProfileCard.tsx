
import { User } from "@/types/user";
import { 
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CustomButton } from "@/components/ui/custom-button";
import { CalendarDays, MapPin, Phone, AtSign, Briefcase, User as UserIcon } from "lucide-react";
import { capitalizeFirstLetter } from "@/utils/string-helpers";

interface ProfileCardProps {
  user: User;
  onEdit?: () => void;
}

export const ProfileCard = ({ user, onEdit }: ProfileCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    }).format(date);
  };

  return (
    <Card className="glass-effect overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-mwap-600 to-mwap-800 text-white relative pb-24">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/20" />
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="bg-white/10 text-white mb-2">
              Verified Worker
            </Badge>
            {onEdit && (
              <Button size="sm" variant="outline" onClick={onEdit} className="bg-white/10 hover:bg-white/20 text-white border-white/20">
                Edit Profile
              </Button>
            )}
          </div>
          <CardTitle className="text-2xl font-bold">{user.name}</CardTitle>
          <p className="text-white/80 mt-1">ID: {user.id}</p>
        </div>
      </CardHeader>

      <div className="relative">
        <div className="absolute -top-12 left-6">
          <div className="h-24 w-24 rounded-full bg-gradient-to-br from-mwap-400 to-mwap-600 border-4 border-white shadow-lg flex items-center justify-center text-white text-3xl font-bold">
            {user.name.charAt(0)}
          </div>
        </div>
      </div>

      <CardContent className="pt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start">
              <UserIcon className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Age & Gender</p>
                <p>{user.age} years, {capitalizeFirstLetter(user.gender)}</p>
              </div>
            </div>

            <div className="flex items-start">
              <Briefcase className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Work Type</p>
                <p>{capitalizeFirstLetter(user.workingType)}</p>
              </div>
            </div>

            <div className="flex items-start">
              <MapPin className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Migration Place</p>
                <p>{user.migrationPlace}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start">
              <Phone className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Mobile Number</p>
                <p>{user.mobile}</p>
              </div>
            </div>

            {user.email && (
              <div className="flex items-start">
                <AtSign className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p>{user.email}</p>
                </div>
              </div>
            )}

            <div className="flex items-start">
              <CalendarDays className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Registration Date</p>
                <p>{formatDate(user.registrationDate)}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between pt-0">
        <div>
          <p className="text-sm text-muted-foreground">Aadhaar Verified</p>
          <p className="font-medium">XXXX-XXXX-{user.aadhaarNumber.slice(-4)}</p>
        </div>
        
        <div>
          <CustomButton variant="outline" size="sm" asChild>
            <a href={`/id-card/${user.id}`} target="_blank">View ID Card</a>
          </CustomButton>
        </div>
      </CardFooter>
    </Card>
  );
};
