
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Scheme {
  name: string;
  description: string;
  eligibility: string;
  benefits: string;
}

interface SchemeCategory {
  id: string;
  name: string;
  icon: JSX.Element;
  schemes: Scheme[];
}

interface SchemesListProps {
  selectedCategory: string | null;
  schemeCategories: SchemeCategory[];
  rights: string[];
  handleSchemeSelect: (scheme: Scheme) => void;
  setMessages: React.Dispatch<React.SetStateAction<any[]>>;
  isMobile: boolean;
}

const SchemesList = ({ 
  selectedCategory, 
  schemeCategories, 
  rights, 
  handleSchemeSelect, 
  setMessages,
  isMobile 
}: SchemesListProps) => {
  if (!selectedCategory || isMobile) return null;

  return (
    <div className="border-t p-4 mt-auto max-h-[30%] scroll">
      <h3 className="font-medium mb-3 text-sm text-primary">
        {selectedCategory === "rights" 
          ? "Legal Rights & Protections" 
          : schemeCategories.find(cat => cat.id === selectedCategory)?.name || ""}
      </h3>
      <ScrollArea className="h-36">
        {selectedCategory === "rights" ? (
          <div className="space-y-2">
            {rights.map((right, index) => (
              <div 
                key={index} 
                className="p-2 border rounded-lg hover:bg-muted transition-colors cursor-pointer hover:shadow-sm" 
                onClick={() => {
                  setMessages(prev => [...prev, {
                    id: Date.now().toString(),
                    content: right,
                    sender: "bot",
                    timestamp: new Date()
                  }]);
                }}
              >
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
                  className="p-2 border rounded-lg hover:bg-muted transition-colors cursor-pointer hover:shadow-sm"
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
  );
};

export default SchemesList;
