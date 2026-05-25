// src/app/terms/page.jsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Scale } from "lucide-react";

export default function TermsOfServicePage() {
  const lastUpdated = "April 1, 2026";

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{
        backgroundImage:
          'url("/images/pexels-lovetosmile-36200692-blurred-dim.jpg")',
      }}
    >
      <div className="min-h-screen bg-black/50 backdrop-blur-[2px]">
        <SiteHeader />

        <main className="container mx-auto px-4 py-8 max-w-4xl bg-accent rounded my-4">
          {/* Hero Section */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
            <p className="">Last Updated: {lastUpdated}</p>
          </div>

          {/* Important Notice */}
          <Card className="mb-6 bg-yellow-50/95 backdrop-blur-sm border-none shadow-lg">
            <CardContent className="p-5">
              <div className="flex gap-3 items-start">
                <span className="text-yellow-700 text-lg">⚠️</span>
                <div>
                  <p className="font-semibold text-yellow-800">
                    Please Read Carefully
                  </p>
                  <p className="text-sm text-yellow-700">
                    By using ServeSync+, you agree to these terms. This is a
                    legally binding agreement between you and ServeSync+.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 1: Introduction */}
          <Card className="mb-6 bg-white/95 backdrop-blur-sm border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-gray-900">1. Introduction</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                Welcome to ServeSync+. These Terms of Service govern your use of
                our platform. By accessing or using ServeSync+, you agree to be
                bound by these Terms.
              </p>
              <p className="text-gray-700 leading-relaxed mt-3">
                ServeSync+ is a multi-sector service scheduling and progress
                tracking platform developed as a senior project at
                <strong> Adama Science and Technology University</strong>.
              </p>
            </CardContent>
          </Card>

          {/* Section 2: User Accounts */}
          <Card className="mb-6 bg-white/95 backdrop-blur-sm border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-gray-900">2. User Accounts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  2.1 Account Registration
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  <li>
                    You must provide accurate and complete information during
                    registration
                  </li>
                  <li>
                    You are responsible for maintaining the security of your
                    account
                  </li>
                  <li>You must be at least 16 years old to use the Services</li>
                  <li>
                    You may not share your account credentials with others
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  2.2 Account Types
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  <li>
                    <strong>Clients:</strong> Individuals seeking services from
                    organizations
                  </li>
                  <li>
                    <strong>Employees:</strong> Staff members who provide
                    services
                  </li>
                  <li>
                    <strong>Administrators:</strong> Organization
                    representatives who manage services and employees
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Section 3: Prohibited Activities */}
          <Card className="mb-6 bg-red-50/95 backdrop-blur-sm border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-red-800">
                3. Prohibited Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2 text-red-700">
                <li>
                  Using the Services for any illegal purpose or in violation of
                  Ethiopian law
                </li>
                <li>
                  Attempting to gain unauthorized access to other accounts or
                  systems
                </li>
                <li>
                  Uploading malicious code or interfering with service operation
                </li>
                <li>Impersonating another person or entity</li>
                <li>Using the Services to spam, harass, or harm others</li>
                <li>Reverse engineering or copying the platform's code</li>
              </ul>
            </CardContent>
          </Card>

          {/* Section 4: Limitation of Liability */}
          <Card className="mb-6 bg-white/95 backdrop-blur-sm border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-gray-900">
                4. Limitation of Liability
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                To the maximum extent permitted by law, ServeSync+ and its
                developers shall not be liable for any indirect, incidental,
                special, consequential, or punitive damages arising from your
                use of the Services.
              </p>
            </CardContent>
          </Card>

          {/* Section 5: Governing Law */}
          <Card className="mb-6 bg-white/95 backdrop-blur-sm border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-gray-900">5. Governing Law</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                These Terms shall be governed by the laws of the{" "}
                <strong>Federal Democratic Republic of Ethiopia</strong>. Any
                disputes shall be resolved in the courts of Adama, Ethiopia.
              </p>
            </CardContent>
          </Card>

          {/* Section 6: Contact Us */}
          <Card className="mb-6 bg-white/95 backdrop-blur-sm border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-gray-900">6. Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-gray-700">
                <p>
                  <strong>Email:</strong> legal@servesyncplus.et
                </p>
                <p>
                  <strong>Phone:</strong> +251-11-554-3322
                </p>
                <p>
                  <strong>Address:</strong> Adama Science & Technology
                  University, Department of CSE, P.O. Box 1888, Adama, Ethiopia
                </p>
              </div>
            </CardContent>
          </Card>
        </main>

        <SiteFooter />
      </div>
    </div>
  );
}
