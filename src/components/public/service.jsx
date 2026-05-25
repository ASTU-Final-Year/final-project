"use client";

import React, { useState } from "react";
import {
  Building2,
  MapPin,
  Mail,
  Phone,
  Star,
  ShieldCheck,
  Check,
} from "lucide-react";
import Link from "next/link";
import { CalendarDatePicker } from "../calendar-date-picker";
import { CompactTimeSlotPicker } from "../time-slot-picker";
import { CalendarDateTimeSlotPicker } from "../calendar-date-time-slot-picker";

export default function PublicOrganizationService({ service, rating }) {
  const [pickedDate, setPickedDate] = useState([new Date()]);
  const [pickedTime, setPickedTime] = useState(null);
  if (rating == null) rating = 0;

  return (
    <div className="min-h-screen  text-foreground font-sans selection:bg-primary/20 selection:text-primary relative flex flex-col">
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
                {service.name}
              </h1>
              <div className="flex flex-col gap-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <Link href={`/organization/${service.organization.id}`}>
                    <span
                      title="is active"
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-500/20"
                    >
                      {service.isActive && <Check className="w-4 h-4" />}
                      {service.organization.name}
                    </span>
                  </Link>
                  {service?.organization?.isGovernment && (
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
                    {service?.organization?.sector}
                  </span>
                  {service.price != null && (
                    <span
                      title="price"
                      className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-900 text-xs font-medium border border-yellow-900/20"
                    >
                      {service.price === 0 ? "free" : `${service.price} Birr`}
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
          {/* Left Column: service Details */}
          <div className="lg:col-span-4 space-y-6">
            {/* About Card */}
            <div className="bg-card text-card-foreground rounded border shadow-sm p-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
              <h2 className="text-lg text-foreground/80 font-semibold mb-4 flex items-center gap-2">
                {/* <Info className="w-5 h-5 text-primary" /> */}
                About
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {service.description}
              </p>
            </div>

            {/* Contact Information Card */}
            <div className="bg-card text-card-foreground rounded border shadow-sm p-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <h2 className="text-lg text-foreground/80 font-semibold mb-4 flex items-center gap-2">
                {/* <Contact className="w-5 h-5 text-primary" /> */}
                Contact
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
                      {service.organization.address}
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
                      <Link href={`mailto:${service.organization.email}`}>
                        {service.organization.email}
                      </Link>
                    </p>
                  </div>
                </li>
                {service.organization.phone && (
                  <li className="flex items-start gap-4">
                    <div className="p-2 bg-primary/10 text-primary rounded border border-primary/20">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">
                        Phone
                      </p>
                      <p className="text-sm font-medium">
                        {service.organization.phone}
                      </p>
                    </div>
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* Right Column: Services Grid */}
          <div className="lg:col-span-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Booking Card */}
              <div className="sm:col-span-2 bg-card text-card-foreground rounded border shadow-sm p-6">
                <h2 className="text-lg text-foreground/80 font-semibold mb-4 flex items-center gap-2">
                  {/* <Info className="w-5 h-5 text-primary" /> */}
                  Please pick a date and time slot to book
                </h2>
                {/* <p className="text-muted-foreground text-sm leading-relaxed">
                  {service.description}
                </p> */}
                {/* <Calendar /> */}
                <div>
                  <CalendarDatePicker
                    date={pickedDate}
                    setDate={setPickedDate}
                  />
                  {/* <CalendarDateTimeSlotPicker
                    calendar={calendar}
                    setDate={setPickedTime}
                    times={pickedTime}
                  /> */}

                  {/* <TimeSlotPicker
                    calendar={pickedDate[0]}
                    times={pickedTime}
                    setDate={setPickedTime}
                    workingHours={{
                      start: "09:00",
                      end: "18:00",
                    }}
                    slotDuration={30}
                    breakTimes={[
                      { start: "12:00", end: "13:00" }, // Lunch break
                      { start: "15:30", end: "15:45" }, // Tea break
                    ]}
                    unavailableDates={["2024-12-25", "2024-12-26"]}
                    minBookingNotice={2} // 2 hours notice required
                    maxDaysInAdvance={14} // Can book up to 14 days in advance
                    onTimeSelect={(time) => {
                      console.log("Selected time:", time);
                    }}
                  /> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
