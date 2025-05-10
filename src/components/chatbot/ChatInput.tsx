
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInput = ({ onSendMessage, isLoading }: ChatInputProps) => {
  const { t } = useLanguage();
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    onSendMessage(input);
    setInput("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full gap-2 relative">
      <Input
        placeholder={t("chatbot.messagePlaceholder")}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={isLoading}
        className="flex-1 pr-10 h-12 rounded-full pl-5 shadow-sm border-muted"
        autoComplete="off"
      />
      <Button 
        type="submit" 
        size="icon" 
        disabled={isLoading || !input.trim()}
        className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full"
      >
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
};

export default ChatInput;
