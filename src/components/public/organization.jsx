import React from "react";
import {
  Building2,
  MapPin,
  Mail,
  Phone,
  Star,
  ShieldCheck,
  Briefcase,
  CalendarDays,
  ArrowRight,
  ExternalLink,
  Check,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import Link from "next/link";
import ServiceCard from "./service-card";

export default function PublicOrganization({ organization, services }) {
  const rating = organization.rating || 0;

  return (
    <div className="min-h-screen bg-accent text-foreground font-sans selection:bg-primary/20 selection:text-primary relative flex flex-col">
      {/* Hero Banner Area */}
      <div
        className="h-60 w-full bg-muted/30 border-b relative z-0 flex items-center justify-center overflow-hidden"
        style={{
          backgroundRepeat: "no-repeat",
          backgroundPositionY: "center",
          backgroundSize: "cover",
          backgroundImage: 'url("/images/pexels-lovetosmile-36200692.jpg")',
        }}
      >
        <div className="w-full h-full bg-slate-900/50"></div>
        {/* Subtle glowing orbs using the primary theme color */}
        {/* <div className="w-full h-full bg-pattern-1 blur-[2px]"></div> */}
        {/* <div className="absolute left-0 right-0 top-0 bottom-0 bg-linear-to-tr from-indigo-700 from-30% via-primary/90 via-70% to-transparent"></div> */}
        {/* <div className="absolute bottom-0 right-1/4 translate-y-1/3 w-72 h-72 bg-primary/50 rounded-full blur-[80px]"></div> */}
      </div>

      {/* Main Content - Pulled up to overlap the hero */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-28 relative z-10 pb-20">
        {/* Profile Header Card (Matches Shadcn Card Style) */}
        <div className="bg-card text-card-foreground rounded border shadow-sm p-6 sm:p-8 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            {/* Title & Badges */}
            <div className="space-y-4 flex-1">
              <h1 className="text-3xl text-foreground/80 sm:text-4xl md:text-5xl font-bold tracking-tight">
                {organization.name}
              </h1>
              <div className="flex flex-col gap-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span
                    title="is active"
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-500/20"
                  >
                    {organization.isActive && <Check className="w-4 h-4" />}
                    {organization.name}
                  </span>
                  {organization.isGovernment && (
                    <span
                      title="is governemnt"
                      className="inline-flex items-center px-1 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-500/20"
                    >
                      <ShieldCheck className="w-4 h-4" />
                    </span>
                  )}
                  <span
                    title="sector"
                    className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/10"
                  >
                    {organization.sector}
                  </span>
                  {organization.price != null && (
                    <span
                      title="price"
                      className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-900 text-xs font-medium border border-yellow-900/20"
                    >
                      {organization.price === 0
                        ? "free"
                        : `${organization.price} Birr`}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400 py-1 rounded-full">
                  {Array(rating)
                    .fill(null)
                    .map((_, index) => (
                      <Star key={index} className="w-4 h-4 fill-amber-500/20" />
                    ))}

                  {Array(5 - rating)
                    .fill(null)
                    .map((_, index) => (
                      <Star
                        key={index}
                        className="w-4 h-4 text-gray-400/80 fill-gray-400/20"
                      />
                    ))}
                  {/* {<Star className="w-4 h-4 fill-amber-500/20" />} */}
                  {/* <span>No</span> */}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Left Column: Organization Details */}
          <div className="lg:col-span-4 space-y-6">
            {/* About Card */}
            <div className="bg-card text-card-foreground rounded border shadow-sm p-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
              <h2 className="text-lg text-foreground/80 font-semibold mb-4 flex items-center gap-2">
                {/* <Building2 className="w-5 h-5 text-primary" /> */}
                About
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {organization.description}
              </p>
            </div>

            {/* Contact Information Card */}
            <div className="bg-card text-card-foreground rounded border shadow-sm p-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <h2 className="text-lg text-foreground/80 font-semibold mb-6">
                Details
              </h2>
              <ul className="space-y-5">
                <li className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 text-primary rounded border border-primary/20">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">
                      Address
                    </p>
                    <p className="text-sm font-medium leading-tight">
                      {organization.address}
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 text-primary rounded border border-primary/20">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs font-medium text-muted-foreground mb-1">
                      Email
                    </p>
                    <p className="text-sm font-medium truncate">
                      {organization.email}
                    </p>
                  </div>
                </li>
                {organization.phone && (
                  <li className="flex items-start gap-4">
                    <div className="p-2 bg-primary/10 text-primary rounded border border-primary/20">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">
                        Phone
                      </p>
                      <p className="text-sm font-medium">
                        {organization.phone}
                      </p>
                    </div>
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* Right Column: Services Grid */}
          <div className="lg:col-span-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground/80 tracking-tight flex items-center gap-2">
                Services
                {/* <span className="inline-flex items-center justify-center bg-primary/10 text-primary text-xs font-bold w-6 h-6 rounded-full border border-primary/20"> */}
                <Badge
                  variant="outline"
                  className="rounded-full min-w-8 h-8 border-primary text-primary font-bold p-2"
                >
                  {services.filter((s) => s.isActive).length}
                </Badge>
                {/* </span> */}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {services.map(
                (service) =>
                  service.isActive && (
                    <ServiceCard key={service.id} service={service} />
                    // <div
                    //   key={service.id}
                    //   className="group relative bg-card text-card-foreground p-6 rounded border shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-300 flex flex-col h-full"
                    // >
                    //   <div className="relative z-10 flex-1">
                    //     {/* <div className="w-10 h-10 bg-muted text-muted-foreground rounded border border-border flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors duration-300">
                    //       <CalendarDays className="w-5 h-5" />
                    //     </div> */}
                    //     <div className="flex gap-2 justify-between">
                    //       <h3 className="text-base font-semibold mb-2 group-hover:text-primary transition-colors duration-300 line-clamp-1">
                    //         {service.name}
                    //       </h3>

                    //       <Button
                    //         variant="link"
                    //         className="flex items-center gap-1.5 text-primary text-sm font-medium hover:underline underline-offset-4"
                    //         asChild
                    //       >
                    //         <Link href={`/service/${service.id}`}>
                    //           view
                    //           <ArrowRight className="w-3.5 h-3.5" />
                    //         </Link>
                    //       </Button>
                    //     </div>

                    //     <p className="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-2">
                    //       {service.description}
                    //     </p>
                    //   </div>

                    //   <div className="relative z-10 mt-auto pt-2 border-t border-border/50 flex items-center justify-between">
                    //     <span className="text-xs font-medium text-muted-foreground">
                    //     </span>
                    //     <Button
                    //       variant="link"
                    //       className="flex items-center gap-1.5 text-primary text-sm font-medium hover:underline underline-offset-4"
                    //       asChild
                    //     >
                    //       <Link href={`/service/${service.id}`}>
                    //         view
                    //         <ArrowRight className="w-3.5 h-3.5" />
                    //       </Link>
                    //     </Button>
                    //   </div>
                    // </div>
                  ),
              )}

              {services.length === 0 && (
                <div className="col-span-full bg-card p-12 rounded border border-dashed flex flex-col items-center justify-center text-center shadow-sm">
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4 border">
                    <CalendarDays className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-base font-semibold mb-1">
                    No Services Found
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    This organization currently has no active public services
                    available.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
