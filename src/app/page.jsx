import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

import {
  CalendarDaysIcon,
  ClockIcon,
  Activity,
  ArrowRightIcon,
  AlertTriangleIcon,
  BotIcon,
  BellIcon,
  LayoutDashboardIcon,
  GlobeIcon,
  Building2Icon,
  UsersIcon,
  UserCheckIcon,
  ShieldCheckIcon,
  SmartphoneIcon,
  ServerIcon,
  DatabaseIcon,
} from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WorkflowAnimation } from "@/components/workflow-animation";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EthiopianCalendar } from "@/components/ui/ethiopian-calendar";
import React from "react";
import Link from "next/link";

const solutions = [
  {
    title: "Flexible Online Booking",
    description:
      "Clients can easily book appointments across different sectors—from a 15-minute clinic visit to a multi-day car repair—with real-time availability.",
    icon: CalendarDaysIcon,
  },
  {
    title: "Complete Service Transparency",
    description:
      "Track service status just like a package delivery. Clients, staff, and admins always know the current stage: Scheduled, In Progress, Quality Check, Completed.",
    icon: Activity,
  },
  {
    title: "Dynamic Workflow",
    description:
      "Service workflow is decided dynamically by the current employee. Current handling employee decides which employee to reassign the task to. No workflow definition is required.",
    icon: BotIcon,
  },
  {
    title: "Real-Time Notifications",
    description:
      "Automated in-app alerts keep clients informed at every stage of their service journey, reducing anxiety and the need for follow-up calls.",
    icon: BellIcon,
  },
  {
    title: "Built for Ethiopia",
    description:
      "Local servers and Payment methods like Chappa for fast system access and local online payment support. Includes an Ethiopian Calendar for date selection and is specifically designed to work seamlessly with local infrastructure needs.",
    icon: GlobeIcon,
  },
  {
    title: "Client & Staff Portals",
    description:
      "Dedicated interfaces for clients to book and track services, and for staff to manage their daily tasks and service queues efficiently.",
    icon: UsersIcon,
  },
  {
    title: "Unified Dashboard",
    description:
      "A single pane of glass for managers to monitor all services across all sectors. Track KPIs, service quality, and operational efficiency in real-time.",
    icon: LayoutDashboardIcon,
  },
  // {
  //   title: "Compliance & Audit Trails",
  //   description:
  //     "Maintain detailed logs of all services, changes, and actions for compliance purposes. Every step is tracked and auditable.",
  //   icon: ShieldCheckIcon,
  // },
  {
    title: "Data Analytics & Insights",
    description:
      "Powerful analytics tools to help you understand your service patterns, identify trends, and make data-driven decisions to improve your operations.",
    icon: DatabaseIcon,
  },
];

const startMonth = new Date();
const endMonth = new Date(Date.now() + 5 * 365.25 * 24 * 60 * 60 * 1000);

