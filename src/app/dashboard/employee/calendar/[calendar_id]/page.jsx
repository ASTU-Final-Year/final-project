"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";
import RequestHandler from "@/lib/request-handler";

// --- Native Date Helpers ---
const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
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
    // Normalize to start/end of days for accurate comparison
    const from = new Date(range.from).setHours(0, 0, 0, 0);
    const to = new Date(range.to).setHours(23, 59, 59, 999);
    const d = date.getTime();
    return d >= from && d <= to;
  });
};

// --- Core Rules Engine Logic ---
const evaluateDateStatus = (date, calendar) => {
  if (!calendar) return { status: null, reason: null };

  const { available, unavailable } = calendar;
  let isAvail = false;
  let reasonId = 0;
  let reason = "";

  // 1. Evaluate Base Availability (additive)
  if (available) {
    if (available.weekly?.includes(date.getDay() - 1)) {
      isAvail = true;
      reasonId = 1;
      reason = "Weekly standard hours";
    }
    if (!isAvail && isDateInRange(date, available.ranges)) {
      isAvail = true;
      reasonId = 2;
      reason = "Custom availability range";
    }
    if (
      !isAvail &&
      available.exactly?.some((d) => isSameDay(date, new Date(d)))
    ) {
      isAvail = true;
      reasonId = 3;
      reason = "Specific available date";
    }
  }

  // 2. Evaluate Exceptions / Blockouts (subtractive - overrides base)
  if (unavailable) {
    if (unavailable.weekly?.includes(date.getDay() - 1)) {
      return {
        status: "unavailable",
        reasonId: 1,
        reason: "Blocked (Weekly rule)",
      };
    }
    if (isDateInRange(date, unavailable.ranges)) {
      return {
        status: "unavailable",
        reasonId: 2,
        reason: "Blocked (Date range)",
      };
    }
    if (unavailable.exactly?.some((d) => isSameDay(date, new Date(d)))) {
      return {
        status: "unavailable",
        reasonId: 3,
        reason: "Blocked (Specific date)",
      };
    }
  }

  return {
    status: isAvail ? "available" : "unavailable",
    reasonId,
    reason: isAvail ? reason : "Outside operational hours",
  };
};

