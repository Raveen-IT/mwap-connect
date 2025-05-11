
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User } from "@/types/user";

interface MessageBubbleProps {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
  user: User | null;
}

const MessageBubble = ({ content, sender, timestamp, user }: MessageBubbleProps) => {
  return (
    <div className={`flex ${sender === "user" ? "justify-end" : "justify-start"} animate-fade-in`}>
      <div className={`flex gap-3 max-w-[85%] ${sender === "user" ? "flex-row-reverse" : ""}`}>
        {sender === "bot" && (
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarFallback className="bg-primary text-primary-foreground">
              M
            </AvatarFallback>
          </Avatar>
        )}
        
        <div
          className={`rounded-xl p-4 shadow-sm ${
            sender === "user"
              ? "bg-primary text-primary-foreground rounded-tr-none"
              : "bg-secondary rounded-tl-none"
          }`}
        >
          <ScrollArea className={`${content.length > 200 ? "max-h-[200px]" : ""}`} type="hover">
            <div className="text-sm">
              {content.split("\n").map((text, i) => (
                <p key={i} className={i > 0 ? "mt-2" : ""}>
                  {text}
                </p>
              ))}
            </div>
          </ScrollArea>
          <div className="text-xs mt-2 opacity-70 text-right">
            {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
        
        {sender === "user" && user && (
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarFallback className="bg-accent text-accent-foreground">
              {user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
