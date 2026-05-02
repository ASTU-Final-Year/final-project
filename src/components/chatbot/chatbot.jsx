// src/components/chatbot/Chatbot.jsx
"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import ReactMarkdown from "react-markdown";
import {
  Bot,
  X,
  Send,
  Minimize2,
  Maximize2,
  Loader2,
  HelpCircle,
  Calendar,
  CreditCard,
  Clock,
} from "lucide-react";
import { getChatbotResponse, getQuickResponse } from "./ai-service";

const QUICK_ACTIONS = [
  { label: "Book appointment", icon: Calendar, query: "How do I book an appointment?" },
  { label: "Pricing plans", icon: CreditCard, query: "Tell me about pricing plans" },
  { label: "Track service", icon: Clock, query: "How do I track my service?" },
  { label: "Contact support", icon: HelpCircle, query: "How can I contact support?" },
];

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      role: "assistant",
      content: "👋 Welcome to **ServeSync+**! I'm SyncBot, your AI assistant. I can help you with booking appointments, understanding pricing, tracking services, and more.\n\nHow can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  const sendMessage = async (messageText = inputValue) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    const quickResponse = getQuickResponse(messageText);
    if (quickResponse) {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: quickResponse,
          timestamp: new Date(),
        }]);
        setIsLoading(false);
      }, 300);
      return;
    }

    const typingId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, {
      id: typingId,
      role: "assistant",
      content: "",
      timestamp: new Date(),
      isTyping: true,
    }]);

    try {
      const history = messages.slice(-5).map(m => ({
        role: m.role === "user" ? "user" : "assistant",
        content: typeof m.content === 'string' ? m.content : '',
      }));
      history.push({ role: "user", content: messageText });

      const response = await getChatbotResponse(history);
      
      setMessages(prev => prev.filter(m => m.id !== typingId));
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      }]);
    } catch (error) {
      console.error("Chatbot error:", error);
      setMessages(prev => prev.filter(m => m.id !== typingId));
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I'm having trouble connecting. Please try again or contact support@servesyncplus.et",
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-indigo-600 hover:bg-indigo-700 text-white z-50"
      >
        <Bot className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className={`fixed bottom-6 right-6 z-50 w-[420px] lg:w-[520px] shadow-xl transition-all duration-300 ${isMinimized ? "h-[60px]" : "h-[600px]"}`}>
      <div className="p-3 border-b bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-t-lg flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          <span className="font-semibold">SyncBot</span>
          <Badge variant="outline" className="border-white/30 text-white text-xs">
            AI 24/7
          </Badge>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-white hover:bg-white/20"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-white hover:bg-white/20"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <ScrollArea className="flex-1 p-4 h-[500px]" ref={scrollRef}>
            <div className="space-y-3">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`flex gap-2 max-w-[85%] ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className={message.role === "user" ? "bg-indigo-600 text-white text-xs" : "bg-indigo-100 text-indigo-600 text-xs"}>
                        {message.role === "user" ? "U" : "🤖"}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`rounded-lg p-3 ${message.role === "user" ? "bg-indigo-600 text-white" : "bg-indigo-50 text-indigo-900"}`}>
                      {message.isTyping ? (
                        <div className="flex items-center gap-1">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm">Thinking...</span>
                        </div>
                      ) : (
                        <>
                          <div className="text-sm prose prose-sm max-w-none">
                            <pre className="text-wrap" >
                            <ReactMarkdown>{message.content}</ReactMarkdown>
                            </pre>
                          </div>
                          <p className="text-xs opacity-70 mt-1">
                            {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="p-3 border-t">
            <div className="flex gap-2 flex-wrap mb-3">
              {QUICK_ACTIONS.map((action) => (
                <Button
                  key={action.label}
                  variant="outline"
                  size="sm"
                  className="gap-1 text-xs border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                  onClick={() => sendMessage(action.query)}
                  disabled={isLoading}
                >
                  <action.icon className="h-3 w-3" />
                  {action.label}
                </Button>
              ))}
            </div>
            <div className="flex w-full gap-2">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about ServeSync+..."
                className="flex-1 border-indigo-200 focus:ring-indigo-400"
                disabled={isLoading}
              />
              <Button 
                onClick={() => sendMessage()} 
                disabled={!inputValue.trim() || isLoading} 
                className="bg-indigo-600 hover:bg-indigo-700"
                size="icon"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </>
      )}
    </Card>
  );
}