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
  FileText,
  Download,
  Printer,
  CheckCircle,
  Globe,
  Server,
  Cookie,
  Users,
  Briefcase,
  CalendarDays,
  AlertCircle,
} from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function PrivacyPolicyPage() {
  const lastUpdated = "April 1, 2026";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/20">
      <SiteHeader />

      <main className="container mx-auto px-4 py-12 max-w-4xl" id="privacy-content">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-indigo-100 mb-4">
            <Shield className="h-8 w-8 text-indigo-700" />
          </div>
          <h1 className="text-4xl font-bold text-indigo-950 mb-2">Privacy Policy</h1>
          <p className="text-indigo-600">Last Updated: {lastUpdated}</p>
          <div className="flex gap-2 justify-center mt-4">
            <Badge variant="outline" className="border-indigo-200 text-indigo-700">GDPR Compliant</Badge>
            <Badge variant="outline" className="border-indigo-200 text-indigo-700">Ethiopia</Badge>
            <Badge variant="outline" className="border-indigo-200 text-indigo-700">Secure</Badge>
          </div>
        </div>

        {/* Section 1: Who We Are */}
        <Card className="mb-6 border-indigo-100">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                <Globe className="h-5 w-5 text-indigo-700" />
              </div>
              <CardTitle className="text-xl text-indigo-900">1. Who We Are</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-indigo-700 leading-relaxed">
              ServeSync+ is a senior project developed by students of <strong>Adama Science and Technology University</strong>, 
              Department of Computer Science and Engineering. The platform provides scheduling, progress tracking, 
              and AI-integrated workflow management for sectors including healthcare, government services, 
              automotive repair, and professional services.
            </p>
            <div className="bg-indigo-50 p-4 rounded-lg mt-4">
              <p className="text-sm font-medium text-indigo-800">Contact Information:</p>
              <p className="text-sm text-indigo-600">Adama Science & Technology University, Department of CSE, P.O. Box 1888, Adama, Ethiopia</p>
              <p className="text-sm text-indigo-600 mt-1">Email: privacy@servesyncplus.et | Phone: +251-11-554-3322</p>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Information We Collect */}
        <Card className="mb-6 border-indigo-100">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                <Database className="h-5 w-5 text-indigo-700" />
              </div>
              <CardTitle className="text-xl text-indigo-900">2. Information We Collect</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-indigo-800 mb-2">Information You Provide</h3>
              <ul className="list-disc pl-5 space-y-1 text-indigo-700">
                <li><strong>Account information:</strong> Name, email, phone number, organization details</li>
                <li><strong>Profile information:</strong> Preferences, job titles, profile pictures</li>
                <li><strong>Service data:</strong> Appointment details, service descriptions, progress updates, uploaded files</li>
                <li><strong>Payment information:</strong> Billing details (we don't store full credit card numbers)</li>
                <li><strong>Communications:</strong> Chat logs and support interactions</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-indigo-800 mb-2">Information Collected Automatically</h3>
              <ul className="list-disc pl-5 space-y-1 text-indigo-700">
                <li><strong>Usage data:</strong> Pages visited, features used, time spent</li>
                <li><strong>Device information:</strong> IP address, browser type, operating system</li>
                <li><strong>Location data:</strong> Approximate location from IP address</li>
                <li><strong>Cookies:</strong> To remember preferences and keep you logged in</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Section 3: How We Use Your Information */}
        <Card className="mb-6 border-indigo-100">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                <Eye className="h-5 w-5 text-indigo-700" />
              </div>
              <CardTitle className="text-xl text-indigo-900">3. How We Use Your Information</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2 text-indigo-700">
              <li><strong>Provide and improve services:</strong> Process bookings, track progress, send notifications</li>
              <li><strong>Enable multi-sector workflows:</strong> Share information with employees and AI agents</li>
              <li><strong>Communicate with you:</strong> Send confirmations, reminders, and status updates</li>
              <li><strong>AI integration:</strong> Allow AI agents to access service data for task handling</li>
              <li><strong>Analytics and reporting:</strong> Generate anonymized insights for organizations</li>
              <li><strong>Legal compliance:</strong> Fulfill legal obligations and enforce terms of service</li>
            </ul>
          </CardContent>
        </Card>

        {/* Section 4: Data Sharing */}
        <Card className="mb-6 border-indigo-100">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                <Users className="h-5 w-5 text-indigo-700" />
              </div>
              <CardTitle className="text-xl text-indigo-900">4. Data Sharing and Disclosure</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-indigo-700 mb-3">We do not sell your personal information. We may share your data in these limited circumstances:</p>
            <ul className="list-disc pl-5 space-y-2 text-indigo-700">
              <li><strong>Within your organization:</strong> Information shared with administrators and employees as needed</li>
              <li><strong>With service providers:</strong> Third-party vendors bound by data protection agreements</li>
              <li><strong>AI agents:</strong> Authorized AI agents may access service data to perform tasks</li>
              <li><strong>Legal requirements:</strong> If required by law, regulation, or legal process</li>
              <li><strong>Business transfers:</strong> In the event of a merger, acquisition, or sale of assets</li>
            </ul>
          </CardContent>
        </Card>

        {/* Section 5: Data Security */}
        <Card className="mb-6 border-indigo-100">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                <Lock className="h-5 w-5 text-indigo-700" />
              </div>
              <CardTitle className="text-xl text-indigo-900">5. Data Security</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2 text-indigo-700">
              <li>Encryption of sensitive data (passwords are hashed, health data is encrypted at rest)</li>
              <li>Secure HTTPS connections for all communications</li>
              <li>Role-based access controls for authorized users only</li>
              <li>Regular security assessments and updates</li>
              <li>Offline-first queues with local encryption when necessary</li>
            </ul>
          </CardContent>
        </Card>

        {/* Section 6: Your Rights */}
        <Card className="mb-6 border-indigo-100">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-indigo-700" />
              </div>
              <CardTitle className="text-xl text-indigo-900">6. Your Rights</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2 text-indigo-700">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Rectification:</strong> Correct inaccurate or incomplete data</li>
              <li><strong>Erasure:</strong> Request deletion of your data (where legally possible)</li>
              <li><strong>Restriction:</strong> Limit how we use your data</li>
              <li><strong>Portability:</strong> Receive your data in a machine-readable format</li>
              <li><strong>Objection:</strong> Object to processing based on legitimate interests</li>
            </ul>
            <div className="bg-indigo-50 p-4 rounded-lg mt-4">
              <p className="text-indigo-800">To exercise your rights, contact us at <strong>privacy@servesyncplus.et</strong>. We will respond within 30 days.</p>
            </div>
          </CardContent>
        </Card>

        {/* Section 7: AI Agent Transparency */}
        <Card className="mb-6 border-indigo-100">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                <Server className="h-5 w-5 text-indigo-700" />
              </div>
              <CardTitle className="text-xl text-indigo-900">7. AI Agent Transparency</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2 text-indigo-700">
              <li>AI agents are bound by the same access controls as human employees</li>
              <li>They only access data necessary for their assigned tasks</li>
              <li>Interactions may be logged for training and improvement (anonymized where possible)</li>
              <li>AI agents are clearly identified when interacting with clients</li>
            </ul>
          </CardContent>
        </Card>

        {/* Section 8: Cookies */}
        <Card className="mb-6 border-indigo-100">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                <Cookie className="h-5 w-5 text-indigo-700" />
              </div>
              <CardTitle className="text-xl text-indigo-900">8. Cookies and Tracking</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-indigo-700">We use cookies to:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-indigo-700">
              <li>Keep you logged in during your session</li>
              <li>Remember your preferences and settings</li>
              <li>Analyze how you use our platform to improve user experience</li>
            </ul>
            <p className="text-indigo-700 mt-3">You can manage cookie settings in your browser preferences.</p>
          </CardContent>
        </Card>

        {/* Section 9: Children's Privacy */}
        <Card className="mb-6 border-indigo-100">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-indigo-700" />
              </div>
              <CardTitle className="text-xl text-indigo-900">9. Children's Privacy</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-indigo-700">
              ServeSync+ is not intended for users under the age of 16. We do not knowingly collect data from children. 
              If you believe a child has provided us with personal information, please contact us so we can delete it.
            </p>
          </CardContent>
        </Card>

        {/* Section 10: Changes to This Policy */}
        <Card className="mb-6 border-indigo-100">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                <Clock className="h-5 w-5 text-indigo-700" />
              </div>
              <CardTitle className="text-xl text-indigo-900">10. Changes to This Policy</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-indigo-700">
              We may update this Privacy Policy from time to time. We will notify you of significant changes via email 
              or a prominent notice on our platform. The "Last Updated" date at the top indicates when this policy was 
              last revised. Your continued use of ServeSync+ after changes constitutes acceptance of the revised policy.
            </p>
          </CardContent>
        </Card>

        {/* Section 11: Contact Us */}
        <Card className="mb-6 border-indigo-100 bg-indigo-50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-indigo-200 flex items-center justify-center">
                <Mail className="h-5 w-5 text-indigo-700" />
              </div>
              <CardTitle className="text-xl text-indigo-900">11. Contact Us</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-indigo-800">
              <p className="flex items-center gap-2"><Mail className="h-4 w-4" /> Email: privacy@servesyncplus.et</p>
              <p className="flex items-center gap-2"><Phone className="h-4 w-4" /> Phone: +251-11-554-3322</p>
              <p className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Address: Adama Science & Technology University, Department of CSE, P.O. Box 1888, Adama, Ethiopia</p>
              <p className="flex items-center gap-2"><Clock className="h-4 w-4" /> Hours: Monday – Friday, 8:00 – 17:00 (EAT)</p>
            </div>
          </CardContent>
        </Card>

        {/* Footer Note */}
        <div className="text-center mt-8 text-sm text-indigo-400 border-t border-indigo-100 pt-6">
          <p>© {new Date().getFullYear()} ServeSync+ – Adama Science & Technology University. All rights reserved.</p>
        </div>
      </main>
      
      <SiteFooter />
    </div>
  );
}