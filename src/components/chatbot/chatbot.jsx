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
          className="h-14 w-14 rounded-full shadow-[0_8px_30px_rgb(99,102,241,0.3)] bg-gradient-to-tr from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white transition-all duration-300 hover:scale-110 group-hover:shadow-2xl border border-indigo-400/20"
        >
          <Bot className="h-6 w-6" />
          <div className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 bg-emerald-500 rounded-full border-2 border-slate-950 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse"></div>
        </Button>
        <div className="absolute -top-12 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black border border-zinc-800 text-white text-xs px-3.5 py-2 rounded-full whitespace-nowrap shadow-lg">
          Chat with <span className="font-bold text-indigo-400">SyncBot</span> 💬
        </div>
      </div>
    );
  }

  return (
    <Card className={`fixed bottom-6 right-6 z-50 w-[420px] lg:w-[480px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-300 overflow-hidden border border-zinc-800 bg-black text-white flex flex-col ${
      isMinimized ? "h-[76px]" : "h-[620px]"
    }`}>
      {/* Header - Premium Dark Glassmorphism */}
      <div className="bg-black border-b border-zinc-800 shrink-0">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="h-10 w-10 bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(124,58,237,0.3)] border border-violet-500/30">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div className="absolute -top-0.5 -right-0.5 h-3 w-3 bg-emerald-500 rounded-full border-2 border-black shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse"></div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-white">SyncBot</span>
                <Badge className="bg-zinc-900 border border-zinc-800 text-indigo-400 text-[10px] px-2.5 py-0.5 font-semibold">
                  AI ASSISTANT
                </Badge>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                <p className="text-[11px] text-zinc-400">Online • Live Support</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-905 rounded-full transition-all duration-200"
              onClick={() => setIsMinimized(!isMinimized)}
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-rose-950/30 rounded-full transition-all duration-200"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages Area - Dark Space */}
          <div className="flex-1 overflow-y-auto bg-black p-4 space-y-4 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent" ref={scrollRef}>
            {messages.map((message) => (
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
                  <Avatar className="h-8 w-8 flex-shrink-0 shadow-md border border-zinc-800 bg-zinc-900">
                    <AvatarFallback
                      className={
                        message.role === "user"
                          ? "bg-gradient-to-tr from-violet-600 to-indigo-600 text-white text-xs border border-violet-500/20"
                          : "bg-zinc-800 text-indigo-400 text-xs"
                      }
                    >
                      {message.role === "user" ? (
                        <MessageSquare className="h-4 w-4" />
                      ) : (
                        <Sparkles className="h-4 w-4 animate-pulse" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`rounded-2xl px-4 py-3 shadow-md ${
                      message.role === "user"
                        ? "bg-gradient-to-tr from-violet-600 to-indigo-600 text-white rounded-tr-none"
                        : "bg-zinc-900 border border-zinc-800/80 text-zinc-100 rounded-tl-none"
                    }`}
                  >
                    <div className={`text-sm leading-relaxed ${message.role === "user" ? "text-white" : "text-zinc-200"} prose prose-invert max-w-none`}>
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                          ul: ({ children }) => <ul className="list-disc pl-4 my-2 space-y-1">{children}</ul>,
                          li: ({ children }) => <li className="text-sm">{children}</li>,
                          strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                    <p className="text-[10px] text-zinc-500 mt-2 text-right">
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
                  <Avatar className="h-8 w-8 border border-zinc-800 bg-zinc-900">
                    <AvatarFallback className="bg-zinc-800 text-indigo-400">
                      <Sparkles className="h-4 w-4 animate-spin" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-zinc-900 border border-zinc-850 rounded-2xl px-4 py-3 shadow-sm rounded-tl-none">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="h-1.5 w-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <div className="h-1.5 w-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <div className="h-1.5 w-1.5 bg-indigo-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                      <span className="text-[11px] text-zinc-400">SyncBot is typing...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area - Pure Black Board */}
          <div className="border-t border-zinc-800 bg-black p-4 space-y-3 shrink-0">
            {/* Quick Actions */}
            <div className="flex gap-2 flex-wrap max-h-20 overflow-y-auto pr-1">
              {QUICK_ACTIONS.map((action) => (
                <Button
                  key={action.label}
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-[11px] border border-zinc-800 hover:border-zinc-700 bg-zinc-900/60 hover:bg-zinc-900 text-zinc-300 hover:text-white h-8 px-3 rounded-full transition-all duration-200 hover:scale-102"
                  onClick={() => sendMessage(action.query)}
                  disabled={isLoading || isTyping}
                >
                  <action.icon className="h-3 w-3 text-indigo-400" />
                  {action.label}
                </Button>
              ))}
            </div>

            {/* Input Field & Send Button */}
            <div className="flex w-full gap-2">
              <div className="flex-1 relative">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Message SyncBot..."
                  className="pr-10 border-zinc-800 focus:ring-1 focus:ring-indigo-500 focus:border-transparent rounded-xl bg-zinc-900 text-white placeholder-zinc-500 transition-all duration-200"
                  disabled={isLoading || isTyping}
                  autoFocus
                />
              </div>
              <Button
                onClick={() => sendMessage()}
                disabled={!inputValue.trim() || isLoading || isTyping}
                className="bg-gradient-to-tr from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 rounded-xl shadow-md hover:shadow-[0_0_15px_rgba(99,102,241,0.4)] text-white transition-all duration-200 hover:scale-105 disabled:opacity-30 shrink-0"
                size="icon"
              >
                {isLoading || isTyping ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            {/* Footer Stats Note */}
            <div className="flex items-center justify-center gap-2.5 pt-1 border-t border-zinc-900">
              <div className="flex items-center gap-1">
                <Zap className="h-3 w-3 text-indigo-500" />
                <p className="text-[10px] text-zinc-500">AI-powered assistant</p>
              </div>
              <div className="h-2.5 w-px bg-zinc-800"></div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-emerald-500" />
                <p className="text-[10px] text-zinc-500">24/7 Service</p>
              </div>
            </div>
          </div>
        </>
      )}
      
      {/* Minimized View */}
      {isMinimized && (
        <div 
          className="flex items-center gap-3 p-3 cursor-pointer hover:bg-zinc-900 transition-all duration-200 group bg-black"
          onClick={() => setIsMinimized(false)}
        >
          <div className="relative">
            <div className="h-10 w-10 bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-full flex items-center justify-center shadow-md border border-violet-500/20 group-hover:scale-105 transition-transform duration-200">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div className="absolute -top-0.5 -right-0.5 h-3 w-3 bg-emerald-500 rounded-full border-2 border-black animate-pulse"></div>
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-white">SyncBot</p>
            <p className="text-xs text-zinc-400">Click to resume conversation</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-full"
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