"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ClockIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

// // Types
// interface TimeSlot {
//   id: string;
//   time: string;
//   available: boolean;
// }

// interface TimeSlotPickerProps {
//   calendar: Date | null; // Selected date
//   times: Date | null; // Currently selected time
//   setDate: (date: Date | null) => void;
//   workingHours?: {
//     start: string; // Format: "09:00"
//     end: string; // Format: "17:00"
//   };
//   slotDuration?: number; // Duration in minutes (default: 30)
//   breakTimes?: {
//     start: string;
//     end: string;
//   }[];
//   unavailableDates?: string[]; // Dates to disable (format: YYYY-MM-DD)
//   minBookingNotice?: number; // Minimum hours before booking (default: 1)
//   maxDaysInAdvance?: number; // Maximum days in advance (default: 30)
//   onTimeSelect?: (time: Date) => void;
//   className?: string;
// }

export function TimeSlotPicker({
  calendar,
  times,
  setDate,
  workingHours = { start: "09:00", end: "17:00" },
  slotDuration = 30,
  breakTimes = [],
  unavailableDates = [],
  minBookingNotice = 1,
  maxDaysInAdvance = 30,
  onTimeSelect,
  className,
}) {
  // Helper functions
  function formatTimeSlot(date) {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }

  function formatTimeToSlotId(date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const slotIndex = Math.floor(
      (hours * 60 + minutes - parseTimeToMinutes(workingHours.start)) /
        slotDuration,
    );
    return `slot-${slotIndex}`;
  }

  function parseTimeToMinutes(timeStr) {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  }

  function parseTimeToDate(baseDate, timeStr) {
    const [hours, minutes] = timeStr.split(":").map(Number);
    const date = new Date(baseDate);
    date.setHours(hours, minutes, 0, 0);
    return date;
  }

  function formatDateToYYYYMMDD(date) {
    return date.toISOString().split("T")[0];
  }

  const [selectedTimeSlot, setSelectedTimeSlot] = React.useState(
    times ? formatTimeToSlotId(times) : null,
  );
  const [timeSlots, setTimeSlots] = React.useState([]);

  // Check if date is valid for booking
  const isDateValid = React.useCallback(
    (date) => {
      if (!date) return false;

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const selectedDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
      );

      // Check if date is in the past
      if (selectedDate < today) return false;

      // Check max days in advance
      const maxDate = new Date(today);
      maxDate.setDate(today.getDate() + maxDaysInAdvance);
      if (selectedDate > maxDate) return false;

      // Check if date is in unavailable dates
      const dateStr = formatDateToYYYYMMDD(date);
      if (unavailableDates.includes(dateStr)) return false;

      return true;
    },
    [maxDaysInAdvance, unavailableDates],
  );

  // Generate time slots for the selected date
  React.useEffect(() => {
    if (!calendar || !isDateValid(calendar)) {
      (async () => setTimeSlots([]))();
      return;
    }

    const slots = [];
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const isToday =
      formatDateToYYYYMMDD(calendar) === formatDateToYYYYMMDD(today);

    // Parse working hours
    const [startHour, startMinute] = workingHours.start.split(":").map(Number);
    const [endHour, endMinute] = workingHours.end.split(":").map(Number);

    let currentTime = new Date(calendar);
    currentTime.setHours(startHour, startMinute, 0, 0);

    const endTime = new Date(calendar);
    endTime.setHours(endHour, endMinute, 0, 0);

    // Parse break times for the selected date
    const breaksForDay = breakTimes.map((breakTime) => ({
      start: parseTimeToDate(calendar, breakTime.start),
      end: parseTimeToDate(calendar, breakTime.end),
    }));

    let slotId = 0;
    while (currentTime < endTime) {
      const slotEndTime = new Date(currentTime);
      slotEndTime.setMinutes(slotEndTime.getMinutes() + slotDuration);

      if (slotEndTime > endTime) break;

      // Check if slot is in the past (for today)
      let isPast = false;
      if (isToday) {
        const minBookingTime = new Date(now);
        minBookingTime.setHours(
          now.getHours() + minBookingNotice,
          now.getMinutes(),
          0,
          0,
        );
        isPast = currentTime < minBookingTime;
      }

      // Check if slot overlaps with any break time
      const isBreak = breaksForDay.some((breakSlot) => {
        return (
          (currentTime >= breakSlot.start && currentTime < breakSlot.end) ||
          (slotEndTime > breakSlot.start && slotEndTime <= breakSlot.end)
        );
      });

      // Check if slot is on weekend (Saturday/Sunday)
      const isWeekend = calendar.getDay() === 0 || calendar.getDay() === 6;

      const isAvailable = !isPast && !isBreak && !isWeekend;

      slots.push({
        id: `slot-${slotId}`,
        time: formatTimeSlot(currentTime),
        available: isAvailable,
      });

      currentTime = slotEndTime;
      slotId++;
    }

    setTimeSlots(slots);

    // Clear selected time if it's no longer available
    if (selectedTimeSlot) {
      const selectedSlot = slots.find((slot) => slot.id === selectedTimeSlot);
      if (!selectedSlot || !selectedSlot.available) {
        setSelectedTimeSlot(null);
        setDate(null);
      }
    }
  }, [
    calendar,
    workingHours,
    slotDuration,
    breakTimes,
    minBookingNotice,
    isDateValid,
    selectedTimeSlot,
    setDate,
  ]);

  const handleTimeSelect = (slot) => {
    if (!slot.available) return;

    setSelectedTimeSlot(slot.id);

    // Create full datetime
    if (calendar) {
      const [timeStr] = slot.time.split(" ");
      const [hours, minutes] = timeStr.split(":");
      const selectedDateTime = new Date(calendar);
      selectedDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      setDate(selectedDateTime);
      onTimeSelect?.(selectedDateTime);
    }
  };

  // Group time slots into rows for better display
  const groupedSlots = React.useMemo(() => {
    const groups = [];
    for (let i = 0; i < timeSlots.length; i += 4) {
      groups.push(timeSlots.slice(i, i + 4));
    }
    return groups;
  }, [timeSlots]);

  if (!calendar) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center p-8 text-center",
          className,
        )}
      >
        <ClockIcon className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Please select a date first</p>
      </div>
    );
  }

  if (!isDateValid(calendar)) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center p-8 text-center",
          className,
        )}
      >
        <ClockIcon className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">
          {calendar < new Date(new Date().setHours(0, 0, 0, 0))
            ? "Cannot book past dates"
            : "Selected date is not available for booking"}
        </p>
      </div>
    );
  }

  if (timeSlots.length === 0) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center p-8 text-center",
          className,
        )}
      >
        <ClockIcon className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">
          No available time slots for this date
        </p>
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-medium">Available Time Slots</h3>
        <p className="text-xs text-muted-foreground">
          {timeSlots.filter((slot) => slot.available).length} slots available
        </p>
      </div>

      <ScrollArea className="h-[320px] pr-4">
        <div className="space-y-2">
          {groupedSlots.map((group, groupIndex) => (
            <div key={groupIndex} className="grid grid-cols-4 gap-2">
              {group.map((slot) => (
                <Button
                  key={slot.id}
                  variant={selectedTimeSlot === slot.id ? "default" : "outline"}
                  disabled={!slot.available}
                  onClick={() => handleTimeSelect(slot)}
                  className={cn(
                    "h-10 text-sm font-normal",
                    !slot.available && "opacity-50 cursor-not-allowed",
                    selectedTimeSlot === slot.id &&
                      "bg-primary text-primary-foreground",
                  )}
                >
                  {slot.time}
                </Button>
              ))}
            </div>
          ))}
        </div>
      </ScrollArea>

      {selectedTimeSlot && (
        <div className="mt-4 p-3 bg-muted rounded-lg">
          <p className="text-sm">
            Selected time:{" "}
            <span className="font-medium">
              {timeSlots.find((slot) => slot.id === selectedTimeSlot)?.time}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}

// Alternative compact version for mobile
export function CompactTimeSlotPicker({
  calendar,
  times,
  setDate,
  workingHours = { start: "09:00", end: "17:00" },
  slotDuration = 30,
  ...props
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const selectedTimeStr = times
    ? times.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : null;

  return (
    <div className="relative">
      <Button
        variant="outline"
        className="w-full justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selectedTimeStr || "Select time"}</span>
        <ChevronRightIcon
          className={cn("h-4 w-4 transition-transform", isOpen && "rotate-90")}
        />
      </Button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-full bg-popover rounded-md border shadow-md p-4">
          <TimeSlotPicker
            calendar={calendar}
            times={times}
            setDate={(date) => {
              setDate(date);
              setIsOpen(false);
            }}
            workingHours={workingHours}
            slotDuration={slotDuration}
            {...props}
          />
        </div>
      )}
    </div>
  );
}
