// app/organization/page.jsx
import {
  Building2,
  CalendarDays,
  CheckCircle,
  Globe,
  Mail,
  MapPin,
  Phone,
  Star,
  Twitter,
  Facebook,
  Linkedin,
  Instagram,
  Award,
  Users,
  Clock,
  ArrowRight,
} from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function OrganizationPage() {
  // Organization data (replace with your actual data)
  const organization = {
    name: 'ServeSync+',
    tagline: 'Connecting Services, Empowering Communities',
    description:
      'ServeSync+ is a leading service integration platform dedicated to bridging the gap between service providers and clients. Founded in 2020, we have grown into a trusted network of over 500+ professionals across 30+ cities.',
    founded: '2020',
    headquarters: 'San Francisco, CA',
    employees: '120+',
    mission:
      'To create seamless connections between people and essential services through innovative technology and human-centric approach.',
    vision:
      'A world where every service need is met with efficiency, transparency, and care.',
    stats: [
      { label: 'Clients Served', value: '10K+', icon: Users },
      { label: 'Service Partners', value: '500+', icon: Building2 },
      { label: 'Projects Completed', value: '15K+', icon: CheckCircle },
      { label: 'Years of Excellence', value: '5+', icon: Award },
    ],
    services: [
      {
        title: 'Consultation',
        description:
          'Expert guidance to help you navigate service options and make informed decisions.',
        icon: Star,
      },
      {
        title: 'Integration',
        description:
          'Seamless integration of multiple service platforms into a unified experience.',
        icon: Globe,
      },
      {
        title: 'Support',
        description:
          '24/7 dedicated support team to assist with any questions or issues.',
        icon: Clock,
      },
    ],
    team: [
      {
        name: 'Sarah Johnson',
        role: 'CEO & Founder',
        bio: 'Former tech executive with 15+ years of experience in service innovation.',
      },
      {
        name: 'Michael Chen',
        role: 'CTO',
        bio: 'Tech leader specializing in scalable platforms and AI integration.',
      },
      {
        name: 'Elena Rodriguez',
        role: 'Head of Operations',
        bio: 'Operations expert focused on delivering exceptional client experiences.',
      },
    ],
    contact: {
      email: 'hello@servesync.com',
      phone: '+1 (555) 123-4567',
      address: '123 Market Street, Suite 400, San Francisco, CA 94103',
      social: {
        twitter: 'https://twitter.com/servesync',
        linkedin: 'https://linkedin.com/company/servesync',
        facebook: 'https://facebook.com/servesync',
        instagram: 'https://instagram.com/servesync',
      },
    },
    achievements: [
      'Best Service Platform 2023 - TechCrunch',
      'Customer Satisfaction Award 2024',
      'Fastest Growing Startup - Forbes',
    ],
  }

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Header with Navigation */}
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-orange-500" />
            <span className="font-bold text-lg">ServeSync+</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link className="text-sm font-medium hover:text-primary transition-colors" href="/">
              Home
            </Link>
            <Link
              className="text-sm font-medium hover:text-primary transition-colors"
              href="/organization"
            >
              Organization
            </Link>
            <Link className="text-sm font-medium hover:text-primary transition-colors" href="/components">
              Components
            </Link>
            <Link className="text-sm font-medium hover:text-primary transition-colors" href="/contact">
              Contact
            </Link>
          </nav>
          <Button variant="outline" size="sm" asChild>
            <Link href="/contact">Get in Touch</Link>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-background to-background py-20 md:py-28">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <Badge className="mb-4 bg-orange-100 text-orange-800 hover:bg-orange-100 border-orange-200">
                Established {organization.founded}
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">
                {organization.name}
              </h1>
              <p className="text-xl text-muted-foreground mb-6">{organization.tagline}</p>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {organization.description}
              </p>
              <div className="flex flex-wrap gap-4 justify-center mt-8">
                <Button size="lg" className="gap-2">
                  Learn More <ArrowRight className="h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline">
                  Contact Us
                </Button>
              </div>
            </div>
          </div>
          <div className="absolute top-20 left-10 w-72 h-72 bg-orange-200/20 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-orange-300/10 rounded-full blur-3xl" />
        </section>

        {/* Stats Section */}
        <section className="py-16 border-y">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {organization.stats.map((stat, idx) => {
                const Icon = stat.icon
                return (
                  <div key={idx} className="text-center space-y-2">
                    <div className="flex justify-center">
                      <div className="p-3 rounded-full bg-orange-100 text-orange-600">
                        <Icon className="h-6 w-6" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-l-4 border-l-orange-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-orange-500" />
                    Our Mission
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{organization.mission}</p>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-orange-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-orange-500" />
                    Our Vision
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{organization.vision}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">What We Offer</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Comprehensive solutions tailored to meet your service needs
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {organization.services.map((service, idx) => {
                const Icon = service.icon
                return (
                  <Card key={idx} className="group hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <div className="mb-4 inline-flex p-3 rounded-lg bg-orange-100 text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors w-fit">
                        <Icon className="h-6 w-6" />
                      </div>
                      <CardTitle>{service.title}</CardTitle>
                      <CardDescription>{service.description}</CardDescription>
                    </CardHeader>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Leadership Team</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Meet the passionate people driving our mission forward
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {organization.team.map((member, idx) => (
                <Card key={idx} className="text-center overflow-hidden">
                  <div className="relative h-64 w-full bg-muted">
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-200">
                      <Avatar className="h-32 w-32 border-4 border-background">
                        <AvatarFallback className="text-4xl bg-orange-500 text-white">
                          {member.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle>{member.name}</CardTitle>
                    <CardDescription>{member.role}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{member.bio}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Achievements & Contact Tabs */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="achievements" className="max-w-3xl mx-auto">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="achievements">Achievements</TabsTrigger>
                <TabsTrigger value="contact">Contact Information</TabsTrigger>
              </TabsList>
              <TabsContent value="achievements" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recognitions & Awards</CardTitle>
                    <CardDescription>
                      We take pride in the milestones we've achieved
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {organization.achievements.map((achievement, idx) => (
                        <li key={idx} className="flex items-center gap-3">
                          <Award className="h-5 w-5 text-orange-500" />
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="contact" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Get in Touch</CardTitle>
                    <CardDescription>
                      Reach out to us through any of these channels
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-orange-500" />
                      <span>{organization.contact.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-orange-500" />
                      <span>{organization.contact.phone}</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-orange-500 mt-0.5" />
                      <span>{organization.contact.address}</span>
                    </div>
                    <Separator />
                    <div className="flex gap-4 pt-2">
                      <Button variant="outline" size="icon" asChild>
                        <Link href={organization.contact.social.twitter} target="_blank">
                          <Twitter className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="outline" size="icon" asChild>
                        <Link href={organization.contact.social.linkedin} target="_blank">
                          <Linkedin className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="outline" size="icon" asChild>
                        <Link href={organization.contact.social.facebook} target="_blank">
                          <Facebook className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="outline" size="icon" asChild>
                        <Link href={organization.contact.social.instagram} target="_blank">
                          <Instagram className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" asChild>
                      <Link href={`mailto:${organization.contact.email}`}>Send an Email</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-muted-foreground">
                Everything you need to know about working with us
              </p>
            </div>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>What services does ServeSync+ offer?</AccordionTrigger>
                <AccordionContent>
                  We offer consultation, integration, and 24/7 support services tailored to
                  connect service providers with clients efficiently. Our platform handles
                  everything from initial discovery to final delivery.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>How can I partner with ServeSync+?</AccordionTrigger>
                <AccordionContent>
                  You can reach out through our contact form or email us directly at{' '}
                  {organization.contact.email}. Our partnership team will guide you through the
                  onboarding process.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>What areas do you serve?</AccordionTrigger>
                <AccordionContent>
                  Currently we serve 30+ major cities across the country, with plans for
                  international expansion in the coming year.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-16 bg-gradient-to-r from-orange-600 to-orange-500 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to work with us?</h2>
            <p className="text-orange-100 mb-6 max-w-2xl mx-auto">
              Join hundreds of satisfied clients who trust ServeSync+ for their service needs
            </p>
            <Button size="lg" variant="secondary" className="bg-white text-orange-600 hover:bg-orange-50">
              Get Started Today
            </Button>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t py-12">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Globe className="h-5 w-5 text-orange-500" />
                  <span className="font-bold">ServeSync+</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Connecting services, empowering communities since 2020.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <Link href="/" className="hover:text-primary transition-colors">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link href="/organization" className="hover:text-primary transition-colors">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="hover:text-primary transition-colors">
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Resources</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <Link href="#" className="hover:text-primary transition-colors">
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-primary transition-colors">
                      Help Center
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-primary transition-colors">
                      Privacy Policy
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Legal</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <Link href="#" className="hover:text-primary transition-colors">
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-primary transition-colors">
                      Cookie Policy
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <Separator className="my-8" />
            <div className="text-center text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} ServeSync+. All rights reserved.
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}