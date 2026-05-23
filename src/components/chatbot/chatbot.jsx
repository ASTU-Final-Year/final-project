// src/components/chatbot/Chatbot.jsx
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
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
  Trash2,
  Pencil,
  RefreshCw,
  Menu,
  PlusCircle,
} from "lucide-react";
import { getChatbotResponse, getQuickResponse } from "./ai-service";
import { useChatbotStore } from "@/store/chatbotStore";

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
const STORAGE_KEY = "syncbot_conversations";

const loadConversations = () => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    const parsed = JSON.parse(stored);
    return parsed.map(conv => ({
      ...conv,
      createdAt: new Date(conv.createdAt),
      updatedAt: new Date(conv.updatedAt),
      messages: conv.messages.map(msg => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      })),
    }));
  } catch {
    return [];
  }
};

const saveConversations = (convs) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(convs));
};

const QUICK_ACTIONS = [
  { label: "Book appointment", icon: Calendar, query: "How do I book an appointment?" },
  { label: "Pricing plans", icon: CreditCard, query: "Tell me about pricing plans" },
  { label: "Track service", icon: Clock, query: "How do I track my service?" },
  { label: "Contact support", icon: HelpCircle, query: "How can I contact support?" },
];

const SUGGESTED_QUESTIONS = [
  "What are the benefits of ServeSync+?",
  "How do I reset my password?",
  "Can I cancel my subscription?",
  "How does the Ethiopian calendar work?",
  "How do I hire an employee?",
];

export function Chatbot() {
  const { isOpen, setIsOpen } = useChatbotStore();
  const [isMinimized, setIsMinimized] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      role: "assistant",
      content:
        "👋 Welcome to **ServeSync+**! I'm SyncBot, your AI assistant. I can help you with booking appointments, understanding pricing, tracking services, and more.\n\nHow can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const sidebarRef = useRef(null);

  // ---- Conversation management (unchanged) ----
  const saveCurrentConversation = useCallback(() => {
    if (!currentConversationId && messages.length === 1 && messages[0].id === "welcome") return;
    const title = messages.find(m => m.role === "user")?.content.slice(0, 50) || "New conversation";
    const updatedConversations = conversations.map(c =>
      c.id === currentConversationId ? { ...c, title, messages, updatedAt: new Date() } : c
    );
    setConversations(updatedConversations);
    saveConversations(updatedConversations);
  }, [currentConversationId, messages, conversations]);

  const startNewConversation = useCallback(() => {
    if (currentConversationId || messages.length > 1) saveCurrentConversation();
    const newId = generateId();
    const newConversation = {
      id: newId,
      title: "New conversation",
      messages: [
        {
          id: "welcome",
          role: "assistant",
          content: "👋 Welcome back! I'm SyncBot, your AI assistant. How can I help you today?",
          timestamp: new Date(),
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setConversations(prev => [newConversation, ...prev]);
    setCurrentConversationId(newId);
    setMessages(newConversation.messages);
    setShowHistory(false);
    toast.success("New conversation started");
    // Focus input after new chat
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [saveCurrentConversation, currentConversationId, messages]);

  const loadConversation = useCallback((conv) => {
    if (currentConversationId) saveCurrentConversation();
    setCurrentConversationId(conv.id);
    setMessages(conv.messages);
    setShowHistory(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [saveCurrentConversation, currentConversationId]);

  const deleteConversation = useCallback((id, e) => {
    e.stopPropagation();
    const updated = conversations.filter(c => c.id !== id);
    setConversations(updated);
    saveConversations(updated);
    if (id === currentConversationId) {
      if (updated.length > 0) loadConversation(updated[0]);
      else startNewConversation();
    }
    toast.success("Conversation deleted");
  }, [conversations, currentConversationId, loadConversation, startNewConversation]);

  // Load stored conversations on mount
  useEffect(() => {
    const stored = loadConversations();
    if (stored.length > 0) {
      setConversations(stored);
      const mostRecent = stored.reduce((a, b) => (a.updatedAt > b.updatedAt ? a : b));
      setCurrentConversationId(mostRecent.id);
      setMessages(mostRecent.messages);
    } else {
      startNewConversation();
    }
  }, []);

  // Auto‑save when messages change
  useEffect(() => {
    if (!currentConversationId) return;
    const timeout = setTimeout(() => saveCurrentConversation(), 500);
    return () => clearTimeout(timeout);
  }, [messages, currentConversationId, saveCurrentConversation]);

  // Auto‑scroll to bottom
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  // Focus input when chat opens (or when not minimized)
  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) inputRef.current.focus();
  }, [isOpen, isMinimized]);

  // Click outside to close sidebar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showHistory && sidebarRef.current && !sidebarRef.current.contains(event.target))
        setShowHistory(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showHistory]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if ((e.ctrlKey || e.metaKey) && e.key === "h") {
        e.preventDefault();
        setShowHistory(prev => !prev);
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "C") {
        e.preventDefault();
        clearChat();
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "N") {
        e.preventDefault();
        startNewConversation();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // ---- Helper functions ----
  const copyToClipboard = useCallback((text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  const clearChat = useCallback(() => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: "👋 Welcome back! I'm SyncBot, your AI assistant. How can I help you today?",
        timestamp: new Date(),
      },
    ]);
    toast.info("Chat cleared");
    // Focus input after clearing
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const editUserMessage = useCallback((userMsgId, userContent) => {
    const userIndex = messages.findIndex(m => m.id === userMsgId);
    if (userIndex === -1) return;
    const assistantIndex = userIndex + 1;
    let newMessages = [...messages];
    if (assistantIndex < newMessages.length && newMessages[assistantIndex].role === "assistant") {
      newMessages.splice(userIndex, 2);
    } else {
      newMessages.splice(userIndex, 1);
    }
    setMessages(newMessages);
    setInputValue(userContent);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [messages]);

  const regenerateResponse = useCallback(async () => {
    const lastUserMsg = [...messages].reverse().find(m => m.role === "user");
    if (!lastUserMsg) return;
    const lastAssistantIndex = [...messages].reverse().findIndex(m => m.role === "assistant");
    if (lastAssistantIndex !== -1) {
      const newMessages = [...messages];
      const idx = newMessages.length - 1 - lastAssistantIndex;
      newMessages.splice(idx, 1);
      setMessages(newMessages);
    }
    await sendMessage(lastUserMsg.content, true);
  }, [messages]);

  // Core send function
  const sendMessage = async (messageText = inputValue, skipAddUser = false) => {
    if ((!messageText.trim() && !skipAddUser) || isLoading) return;

    if (!skipAddUser) {
      const userMessage = {
        id: Date.now().toString(),
        role: "user",
        content: messageText,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, userMessage]);
      setInputValue("");
    }

    setIsLoading(true);

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
        // Focus input after response
        setTimeout(() => inputRef.current?.focus(), 100);
      }, 300);
      return;
    }

    const typingId = (Date.now() + 1).toString();
    setMessages(prev => [
      ...prev,
      { id: typingId, role: "assistant", content: "", timestamp: new Date(), isTyping: true },
    ]);

    try {
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
        { id: (Date.now() + 1).toString(), role: "assistant", content: response, timestamp: new Date() },
      ]);
    } catch (error) {
      console.error(error);
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
      // Focus input after response
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const hasUserMessages = messages.some(m => m.role === "user");
  const lastAssistant = [...messages].reverse().find(m => m.role === "assistant" && !m.isTyping);
  const showSuggestions = !hasUserMessages || (lastAssistant && lastAssistant.id === messages[messages.length - 1]?.id);

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white z-50 transition-all duration-300 hover:scale-105 active:scale-95"
      >
        <Bot className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <>
      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 z-50 h-full w-80 bg-white dark:bg-gray-900 shadow-2xl border-r border-gray-200 dark:border-gray-800 transition-transform duration-300 ease-in-out ${
          showHistory ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="font-semibold text-gray-800 dark:text-gray-200">Conversations</h2>
          <Button variant="ghost" size="icon" onClick={() => setShowHistory(false)} className="rounded-full">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <ScrollArea className="h-[calc(100%-70px)] p-2">
          <Button
            variant="outline"
            className="w-full mb-3 gap-2 justify-center border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950"
            onClick={startNewConversation}
          >
            <PlusCircle className="h-4 w-4" />
            New chat
          </Button>
          {conversations.map(conv => (
            <div
              key={conv.id}
              className={`group p-3 mb-2 rounded-xl cursor-pointer transition-all hover:bg-gray-100 dark:hover:bg-gray-800 ${
                currentConversationId === conv.id ? "bg-indigo-50 dark:bg-indigo-950/50 border-l-4 border-indigo-500" : ""
              }`}
              onClick={() => loadConversation(conv)}
            >
              <div className="flex justify-between items-start">
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate flex-1">
                  {conv.title}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700"
                  onClick={(e) => deleteConversation(conv.id, e)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {new Date(conv.updatedAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* Main Chat Window */}
      <Card
        className={`fixed bottom-6 right-6 z-50 w-[95vw] sm:w-[450px] lg:w-[520px] shadow-2xl transition-all duration-300 ${
          isMinimized ? "h-[60px]" : "h-[600px] max-h-[90vh]"
        } bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border border-indigo-100 dark:border-indigo-800 rounded-2xl overflow-hidden flex flex-col`}
      >
        {/* Header */}
        <div className="p-4 border-b bg-gradient-to-r from-indigo-600 to-indigo-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/20 rounded-full transition"
              onClick={() => setShowHistory(true)}
              title="Conversation history (Ctrl+H)"
            >
              <Menu className="h-4 w-4" />
            </Button>
            <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <span className="font-semibold text-lg">SyncBot</span>
              <Badge variant="outline" className="ml-2 bg-white/20 text-white border-white/30 text-[10px]">
                AI 24/7
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/20 rounded-full transition"
              onClick={() => startNewConversation()}
              title="New conversation (Ctrl+Shift+N)"
            >
              <PlusCircle className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/20 rounded-full transition"
              onClick={clearChat}
              title="Clear chat (Ctrl+Shift+C)"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/20 rounded-full transition"
              onClick={() => setIsMinimized(!isMinimized)}
              title={isMinimized ? "Expand" : "Minimize"}
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/20 rounded-full transition"
              onClick={() => setIsOpen(false)}
              title="Close"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4 bg-gradient-to-b from-transparent to-indigo-50/20 dark:to-indigo-950/10" ref={scrollRef}>
              <div className="space-y-4">
                {messages.map((message, idx) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} group animate-in fade-in slide-in-from-bottom-2 duration-300`}
                  >
                    <div className={`flex gap-2 max-w-[85%] ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                      <Avatar className="h-8 w-8 shrink-0 ring-2 ring-white dark:ring-gray-800 shadow-sm">
                        <AvatarFallback
                          className={
                            message.role === "user"
                              ? "bg-gradient-to-br from-indigo-500 to-indigo-600 text-white text-xs"
                              : "bg-gray-100 dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 text-xs"
                          }
                        >
                          {message.role === "user" ? "You" : "🤖"}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`rounded-2xl p-3 shadow-sm transition-all ${
                          message.role === "user"
                            ? "bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-br-sm"
                            : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 rounded-bl-sm"
                        }`}
                      >
                        {message.isTyping ? (
                          <div className="flex items-center gap-2 py-1">
                            <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
                            <div className="w-2 h-2 rounded-full bg-current animate-pulse delay-75" />
                            <div className="w-2 h-2 rounded-full bg-current animate-pulse delay-150" />
                          </div>
                        ) : (
                          <>
                            <div className="prose prose-sm dark:prose-invert max-w-none break-words">
                              <ReactMarkdown>{message.content}</ReactMarkdown>
                            </div>
                            <div className="flex items-center justify-end gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="text-[10px] opacity-60">
                                {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                              </span>
                              <button
                                onClick={() => copyToClipboard(message.content, message.id)}
                                className="text-[10px] opacity-60 hover:opacity-100 transition"
                                title="Copy"
                              >
                                {copiedId === message.id ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                              </button>
                              {message.role === "user" && (
                                <button
                                  onClick={() => editUserMessage(message.id, message.content)}
                                  className="text-[10px] opacity-60 hover:opacity-100 transition"
                                  title="Edit message"
                                >
                                  <Pencil className="h-3 w-3" />
                                </button>
                              )}
                              {message.role === "assistant" && idx === messages.length - 1 && (
                                <button
                                  onClick={regenerateResponse}
                                  className="text-[10px] opacity-60 hover:opacity-100 transition"
                                  title="Regenerate"
                                  disabled={isLoading}
                                >
                                  <RefreshCw className="h-3 w-3" />
                                </button>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Suggested Questions */}
            {showSuggestions && (
              <div className="px-4 pt-3 pb-1 border-t border-gray-100 dark:border-gray-800">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Try asking:</p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_QUESTIONS.map((q) => (
                    <Button
                      key={q}
                      variant="outline"
                      size="sm"
                      className="text-xs rounded-full border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 hover:bg-indigo-50 dark:hover:bg-indigo-950 hover:text-indigo-700 dark:hover:text-indigo-400 transition-all"
                      onClick={() => setInputValue(q)}
                    >
                      {q}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="px-4 pt-2 pb-1 border-t border-gray-100 dark:border-gray-800">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                {QUICK_ACTIONS.map((action) => (
                  <Button
                    key={action.label}
                    variant="outline"
                    size="sm"
                    className="gap-1.5 text-xs rounded-full border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-gray-700 dark:text-gray-300 hover:text-indigo-700 dark:hover:text-indigo-400 transition-all"
                    onClick={() => sendMessage(action.query)}
                    disabled={isLoading}
                  >
                    <action.icon className="h-3.5 w-3.5" />
                    {action.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about ServeSync+..."
                  className="flex-1 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 rounded-xl bg-white dark:bg-gray-800 transition-all"
                  disabled={isLoading}
                />
                <Button
                  onClick={() => sendMessage()}
                  disabled={!inputValue.trim() || isLoading}
                  className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-xl transition-all duration-200 hover:shadow-md disabled:opacity-50"
                  size="icon"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-[10px] text-center text-gray-400 dark:text-gray-500 mt-2">
                SyncBot – Your AI assistant for ServeSync+ • <kbd className="text-xs">Ctrl+H</kbd> history
              </p>
            </div>
          </>
        )}
      </Card>
    </>
  );
}