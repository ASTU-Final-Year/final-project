// src/app/layout.jsx
import { Geist, Geist_Mono, Noto_Sans } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Chatbot } from "@/components/chatbot/chatbot";

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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-accent`}
      >
        <TooltipProvider>
          {children}
          <Chatbot />
        </TooltipProvider>
      </body>
    </html>
  );
}
