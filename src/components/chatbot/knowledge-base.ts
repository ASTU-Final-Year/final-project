// src/lib/chatbot/knowledge-base.ts

export interface KnowledgeItem {
  id: string;
  category: "overview" | "features" | "pricing" | "roles" | "workflow" | "support" | "tech";
  title: string;
  content: string;
  tags: string[];
  synonyms: string[];
}

export const knowledgeBase: KnowledgeItem[] = [
  // ==================== OVERVIEW ====================
  {
    id: "ov-001",
    category: "overview",
    title: "What is ServeSync+?",
    content: "ServeSync+ is a smart multi-sector service scheduling and progress tracking system developed at Adama Science and Technology University, Ethiopia. It helps organizations and clients manage appointments, track progress, and coordinate services across healthcare, government, automotive, salon, and legal sectors.",
    tags: ["overview", "platform", "introduction"],
    synonyms: ["what is", "definition", "about", "describe"],
  },
  {
    id: "ov-002",
    category: "overview",
    title: "Target Sectors",
    content: "Healthcare (hospitals, clinics), Government Services (IDs, permits, licenses through DARA, Immigration, Transport Authority), Automotive (repairs, maintenance), Beauty & Salon, and Legal Services.",
    tags: ["sectors", "healthcare", "government", "automotive", "beauty", "legal"],
    synonyms: ["industries", "domains", "fields"],
  },

  // ==================== FEATURES ====================
  {
    id: "ft-001",
    category: "features",
    title: "Smart Scheduling",
    content: "Real-time availability calendar that prevents double-booking. Book appointments 24/7 from anywhere. Supports variable time slots.",
    tags: ["scheduling", "booking", "calendar"],
    synonyms: ["book", "appointment", "reserve", "time", "slot", "calendar"],
  },
  {
    id: "ft-002",
    category: "features",
    title: "Progress Tracking",
    content: "Live status updates: Scheduled → In Queue → In Progress → Completed. Clients see exactly where their service stands.",
    tags: ["tracking", "status", "progress"],
    synonyms: ["track", "status", "where", "stage", "update", "follow"],
  },
  {
    id: "ft-003",
    category: "features",
    title: "Automated Notifications",
    content: "Automatic alerts via SMS, email, and push notifications for confirmations, reminders, and status changes. Works offline.",
    tags: ["notifications", "alerts", "sms", "email", "push"],
    synonyms: ["reminder", "alert", "message", "notify", "email", "sms"],
  },
  {
    id: "ft-004",
    category: "features",
    title: "Ethiopian Calendar",
    content: "Built-in Ethiopian calendar (የኢትዮጵያ ዘመን አቆጣጠር) for date selection. Switch between Gregorian and Ethiopian views.",
    tags: ["ethiopian", "calendar", "date", "gregorian"],
    synonyms: ["ethiopian date", "ethio calendar"],
  },
  {
    id: "ft-005",
    category: "features",
    title: "AI Agent Integration",
    content: "AI agents work alongside human staff via API. They can handle routine tasks, answer questions, and update service status automatically.",
    tags: ["ai", "agents", "automation", "chatbot"],
    synonyms: ["ai", "agent", "chatbot", "bot", "automate"],
  },

  // ==================== PRICING ====================
  {
    id: "pr-001",
    category: "pricing",
    title: "Free Plan",
    content: "0 ETB/month - 1 service, up to 10 employees, basic scheduling, email support.",
    tags: ["free", "pricing", "plan"],
    synonyms: ["free", "price", "cost", "subscription"],
  },
  {
    id: "pr-002",
    category: "pricing",
    title: "Small Business Plan",
    content: "1,000 ETB/month - 3 services, up to 30 employees, progress tracking, email support. Most popular.",
    tags: ["small", "business", "pricing", "popular"],
    synonyms: ["small", "business", "price", "cost", "subscription"],
  },
  {
    id: "pr-003",
    category: "pricing",
    title: "Medium Business Plan",
    content: "3,000 ETB/month - 20 services, up to 200 employees, AI agent integration, analytics dashboard, priority support.",
    tags: ["medium", "business", "pricing"],
    synonyms: ["medium", "business", "price", "cost"],
  },
  {
    id: "pr-004",
    category: "pricing",
    title: "Large Business Plan",
    content: "10,000 ETB/month - 100 services, up to 1000 employees, custom workflows, SLA guarantee, dedicated support.",
    tags: ["large", "enterprise", "pricing"],
    synonyms: ["large", "enterprise", "price", "cost"],
  },

  // ==================== HOW-TO GUIDES ====================
  {
    id: "gd-001",
    category: "support",
    title: "How to Book an Appointment",
    content: "1) Log in to your client account, 2) Search for an organization, 3) Select your service, 4) Choose a time slot, 5) Confirm and complete payment.",
    tags: ["how-to", "booking", "appointment"],
    synonyms: ["book", "appointment", "schedule", "reserve", "steps", "procedure"],
  },
  {
    id: "gd-002",
    category: "support",
    title: "How to Track Your Service",
    content: "1) Go to 'My Appointments', 2) Click on the appointment, 3) View the real-time status bar.",
    tags: ["how-to", "tracking"],
    synonyms: ["track", "status", "where", "progress"],
  },
  {
    id: "gd-003",
    category: "support",
    title: "How to Cancel an Appointment",
    content: "1) Navigate to 'My Appointments', 2) Select the appointment, 3) Click 'Cancel', 4) Confirm cancellation.",
    tags: ["how-to", "cancellation"],
    synonyms: ["cancel", "refund", "delete", "remove"],
  },
  {
    id: "gd-004",
    category: "support",
    title: "Password Recovery",
    content: "To reset your password: 1) On the login page, click 'Forgot password?'. 2) Enter your registered email address. 3) Check your inbox for a password reset link. 4) Click the link and set a new password. If you don't receive an email, check your spam folder or contact support@servesyncplus.et.",
    tags: ["password", "recovery", "reset", "forgot", "security"],
    synonyms: ["password", "forgot", "reset", "recover", "login", "sign in"],
  },

  // ==================== CONTACT ====================
  {
    id: "ct-001",
    category: "support",
    title: "Contact Information",
    content: "Email: support@servesyncplus.et. Phone: +251-11-554-3322. Address: Adama Science & Technology University, Ethiopia. Hours: Monday – Friday, 8:00 – 17:00 (EAT).",
    tags: ["contact", "support", "email", "phone", "address"],
    synonyms: ["contact", "support", "help", "reach", "call", "email"],
  },
];