export default function SmartCalendarGrid() {
  const { calendar_id } = useParams();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendar, setCalendar] = useState(null);
  const [employeeId, setEmployeeId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // --- Data Fetching ---
  useEffect(() => {
    RequestHandler.Get("/api/v1/employee").then(async (res) => {
      if (res.ok) {
        const { employee } = await res.json();
        setEmployeeId(employee.userId);
      }
    });
  }, []);

  const fetchCalendars = useCallback(async () => {
    if (!employeeId) return;
    (async () => setIsLoading(true))();

    const params = new URLSearchParams({
      iemployee: 1,
    });

    const [dataRes] = await Promise.all([
      RequestHandler.Get(
        `/api/v1/employee/${employeeId}/calendar/${calendar_id}?${params.toString()}`,
      ),
    ]);

    if (dataRes.ok) {
      const data = await dataRes.json();
      let result = data.calendar;

      result = {
        ...result,
        available: {
          ...(result.available ?? {}),
          ranges: result.available?.ranges
            ? result.available.ranges.map(({ from, to }) => ({
                from: new Date(from),
                to: new Date(to),
              }))
            : [],
          exactly: result.available?.exactly
            ? result.available.exactly.map((e) => new Date(e))
            : [],
        },
        unavailable: {
          ...(result.unavailable ?? {}),
          ranges: result.unavailable?.ranges
            ? result.unavailable.ranges
                .map(({ from, to }) => ({
                  from: new Date(from),
                  to: new Date(to),
                }))
                .sort((a, b) => a.from.getTime() - b.from.getTime())
            : [],
          exactly: result.unavailable?.exactly
            ? result.unavailable.exactly
                .map((e) => new Date(e))
                .sort((a, b) => a.getTime() - b.getTime())
            : [],
        },
      };
      (async () => setCalendar(result))();
    }
    (async () => setIsLoading(false))();
  }, [employeeId, calendar_id]);

  useEffect(() => {
    fetchCalendars();
  }, [fetchCalendars]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const handleToday = () => setCurrentDate(new Date());

  // Generate the days for the current month view
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

    // Next month padding (to complete the 35 or 42 cell grid)
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

  return isLoading ? (
    <div className="h-full flex items-center justify-center border rounded bg-card">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  ) : (
    <Card className="w-full border shadow-sm bg-card overflow-visible">
      {/* Header Controls */}
      <CardHeader className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0 border-b pb-4 bg-muted/20">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-primary/10 rounded-md text-primary">
            <CalendarIcon className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              {MONTHS[month]} {year}
            </CardTitle>
            <p className="text-sm text-muted-foreground font-medium">
              Viewing: {calendar?.name || "Unassigned Configuration"}
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
        {/* Days of Week Header */}
        <div className="grid grid-cols-7 border-b bg-muted/10">
          {DAYS_OF_WEEK.map((day) => (
            <div
              key={day}
              className="py-3 text-center text-xs font-bold text-muted-foreground uppercase tracking-wider"
            >
              {day}
            </div>
          ))}
        </div>
        {/* Calendar Grid */}
        <div className="p-1 grid grid-cols-7 auto-rows-fr gap-px mx-4 my-2">
          {calendarDays.map((dayObj, idx) => {
            const isToday = isSameDay(dayObj.date, new Date());
            const isAvailable = dayObj.status === "available";
            const reasonId = dayObj.reasonId;

            return (
              <div
                key={idx}
                className={cn(
                  "min-h-[120px] bg-background p-2 flex flex-col transition-colors relative group",
                  !dayObj.isCurrentMonth && "bg-muted/30",
                  isAvailable
                    ? "bg-background hover:ring-1 hover:ring-primary/70 shadow-sm rounded"
                    : "bg-muted z-0 hover:bg-accent",
                )}
              >
                {/* Date Number Indicator */}
                <div className="flex justify-between items-start">
                  <span
                    className={cn(
                      "flex items-center justify-center h-7 w-7 rounded-full text-sm font-semibold",
                      isToday
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-foreground",
                      !dayObj.isCurrentMonth &&
                        !isToday &&
                        "text-muted-foreground",
                      !isAvailable
                        ? ""
                        : !dayObj.isCurrentMonth && !isToday
                          ? "text-primary"
                          : "",
                    )}
                  >
                    {dayObj.date.getDate()}
                  </span>

                  {/* Status Icon */}
                  {/* {isAvailable ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500/70" />
                  ) : (
                    <XCircle className="h-4 w-4 text-destructive/50" />
                  )} */}
                </div>

                {/* Status Block */}
                {/* <div className="mt-auto pt-2">
                  <div
                    className={cn(
                      "text-[10px] sm:text-xs font-medium px-2 py-1 rounded-md w-full truncate border",
                      isAvailable
                        ? "bg-green-100/50 text-green-700 border-green-200"
                        : "bg-red-50 text-red-700/80 border-red-100",
                    )}
                  >
                    {dayObj.reason}
                  </div>
                </div> */}

                {/* Hover Tooltip (CSS only) */}
                <div className="absolute hidden group-hover:block bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[200px] p-2 bg-slate-800 text-slate-100 text-xs rounded-md shadow-xl z-20">
                  <p className="font-bold">{dayObj.date.toDateString()}</p>
                  <p className="opacity-90">{dayObj.reason}</p>
                  {/* Triangle pointer */}
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
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
            <span className="font-medium text-slate-700">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <span className="font-medium text-slate-700">
              Exception / Blocked
            </span>
          </div>
        </div> */}{" "}
      </CardContent>
    </Card>
  );
}
