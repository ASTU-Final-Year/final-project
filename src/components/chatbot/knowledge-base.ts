// src/lib/chatbot/knowledge-base.ts

export interface KnowledgeItem {
  id: string;
  category: "overview" | "features" | "pricing" | "roles" | "workflow" | "support" | "tech";
  title: string;
  content: string;
  tags: string[];
}

export const knowledgeBase: KnowledgeItem[] = [
  // OVERVIEW
  {
    id: "ov-001",
    category: "overview",
    title: "What is ServeSync+?",
    content: "ServeSync+ is a smart multi-sector service scheduling and progress tracking system developed at Adama Science and Technology University, Ethiopia. It helps organizations and clients manage appointments, track progress, and coordinate services across healthcare, government, automotive, salon, and legal sectors.",
    tags: ["overview", "platform"],
  },
  {
    id: "ov-002",
    category: "overview",
    title: "Target Sectors",
    content: "Healthcare (hospitals, clinics), Government Services (IDs, permits, licenses through DARA, Immigration, Transport Authority), Automotive (repairs, maintenance), Beauty & Salon, and Legal Services.",
    tags: ["sectors", "healthcare", "government", "automotive"],
  },

  // FEATURES
  {
    id: "ft-001",
    category: "features",
    title: "Smart Scheduling",
    content: "Real-time availability calendar that prevents double-booking. Book appointments 24/7 from anywhere. Supports variable time slots.",
    tags: ["scheduling", "booking"],
  },
  {
    id: "ft-002",
    category: "features",
    title: "Progress Tracking",
    content: "Live status updates: Scheduled → In Queue → In Progress → Completed. Clients see exactly where their service stands.",
    tags: ["tracking", "status"],
  },
  {
    id: "ft-003",
    category: "features",
    title: "Automated Notifications",
    content: "Automatic alerts via SMS, email, and push notifications for confirmations, reminders, and status changes. Works offline.",
    tags: ["notifications", "alerts"],
  },
  {
    id: "ft-004",
    category: "features",
    title: "Ethiopian Calendar",
    content: "Built-in Ethiopian calendar (የኢትዮጵያ ዘመን አቆጣጠር) for date selection. Switch between Gregorian and Ethiopian views.",
    tags: ["ethiopian", "calendar"],
  },

  // PRICING
  {
    id: "pr-001",
    category: "pricing",
    title: "Free Plan",
    content: "0 ETB/month - 1 service, up to 10 employees, basic scheduling, email support.",
    tags: ["free", "pricing"],
  },
  {
    id: "pr-002",
    category: "pricing",
    title: "Small Business Plan",
    content: "1,000 ETB/month - 3 services, up to 30 employees, progress tracking, email support. Most popular.",
    tags: ["small", "business", "pricing"],
  },
  {
    id: "pr-003",
    category: "pricing",
    title: "Medium Business Plan",
    content: "3,000 ETB/month - 20 services, up to 200 employees, AI agent integration, analytics dashboard, priority support.",
    tags: ["medium", "business", "pricing"],
  },
  {
    id: "pr-004",
    category: "pricing",
    title: "Large Business Plan",
    content: "10,000 ETB/month - 100 services, up to 1000 employees, custom workflows, SLA guarantee, dedicated support.",
    tags: ["large", "enterprise", "pricing"],
  },

  // HOW-TO GUIDES
  {
    id: "gd-001",
    category: "support",
    title: "How to Book an Appointment",
    content: "1) Log in to your client account, 2) Search for an organization, 3) Select your service, 4) Choose a time slot, 5) Confirm and complete payment.",
    tags: ["how-to", "booking"],
  },
  {
    id: "gd-002",
    category: "support",
    title: "How to Track Your Service",
    content: "1) Go to 'My Appointments', 2) Click on the appointment, 3) View the real-time status bar.",
    tags: ["how-to", "tracking"],
  },
  {
    id: "gd-003",
    category: "support",
    title: "How to Cancel an Appointment",
    content: "1) Navigate to 'My Appointments', 2) Select the appointment, 3) Click 'Cancel', 4) Confirm cancellation.",
    tags: ["how-to", "cancellation"],
  },

  // CONTACT
  {
    id: "ct-001",
    category: "support",
    title: "Contact Information",
    content: "Email: support@servesyncplus.et. Phone: +251-11-554-3322. Address: Adama Science & Technology University, Ethiopia. Hours: Monday – Friday, 8:00 – 17:00 (EAT).",
    tags: ["contact", "support"],
  },
];

export function searchKnowledge(query: string): KnowledgeItem[] {
  const lowerQuery = query.toLowerCase();
  return knowledgeBase.filter(
    (item) =>
      item.title.toLowerCase().includes(lowerQuery) ||
      item.content.toLowerCase().includes(lowerQuery) ||
      item.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
}
