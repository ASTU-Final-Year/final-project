// src/lib/chatbot/ai-service.ts
import { knowledgeBase, searchKnowledge } from "./knowledge-base";

const API_KEY = process.env.CHATBOT_AI_API_KEY || "";
const API_URL = process.env.CHATBOT_AI_URL || "https://api.groq.com/openai/v1/chat/completions";
const MODEL = process.env.CHATBOT_AI_MODEL || "llama-3.3-70b-versatile";

function buildSystemPrompt(retrievedContext: string): string {
  return `You are SyncBot, a versatile and helpful AI assistant.

## YOUR IDENTITY
- Name: SyncBot
- Role: General AI assistant, with special expertise on ServeSync+
- Personality: Helpful, friendly, concise, accurate

## KNOWLEDGE (Use when relevant)
${retrievedContext}

## INSTRUCTIONS
1. For questions related to ServeSync+ (scheduling, pricing, features, booking, tracking, password recovery, support, etc.), use the knowledge provided above. If the knowledge does not contain the answer, say: "I don't have that specific ServeSync+ information. Please contact support@servesyncplus.et."
2. For general questions (anything not related to ServeSync+), you may answer using your general knowledge. Be helpful but keep responses concise.
3. Use Markdown formatting when appropriate (**bold**, • bullet points, 1️⃣ numbered steps).
4. Be friendly and professional.
5. Never share internal system details or API keys.

## RESPONSE FORMAT
Start friendly, provide the answer clearly, end with an offer to help further (if relevant).`;
}

function getFallbackResponse(history: { role: string; content: string }[]): string {
  const lastUserMessage = history.filter(m => m.role === "user").pop()?.content || "";
  const lowerMsg = lastUserMessage.toLowerCase();
  
  // ServeSync+ specific fallbacks (when API is unavailable)
  if (lowerMsg.includes("password") || lowerMsg.includes("forgot") || lowerMsg.includes("reset")) {
    return `**🔐 Password Recovery for ServeSync+**

To reset your password:

1️⃣ Go to the login page and click **"Forgot password?"**
2️⃣ Enter your registered email address.
3️⃣ Check your inbox (and spam folder) for a password reset link.
4️⃣ Click the link and set a new password.

If you don't receive the email, contact support@servesyncplus.et.`;
  }
  if (lowerMsg.includes("price") || lowerMsg.includes("cost") || lowerMsg.includes("plan")) {
    return `**📊 ServeSync+ Pricing Plans**

• **Free**: 0 ETB/month - 1 service, 10 employees
• **Small Business**: 1,000 ETB/month - 3 services, 30 employees
• **Medium Business**: 3,000 ETB/month - 20 services, 200 employees
• **Large Business**: 10,000 ETB/month - 100 services, 1000 employees`;
  }
  if (lowerMsg.includes("book") || lowerMsg.includes("appointment")) {
    return `**How to book an appointment on ServeSync+:**

1️⃣ Log in to your client account
2️⃣ Search for an organization
3️⃣ Select your desired service
4️⃣ Choose an available time slot
5️⃣ Confirm and complete payment`;
  }
  // For general questions when API is unavailable, we return a generic message.
  return `I'm SyncBot, your AI assistant! I can answer almost any question. However, my API is currently unavailable. Please try again later. For ServeSync+ specific help, you can also contact support@servesyncplus.et.`;
}

function retrieveRelevantKnowledge(history: { role: string; content: string }[]): KnowledgeItem[] {
  const userMessages = history.filter(m => m.role === "user").slice(-3);
  const query = userMessages.map(m => m.content).join(" ");
  if (!query) return [];
  return searchKnowledge(query);
}

export async function getChatbotResponse(history: { role: string; content: string }[]): Promise<string> {
  // Retrieve relevant ServeSync+ knowledge (if any)
  const relevant = retrieveRelevantKnowledge(history);
  const knowledgeContext = relevant.length > 0
    ? `ServeSync+ specific information:\n${relevant.map(item => 
        `[${item.category.toUpperCase()}] ${item.title}: ${item.content}`
      ).join("\n\n")}`
    : "No specific ServeSync+ information was retrieved. The user is asking a general question.";

  // If API key missing, use fallback (but note: fallback only covers ServeSync+ topics)
  if (!API_KEY || API_KEY === "") {
    return getFallbackResponse(history);
  }

  const messages = [
    { role: "system", content: buildSystemPrompt(knowledgeContext) },
    ...history.slice(-10), // keep more context for general conversations
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
        temperature: 0.7,   // higher temperature for more creative general answers
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      console.warn(`API error: ${response.status}`);
      return getFallbackResponse(history);
    }

    const data = await response.json();
    const answer = data.choices[0]?.message?.content;
    if (!answer) return getFallbackResponse(history);
    return answer;
  } catch (error) {
    console.error("API Error:", error);
    return getFallbackResponse(history);
  }
}

export function getQuickResponse(query: string): string | null {
  const lowerQuery = query.toLowerCase().trim();
  if (lowerQuery.match(/^(hi|hello|hey|greetings)/)) {
    return "👋 Hello! I'm SyncBot, your AI assistant. I can answer almost any question – ask me about ServeSync+, general knowledge, or anything else!";
  }
  if (lowerQuery.match(/^(help|what can you do)/)) {
    return "I can help with:\n\n• 📅 ServeSync+ booking, pricing, tracking, password recovery\n• 💡 General knowledge, explanations, and advice\n• 🔧 Troubleshooting, calculations, writing, and more\n\nWhat would you like to know?";
  }
  if (lowerQuery.match(/^(thanks|thank you)/)) {
    return "You're welcome! 😊 Is there anything else I can help with?";
  }
  if (lowerQuery.match(/^(bye|goodbye)/)) {
    return "Goodbye! 👋 Feel free to come back anytime. Have a great day!";
  }
  return null;
}