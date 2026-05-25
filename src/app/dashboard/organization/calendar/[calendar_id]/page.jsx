// src/app/dashboard/organization/calendar/[calendar_id]/page.jsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Calendar as CalendarIcon,
  CheckCircle,
  Loader2,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useParams } from "next/navigation";
import RequestHandler from "@/lib/request-handler";
import CalendarGrid from "@/components/calendar/grid";

export default function SmartCalendarPage() {
  const { calendar_id } = useParams();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendar, setCalendar] = useState(null);
  const [organization, setOrganization] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [calendarMode, setCalendarMode] = useState("gregorian");
  const [language, setLanguage] = useState("en"); // 'en' or 'am'

  useEffect(() => {
    RequestHandler.Get("/query/v1/organization?organization_admin").then(
      async (res) => {
        if (res.ok) {
          const { organizations } = await res.json();
          setOrganization(organizations?.[0]);
        }
      },
    );
  }, []);

  const fetchCalendar = useCallback(async () => {
    if (!calendar_id) return;

    try {
      const dataRes = await RequestHandler.Get(
        `/query/v1/organizationCalendar?~id=${calendar_id}&select={"":true,"organization":["name"]}`,
      );

      if (dataRes.ok) {
        const { organizationCalendars } = await dataRes.json();
        let result = organizationCalendars?.[0];

        if (result) {
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
                ? result.unavailable.ranges.map(({ from, to }) => ({
                    from: new Date(from),
                    to: new Date(to),
                  }))
                : [],
              exactly: result.unavailable?.exactly
                ? result.unavailable.exactly.map((e) => new Date(e))
                : [],
            },
          };
          setCalendar(result);
        }
      }
    } catch (error) {
      console.error("Failed to fetch calendar:", error);
    } finally {
      setIsLoading(false);
    }
  }, [calendar_id]);

  useEffect(() => {
    (async () => fetchCalendar())();
  }, [fetchCalendar]);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center border rounded bg-card">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!calendar) {
    return (
      <Card className="w-full">
        <CardContent className="py-12 text-center">
          <CalendarIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Calendar not found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Calendar Info Header */}
      {/* <div className="flex flex-wrap justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{calendar.name}</h1>
          <p className="text-muted-foreground mt-1">
            {calendar.description || "No description provided"}
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            <div className="flex flex-col">
              {calendar.available?.weekly?.length > 0 && (
                <Badge variant="ghost" className="gap-1 text-primary">
                  <span>
                    {" "}
                    {calendar.available.weekly
                      .map(
                        (d) =>
                          ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][d],
                      )
                      .join(", ")}
                  </span>
                </Badge>
              )}
              {calendar.unavailable?.weekly?.length > 0 && (
                <Badge variant="ghost" className="gap-1 text-orange-500">
                  <span>
                    {" "}
                    {calendar.unavailable.weekly
                      .map(
                        (d) =>
                          ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][d],
                      )
                      .join(", ")}
                  </span>
                </Badge>
              )}
            </div>
            {calendar.organization?.name && (
              <Badge variant="ghost">{calendar.organization.name}</Badge>
            )}
          </div>
        </div>
      </div> */}

      {/* Calendar Mode and Language Toggle */}
      <Card className="p-4">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h3>{calendar.organization.name}</h3>
            <h1 className="text-2xl font-bold tracking-tight">
              {calendar.name}
            </h1>
            <p className="text-muted-foreground mt-1">
              {calendar.description || "No description provided"}
            </p>
            {/* <h3 className="font-medium">Display Settings</h3>
            <p className="text-xs text-muted-foreground">
              Switch between Gregorian and Ethiopian calendar views
            </p> */}
          </div>
          <div className="flex gap-4">
            <Tabs value={calendarMode} onValueChange={setCalendarMode}>
              <TabsList>
                <TabsTrigger value="gregorian">Gregorian</TabsTrigger>
                <TabsTrigger value="ethiopian">Ethiopian</TabsTrigger>
              </TabsList>
            </Tabs>
            <Tabs value={language} onValueChange={setLanguage}>
              <TabsList>
                <TabsTrigger value="en">English</TabsTrigger>
                <TabsTrigger value="am">አማርኛ</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </Card>

      {/* Calendar Grid Component */}
      <CalendarGrid
        calendar={calendar}
        currentDate={currentDate}
        onDateChange={setCurrentDate}
        calendarMode={calendarMode}
        language={language}
      />

      {/* Schedule Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Availability Summary */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-green-600 flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              {language === "am" ? "የመገኛ ሰአታት" : "Availability Schedule"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {calendar.available?.weekly?.length > 0 && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {language === "am" ? "ሳምንታዊ ቀናት" : "Weekly Days"}
                </p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {calendar.available.weekly.map((day) => (
                    <Badge key={day} variant="outline" className="bg-green-50">
                      {language === "am"
                        ? ["ሰኞ", "ማክሰኞ", "ረቡዕ", "ሐሙስ", "አርብ", "ቅዳሜ", "እሑድ"][
                            day - 1
                          ]
                        : [
                            "Monday",
                            "Tuesday",
                            "Wednesday",
                            "Thursday",
                            "Friday",
                            "Saturday",
                            "Sunday",
                          ][day - 1]}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {calendar.available?.ranges?.length > 0 && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {language === "am" ? "የቀን ክልሎች" : "Date Ranges"}
                </p>
                <div className="space-y-1 mt-1">
                  {calendar.available.ranges.map(({ from, to }, idx) => (
                    <div key={idx} className="text-sm">
                      {from.toLocaleDateString()} - {to.toLocaleDateString()}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!calendar.available?.weekly?.length &&
              !calendar.available?.ranges?.length && (
                <p className="text-sm text-muted-foreground">
                  {language === "am"
                    ? "ምንም የመገኛ ሰአታት አልተዘጋጀም"
                    : "No availability configured"}
                </p>
              )}
          </CardContent>
        </Card>

        {/* Unavailability Summary */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-red-600 flex items-center gap-2">
              <XCircle className="h-5 w-5" />
              {language === "am" ? "ያልተገኙ ቀናት" : "Unavailability Schedule"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {calendar.unavailable?.weekly?.length > 0 && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {language === "am" ? "ሳምንታዊ ዕረፍት" : "Weekly Days Off"}
                </p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {calendar.unavailable.weekly.map((day) => (
                    <Badge key={day} variant="outline" className="bg-red-50">
                      {language === "am"
                        ? ["ሰኞ", "ማክሰኞ", "ረቡዕ", "ሐሙስ", "አርብ", "ቅዳሜ", "እሑድ"][
                            day - 1
                          ]
                        : [
                            "Monday",
                            "Tuesday",
                            "Wednesday",
                            "Thursday",
                            "Friday",
                            "Saturday",
                            "Sunday",
                          ][day - 1]}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {calendar.unavailable?.ranges?.length > 0 && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {language === "am" ? "የታገዱ ቀናት" : "Blocked Date Ranges"}
                </p>
                <div className="space-y-1 mt-1">
                  {calendar.unavailable.ranges.map(({ from, to }, idx) => (
                    <div key={idx} className="text-sm text-red-600">
                      {from.toLocaleDateString()} - {to.toLocaleDateString()}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {calendar.unavailable?.exactly?.length > 0 && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {language === "am"
                    ? "የተወሰኑ የታገዱ ቀናት"
                    : "Specific Blocked Dates"}
                </p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {calendar.unavailable.exactly.map((date, idx) => (
                    <Badge key={idx} variant="outline" className="bg-red-50">
                      {date.toLocaleDateString()}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {!calendar.unavailable?.weekly?.length &&
              !calendar.unavailable?.ranges?.length &&
              !calendar.unavailable?.exactly?.length && (
                <p className="text-sm text-muted-foreground">
                  {language === "am"
                    ? "ምንም ያልተገኙ ቀናት አልተዘጋጁም"
                    : "No unavailability configured"}
                </p>
              )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
