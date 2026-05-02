// src/app/terms/page.jsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Scale,
  Shield,
  AlertTriangle,
  CheckCircle,
  Users,
  Building2,
  Clock,
  CreditCard,
  Bot,
  Mail,
  Phone,
  MapPin,
  Download,
  Printer,
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
    // <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/20">
    <div className="flex min-h-screen flex-col font-sans">
      <SiteHeader />

      <main className="container mx-auto px-4 py-12 max-w-4xl" id="terms-content">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-indigo-100 mb-4">
            <Scale className="h-8 w-8 text-indigo-700" />
          </div>
          <h1 className="text-4xl font-bold text-indigo-950 mb-2">Terms of Service</h1>
          <p className="text-indigo-600">Last Updated: {lastUpdated} | Effective: {effectiveDate}</p>
          <div className="flex gap-2 justify-center mt-4">
            <Badge variant="outline" className="border-indigo-200 text-indigo-700">Version 1.0</Badge>
            <Badge variant="outline" className="border-indigo-200 text-indigo-700">Ethiopia</Badge>
            <Badge variant="outline" className="border-indigo-200 text-indigo-700">Legally Binding</Badge>
          </div>
        </div>

        {/* Important Notice */}
        <Card className="mb-6 border-amber-200 bg-amber-50">
          <CardContent className="p-5">
            <div className="flex gap-3 items-start">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-800">Please Read Carefully</p>
                <p className="text-sm text-amber-700">By using ServeSync+, you agree to these terms. This is a legally binding agreement between you and ServeSync+.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 1: Introduction */}
        <Card className="mb-6 border-indigo-100">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-indigo-700" />
              </div>
              <CardTitle className="text-xl text-indigo-900">1. Introduction</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-indigo-700 leading-relaxed">
              Welcome to ServeSync+ ("we," "our," or "us"). These Terms of Service ("Terms") govern your use of our web and mobile applications, 
              APIs, and related services (collectively, the "Services"). By accessing or using ServeSync+, you agree to be bound by these Terms.
            </p>
            <p className="text-indigo-700 leading-relaxed mt-3">
              ServeSync+ is a multi-sector service scheduling and progress tracking platform developed as a senior project at 
              <strong> Adama Science and Technology University</strong>. The platform connects clients with service providers across 
              healthcare, government, automotive, and professional services sectors.
            </p>
          </CardContent>
        </Card>

        {/* Section 2: Acceptance of Terms */}
        <Card className="mb-6 border-indigo-100">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-indigo-700" />
              </div>
              <CardTitle className="text-xl text-indigo-900">2. Acceptance of Terms</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-indigo-700 leading-relaxed">
              By creating an account, accessing, or using our Services, you confirm that you have read, understood, and agree to be bound 
              by these Terms. If you are using the Services on behalf of an organization, you represent that you have authority to bind 
              that organization to these Terms.
            </p>
            <div className="bg-red-50 p-4 rounded-lg mt-4 border border-red-200">
              <p className="text-red-700 text-sm flex gap-2">
                <AlertTriangle className="h-4 w-4" />
                <span>If you do not agree to these Terms, you may not access or use the Services.</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Section 3: User Accounts */}
        <Card className="mb-6 border-indigo-100">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                <Users className="h-5 w-5 text-indigo-700" />
              </div>
              <CardTitle className="text-xl text-indigo-900">3. User Accounts</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-indigo-800 mb-2">3.1 Account Registration</h3>
              <ul className="list-disc pl-5 space-y-1 text-indigo-700">
                <li>You must provide accurate, current, and complete information during registration</li>
                <li>You are responsible for maintaining the security of your account credentials</li>
                <li>You must be at least 16 years old to use the Services</li>
                <li>You may not share your account credentials with others</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-indigo-800 mb-2">3.2 Account Types</h3>
              <ul className="list-disc pl-5 space-y-1 text-indigo-700">
                <li><strong>Clients:</strong> Individuals seeking services from organizations</li>
                <li><strong>Employees:</strong> Staff members (human or AI agents) who provide services</li>
                <li><strong>Administrators:</strong> Organization representatives who manage services and employees</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-indigo-800 mb-2">3.3 Account Termination</h3>
              <p className="text-indigo-700">
                We reserve the right to suspend or terminate accounts that violate these Terms or applicable laws. 
                You may delete your account at any time through your account settings.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Section 4: Service Usage */}
        <Card className="mb-6 border-indigo-100">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-indigo-700" />
              </div>
              <CardTitle className="text-xl text-indigo-900">4. Service Usage</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-indigo-800 mb-2">4.1 Scheduling and Appointments</h3>
              <ul className="list-disc pl-5 space-y-1 text-indigo-700">
                <li>Appointments are subject to availability and organization-specific policies</li>
                <li>Cancellation policies may vary by organization and service type</li>
                <li>We are not responsible for no-shows or late arrivals by either party</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-indigo-800 mb-2">4.2 Progress Tracking</h3>
              <ul className="list-disc pl-5 space-y-1 text-indigo-700">
                <li>Service status updates are provided in real-time based on staff input</li>
                <li>Estimated completion times are estimates and not guarantees</li>
                <li>We strive for accuracy but cannot guarantee real-time precision in all conditions</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-indigo-800 mb-2">4.3 AI Agents</h3>
              <ul className="list-disc pl-5 space-y-1 text-indigo-700">
                <li>Organizations may integrate AI agents to assist with service delivery</li>
                <li>AI agents are identified as such when interacting with clients</li>
                <li>Organizations are responsible for the actions and outputs of their AI agents</li>
                <li>We do not train our own models on your data without consent</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Section 5: Payments and Fees */}
        <Card className="mb-6 border-indigo-100">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-indigo-700" />
              </div>
              <CardTitle className="text-xl text-indigo-900">5. Payments and Fees</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-indigo-800 mb-2">5.1 Subscription Plans</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-indigo-50">
                      <th className="border border-indigo-200 px-4 py-2 text-left text-sm font-semibold text-indigo-800">Plan</th>
                      <th className="border border-indigo-200 px-4 py-2 text-left text-sm font-semibold text-indigo-800">Price (ETB/month)</th>
                      <th className="border border-indigo-200 px-4 py-2 text-left text-sm font-semibold text-indigo-800">Services</th>
                      <th className="border border-indigo-200 px-4 py-2 text-left text-sm font-semibold text-indigo-800">Employees</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td className="border border-indigo-200 px-4 py-2 text-indigo-700">Free</td><td className="border border-indigo-200 px-4 py-2 text-indigo-700">0</td><td className="border border-indigo-200 px-4 py-2 text-indigo-700">1</td><td className="border border-indigo-200 px-4 py-2 text-indigo-700">10 max</td></tr>
                    <tr><td className="border border-indigo-200 px-4 py-2 text-indigo-700">Small Business</td><td className="border border-indigo-200 px-4 py-2 text-indigo-700">1,000</td><td className="border border-indigo-200 px-4 py-2 text-indigo-700">3</td><td className="border border-indigo-200 px-4 py-2 text-indigo-700">30 max</td></tr>
                    <tr><td className="border border-indigo-200 px-4 py-2 text-indigo-700">Medium Business</td><td className="border border-indigo-200 px-4 py-2 text-indigo-700">3,000</td><td className="border border-indigo-200 px-4 py-2 text-indigo-700">20</td><td className="border border-indigo-200 px-4 py-2 text-indigo-700">200 max</td></tr>
                    <tr><td className="border border-indigo-200 px-4 py-2 text-indigo-700">Large Business</td><td className="border border-indigo-200 px-4 py-2 text-indigo-700">10,000</td><td className="border border-indigo-200 px-4 py-2 text-indigo-700">100</td><td className="border border-indigo-200 px-4 py-2 text-indigo-700">1000 max</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-indigo-800 mb-2">5.2 Payment Terms</h3>
              <ul className="list-disc pl-5 space-y-1 text-indigo-700">
                <li>All fees are in Ethiopian Birr (ETB) and are exclusive of taxes</li>
                <li>Payments are processed through secure third-party gateways</li>
                <li>Subscriptions auto-renew monthly unless canceled</li>
                <li>Refunds are handled on a case-by-case basis</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Section 6: Prohibited Activities */}
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-red-700" />
              </div>
              <CardTitle className="text-xl text-red-800">6. Prohibited Activities</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2 text-red-700">
              <li>Using the Services for any illegal purpose or in violation of Ethiopian law</li>
              <li>Attempting to gain unauthorized access to other accounts or systems</li>
              <li>Uploading malicious code or interfering with service operation</li>
              <li>Impersonating another person or entity</li>
              <li>Using the Services to spam, harass, or harm others</li>
              <li>Reverse engineering or copying the platform's code</li>
              <li>Using AI agents in ways that violate applicable laws or regulations</li>
            </ul>
          </CardContent>
        </Card>

        {/* Section 7: Intellectual Property */}
        <Card className="mb-6 border-indigo-100">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                <Shield className="h-5 w-5 text-indigo-700" />
              </div>
              <CardTitle className="text-xl text-indigo-900">7. Intellectual Property</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2 text-indigo-700">
              <li><strong>Our IP:</strong> The ServeSync+ platform, logo, and content are owned by us and protected by Ethiopian and international intellectual property laws</li>
              <li><strong>Your IP:</strong> You retain ownership of your data and content. You grant us a license to host and process your data to provide the Services</li>
              <li><strong>Feedback:</strong> Any suggestions or feedback you provide may be used without compensation or obligation</li>
            </ul>
          </CardContent>
        </Card>

        {/* Section 8: Limitation of Liability */}
        <Card className="mb-6 border-indigo-100">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                <Gavel className="h-5 w-5 text-indigo-700" />
              </div>
              <CardTitle className="text-xl text-indigo-900">8. Limitation of Liability</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-indigo-700 leading-relaxed">
              To the maximum extent permitted by law, ServeSync+ and its developers shall not be liable for any indirect, incidental, 
              special, consequential, or punitive damages, including loss of profits, data, or goodwill, arising from your use of the Services.
            </p>
            <p className="text-indigo-700 leading-relaxed mt-3">
              Our total liability shall not exceed the amount you paid us (if any) in the 12 months preceding the claim.
            </p>
          </CardContent>
        </Card>

        {/* Section 9: Disclaimer of Warranties */}
        <Card className="mb-6 border-indigo-100">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-indigo-700" />
              </div>
              <CardTitle className="text-xl text-indigo-900">9. Disclaimer of Warranties</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-indigo-700 leading-relaxed">
              The Services are provided "as is" and "as available" without warranties of any kind, either express or implied. 
              We do not guarantee that the Services will be uninterrupted, error-free, or secure.
            </p>
          </CardContent>
        </Card>

        {/* Section 10: Governing Law */}
        <Card className="mb-6 border-indigo-100">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                <Globe className="h-5 w-5 text-indigo-700" />
              </div>
              <CardTitle className="text-xl text-indigo-900">10. Governing Law</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-indigo-700 leading-relaxed">
              These Terms shall be governed by the laws of the <strong>Federal Democratic Republic of Ethiopia</strong>. 
              Any disputes arising under these Terms shall be resolved in the courts of Adama, Ethiopia.
            </p>
          </CardContent>
        </Card>

        {/* Section 11: Changes to Terms */}
        <Card className="mb-6 border-indigo-100">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                <Clock className="h-5 w-5 text-indigo-700" />
              </div>
              <CardTitle className="text-xl text-indigo-900">11. Changes to Terms</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-indigo-700 leading-relaxed">
              We may modify these Terms at any time. We will notify you of material changes via email or through the platform. 
              Your continued use after changes constitutes acceptance of the revised Terms.
            </p>
          </CardContent>
        </Card>

        {/* Section 12: Contact Information */}
        <Card className="mb-6 border-indigo-200 bg-indigo-50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-indigo-200 flex items-center justify-center">
                <HelpCircle className="h-5 w-5 text-indigo-700" />
              </div>
              <CardTitle className="text-xl text-indigo-900">12. Contact Information</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-indigo-800">
              <p className="flex items-center gap-2"><Mail className="h-4 w-4" /> Email: legal@servesyncplus.et</p>
              <p className="flex items-center gap-2"><Phone className="h-4 w-4" /> Phone: +251-11-554-3322</p>
              <p className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Address: Adama Science & Technology University, Department of CSE, P.O. Box 1888, Adama, Ethiopia</p>
            </div>
            <div className="mt-4 pt-4 border-t border-indigo-200">
              <p className="text-sm text-indigo-600">
                For questions about these Terms, please contact our legal team at the email above.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-indigo-400 border-t border-indigo-100 pt-6">
          <p>© {new Date().getFullYear()} ServeSync+ – Adama Science & Technology University. All rights reserved.</p>
          <p className="mt-2 text-xs">
            <Link href="/privacy" className="hover:underline">Privacy Policy</Link> | 
            <Link href="/terms" className="hover:underline ml-2">Terms of Service</Link>
          </p>
        </div>
      </main>
      
      <SiteFooter />
    </div>
  );
}