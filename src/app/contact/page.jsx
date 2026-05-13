// src/app/contact/page.jsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  AlertCircle,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Globe,
  MessageSquare,
  Bot,
  Headphones,
  Building2,
  Users,
  CalendarDays,
} from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Success response
    setSubmitStatus("success");
    setFormData({ name: "", email: "", subject: "", message: "" });
    setIsSubmitting(false);

    // Auto-hide success message after 5 seconds
    setTimeout(() => setSubmitStatus(null), 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/20">
      <SiteHeader />

      <main className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="border-indigo-200 text-indigo-700 bg-indigo-50/50 px-4 py-1.5 mb-4">
            <Headphones className="h-3.5 w-3.5 mr-1" />
            24/7 Support Available
          </Badge>
          <h1 className="text-4xl font-bold text-indigo-950 mb-3">Get in Touch</h1>
          <p className="text-indigo-600 max-w-2xl mx-auto">
            Have questions about ServeSync+? Our team (and AI agents) are ready to help you transform service delivery.
            We're here to answer your questions and help you get started.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Information Cards */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-indigo-100 shadow-sm">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-indigo-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-indigo-900">Email Us</h3>
                    <p className="text-sm text-indigo-600">support@servesyncplus.et</p>
                    <p className="text-sm text-indigo-600">privacy@servesyncplus.et</p>
                    <p className="text-sm text-indigo-600">legal@servesyncplus.et</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                    <Phone className="h-5 w-5 text-indigo-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-indigo-900">Call Us</h3>
                    <p className="text-sm text-indigo-600">+251-11-554-3322</p>
                    <p className="text-sm text-indigo-500">Available during business hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-indigo-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-indigo-900">Visit Us</h3>
                    <p className="text-sm text-indigo-600">
                      Adama Science & Technology University<br />
                      Department of Computer Science and Engineering<br />
                      P.O. Box 1888, Adama, Ethiopia
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-indigo-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-indigo-900">Business Hours</h3>
                    <p className="text-sm text-indigo-600">Monday – Friday: 8:00 – 17:00 (EAT)</p>
                    <p className="text-sm text-indigo-500">Saturday – Sunday: Closed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Assistant Card */}
            <Card className="border-indigo-100 bg-gradient-to-br from-indigo-50 to-indigo-100/30">
              <CardContent className="p-6 text-center">
                <div className="h-12 w-12 rounded-full bg-indigo-200 flex items-center justify-center mx-auto mb-3">
                  <Bot className="h-6 w-6 text-indigo-700" />
                </div>
                <h3 className="font-semibold text-indigo-900 mb-2">AI Assistant Available 24/7</h3>
                <p className="text-sm text-indigo-600 mb-4">
                  Our AI chatbot SyncBot is available 24/7 to answer your questions instantly.
                </p>
                <Button variant="outline" className="border-indigo-200 text-indigo-700 hover:bg-indigo-100">
                  <Bot className="h-4 w-4 mr-2" />
                  Chat with SyncBot
                </Button>
              </CardContent>
            </Card>

            {/* Social Media Links */}
            <Card className="border-indigo-100">
              <CardContent className="p-6">
                <h3 className="font-semibold text-indigo-900 mb-4 text-center">Follow Us</h3>
                <div className="flex justify-center gap-4">
                  <Button variant="outline" size="icon" className="rounded-full border-indigo-200 text-indigo-600 hover:bg-indigo-50">
                    <Facebook className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full border-indigo-200 text-indigo-600 hover:bg-indigo-50">
                    <Twitter className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full border-indigo-200 text-indigo-600 hover:bg-indigo-50">
                    <Linkedin className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full border-indigo-200 text-indigo-600 hover:bg-indigo-50">
                    <Instagram className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="border-indigo-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-indigo-900">Send us a Message</CardTitle>
                <CardDescription className="text-indigo-600">
                  Fill out the form below and we'll get back to you within 24 hours.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {submitStatus === "success" && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-800">Message Sent Successfully!</p>
                      <p className="text-sm text-green-700">We'll get back to you within 24 hours.</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <Label htmlFor="name" className="text-indigo-900 font-medium">
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="mt-1.5 border-indigo-200 focus:ring-indigo-400"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-indigo-900 font-medium">
                      Email Address <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="mt-1.5 border-indigo-200 focus:ring-indigo-400"
                    />
                  </div>

                  <div>
                    <Label htmlFor="subject" className="text-indigo-900 font-medium">
                      Subject <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="subject"
                      placeholder="What is this regarding?"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="mt-1.5 border-indigo-200 focus:ring-indigo-400"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-indigo-900 font-medium">
                      Message <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="message"
                      placeholder="Please provide details about your inquiry..."
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="mt-1.5 border-indigo-200 focus:ring-indigo-400 resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>

                <div className="mt-6 pt-6 border-t border-indigo-100">
                  <div className="flex items-center justify-center gap-2 text-xs text-indigo-500">
                    <Bot className="h-3.5 w-3.5" />
                    <span>Our AI agents read these messages too – we'll route it to the right team instantly.</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-indigo-950 text-center mb-8">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-indigo-100">
              <CardHeader>
                <CardTitle className="text-lg text-indigo-900">How quickly will I get a response?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-indigo-600">
                  We aim to respond to all inquiries within 24 hours during business days. For urgent matters, 
                  please call our support line directly.
                </p>
              </CardContent>
            </Card>
            <Card className="border-indigo-100">
              <CardHeader>
                <CardTitle className="text-lg text-indigo-900">Can I schedule a demo?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-indigo-600">
                  Absolutely! Fill out the contact form with "Demo Request" as the subject, and our team will 
                  reach out to schedule a personalized demo at your convenience.
                </p>
              </CardContent>
            </Card>
            <Card className="border-indigo-100">
              <CardHeader>
                <CardTitle className="text-lg text-indigo-900">Is there a phone number I can call?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-indigo-600">
                  Yes! You can reach us at <strong>+251-11-554-3322</strong> during business hours 
                  (Monday–Friday, 8:00 AM – 5:00 PM EAT).
                </p>
              </CardContent>
            </Card>
            <Card className="border-indigo-100">
              <CardHeader>
                <CardTitle className="text-lg text-indigo-900">Do you have a live chat option?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-indigo-600">
                  Yes! Look for the blue chat bubble in the bottom-right corner of your screen. Our AI assistant 
                  SyncBot is available 24/7 to help with common questions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16">
          <Card className="border-indigo-100 overflow-hidden">
            <CardHeader>
              <CardTitle className="text-xl text-indigo-900">Find Us</CardTitle>
              <CardDescription>Adama Science & Technology University Campus</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-64 bg-indigo-100 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-10 w-10 text-indigo-600 mx-auto mb-2" />
                  <p className="text-indigo-700 font-medium">Adama Science & Technology University</p>
                  <p className="text-indigo-600 text-sm">Department of Computer Science and Engineering</p>
                  <p className="text-indigo-500 text-sm">P.O. Box 1888, Adama, Ethiopia</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* <Chatbot /> */}
      </main>
      <SiteFooter />
    </div>
  );
}