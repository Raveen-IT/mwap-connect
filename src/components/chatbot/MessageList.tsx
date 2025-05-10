
import React, { useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import MessageBubble from "./MessageBubble";
import { User } from "@/types/user";

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
  schemes: any[];
}

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  user: User | null;
  schemeCategories: SchemeCategory[];
  setSelectedCategory: (category: string | null) => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  scrollAreaRef: React.RefObject<HTMLDivElement>;
  isMobile: boolean;
}

const MessageList = ({
  messages,
  isLoading,
  user,
  schemeCategories,
  setSelectedCategory,
  messagesEndRef,
  scrollAreaRef,
  isMobile
}: MessageListProps) => {
  useEffect(() => {
    if (messagesEndRef.current) {
      // Use setTimeout to ensure the DOM has updated
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [messages, messagesEndRef]);

  return (
    <ScrollArea 
      className="flex-1 p-4 overflow-y-auto" 
      viewportRef={scrollAreaRef}
    >
      <div className="space-y-4 py-2 pb-6">
        {messages.map((message) => (
          <MessageBubble 
            key={message.id}
            {...message}
            user={user}
          />
        ))}
        
        {isLoading && (
          <div className="flex justify-start animate-fade-in">
            <div className="flex gap-3 max-w-[85%]">
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  M
                </AvatarFallback>
              </Avatar>
              <div className="rounded-xl rounded-tl-none p-4 text-sm bg-secondary shadow-sm">
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
        
        <div ref={messagesEndRef} className="h-0" />
      </div>
    </ScrollArea>
  );
};

// Fix missing import
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default MessageList;
