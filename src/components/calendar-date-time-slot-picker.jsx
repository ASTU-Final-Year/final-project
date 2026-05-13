"use client";

import { useState } from "react";
import { Calendar } from "./ui/calendar";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { EthiopianCalendar } from "./ui/ethiopian-calendar";
import { Plus } from "lucide-react";

export function CalendarDateTimeSlotPicker({
  date,
  setDate,
  mode = "single",
  times,
  setTimes,
  startMonth = new Date(),
  endMonth = new Date(new Date().getTime() + 10 * 365.25 * 24 * 60 * 60 * 1000),
}) {
  const monthStrs = {
    en: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    am: [
      "መስ",
      "ጥቅ",
      "ህዳ",
      "ታህ",
      "ጥር",
      "የካ",
      "መጋ",
      "ሚያ",
      "ግን",
      "ሰኔ",
      "ሐም",
      "ነሃ",
      "ጳጉ",
    ],
  };

  const [calendarMode, setCalendarMode] = useState("ethiopian");
  const [selectedDateMode, setSelectedDateMode] = useState(mode);

  const formatLocaleShortDate = (d) => {
    const isEthiopian = calendarMode === "ethiopian";
    const ed = EthDateTime.fromEuropeanDate(d);
    const day = isEthiopian ? ed.date + 1 : d.getDate();
    const month = isEthiopian ? ed.month % 13 : d.getMonth();
    const year = isEthiopian ? ed.year : d.getFullYear();
    return `${monthStrs[isEthiopian ? "am" : "en"][month]} ${day}, ${year}`;
  };

  return (
    <div>
      <Card className="">
        <CardContent>
          <Tabs
            defaultValue="ethiopian"
            value={calendarMode}
            onValueChange={setCalendarMode}
            className="w-full"
          >
            {/* Tab Select */}
            <div className="flex flex-col items-center gap-1">
              <div className="rounded space-x-1 p-1 w-auto mx-auto flex justify-center">
                <TabsList className="grid grid-cols-2 border data-[active=true]:bg-primary/15">
                  <TabsTrigger value="ethiopian">ኢትዮጵያዊ</TabsTrigger>
                  <TabsTrigger value="gregorian">Gregorian</TabsTrigger>
                </TabsList>
              </div>
            </div>
            {/* Calendars */}
            <div className="flex gap-2">
              <div className="p-2 rounded space-y-2 mx-auto">
                {/* Availablity Calendars */}
                <TabsContent
                  value="ethiopian"
                  className="flex justify-center mt-0"
                >
                  <EthiopianCalendar
                    mode={selectedDateMode}
                    selected={date}
                    onSelect={(date) => {
                      setDate(Array.isArray(date) ? date : [date]);
                    }}
                    startMonth={startMonth}
                    endMonth={endMonth}
                    reverseYears
                    className="px-0 py-0 pb-1 mx-auto"
                    captionLayout="dropdown"
                  />
                </TabsContent>
                <TabsContent
                  value="gregorian"
                  className="flex justify-center mt-0"
                >
                  <Calendar
                    mode={selectedDateMode}
                    selected={date}
                    onSelect={(date) => {
                      setDate(Array.isArray(date) ? date : [date]);
                    }}
                    startMonth={startMonth}
                    endMonth={endMonth}
                    reverseYears
                    className="px-0 py-2 mx-auto"
                    captionLayout="dropdown"
                  />
                </TabsContent>
              </div>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
