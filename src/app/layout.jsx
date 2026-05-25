// src/app/layout.jsx
import { Geist, Geist_Mono, Noto_Sans } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Chatbot } from "@/components/chatbot/chatbot";
import { Toaster } from "@/components/ui/sonner";

const notoSans = Noto_Sans({ variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "ServeSync+",
  description: "A multisector smart scheduling and progress tracking system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={cn("font-sans", notoSans.variable)}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="bg-main fixed -z-10 left-0 right-0 top-0 bottom-0"></div>
        <TooltipProvider>
          {children}
          <Toaster />
          <Chatbot />
        </TooltipProvider>
      </body>
    </html>
  );
}
