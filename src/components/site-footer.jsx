import React from "react";
import Link from "next/link";
import {
  Activity,
  Shield,
  Command,
  Map,
  HelpCircle,
  PhoneCall,
  Mail,
} from "lucide-react";
import Image from "next/image";

const BACKEND_PORT = parseInt(process.env.BACKEND_PORT || "") || 4000;
const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || "support@servesyncplus.et";

export function SiteFooter() {
  // const systemStatus = await fetch(
  //   `http://localhost:${BACKEND_PORT}/api/v1/status`,
  // ).then(async (res) => (res.ok ? await res.json() : null));
  // const isSystemActive = systemStatus?.systemActive;
  const isSystemActive = true;
  return (
    <footer className="border-t bg-slate-900 text-white/90 pb-12 pt-16 mt-auto">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-1 md:col-span-3 space-y-6">
            <div className="flex items-center gap-3">
              <div className="bg-primary p-2 rounded-xl text-white shadow-sm">
                <Activity className="h-5 w-5" />
              </div>
              <span className="font-bold text-xl tracking-tight">
                ServeSync<span className="text-primary">+</span>
              </span>
            </div>
            <div className="flex flex-col gap-2 pt-2">
              <div className="flex items-center gap-2 text-sm text-muted/75">
                <Command className="h-4 w-4" /> v1.0.0 (Beta)
              </div>
              <div
                className={`flex items-center gap-2 text-sm ${isSystemActive ? "text-green-600" : "text-red-600"} font-medium`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${isSystemActive ? "bg-green-600" : "bg-red-600"} inline-block animate-pulse`}
                />{" "}
                {isSystemActive
                  ? "All Systems Operational"
                  : "System Under Maintenance"}
              </div>
            </div>
          </div>

          {/* Links Col 2 - Support */}
          <div className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-primary" /> Support
            </h4>
            <ul className="space-y-3 ml-6">
              <li>
                <Link
                  href="/support/manual"
                  className="text-sm text-muted/75 hover:text-primary transition-colors"
                >
                  Manual
                </Link>
              </li>
              <li>
                <Link
                  href="/support/api"
                  className="text-sm text-muted/75 hover:text-primary transition-colors"
                >
                  API Reference
                </Link>
              </li>
              <li>
                <Link
                  href="/support/ai"
                  className="text-sm text-muted/75 hover:text-primary transition-colors"
                >
                  Chat With AI
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Col 3 - Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" /> Legal & Contact
            </h4>
            <ul className="space-y-3 ml-6">
              <li>
                <Link
                  href="/legal/privacy-policy"
                  className="text-sm text-muted/75 hover:text-primary transition-colors mt-2 block"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/terms-of-service"
                  className="text-sm text-muted/75 hover:text-primary transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="text-sm text-muted/75 transition-colors flex items-center gap-2"
                >
                  {/* <Mail className="h-3 w-3" /> */}
                  {SUPPORT_EMAIL}
                </Link>
              </li>
              <li>
                <span className="text-sm text-muted/75 transition-colors flex items-center gap-2">
                  {/* <PhoneCall className="h-3 w-3" />  */}
                  +251 09 98 87 76 65
                </span>
              </li>
            </ul>
          </div>

          {/* Links Col 1 - Platform */}
          <div className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              <Map className="h-4 w-4 text-primary" /> Platform
            </h4>
            <ul className="space-y-3 ml-6">
              <li>
                <Link
                  href="/"
                  className="text-sm text-muted/75 hover:text-primary transition-colors"
                >
                  Web Service
                </Link>
              </li>
              <li>
                <Link
                  href="/mobile-app"
                  className="text-sm text-muted/75 hover:text-primary transition-colors"
                >
                  Mobile App
                </Link>
                <div className="flex md:flex-col gap-4 mt-4">
                  <Link
                    href="#google-play-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Image
                      src="/images/google-play-badge.svg"
                      alt="Get it on Google Play"
                      width={162}
                      height={48}
                    />
                  </Link>
                  <Link
                    href="#app-store-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Image
                      src="/images/app-store-badge.svg"
                      alt="Download on the App Store"
                      width={143.6}
                      height={48}
                    />
                  </Link>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border/25 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted/70 text-center md:text-left">
            &copy; {new Date().getFullYear()}{" "}
            <Link href="https://www.astu.edu.et/">
              Adama Science and Technology University
            </Link>{" "}
            <em>2014 academic year students</em>
          </p>
        </div>
      </div>
    </footer>
  );
}
