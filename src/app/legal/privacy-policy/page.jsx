// src/app/privacy/page.jsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function PrivacyPolicyPage() {
  const lastUpdated = "April 1, 2026";

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{
        backgroundImage:
          'url("/images/pexels-lovetosmile-36200692-blurred-dim.jpg")',
      }}
    >
      <SiteHeader />
      <main className="container mx-auto px-4 py-8 max-w-4xl bg-accent rounded my-4">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
          <p className="">Last Updated: {lastUpdated}</p>
        </div>

        {/* Section 1: Who We Are */}
        <Card className="mb-6 bg-white/95 backdrop-blur-sm border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-black/90">1. Who We Are</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-black/80 leading-relaxed">
              ServeSync+ is a senior project developed by students of{" "}
              <strong>Adama Science and Technology University</strong>,
              Department of Computer Science and Engineering. The platform
              provides scheduling, progress tracking, and AI-integrated workflow
              management for sectors including healthcare, government services,
              automotive repair, and professional services.
            </p>
            <div className="bg-gray-100 p-4 rounded-lg mt-4">
              <p className=" font-medium text-black/90">Contact Information:</p>
              <p className=" text-gray-600">
                Adama Science & Technology University, Department of CSE, P.O.
                Box 1888, Adama, Ethiopia
              </p>
              <p className=" text-gray-600 mt-1">
                Email: privacy@servesyncplus.et | Phone: +251-11-554-3322
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Information We Collect */}
        <Card className="mb-6 bg-white/95 backdrop-blur-sm border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-black/90">
              2. Information We Collect
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-black/90 mb-2">
                Information You Provide
              </h3>
              <ul className="list-disc pl-5 space-y-1 text-black/80">
                <li>
                  <strong>Account information:</strong> Name, email, phone
                  number, organization details
                </li>
                <li>
                  <strong>Profile information:</strong> Preferences, job titles,
                  profile pictures
                </li>
                <li>
                  <strong>Service data:</strong> Appointment details, service
                  descriptions, progress updates, uploaded files
                </li>
                <li>
                  <strong>Payment information:</strong> Billing details (we
                  don't store full credit card numbers)
                </li>
                <li>
                  <strong>Communications:</strong> Chat logs and support
                  interactions
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-black/90 mb-2">
                Information Collected Automatically
              </h3>
              <ul className="list-disc pl-5 space-y-1 text-black/80">
                <li>
                  <strong>Usage data:</strong> Pages visited, features used,
                  time spent
                </li>
                <li>
                  <strong>Device information:</strong> IP address, browser type,
                  operating system
                </li>
                <li>
                  <strong>Location data:</strong> Approximate location from IP
                  address
                </li>
                <li>
                  <strong>Cookies:</strong> To remember preferences and keep you
                  logged in
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Section 3: How We Use Your Information */}
        <Card className="mb-6 bg-white/95 backdrop-blur-sm border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-black/90">
              3. How We Use Your Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2 text-black/80">
              <li>
                <strong>Provide and improve services:</strong> Process bookings,
                track progress, send notifications
              </li>
              <li>
                <strong>Enable multi-sector workflows:</strong> Share
                information with employees and AI agents
              </li>
              <li>
                <strong>Communicate with you:</strong> Send confirmations,
                reminders, and status updates
              </li>
              <li>
                <strong>AI integration:</strong> Allow AI agents to access
                service data for task handling
              </li>
              <li>
                <strong>Analytics and reporting:</strong> Generate anonymized
                insights for organizations
              </li>
              <li>
                <strong>Legal compliance:</strong> Fulfill legal obligations and
                enforce terms of service
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Section 4: Your Rights */}
        <Card className="mb-6 bg-white/95 backdrop-blur-sm border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-black/90">4. Your Rights</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2 text-black/80">
              <li>
                <strong>Access:</strong> Request a copy of your personal data
              </li>
              <li>
                <strong>Rectification:</strong> Correct inaccurate or incomplete
                data
              </li>
              <li>
                <strong>Erasure:</strong> Request deletion of your data (where
                legally possible)
              </li>
              <li>
                <strong>Restriction:</strong> Limit how we use your data
              </li>
              <li>
                <strong>Portability:</strong> Receive your data in a
                machine-readable format
              </li>
              <li>
                <strong>Objection:</strong> Object to processing based on
                legitimate interests
              </li>
            </ul>
            <div className="bg-gray-100 p-4 rounded-lg mt-4">
              <p className="text-black/90">
                To exercise your rights, contact us at{" "}
                <strong>privacy@servesyncplus.et</strong>. We will respond
                within 30 days.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Section 5: Contact Us */}
        <Card className="mb-6 bg-white/95 backdrop-blur-sm border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-black/90">5. Contact Us</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-black/80">
              <p>
                <strong>Email:</strong> privacy@servesyncplus.et
              </p>
              <p>
                <strong>Phone:</strong> +251-11-554-3322
              </p>
              <p>
                <strong>Address:</strong> Adama Science & Technology University,
                Department of CSE, P.O. Box 1888, Adama, Ethiopia
              </p>
              <p>
                <strong>Hours:</strong> Monday – Friday, 8:00 – 17:00 (EAT)
              </p>
            </div>
          </CardContent>
        </Card>
      </main>

      <SiteFooter />
    </div>
  );
}
