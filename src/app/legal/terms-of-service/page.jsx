// src/app/terms/page.jsx
"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Scale,
  Shield,
  AlertTriangle,
  CheckCircle,
  Users,
  Building2,
  CreditCard,
  Mail,
  Phone,
  MapPin,
  Globe,
  Gavel,
  BookOpen,
  HelpCircle,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function TermsOfServicePage() {
  const lastUpdated = "April 1, 2026";
  const effectiveDate = "April 1, 2026";

  return (
    <div className="flex min-h-screen flex-col font-sans">
      <SiteHeader />

      <div 
        className="flex-1 bg-cover bg-center bg-fixed relative pb-20"
        style={{ backgroundImage: 'url("/images/pexels-lovetosmile-36200692-blurred-dim.jpg")' }}
      >
        <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-[2px] pointer-events-none z-0"></div>

        <main className="container relative z-10 mx-auto px-4 py-16 max-w-4xl" id="terms-content">
          {/* Hero Section */}
          <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="inline-flex items-center justify-center h-20 w-20 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 mb-6 shadow-xl">
              <Scale className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 drop-shadow-md tracking-tight">Terms of Service</h1>
            <p className="text-indigo-100 text-lg md:text-xl font-light mb-6">Last Updated: {lastUpdated} | Effective: {effectiveDate}</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Badge variant="outline" className="border-indigo-300 text-indigo-100 bg-indigo-900/50 px-4 py-1.5 backdrop-blur-md shadow-lg text-sm">Version 1.0</Badge>
              <Badge variant="outline" className="border-indigo-300 text-indigo-100 bg-indigo-900/50 px-4 py-1.5 backdrop-blur-md shadow-lg text-sm">Ethiopia</Badge>
              <Badge variant="outline" className="border-indigo-300 text-indigo-100 bg-indigo-900/50 px-4 py-1.5 backdrop-blur-md shadow-lg text-sm">Legally Binding</Badge>
            </div>
          </div>

          {/* Important Notice */}
          <Card className="mb-8 border-amber-200/50 bg-amber-50/95 backdrop-blur-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-2xl overflow-hidden group">
            <CardContent className="p-6">
              <div className="flex gap-4 items-start">
                <div className="p-2 bg-amber-100 rounded-full shrink-0">
                  <AlertTriangle className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-lg font-bold text-amber-900 mb-1">Please Read Carefully</p>
                  <p className="text-base text-black font-medium">By using ServeSync+, you agree to these terms. This is a legally binding agreement between you and ServeSync+.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-8">
            {/* Section 1 & 2: Intro & Acceptance */}
            <Card className="border-white/20 bg-white/95 backdrop-blur-xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 rounded-2xl overflow-hidden group">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100/50 pb-5 pt-6 px-8">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0 group-hover:bg-indigo-600 transition-colors duration-300">
                    <BookOpen className="h-6 w-6 text-indigo-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-indigo-950">1. Intro & Acceptance</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <p className="text-black text-lg leading-relaxed mb-4">
                  Welcome to ServeSync+ ("we," "our," or "us"). These Terms govern your use of our Services. ServeSync+ is an ASTU senior project platform connecting clients with organizations across sectors.
                </p>
                <p className="text-black text-lg leading-relaxed mb-4">
                  By creating an account or using our Services, you agree to be bound by these Terms. If representing an organization, you confirm authority to bind them.
                </p>
                <div className="bg-red-50 p-5 rounded-xl border border-red-200/50 flex gap-3 items-center">
                  <AlertTriangle className="h-5 w-5 text-red-600 shrink-0" />
                  <p className="text-red-800 text-base font-semibold">
                    If you do not agree to these Terms, you may not access or use the Services.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Section 3 & 4: Accounts & Service Usage */}
            <Card className="border-white/20 bg-white/95 backdrop-blur-xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 rounded-2xl overflow-hidden group">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100/50 pb-5 pt-6 px-8">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0 group-hover:bg-indigo-600 transition-colors duration-300">
                    <Users className="h-6 w-6 text-indigo-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-indigo-950">2. Accounts & Service Usage</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-8 grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-indigo-900 mb-4">User Accounts</h3>
                  <ul className="list-disc pl-5 space-y-2 text-black text-lg">
                    <li>Must provide accurate info and be 16+ years old.</li>
                    <li>Credentials must remain secure and unshared.</li>
                    <li><strong>Types:</strong> Clients, Employees (human/AI), Admins.</li>
                    <li>We reserve the right to suspend violating accounts.</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-indigo-900 mb-4">Service Delivery</h3>
                  <ul className="list-disc pl-5 space-y-2 text-black text-lg">
                    <li>Appointments subject to org availability/policies.</li>
                    <li>Progress updates/ETAs are estimates, not guarantees.</li>
                    <li>Orgs are responsible for their AI agents' outputs.</li>
                    <li>We don't train core models on your data without consent.</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Section 5: Payments and Fees */}
            <Card className="border-white/20 bg-white/95 backdrop-blur-xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 rounded-2xl overflow-hidden group">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100/50 pb-5 pt-6 px-8">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0 group-hover:bg-indigo-600 transition-colors duration-300">
                    <CreditCard className="h-6 w-6 text-indigo-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-indigo-950">3. Payments and Fees</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <p className="text-black text-lg mb-4 font-medium">All fees are in ETB, exclusive of taxes, processed via secure gateways. Auto-renew applies unless canceled.</p>
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full border-collapse bg-white">
                    <thead>
                      <tr className="bg-slate-100">
                        <th className="border-b border-slate-200 px-6 py-4 text-left text-base font-bold text-indigo-950">Plan</th>
                        <th className="border-b border-slate-200 px-6 py-4 text-left text-base font-bold text-indigo-950">Price (ETB/mo)</th>
                        <th className="border-b border-slate-200 px-6 py-4 text-left text-base font-bold text-indigo-950">Services</th>
                        <th className="border-b border-slate-200 px-6 py-4 text-left text-base font-bold text-indigo-950">Employees</th>
                      </tr>
                    </thead>
                    <tbody className="text-black text-lg">
                      <tr className="hover:bg-slate-50"><td className="border-b border-slate-100 px-6 py-3 font-medium">Free</td><td className="border-b border-slate-100 px-6 py-3">0</td><td className="border-b border-slate-100 px-6 py-3">1</td><td className="border-b border-slate-100 px-6 py-3">10 max</td></tr>
                      <tr className="hover:bg-slate-50"><td className="border-b border-slate-100 px-6 py-3 font-medium">Small Business</td><td className="border-b border-slate-100 px-6 py-3">1,000</td><td className="border-b border-slate-100 px-6 py-3">3</td><td className="border-b border-slate-100 px-6 py-3">30 max</td></tr>
                      <tr className="hover:bg-slate-50"><td className="border-b border-slate-100 px-6 py-3 font-medium">Medium Business</td><td className="border-b border-slate-100 px-6 py-3">3,000</td><td className="border-b border-slate-100 px-6 py-3">20</td><td className="border-b border-slate-100 px-6 py-3">200 max</td></tr>
                      <tr className="hover:bg-slate-50">                             <td className="px-6 py-3 font-medium">Large Business</td><td className="px-6 py-3">10,000</td><td className="px-6 py-3">100</td><td className="px-6 py-3">1000 max</td></tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Section 6: Prohibited & Legal */}
            <Card className="border-white/20 bg-white/95 backdrop-blur-xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 rounded-2xl overflow-hidden group">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100/50 pb-5 pt-6 px-8">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0 group-hover:bg-indigo-600 transition-colors duration-300">
                    <Gavel className="h-6 w-6 text-indigo-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-indigo-950">4. Legal & Restrictions</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <ul className="list-disc pl-5 space-y-3 text-black text-lg">
                  <li><strong>Prohibited:</strong> Illegal acts, unauthorized access, malicious code, impersonation, spam, or reverse engineering.</li>
                  <li><strong>Intellectual Property:</strong> We own ServeSync+ IP. You own your data but license us to host it.</li>
                  <li><strong>Warranties & Liability:</strong> Provided "as is" without guarantees. Liability capped at the amount paid in the last 12 months.</li>
                  <li><strong>Governing Law:</strong> Governed by the Federal Democratic Republic of Ethiopia. Disputes resolved in Adama courts.</li>
                  <li><strong>Changes:</strong> We may modify terms and will notify you of material changes.</li>
                </ul>
              </CardContent>
            </Card>

            {/* Section 12: Contact Information */}
            <Card className="border-white/20 bg-white/95 backdrop-blur-xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 rounded-2xl overflow-hidden group">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100/50 pb-5 pt-6 px-8">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0 group-hover:bg-indigo-600 transition-colors duration-300">
                    <HelpCircle className="h-6 w-6 text-indigo-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-indigo-950">5. Contact Information</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="bg-slate-100/50 p-6 rounded-xl border border-slate-200/50">
                  <p className="text-black text-lg mb-2">For questions about these Terms, contact our legal team:</p>
                  <p className="text-lg text-black">
                    Email: <a href="mailto:legal@servesyncplus.et" className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors">legal@servesyncplus.et</a><br/>
                    Phone: <a href="tel:+251115543322" className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors">+251-11-554-3322</a><br/>
                    Address: ASTU, Dept. of CSE, P.O. Box 1888, Adama, Ethiopia
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Footer Note */}
          <div className="text-center mt-16 pt-8 text-base text-white/80 border-t border-white/20">
            <p>© {new Date().getFullYear()} ServeSync+ – Adama Science & Technology University. All rights reserved.</p>
            <p className="mt-3">
              <Link href="/legal/privacy-policy" className="text-blue-300 hover:text-blue-200 hover:underline font-medium">Privacy Policy</Link>
              <span className="mx-3 opacity-50">|</span>
              <Link href="/legal/terms-of-service" className="text-blue-300 hover:text-blue-200 hover:underline font-medium">Terms of Service</Link>
            </p>
          </div>
        </main>
      </div>
      
      <SiteFooter />
    </div>
  );
}