// src/app/privacy/page.jsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Shield,
  Lock,
  Eye,
  Database,
  Mail,
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  Globe,
  Server,
  Cookie,
  Users,
  AlertCircle,
} from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function PrivacyPolicyPage() {
  const lastUpdated = "April 1, 2026";

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <div
        className="flex-1 bg-cover bg-center bg-fixed relative pb-20"
        style={{ backgroundImage: 'url("/images/pexels-lovetosmile-36200692-blurred-dim.jpg")' }}
      >
        <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-[2px] pointer-events-none z-0"></div>

        <main className="container relative z-10 mx-auto px-4 py-16 max-w-4xl" id="privacy-content">
          {/* Hero Section */}
          <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="inline-flex items-center justify-center h-20 w-20 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 mb-6 shadow-xl">
              <Shield className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 drop-shadow-md tracking-tight">Privacy Policy</h1>
            <p className="text-indigo-100 text-lg md:text-xl font-light mb-6">Last Updated: {lastUpdated}</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Badge variant="outline" className="border-indigo-300 text-indigo-100 bg-indigo-900/50 px-4 py-1.5 backdrop-blur-md shadow-lg text-sm">GDPR Compliant</Badge>
              <Badge variant="outline" className="border-indigo-300 text-indigo-100 bg-indigo-900/50 px-4 py-1.5 backdrop-blur-md shadow-lg text-sm">Ethiopia</Badge>
              <Badge variant="outline" className="border-indigo-300 text-indigo-100 bg-indigo-900/50 px-4 py-1.5 backdrop-blur-md shadow-lg text-sm">Secure</Badge>
            </div>
          </div>

          <div className="space-y-8">
            {/* Section 1: Who We Are */}
            <Card className="border-white/20 bg-white/95 backdrop-blur-xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 rounded-2xl overflow-hidden group">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100/50 pb-5 pt-6 px-8">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0 group-hover:bg-indigo-600 transition-colors duration-300">
                    <Globe className="h-6 w-6 text-indigo-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-indigo-950">1. Who We Are</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <p className="text-black text-lg leading-relaxed">
                  ServeSync+ is an ASTU senior project platform providing AI-integrated scheduling and workflow management.
                </p>
                <div className="bg-slate-100/50 p-5 rounded-xl mt-5 border border-slate-200/50">
                  <p className="text-lg font-semibold text-black">Contact Info:</p>
                  <p className="text-lg text-black mt-2">
                    ASTU, Dept. of CSE, P.O. Box 1888, Adama, Ethiopia<br />
                    Email: <a href="mailto:privacy@servesyncplus.et" className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors">privacy@servesyncplus.et</a><br />
                    Phone: <a href="tel:+251115543322" className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors">+251-11-554-3322</a>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Section 2: Information We Collect */}
            <Card className="border-white/20 bg-white/95 backdrop-blur-xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 rounded-2xl overflow-hidden group">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100/50 pb-5 pt-6 px-8">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0 group-hover:bg-indigo-600 transition-colors duration-300">
                    <Database className="h-6 w-6 text-indigo-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-indigo-950">2. Information We Collect</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-8 grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-indigo-900 mb-4">You Provide</h3>
                  <ul className="list-disc pl-5 space-y-2 text-black text-lg">
                    <li><strong>Account:</strong> Name, email, org details</li>
                    <li><strong>Profile:</strong> Preferences, photos</li>
                    <li><strong>Service Data:</strong> Appointments, files</li>
                    <li><strong>Payment:</strong> Billing info (no full CCs)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-indigo-900 mb-4">Collected Automatically</h3>
                  <ul className="list-disc pl-5 space-y-2 text-black text-lg">
                    <li><strong>Usage:</strong> Pages, features, time</li>
                    <li><strong>Device:</strong> IP, browser, OS</li>
                    <li><strong>Location:</strong> General via IP</li>
                    <li><strong>Cookies:</strong> For sessions & prefs</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Section 3: How We Use Your Information */}
            <Card className="border-white/20 bg-white/95 backdrop-blur-xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 rounded-2xl overflow-hidden group">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100/50 pb-5 pt-6 px-8">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0 group-hover:bg-indigo-600 transition-colors duration-300">
                    <Eye className="h-6 w-6 text-indigo-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-indigo-950">3. Usage & Sharing</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <p className="text-black text-lg mb-4 font-medium">We do not sell your personal info. Data is used/shared to:</p>
                <ul className="list-disc pl-5 space-y-3 text-black text-lg">
                  <li><strong>Provide Services:</strong> Process bookings, notify users, enable multi-sector workflows.</li>
                  <li><strong>AI Integration:</strong> Allow authorized AI agents to assist with tasks.</li>
                  <li><strong>With Partners:</strong> Share with bound third-party vendors for ops.</li>
                  <li><strong>Compliance:</strong> Fulfill legal obligations or during business transfers.</li>
                </ul>
              </CardContent>
            </Card>

            {/* Section 5: Data Security */}
            <Card className="border-white/20 bg-white/95 backdrop-blur-xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 rounded-2xl overflow-hidden group">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100/50 pb-5 pt-6 px-8">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0 group-hover:bg-indigo-600 transition-colors duration-300">
                    <Lock className="h-6 w-6 text-indigo-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-indigo-950">4. Security & Rights</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-8 grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-indigo-900 mb-4">Security Measures</h3>
                  <ul className="list-disc pl-5 space-y-2 text-black text-lg">
                    <li>Data encryption & HTTPS</li>
                    <li>Role-based access controls</li>
                    <li>Regular security audits</li>
                    <li>Offline-first local encryption</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-indigo-900 mb-4">Your Rights</h3>
                  <ul className="list-disc pl-5 space-y-2 text-black text-lg">
                    <li>Access & port data</li>
                    <li>Correct or erase data</li>
                    <li>Restrict or object to processing</li>
                    <li><a href="mailto:privacy@servesyncplus.et" className="text-blue-600 hover:text-blue-800 hover:underline font-medium">Contact us</a> to exercise rights</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Section 7: AI Agent Transparency */}
            <Card className="border-white/20 bg-white/95 backdrop-blur-xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 rounded-2xl overflow-hidden group">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100/50 pb-5 pt-6 px-8">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0 group-hover:bg-indigo-600 transition-colors duration-300">
                    <Server className="h-6 w-6 text-indigo-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-indigo-950">5. AI & Policies</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <ul className="list-disc pl-5 space-y-3 text-black text-lg">
                  <li><strong>AI Transparency:</strong> AI agents follow human access controls, access only needed data, and are clearly identified.</li>
                  <li><strong>Cookies:</strong> Used for sessions, prefs, and analytics. Manageable via browser.</li>
                  <li><strong>Children:</strong> Not intended for users under 16. We delete known child data.</li>
                  <li><strong>Updates:</strong> Significant policy changes will be notified via email or platform notice.</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      <SiteFooter />
    </div>
  );
}