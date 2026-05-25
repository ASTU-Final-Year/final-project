// src/components/calendar/CalendarGrid.jsx
"use client";

import React, { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  gregorianToEthiopian,
  getEthiopianMonthName,
  getEthiopianDayName,
  formatEthiopianDate,
  ethiopianDays,
  ethiopianShortDays,
  ethiopianMonthNames,
} from "@/lib/date.utils";

const DAYS_OF_WEEK_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS_EN = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const isSameDay = (d1, d2) => {
  if (!d1 || !d2) return false;
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

const isDateInRange = (date, ranges) => {
  if (!ranges) return false;
  return ranges.some((range) => {
    const from = new Date(range.from).setHours(0, 0, 0, 0);
    const to = new Date(range.to).setHours(23, 59, 59, 999);
    const d = date.getTime();
    return d >= from && d <= to;
  });
};

const evaluateDateStatus = (date, calendar) => {
  if (!calendar) return { status: null, reason: null };

  const { available, unavailable } = calendar;
  let isAvail = false;
  let inThePast = date.setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0);
  let reason = "";

  // Note: day of week: Sunday=0, Monday=1, etc.
  // Your calendar uses Monday=1, so adjust
  const adjustedDay = date.getDay() === 0 ? 6 : date.getDay() - 1;
  if (inThePast) {
    isAvail = false;
    reason = "Time is in the past";
  } else if (available) {
    if (available.weekly?.includes(adjustedDay)) {
      isAvail = true;
      reason = "Weekly schedule";
    }
    if (!isAvail && isDateInRange(date, available.ranges)) {
      isAvail = true;
      reason = "Custom availability range";
    }
    if (
      !isAvail &&
      available.exactly?.some((d) => isSameDay(date, new Date(d)))
    ) {
      isAvail = true;
      reason = "Specific available date";
    }
  }

  if (!inThePast && unavailable) {
    if (unavailable.weekly?.includes(adjustedDay)) {
      return { status: "unavailable", reason: "Weekly day off" };
    }
    if (isDateInRange(date, unavailable.ranges)) {
      return { status: "unavailable", reason: "Blocked date range" };
    }
    if (unavailable.exactly?.some((d) => isSameDay(date, new Date(d)))) {
      return { status: "unavailable", reason: "Specific blocked date" };
    }
  }

  return {
    status: isAvail ? "available" : "unavailable",
    reason: isAvail ? reason : reason || "Outside operational hours",
  };
};

