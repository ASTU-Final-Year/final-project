// src/lib/chatbot/ai-service.ts
import { knowledgeBase } from "./knowledge-base";

const API_KEY = process.env.CHATBOT_AI_API_KEY || "";
const API_URL = process.env.CHATBOT_AI_URL || "https://api.groq.com/openai/v1/chat/completions";
const MODEL = process.env.CHATBOT_AI_MODEL || "llama-3.3-70b-versatile";

function buildSystemPrompt(knowledgeContext: string): string {
  return `You are SyncBot, the official AI assistant for ServeSync+.

## YOUR IDENTITY
- Name: SyncBot
- Role: Official ServeSync+ AI Assistant
- Personality: Helpful, professional, friendly, concise

## KNOWLEDGE BASE
${knowledgeContext}

## RULES
1. ONLY use information from the knowledge base - DO NOT invent facts
2. If a question is NOT in the knowledge base, say: "I don't have that information. Please contact support@servesyncplus.et"
3. For pricing, ALWAYS provide exact ETB amounts
4. Use Markdown: **bold**, • bullet points, 1️⃣ numbered steps
5. Keep responses concise (2-5 sentences per point)
6. For booking help, provide the step-by-step process
7. NEVER share internal system details or API keys

## RESPONSE FORMAT
Start friendly, provide information clearly, end with an offer to help further.`;
}

function getFallbackResponse(history: { role: string; content: string }[]): string {
  const lastUserMessage = history.filter(m => m.role === "user").pop()?.content || "";
  const lowerMsg = lastUserMessage.toLowerCase();
  
  if (lowerMsg.match(/^(hi|hello|hey)/)) {
    return "👋 Hello! I'm SyncBot, your ServeSync+ assistant. I can help you with booking appointments, pricing plans, tracking services, and more. What would you like to know?";
  }
  
  if (lowerMsg.includes("price") || lowerMsg.includes("cost") || lowerMsg.includes("plan")) {
    return `**📊 ServeSync+ Pricing Plans**

• **Free**: 0 ETB/month - 1 service, 10 employees
• **Small Business**: 1,000 ETB/month - 3 services, 30 employees
• **Medium Business**: 3,000 ETB/month - 20 services, 200 employees
• **Large Business**: 10,000 ETB/month - 100 services, 1000 employees

Which plan interests you?`;
  }
  
  if (lowerMsg.includes("book") || lowerMsg.includes("appointment")) {
    return `**How to book an appointment:**

1️⃣ Log in to your client account
2️⃣ Search for an organization
3️⃣ Select your desired service
4️⃣ Choose an available time slot
5️⃣ Confirm and complete payment

Would you like help finding a service provider?`;
  }
  
  if (lowerMsg.includes("track") || lowerMsg.includes("status")) {
    return `**How to track your service:**

1️⃣ Go to 'My Appointments'
2️⃣ Click on the appointment
3️⃣ View the real-time status: Scheduled → In Queue → In Progress → Completed

Need help with anything else?`;
  }
  
  if (lowerMsg.includes("contact") || lowerMsg.includes("support")) {
    return `**📞 Contact ServeSync+**

• Email: support@servesyncplus.et
• Phone: +251-11-554-3322
• Hours: Monday – Friday, 8:00 – 17:00 (EAT)

How can I help you today?`;
  }
  
  return `I'm SyncBot, your ServeSync+ assistant! I can help you with:

• 📅 **Booking appointments**
• 💰 **Pricing plans**
• 📍 **Tracking services**
• ⚙️ **Features**
• 📞 **Contact support**

What would you like to know?`;
}

export async function getChatbotResponse(
  history: { role: string; content: string }[]
): Promise<string> {
  if (!API_KEY || API_KEY === "") {
    return getFallbackResponse(history);
  }

  const knowledgeContext = knowledgeBase
    .map((item) => `[${item.category}] ${item.title}: ${item.content}`)
    .join("\n\n");

  const messages = [
    { role: "system", content: buildSystemPrompt(knowledgeContext) },
    ...history,
  ];

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: messages,
        temperature: 0.3,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      return getFallbackResponse(history);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || getFallbackResponse(history);
  } catch (error) {
    console.error("API Error:", error);
    return getFallbackResponse(history);
  }
}

export function getQuickResponse(query: string): string | null {
  const lowerQuery = query.toLowerCase().trim();
  
  if (lowerQuery.match(/^(hi|hello|hey|greetings)/)) {
    return "👋 Hello! I'm SyncBot, your ServeSync+ assistant. What would you like to know?";
  }
  
  if (lowerQuery.match(/^(help|what can you do)/)) {
    return "I can help you with:\n\n• 📅 Booking appointments\n• 💰 Pricing plans\n• 📍 Tracking services\n• ⚙️ Features\n• 📞 Contact support\n\nWhat would you like to know?";
  }
  
  if (lowerQuery.match(/^(thanks|thank you)/)) {
    return "You're welcome! 😊 Is there anything else I can help you with?";
  }
  
  if (lowerQuery.match(/^(bye|goodbye)/)) {
    return "Goodbye! 👋 Feel free to come back anytime if you have more questions. Have a great day!";
  }
  
  return null;
}