export default function Page() {
  // const [dates, setDates] = React.useState([new Date()]);

  return (
    <div className="flex min-h-screen flex-col font-sans">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section
          className="relative bg-cover bg-center py-24 px-6"
          style={{
            backgroundImage: 'url("/images/pexels-lovetosmile-36200692.jpg")',
            // 'url("https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=100")',
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/70 z-0" />

          <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center justify-center">
            {/* Left Content */}
            <div className=" text-white">
              {/* <div className="inline-block mb-4 px-5 py-2 rounded bg-primary text-primary-foreground font-semibold shadow-md shadow-primary/30 text-sm">
                One of the Best Scheduling Platforms in Ethiopia
              </div> */}

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-0 drop-shadow-lg">
                Unified Scheduling for{" "}
                <span className="text-primary drop-shadow-lg">
                  Every Service Sector
                </span>
              </h1>

              <p className="text-lg transform  py-2 w-auto text-primary-foreground font-bold uppercase leading-relaxed mb-4 shadow">
                Save your time and money
              </p>

              <p className="text-lg md:text-xl text-muted/90 leading-relaxed mb-8 max-w-xl">
                We deliver a smart and dynamic service scheduling and progress
                tracking system across any sector.
              </p>

              <div className="flex flex-col lg:flex-row gap-4 mb-6">
                <Link
                  href="/register/organization"
                  className="rounded px-8 py-2 bg-primary hover:bg-primary text-white shadow-xl shadow-primary/30 cursor-pointer"
                >
                  Register Organization
                </Link>

                <Link
                  href="/services"
                  className="rounded px-8 py-2 bg-white text-primary hover:bg-gray-100 shadow-lg cursor-pointer"
                >
                  Explore Services
                </Link>
              </div>
            </div>

            {/* Right - Calendar */}
            <div className="flex justify-center">
              <div className="bg-white rounded-[0.5em] p-6 w-full max-w-md shadow-[0_40px_60px_-20px_rgba(0,0,0,0.5)]">
                <Card className="ring-ring/40">
                  <CardContent>
                    <Tabs defaultValue="ethiopian" className="w-full">
                      <TabsList className="grid w-full grid-cols-2 mb-4">
                        <TabsTrigger value="ethiopian">የኢትዮጵያ</TabsTrigger>
                        <TabsTrigger value="gregorian">Gregorian</TabsTrigger>
                      </TabsList>
                      <TabsContent
                        value="ethiopian"
                        className="flex justify-center mt-0"
                      >
                        <EthiopianCalendar
                          mode="single"
                          selected={new Date()}
                          // selected={dates}
                          // onSelect={setDates}
                          startMonth={startMonth}
                          endMonth={endMonth}
                          reverseYears
                          className="px-0 py-0 w-full"
                          captionLayout="dropdown"
                        />
                      </TabsContent>
                      <TabsContent
                        value="gregorian"
                        className="flex justify-center mt-0"
                      >
                        <Calendar
                          mode="single"
                          selected={new Date()}
                          // selected={dates}
                          // onSelect={setDates}
                          startMonth={startMonth}
                          endMonth={endMonth}
                          reverseYears
                          className="px-0 py-2 w-full"
                          captionLayout="dropdown"
                        />
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>

                {/* <Calendar
                  mode="single"
                  className="rounded-xl border-none"
                  captionLayout="dropdown"
                /> */}

                {/* Slot Info */}
                <div className="mt-6 p-4 rounded bg-primary/10 border border-primary/20 flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">
                      3 slots available
                    </p>
                    <p className="text-xs text-slate-500">9:00 AM – 4:30 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features / Solution Section */}
        <section className="container mx-auto px-4 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              The Solutions We Deliver
            </h2>
            {/* <p className="mt-4 text-lg text-slate-600">
              Built to streamline operations across every industry.
            </p> */}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {solutions.map((solution, index) => (
              <Card
                key={index}
                className="hover:shadow- hover:ring transition-shadow duration-200 ring-0"
              >
                <CardHeader>
                  <div className="mb-4 h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <solution.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{solution.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-slate-600 leading-relaxed">
                  {solution.description}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Workflow animation */}
        <section className="container min-w-full px-4 py-16 bg-accent border-y">
          <WorkflowAnimation />
        </section>

        {/* Target Audience */}
        <section className="container mx-auto px-4 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Designed for the Key Players in Any Service Sector
            </h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              A flexible system tailored to empower everyone involved in the
              service delivery chain.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-t-4 border-t-slate-700 hover:border-t-primary shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-8 flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center mb-6">
                  <Building2Icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  For Service Providers
                </h3>
                <p className="text-slate-600">
                  Hospitals, Government Bureaus, Salons, Repair Centers focusing
                  on efficiency.
                </p>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-slate-700 hover:border-t-primary shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-8 flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mb-6">
                  <UsersIcon className="h-8 w-8 text-slate-800" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  For Employees
                </h3>
                <p className="text-slate-600">
                  Clerks, Mechanics, Doctors, Analysts looking for a unified
                  task queue.
                </p>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-slate-700 hover:border-t-primary shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-8 flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mb-6">
                  <UserCheckIcon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  For Clients &amp; Citizens
                </h3>
                <p className="text-slate-600">
                  Patients, Citizens Seeking Permits, and Customers wanting
                  transparency.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-slate-900 py-24 text-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl text-white">
                From Booking to Completion in Four Steps
              </h2>
              <p className="mt-4 text-lg text-slate-400">
                A seamless workflow that keeps everyone in the loop.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="relative">
                {/* Visual Progress Connector */}
                <div className="absolute left-8 top-8 bottom-8 w-px bg-slate-700 md:hidden" />
                <div className="hidden md:block absolute top-[2.25rem] left-[10%] right-[10%] h-px bg-slate-700" />

                <div className="flex flex-col md:flex-row justify-between relative gap-10 md:gap-4">
                  {/* Step 1 */}
                  <div className="flex flex-row md:flex-col items-start md:items-center relative z-10 w-full md:w-1/4">
                    <div className="h-16 w-16 rounded-full bg-slate-800 border-2 border-primary flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(234,88,12,0.3)] shadow-primary/20">
                      <span className="text-xl font-bold text-primary">1</span>
                    </div>
                    <div className="ml-6 md:ml-0 md:mt-6 md:text-center">
                      <h3 className="text-lg font-semibold text-white mb-2">
                        Client Books
                      </h3>
                      <p className="text-slate-400 text-sm">
                        Client selects a service and time slot.
                      </p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex flex-row md:flex-col items-start md:items-center relative z-10 w-full md:w-1/4">
                    <div className="h-16 w-16 rounded-full bg-slate-800 border-2 border-slate-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-xl font-bold text-slate-300">
                        2
                      </span>
                    </div>
                    <div className="ml-6 md:ml-0 md:mt-6 md:text-center">
                      <h3 className="text-lg font-semibold text-white mb-2">
                        Task Assigned
                      </h3>
                      <p className="text-slate-400 text-sm">
                        System assigns the task to an employee or AI agent.
                      </p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex flex-row md:flex-col items-start md:items-center relative z-10 w-full md:w-1/4">
                    <div className="h-16 w-16 rounded-full bg-slate-800 border-2 border-slate-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-xl font-bold text-slate-300">
                        3
                      </span>
                    </div>
                    <div className="ml-6 md:ml-0 md:mt-6 md:text-center">
                      <h3 className="text-lg font-semibold text-white mb-2">
                        Service Executed
                      </h3>
                      <p className="text-slate-400 text-sm">
                        Staff updates progress; client sees real-time status.
                      </p>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="flex flex-row md:flex-col items-start md:items-center relative z-10 w-full md:w-1/4">
                    <div className="h-16 w-16 rounded-full bg-slate-800 border-2 border-slate-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-xl font-bold text-slate-300">
                        4
                      </span>
                    </div>
                    <div className="ml-6 md:ml-0 md:mt-6 md:text-center">
                      <h3 className="text-lg font-semibold text-white mb-2">
                        Service Completed
                      </h3>
                      <p className="text-slate-400 text-sm">
                        Client receives notification, payment, and completion
                        summary.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-16 bg-slate-800 rounded-xl p-6 border border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-slate-300">
                    Live Service Status
                  </span>
                  <Badge
                    variant="outline"
                    className="text-primary border-primary/30 bg-primary/10"
                  >
                    <ClockIcon className="w-3 h-3 mr-1" /> Estimated 15 mins
                  </Badge>
                </div>
                <Progress
                  value={65}
                  className="h-3 bg-slate-700 [&>div]:bg-primary"
                />
                <div className="flex justify-between mt-3 text-xs text-slate-400">
                  <span>Received</span>
                  <span className="text-primary font-medium">In Progress</span>
                  <span>Completed</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="container mx-auto px-4 py-24 text-center">
          <div className="bg-primary rounded p-10 md:p-16 text-white shadow-xl shadow-primary/20 max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight md:text-5xl mb-6">
              Ready to Transform Your Service Management?
            </h2>
            <p className="text-primary-foreground text-lg md:text-xl mb-10 max-w-2xl mx-auto">
              Join the organizations moving beyond manual processes. Get started
              with ServeSync+ today and bring real-time efficiency to your
              sector.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/register/organization"
                className="bg-white p-2 text-primary hover:bg-slate-100 font-bold rounded px-8 cursor-pointer"
              >
                Register Organization
              </Link>
            </div>
          </div>
        </section>

        {/* Technology / Trust */}
        <section className="bg-slate-50 py-20 border-y border-slate-200">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-10">
              Built on a Modern, Reliable Stack
            </h2>

            <div className="flex flex-wrap justify-center gap-8 md:gap-16 items-center opacity-70">
              <div className="flex flex-col items-center gap-2">
                <SmartphoneIcon className="h-10 w-10 text-slate-800" />
                <span className="font-semibold text-slate-600">
                  Next.js &amp; React Native
                </span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="font-extrabold text-3xl tracking-tighter text-slate-800">
                  Bun.js
                </div>
                <span className="font-semibold text-slate-600">
                  Ultrafast Runtime
                </span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <DatabaseIcon className="h-10 w-10 text-slate-800" />
                <span className="font-semibold text-slate-600">PostgreSQL</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <ServerIcon className="h-10 w-10 text-slate-800" />
                <span className="font-semibold text-slate-600">Docker</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <ShieldCheckIcon className="h-10 w-10 text-slate-800" />
                <span className="font-semibold text-slate-600">
                  Enterprise Security
                </span>
              </div>
            </div>

            <p className="mt-10 text-slate-600 max-w-2xl mx-auto">
              Our commitment to performance, scalability, and security ensures
              that your institution's core processes run reliably without
              interruption.
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
