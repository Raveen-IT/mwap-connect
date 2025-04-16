
import { Loader } from "lucide-react";

interface LoadingPageProps {
  message?: string;
}

export const LoadingPage = ({ message = "Loading..." }: LoadingPageProps) => {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader className="h-8 w-8 animate-spin text-primary" />
        <p className="text-lg font-medium text-muted-foreground animate-pulse">
          {message}
        </p>
      </div>
    </div>
  );
};
