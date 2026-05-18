"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
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
  Sparkles,
  MessageSquare,
  ChevronDown,
  Zap,
  Phone,
  CheckCircle,
} from "lucide-react";
import { getChatbotResponse, getQuickResponse } from "./ai-service";

const QUICK_ACTIONS = [
  { label: "Book appointment", icon: Calendar, query: "How do I book an appointment?", color: "bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200" },
  { label: "Pricing plans", icon: CreditCard, query: "Tell me about pricing plans", color: "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border-emerald-200" },
  { label: "Track service", icon: Clock, query: "How do I track my service?", color: "bg-purple-50 text-purple-600 hover:bg-purple-100 border-purple-200" },
  { label: "Contact support", icon: HelpCircle, query: "How can I contact support?", color: "bg-amber-50 text-amber-600 hover:bg-amber-100 border-amber-200" },
];

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      role: "assistant",
      content: "👋 Hello! I'm SyncBot, your ServeSync+ assistant. I can help you with booking appointments, understanding pricing, tracking services, and more.\n\nHow can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, isMinimized]);

  const sendMessage = async (messageText = inputValue) => {
    if (!messageText.trim() || isLoading || isTyping) return;

    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    setIsTyping(true);

    // Check for quick responses first
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
        setIsTyping(false);
      }, 500);
      return;
    }

    try {
      const history = messages.slice(-5).map(m => ({
        role: m.role === "user" ? "user" : "assistant",
        content: typeof m.content === 'string' ? m.content : '',
      }));
      history.push({ role: "user", content: messageText });

      // Simulate typing delay like real chatbots
      const response = await getChatbotResponse(history);
      
      // Add a small delay to simulate typing
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: response,
          timestamp: new Date(),
        }]);
        setIsLoading(false);
        setIsTyping(false);
      }, 800);
    } catch (error) {
      console.error("Chatbot error:", error);
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Sorry, I'm having trouble connecting. Please try again or contact support@servesyncplus.et",
          timestamp: new Date(),
        }]);
        setIsLoading(false);
        setIsTyping(false);
      }, 500);
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
      <div className="fixed bottom-6 right-6 z-50 group">
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white transition-all duration-300 hover:scale-110 group-hover:shadow-xl"
        >
          <Bot className="h-6 w-6" />
          <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
        </Button>
        <div className="absolute -top-12 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-full whitespace-nowrap">
          Chat with SyncBot 💬
        </div>
      </div>
    );
  }

  return (
    <Card className={`fixed bottom-6 right-6 z-50 w-[420px] lg:w-[500px] shadow-2xl transition-all duration-300 overflow-hidden border-0 flex flex-col ${
      isMinimized ? "h-[72px]" : "h-[650px]"
    }`}>
      {/* Header - Normal positioning, not sticky */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm shadow-lg">
                <Bot className="h-5 w-5" />
              </div>
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-lg">SyncBot</span>
                <Badge className="bg-white/20 text-white border-0 text-xs px-2 py-0.5">
                  AI 24/7
                </Badge>
              </div>
              <p className="text-xs text-blue-200">Online • Ready to help</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/20 rounded-full transition-all duration-200 hover:scale-110"
              onClick={() => setIsMinimized(!isMinimized)}
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/20 rounded-full transition-all duration-200 hover:scale-110 hover:bg-red-500/20"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages Area - Scrollable */}
          <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950" ref={scrollRef}>
            <div className="p-4 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  } animate-in fade-in slide-in-from-bottom-2 duration-300`}
                >
                  <div
                    className={`flex gap-3 max-w-[85%] ${
                      message.role === "user" ? "flex-row-reverse" : ""
                    }`}
                  >
                    <Avatar className="h-8 w-8 flex-shrink-0 shadow-md">
                      <AvatarFallback
                        className={
                          message.role === "user"
                            ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs"
                            : "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-600 text-xs"
                        }
                      >
                        {message.role === "user" ? (
                          <MessageSquare className="h-4 w-4" />
                        ) : (
                          <Sparkles className="h-4 w-4" />
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`rounded-2xl px-4 py-2.5 transition-all duration-200 hover:shadow-md ${
                        message.role === "user"
                          ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md"
                          : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-sm border border-gray-100 dark:border-gray-700"
                      }`}
                    >
                      <div className={`text-sm leading-relaxed ${message.role === "user" ? "text-white" : "text-gray-700 dark:text-gray-300"} prose prose-sm max-w-none`}>
                        <ReactMarkdown
                          components={{
                            p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                            ul: ({ children }) => <ul className="list-disc pl-4 my-2 space-y-1">{children}</ul>,
                            li: ({ children }) => <li className="text-sm">{children}</li>,
                            strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>
                      <p className="text-xs opacity-60 mt-2">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Realistic Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="flex gap-3 max-w-[85%]">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-600">
                        <Sparkles className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl px-4 py-3 shadow-sm border border-gray-100 dark:border-gray-700">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          <div className="h-2 w-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                          <div className="h-2 w-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                          <div className="h-2 w-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                        <span className="text-xs text-gray-500">SyncBot is typing...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Scroll anchor */}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area - Fixed at bottom */}
          <div className="border-t bg-white dark:bg-gray-900 shadow-lg">
            <div className="p-4 space-y-3">
              {/* Quick Actions */}
              <div className="flex gap-2 flex-wrap">
                {QUICK_ACTIONS.map((action) => (
                  <Button
                    key={action.label}
                    variant="outline"
                    size="sm"
                    className={`gap-1.5 text-xs ${action.color} border h-9 px-3 rounded-full transition-all duration-200 hover:scale-105`}
                    onClick={() => sendMessage(action.query)}
                    disabled={isLoading || isTyping}
                  >
                    <action.icon className="h-3.5 w-3.5" />
                    {action.label}
                  </Button>
                ))}
              </div>

              {/* Input Field - Always visible */}
              <div className="flex w-full gap-2">
                <div className="flex-1 relative">
                  <Input
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything about ServeSync+..."
                    className="pr-10 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-400 focus:border-transparent rounded-xl bg-gray-50 dark:bg-gray-800 transition-all duration-200"
                    disabled={isLoading || isTyping}
                    autoFocus
                  />
                </div>
                <Button
                  onClick={() => sendMessage()}
                  disabled={!inputValue.trim() || isLoading || isTyping}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 disabled:opacity-50"
                  size="icon"
                >
                  {isLoading || isTyping ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
              
              {/* Footer Note */}
              <div className="flex items-center justify-center gap-2 pt-1">
                <div className="flex items-center gap-1">
                  <Zap className="h-3 w-3 text-blue-500" />
                  <p className="text-xs text-gray-400">AI-powered responses</p>
                </div>
                <div className="h-3 w-px bg-gray-200"></div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <p className="text-xs text-gray-400">24/7 Available</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      
      {/* Minimized View */}
      {isMinimized && (
        <div 
          className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 group"
          onClick={() => setIsMinimized(false)}
        >
          <div className="relative">
            <div className="h-10 w-10 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-200">
              <Bot className="h-5 w-5 text-blue-600" />
            </div>
            <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold">SyncBot</p>
            <p className="text-xs text-gray-500">Click to continue conversation</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
            }}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}
    </Card>
  );
}