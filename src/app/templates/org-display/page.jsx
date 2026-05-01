"use client";

import React from "react";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  Users,
  Award,
  Building2,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  ArrowLeft,
  CheckCircle,
  Wrench,
  Car,
  Battery,
  Wind,
  Droplet,
  Gauge,
  Shield,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Organization data (replace with real data)
const organizationData = {
  name: "Helen Automotive",
  logo: "https://placehold.co/200x200/2c3e50/ffffff?text=HA",
  tagline: "Trusted car service & maintenance",
  description:
    "Helen Automotive provides professional auto repair, maintenance, and diagnostic services. We serve both individual car owners and corporate fleets with fast, reliable service.",
  founded: "2015",
  employeeCount: "25+",
  clientsServed: "500+",
  address: {
    street: "Bole Road, near Atlas",
    city: "Addis Ababa",
    state: "Kirkos",
    zipCode: "1000",
    country: "Ethiopia",
  },
  contact: {
    phone: "+251 911 123 456",
    email: "info@helenauto.com",
    website: "https://www.helenauto.com",
  },
  social: {
    linkedin: "https://linkedin.com/company/helenauto",
    twitter: "https://twitter.com/helenauto",
    facebook: "https://facebook.com/helenauto",
    instagram: "https://instagram.com/helenauto",
  },
  operatingHours: {
    monday_friday: "8:00 AM – 6:00 PM",
    saturday: "9:00 AM – 4:00 PM",
    sunday: "Closed",
  },
  certifications: ["ASE Certified", "ISO 9001:2024", "Ethiopian Transport Award 2023"],
  services: [
    { name: "Oil Change & Tune-up", icon: Droplet, description: "Full synthetic oil, filter replacement, and engine check" },
    { name: "Brake Repair", icon: Car, description: "Pad replacement, rotor resurfacing, brake fluid flush" },
    { name: "Engine Diagnostics", icon: Gauge, description: "Computer scan, fault code analysis, performance test" },
    { name: "Tire Rotation & Alignment", icon: Wrench, description: "Even wear, balancing, and alignment adjustment" },
    { name: "Battery Replacement", icon: Battery, description: "Load test, new battery installation, terminal cleaning" },
    { name: "AC Service", icon: Wind, description: "Recharge, leak detection, cabin filter replacement" },
  ],
};

function OrganizationDisplayPage() {
  const org = organizationData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Cover – Automotive theme background image (clearly an automobile) */}
      <div className="relative w-full h-64 md:h-80 lg:h-96 overflow-hidden shadow-lg">
        {/* Background image – modern car in a professional auto repair shop */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=1600&h=600&fit=crop')`,
          }}
        />
        {/* Dark overlay for text contrast */}
        <div className="absolute inset-0 bg-black/50" />
        
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
          <div className="container mx-auto flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20 md:h-28 md:w-28 border-4 border-white shadow-xl">
                <AvatarImage src={org.logo} alt={org.name} />
                <AvatarFallback className="bg-primary text-white text-2xl">
                  {org.name.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl md:text-4xl font-bold drop-shadow-md">
                  {org.name}
                </h1>
                <p className="text-sm md:text-base text-white/90">{org.tagline}</p>
              </div>
            </div>
            <Button variant="secondary" size="sm" asChild className="shadow-md">
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-1" /> Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content (same as before – services as attractive cards, etc.) */}
      <div className="container mx-auto px-4 py-10 md:py-16">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Sidebar – Snapshot + Contact */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="shadow-md border-0 bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  Organization Snapshot
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Founded</span>
                  <span className="font-semibold">{org.founded}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Employees</span>
                  <span className="font-semibold">{org.employeeCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Clients served</span>
                  <span className="font-semibold">{org.clientsServed}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl">Contact & Location</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div className="text-sm">
                    <p>{org.address.street}</p>
                    <p>{org.address.city}, {org.address.state}</p>
                    <p>{org.address.zipCode}, {org.address.country}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <span className="text-sm">{org.contact.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <span className="text-sm break-all">{org.contact.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-primary" />
                  <a
                    href={org.contact.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    {org.contact.website.replace("https://", "")}
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl">Follow Us</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3 flex-wrap">
                  {org.social.linkedin && (
                    <Button variant="outline" size="icon" asChild className="rounded-full hover:bg-primary hover:text-white transition">
                      <a href={org.social.linkedin} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                  {org.social.twitter && (
                    <Button variant="outline" size="icon" asChild className="rounded-full hover:bg-primary hover:text-white transition">
                      <a href={org.social.twitter} target="_blank" rel="noopener noreferrer">
                        <Twitter className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                  {org.social.facebook && (
                    <Button variant="outline" size="icon" asChild className="rounded-full hover:bg-primary hover:text-white transition">
                      <a href={org.social.facebook} target="_blank" rel="noopener noreferrer">
                        <Facebook className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                  {org.social.instagram && (
                    <Button variant="outline" size="icon" asChild className="rounded-full hover:bg-primary hover:text-white transition">
                      <a href={org.social.instagram} target="_blank" rel="noopener noreferrer">
                        <Instagram className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column – All info */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <Card className="shadow-md border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl">About {org.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {org.description}
                </p>
              </CardContent>
            </Card>

            {/* SERVICES – Attractive cards */}
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Briefcase className="h-6 w-6 text-primary" />
                Our Services
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-5">
                {org.services.map((service, idx) => {
                  const IconComponent = service.icon;
                  return (
                    <div
                      key={idx}
                      className="group relative bg-white dark:bg-gray-900 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200 dark:border-gray-700 overflow-hidden"
                    >
                      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-primary-0 group-hover:w-2 transition-all duration-300" />
                      <CardContent className="p-5">
                        <div className="flex items-start gap-4">
                          <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                            <IconComponent className="h-6 w-6" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-1">{service.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {service.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Operating Hours */}
            <Card className="shadow-md border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Operating Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="font-medium">Monday – Friday</span>
                    <span>{org.operatingHours.monday_friday}</span>
                  </div>
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="font-medium">Saturday</span>
                    <span>{org.operatingHours.saturday}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Sunday</span>
                    <span className="text-muted-foreground">{org.operatingHours.sunday}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Certifications */}
            <Card className="shadow-md border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Certifications & Awards
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {org.certifications.map((cert, idx) => (
                    <Badge key={idx} variant="secondary" className="px-3 py-1.5 text-sm rounded-full shadow-sm">
                      {cert}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Location Map */}
            <Card className="shadow-md border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl">Our Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-full h-64 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700 rounded-lg flex items-center justify-center text-muted-foreground shadow-inner">
                  <div className="text-center">
                    <MapPin className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <p>Interactive map will be embedded here</p>
                    <p className="text-sm">{org.address.street}, {org.address.city}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrganizationDisplayPage;