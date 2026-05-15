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
  Copy,
  Check,
  Pencil,
  RefreshCw,
  Trash2,
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
  const [copiedId, setCopiedId] = useState(null);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  // Auto‑scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  // Helper to copy text to clipboard
  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Delete conversation (keep only welcome message)
  const clearChat = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: "👋 Welcome back! I'm SyncBot, your AI assistant. How can I help you today?",
        timestamp: new Date(),
      },
    ]);
  };

  // Edit a user message: pre‑fill input and remove the old pair (user + assistant response)
  const editUserMessage = (userMsgId, userContent) => {
    // Find index of this user message
    const userIndex = messages.findIndex(m => m.id === userMsgId);
    if (userIndex === -1) return;

    // The assistant response is the next message (if exists)
    const assistantIndex = userIndex + 1;
    let newMessages = [...messages];

    // Remove the user message and (if exists) its assistant response
    if (assistantIndex < newMessages.length && newMessages[assistantIndex].role === "assistant") {
      newMessages.splice(userIndex, 2);
    } else {
      newMessages.splice(userIndex, 1);
    }

    setMessages(newMessages);
    setInputValue(userContent);
    // Focus input so user can edit and resend
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  // Regenerate last assistant response (resend the previous user query)
  const regenerateResponse = async () => {
    // Find the last user message
    const lastUserMsg = [...messages].reverse().find(m => m.role === "user");
    if (!lastUserMsg) return;

    // Remove the last assistant message (if it exists)
    const lastAssistantIndex = [...messages].reverse().findIndex(m => m.role === "assistant");
    if (lastAssistantIndex !== -1) {
      const newMessages = [...messages];
      const idx = newMessages.length - 1 - lastAssistantIndex;
      newMessages.splice(idx, 1);
      setMessages(newMessages);
    }

    // Resend the user's query
    await sendMessage(lastUserMsg.content, true); // true = skip adding user message again
  };

  // Core send function, can be called with an optional flag to not duplicate user message
  const sendMessage = async (messageText = inputValue, skipAddUser = false) => {
    if ((!messageText.trim() && !skipAddUser) || isLoading) return;

    let userMsgId = null;
    if (!skipAddUser) {
      const userMessage = {
        id: Date.now().toString(),
        role: "user",
        content: messageText,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, userMessage]);
      userMsgId = userMessage.id;
      setInputValue("");
    }

    setIsLoading(true);

    // Quick response detection (works without API)
    const quickResponse = getQuickResponse(messageText);
    if (quickResponse) {
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: quickResponse,
            timestamp: new Date(),
          },
        ]);
        setIsLoading(false);
      }, 300);
      return;
    }

    const typingId = (Date.now() + 1).toString();
    setMessages(prev => [
      ...prev,
      {
        id: typingId,
        role: "assistant",
        content: "",
        timestamp: new Date(),
        isTyping: true,
      },
    ]);

    try {
      // Build conversation history (exclude typing indicator)
      const history = messages
        .filter(m => !m.isTyping && m.role !== "system")
        .slice(-5)
        .map(m => ({
          role: m.role === "user" ? "user" : "assistant",
          content: m.content,
        }));
      history.push({ role: "user", content: messageText });

      const response = await getChatbotResponse(history);

      setMessages(prev => prev.filter(m => m.id !== typingId));
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: response,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error("Chatbot error:", error);
      setMessages(prev => prev.filter(m => m.id !== typingId));
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Sorry, I'm having trouble connecting. Please try again or contact support@servesyncplus.et",
          timestamp: new Date(),
        },
      ]);
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
    <Card
      className={`fixed bottom-6 right-6 z-50 w-[420px] lg:w-[520px] shadow-xl transition-all duration-300 ${
        isMinimized ? "h-[60px]" : "h-[600px]"
      }`}
    >
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
            onClick={clearChat}
            title="Clear chat"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
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
              {messages.map((message, idx) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} group`}
                >
                  <div
                    className={`flex gap-2 max-w-[85%] ${message.role === "user" ? "flex-row-reverse" : ""}`}
                  >
                    <Avatar className="h-7 w-7">
                      <AvatarFallback
                        className={
                          message.role === "user"
                            ? "bg-indigo-600 text-white text-xs"
                            : "bg-indigo-100 text-indigo-600 text-xs"
                        }
                      >
                        {message.role === "user" ? "U" : "🤖"}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`rounded-lg p-3 relative ${
                        message.role === "user"
                          ? "bg-indigo-600 text-white"
                          : "bg-indigo-50 text-indigo-900"
                      }`}
                    >
                      {message.isTyping ? (
                        <div className="flex items-center gap-1">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm">Thinking...</span>
                        </div>
                      ) : (
                        <>
                          <div className="text-sm prose prose-sm max-w-none">
                            <ReactMarkdown>{message.content}</ReactMarkdown>
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <p className="text-xs opacity-70">
                              {message.timestamp.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                            {/* Action buttons */}
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-5 w-5"
                                onClick={() => copyToClipboard(message.content, message.id)}
                                title="Copy message"
                              >
                                {copiedId === message.id ? (
                                  <Check className="h-3 w-3 text-green-500" />
                                ) : (
                                  <Copy className="h-3 w-3" />
                                )}
                              </Button>
                              {message.role === "user" && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-5 w-5"
                                  onClick={() => editUserMessage(message.id, message.content)}
                                  title="Edit message"
                                >
                                  <Pencil className="h-3 w-3" />
                                </Button>
                              )}
                              {message.role === "assistant" && idx === messages.length - 1 && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-5 w-5"
                                  onClick={regenerateResponse}
                                  title="Regenerate response"
                                  disabled={isLoading}
                                >
                                  <RefreshCw className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          </div>
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