export default function CalendarGrid({
  calendar,
  currentDate,
  onDateChange,
  calendarMode = "gregorian",
  language = "en",
}) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Generate calendar days (dates are always Gregorian)
  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days = [];

    // Previous month padding
    for (let i = 0; i < firstDayOfMonth; i++) {
      const d = new Date(
        year,
        month - 1,
        daysInPrevMonth - firstDayOfMonth + i + 1,
      );
      days.push({
        date: d,
        isCurrentMonth: false,
        ...evaluateDateStatus(d, calendar),
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(year, month, i);
      days.push({
        date: d,
        isCurrentMonth: true,
        ...evaluateDateStatus(d, calendar),
      });
    }

    // Next month padding
    const totalCells = days.length > 35 ? 42 : 35;
    const remainingDays = totalCells - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      const d = new Date(year, month + 1, i);
      days.push({
        date: d,
        isCurrentMonth: false,
        ...evaluateDateStatus(d, calendar),
      });
    }

    return days;
  }, [year, month, calendar]);

  const handlePrevMonth = () => {
    onDateChange(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    onDateChange(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    onDateChange(new Date());
  };

  const getDisplayDate = () => {
    if (calendarMode === "ethiopian") {
      const eth = gregorianToEthiopian(currentDate);
      const monthName = ethiopianMonthNames[language || "en"][eth.month];
      return `${monthName} ${eth.year}`;
    }
    return `${MONTHS_EN[month]} ${year}`;
  };

  const getDaysOfWeek = (language = "en") => {
    if (calendarMode === "ethiopian") {
      return ethiopianShortDays[language || "en"];
    }
    return DAYS_OF_WEEK_EN;
  };

  const getDateDisplay = (date, isCurrentMonth) => {
    if (calendarMode === "ethiopian") {
      const eth = gregorianToEthiopian(date);
      return eth.date;
    }
    return date.getDate();
  };

  const isToday = (date) => {
    const today = new Date();
    return isSameDay(date, today);
  };

  return (
    <Card className="w-full border shadow-sm bg-card overflow-visible min-w-2xl max-w-4xl">
      <CardHeader className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0 border-b pb-4 bg-muted/20">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-primary/10 rounded-md text-primary">
            <CalendarIcon className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              {getDisplayDate()}
            </CardTitle>
            <p className="text-sm text-muted-foreground font-medium">
              {calendar?.name || "Calendar View"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleToday}
            className="font-semibold hidden sm:flex"
          >
            Today
          </Button>
          <div className="flex items-center border rounded-md bg-background">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevMonth}
              className="h-9 w-9 rounded-r-none hover:bg-muted"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="h-4 w-px bg-border" />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNextMonth}
              className="h-9 w-9 rounded-l-none hover:bg-muted"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="grid grid-cols-7 border-b bg-muted/10">
          {getDaysOfWeek(language).map((day) => (
            <div
              key={day}
              className="py-3 text-center text-xs font-bold text-muted-foreground uppercase tracking-wider"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="p-1 grid grid-cols-7 auto-rows-fr gap-px mx-4 my-2">
          {calendarDays.map((dayObj, idx) => {
            const today = isToday(dayObj.date);
            const isAvailable = dayObj.status === "available";
            const dateNumber = getDateDisplay(
              dayObj.date,
              dayObj.isCurrentMonth,
            );

            return (
              <div
                key={idx}
                className={cn(
                  "min-h-[100px] bg-background p-2 flex flex-col transition-colors relative group m-[1px]",
                  dayObj.isCurrentMonth ? "bg-primary" : "bg-muted/30",
                  isAvailable
                    ? "border border-primary/50 hover:ring-1 hover:ring-primary/70 shadow-sm rounded"
                    : "bg-black/5 border border-black/10 rounded hover:bg-accent/20",
                )}
              >
                <div className="flex justify-between items-start">
                  <span
                    className={cn(
                      "flex items-center justify-center h-7 w-7 rounded-full text-sm font-semibold",
                      isAvailable
                        ? "text-primary-foreground"
                        : "text-muted-foreground",
                      !dayObj.isCurrentMonth
                        ? "text-muted-foreground"
                        : !isAvailable
                          ? "text-foreground"
                          : "text-primary-foreground",
                    )}
                  >
                    {dateNumber}
                  </span>
                  <div className="flex gap-0.5">
                    {today && (
                      <div className="rounded-full bg-white p-1 px-2 text-primary border border-primary/70">
                        Today
                      </div>
                    )}
                  </div>

                  {/* <div className="flex gap-0.5">
                    {isAvailable && (
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                    )}
                  </div> */}
                </div>

                {/* <div className="mt-1">
                  <Badge
                    variant={isAvailable ? "outline" : "secondary"}
                    className={cn(
                      "text-[9px] px-1.5 py-0 h-4",
                      isAvailable && "border-green-500 text-green-600",
                    )}
                  >
                    {isAvailable ? "Available" : "Unavailable"}
                  </Badge>
                </div> */}

                {/* Hover Tooltip */}
                <div className="absolute hidden group-hover:block bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[220px] p-2 bg-gray-900 text-gray-100 text-xs rounded-md shadow-xl z-20">
                  <p className="font-bold">
                    {calendarMode === "ethiopian"
                      ? formatEthiopianDate(dayObj.date)
                      : dayObj.date.toLocaleDateString()}
                  </p>
                  <p className="opacity-90 mt-1">
                    {dayObj.reason || "No status info"}
                  </p>
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        {/* <div className="flex items-center justify-start gap-6 p-4 bg-muted/10 border-t text-sm">
          <span className="font-semibold text-muted-foreground mr-2">
            Legend:
          </span>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-foreground">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <span className="text-foreground">Unavailable</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-foreground">Today</span>
          </div>
        </div> */}
      </CardContent>
    </Card>
  );
}