// Tokenization and search (unchanged)
function tokenize(text: string): string[] {
  return text.toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter(w => w.length > 1);
}

const SYNONYM_MAP: Record<string, string[]> = {
  book: ["booking", "appointment", "schedule", "reserve"],
  price: ["pricing", "cost", "fee", "subscription"],
  track: ["tracking", "status", "progress", "where"],
  cancel: ["cancellation", "refund", "delete"],
  support: ["contact", "help", "assist"],
  feature: ["features", "capability", "function"],
  plan: ["plans", "pricing", "subscription"],
  password: ["forgot", "reset", "recover", "login"],
};

function expandQuery(query: string): string[] {
  const words = tokenize(query);
  const expanded = new Set<string>();
  words.forEach(w => {
    expanded.add(w);
    if (SYNONYM_MAP[w]) SYNONYM_MAP[w].forEach(syn => expanded.add(syn));
    for (const [key, syns] of Object.entries(SYNONYM_MAP)) {
      if (syns.includes(w)) expanded.add(key);
    }
  });
  return Array.from(expanded);
}

export function searchKnowledge(query: string): KnowledgeItem[] {
  const expandedTerms = expandQuery(query);
  const queryLower = query.toLowerCase();

  const scored = knowledgeBase.map(item => {
    let score = 0;
    const textToSearch = `${item.title} ${item.content} ${item.tags.join(" ")} ${item.synonyms.join(" ")}`.toLowerCase();
    
    expandedTerms.forEach(term => {
      if (textToSearch.includes(term)) score += 2;
    });
    if (item.title.toLowerCase().includes(queryLower)) score += 5;
    if (item.tags.some(t => expandedTerms.includes(t))) score += 3;
    if (item.synonyms.some(s => expandedTerms.includes(s))) score += 2;
    
    return { item, score };
  });
  
  return scored.filter(s => s.score > 0).sort((a,b) => b.score - a.score).slice(0, 5).map(s => s.item);
}