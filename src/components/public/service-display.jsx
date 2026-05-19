// src/components/public/service-display.jsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Calendar,
  Clock,
  DollarSign,
  MapPin,
  Phone,
  Mail,
  User,
  CheckCircle,
  AlertCircle,
  Building2,
  Star,
  MessageCircle,
  Scissors,
  Stethoscope,
  Dumbbell,
  Wrench,
  Coffee,
  Laptop,
  Landmark,
  Wifi,
  Loader2,
} from "lucide-react";
import RequestHandler from "@/lib/request-handler";
import { CalendarDatePicker } from "../calendar-date-picker";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const sectorIcons = {
  Beauty: Scissors,
  Healthcare: Stethoscope,
  Fitness: Dumbbell,
  Automotive: Wrench,
  "Food & Beverage": Coffee,
  Technology: Laptop,
  Banking: Landmark,
  Telecommunications: Wifi,
  Government: Building2,
};

const sectorImages = {
  Beauty: "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=800&auto=format&fit=crop",
  Healthcare: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=800&auto=format&fit=crop",
  Fitness: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop",
  Automotive: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?q=80&w=800&auto=format&fit=crop",
  "Food & Beverage": "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=800&auto=format&fit=crop",
  Technology: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800&auto=format&fit=crop",
  Banking: "https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?q=80&w=800&auto=format&fit=crop",
  Telecommunications: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=800&auto=format&fit=crop",
  Government: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?q=80&w=800&auto=format&fit=crop",
};

const getServiceImage = (sector) => {
  const normalized = Object.keys(sectorImages).find(
    (key) => key.toLowerCase() === (sector || "").toLowerCase()
  );
  return sectorImages[normalized] || "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop";
};

export default function PublicOrganizationService({ service }) {
  const router = useRouter();
  const [isBooking, setIsBooking] = useState(false);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [bookingForm, setBookingForm] = useState({
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [organization, setOrganization] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [user, setUser] = useState(null);

  const SectorIcon = sectorIcons[service.organization?.sector] || Building2;

  // Check if user is logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await RequestHandler.Get("/query/v1/user?mine");
        if (res.ok) {
          const { users } = await res.json();
          if (users?.[0]) {
            setIsClient(true);
            setUser(users[0]);
          }
        }
      } catch (error) {
        setIsClient(false);
      }
    };
    checkAuth();
  }, []);

  // Generate available time slots based on selected date and calendar
  useEffect(() => {
    (async () => {
      if (selectedDate && service.calendar) {
        const dayOfWeek = selectedDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
        const adjustedDay = dayOfWeek === 0 ? 7 : dayOfWeek; // Convert to 1-7 (Monday=1, Sunday=7)

        const calendar = service.calendar;
        const availableDays = calendar.available?.weekly || [];
        const availableHours = calendar.available?.hours || [
          ["08:00", "17:30"],
        ];
        const unavailableHours = calendar.unavailable?.hours || [
          ["11:00", "14:00"],
        ];

        // Check if service is available on this day
        const slots = [];
        if (availableDays.includes(adjustedDay)) {
          // Generate time slots based on available hours
          availableHours.map((availableHour, idx) => {
            const unavailableHour = unavailableHours[idx];
            const [startHour, startMinute] = availableHour[0]
              .split(":")
              .map(Number);
            const [endHour, endMinute] = availableHour[1]
              .split(":")
              .map(Number);

            const [startHourU, startMinuteU] = unavailableHour[0]
              .split(":")
              .map(Number);
            const [endHourU, endMinuteU] = unavailableHour[1]
              .split(":")
              .map(Number);

            for (let hour = startHour; hour < endHour; hour++) {
              const ampm = hour >= 12 ? "PM" : "AM";
              if (!(hour >= startHourU && hour < endHourU)) {
                const displayHour =
                  hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
                slots.push(`${displayHour}:00 ${ampm}`);
                if (hour < endHour || (hour === endHour - 1 && endMinute > 0)) {
                  slots.push(`${displayHour}:30 ${ampm}`);
                }
              }
            }
          });
          setAvailableTimeSlots(slots);
        } else {
          setAvailableTimeSlots([]);
          toast.info("This service is not available on the selected day");
        }
        setSelectedTime(null);
      }
    })();
  }, [selectedDate, service.calendar]);

  const handleBookAppointment = async () => {
    if (!selectedDate || !selectedTime) {
      toast.error("Please select both date and time");
      return;
    }

    if (!isClient) {
      toast.error("Please login to book an appointment");
      return;
    }

    // Parse date and time to create startTime
    const [time, period] = selectedTime.split(" ");
    let [hours, minutes] = time.split(":");
    hours = parseInt(hours);
    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;

    const startDateTime = new Date(selectedDate);
    startDateTime.setHours(hours, parseInt(minutes), 0);

    // Calculate end time (assuming 1 hour service duration)
    const endDateTime = new Date(startDateTime);
    endDateTime.setHours(endDateTime.getHours() + 1);

    setIsSubmitting(true);
    try {
      const res = await RequestHandler.Post("/query/v1/appointment?client", {
        body: {
          serviceId: service.id,
          startTime: startDateTime.toISOString(),
          endTime: endDateTime.toISOString(),
          notes: bookingForm.notes,
        },
      });

      if (res.ok) {
        const { appointments } = await res.json();
        if (appointments.length > 0) {
          toast.success("Appointment booked successfully!");
          setShowBookingDialog(false);
          setSelectedDate(null);
          setSelectedTime(null);
          setBookingForm({ notes: "" });
          setTimeout(() => {
            router.push(
              `/success/appointment?id=${encodeURIComponent(appointments[0].id)}`,
            );
          });
          return;
        }
      }
      const error = await res.json();
      throw new Error(error.message || "Failed to book appointment");
    } catch (error) {
      console.error("Booking error:", error);
      toast.error(error.message || "Failed to book appointment");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!service) return null;

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="grid lg:grid-cols-3 gap-8 items-start">
        {/* Main Content - Left Column (Unified Cohesive Card) */}
        <div className="lg:col-span-2">
          <Card className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm flex flex-col">
            {/* Service matching Image with badge at the top */}
            <div className="relative h-64 md:h-[420px] w-full overflow-hidden bg-slate-100 shrink-0">
              <img
                src={getServiceImage(service.organization?.sector)}
                alt={service.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute top-4 right-4 flex gap-2">
                <Badge className={cn("text-white backdrop-blur-sm border shadow-sm font-semibold rounded-full px-3 py-1 text-xs", service.isActive ? "bg-emerald-500/90 border-emerald-400" : "bg-rose-500/90 border-rose-400")}>
                  {service.isActive ? "Available" : "Unavailable"}
                </Badge>
              </div>
            </div>

            <CardContent className="p-6 md:p-8 space-y-6">
              {/* Price and Sector badge */}
              <div className="flex items-center justify-between">
                <div className="text-3xl font-extrabold text-primary">
                  ETB {service.price?.toFixed(2) || "0.00"}
                </div>
                {service.organization?.sector && (
                  <Badge
                    variant="outline"
                    className="border-primary/20 text-primary bg-primary/5 rounded-full px-3 py-1 text-xs font-semibold"
                  >
                    {service.organization.sector}
                  </Badge>
                )}
              </div>

              {/* Service title and description */}
              <div className="space-y-3">
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight">
                  {service.name}
                </h1>
                {service.description && (
                  <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                    {service.description}
                  </p>
                )}
              </div>

              {/* Location address */}
              <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                <MapPin className="h-4.5 w-4.5 text-slate-400 shrink-0" />
                <span>{service.organization?.address || "Address not listed"}</span>
              </div>

              {/* Divider */}
              <div className="border-t border-slate-100 dark:border-slate-800" />

              {/* Attributes grid (weekly hours, quality verified) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                {service.calendar && (
                  <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 rounded-xl border border-slate-150/50 text-slate-650 min-w-0">
                    <Calendar className="w-4.5 h-4.5 text-slate-450 shrink-0" />
                    <span className="truncate">
                      Available:{" "}
                      {service.calendar.available?.weekly
                        ?.map(
                          (d) =>
                            ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][
                              d - 1
                            ],
                        )
                        .join(", ")}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 rounded-xl border border-slate-150/50 text-slate-650 min-w-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
                  <span className="truncate font-semibold text-slate-700">Premium Quality Verified</span>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-slate-100 dark:border-slate-800" />

              {/* Service Provider Profile Section */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/55 p-4 rounded-xl border border-slate-100">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-base border border-primary/20 shrink-0">
                    {service.organization?.name?.substring(0, 2).toUpperCase() || "SP"}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-slate-900 truncate">
                      {service.organization?.name}
                    </div>
                    <div className="text-xs text-slate-450 truncate">
                      {service.organization?.email}
                    </div>
                    {service.organization?.phone && (
                      <div className="text-xs text-slate-400 mt-0.5 font-medium">
                        {service.organization.phone}
                      </div>
                    )}
                  </div>
                </div>
                {service.organization?.isGovernment && (
                  <Badge variant="outline" className="gap-1 rounded-full text-slate-500 border-slate-200 bg-white shadow-sm shrink-0">
                    <Building2 className="w-3.5 h-3.5" />
                    Government Org
                  </Badge>
                )}
              </div>

              {/* Divider */}
              <div className="border-t border-slate-100 dark:border-slate-800" />

              {/* What to Expect checklist */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">What to Expect</h4>
                <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <li className="flex items-center gap-2.5 text-xs font-semibold text-slate-650">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    Professional delivery
                  </li>
                  <li className="flex items-center gap-2.5 text-xs font-semibold text-slate-650">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    Timely appointment
                  </li>
                  <li className="flex items-center gap-2.5 text-xs font-semibold text-slate-650">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    Quality guaranteed
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Booking Sidebar - Right Column */}
        <div className="lg:col-span-1">
          <Card className="sticky top-8 rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm flex flex-col">
            {/* Same image style as first card at the top */}
            <div className="relative h-44 w-full overflow-hidden bg-slate-100 shrink-0">
              <img
                src={getServiceImage(service.organization?.sector)}
                alt={service.name}
                className="h-full w-full object-cover"
              />
            </div>

            <CardContent className="p-6 space-y-5">
              <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
                <div className="text-3xl font-extrabold text-primary">
                  ETB {service.price?.toFixed(2) || "0.00"}
                </div>
                <div className="text-xs font-medium text-slate-400 mt-0.5">
                  per appointment
                </div>
              </div>

              <Separator />

              <Dialog
                open={showBookingDialog}
                onOpenChange={setShowBookingDialog}
                className="min-w-xl"
              >
                <DialogTrigger asChild>
                  <Button
                    className="w-full text-sm font-semibold h-11 rounded-full shadow-md transition-all hover:shadow-lg"
                    size="lg"
                    disabled={!service.isActive}
                  >
                    Book Appointment
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-full min-w-xl sm:max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Book Appointment</DialogTitle>
                  </DialogHeader>

                  <div className="space-y-4 py-4">
                    {/* Not logged in warning */}
                    {!isClient && (
                      <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-medium text-yellow-800 dark:text-yellow-200">
                            Please login to book
                          </p>
                          <p className="text-yellow-700 dark:text-yellow-300">
                            You need to be logged in to book an appointment.
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="flex gap-2">
                      {/* Date Selection */}
                      <div className="space-y-2">
                        <Label>Select Date</Label>
                        <CalendarDatePicker
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          disabled={(date) => {
                            // Disable past dates
                            if (
                              date <
                              new Date(new Date().getTime() - 24 * 60 * 60000)
                            )
                              return true;
                            // Check if available on this day of week
                            if (service.calendar) {
                              const dayOfWeek = date.getDay();
                              const adjustedDay =
                                dayOfWeek === 0 ? 7 : dayOfWeek;
                              return !service.calendar.available?.weekly?.includes(
                                adjustedDay,
                              );
                            }
                            return false;
                          }}
                          className="rounded-md border"
                        />
                      </div>

                      {/* Time Selection */}
                      {selectedDate && availableTimeSlots.length > 0 && (
                        <div className="space-y-2">
                          <Label>Select Time</Label>
                          <div className="grid grid-cols-3 gap-2">
                            {availableTimeSlots.map((time) => (
                              <Button
                                key={time}
                                variant={
                                  selectedTime === time ? "default" : "outline"
                                }
                                onClick={() => setSelectedTime(time)}
                                className="text-sm"
                              >
                                <Clock className="w-3 h-3 mr-1" />
                                {time}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {selectedDate && availableTimeSlots.length === 0 && (
                      <div className="text-center text-sm text-muted-foreground p-4 bg-muted rounded-lg">
                        No available time slots for this date
                      </div>
                    )}

                    {/* Notes */}
                    <div className="space-y-2">
                      <Label htmlFor="notes">Additional Notes (Optional)</Label>
                      <Textarea
                        id="notes"
                        placeholder="Any special requests or notes for the service provider..."
                        value={bookingForm.notes}
                        onChange={(e) =>
                          setBookingForm({
                            ...bookingForm,
                            notes: e.target.value,
                          })
                        }
                        rows={3}
                      />
                    </div>

                    {/* Booking Summary */}
                    {selectedDate && selectedTime && (
                      <div className="p-3 bg-muted rounded-lg space-y-1">
                        <p className="font-medium text-sm">Booking Summary</p>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Service:
                          </span>
                          <span>{service.name}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Date:</span>
                          <span>
                            {selectedDate?.toLocaleDateString()} at{" "}
                            {selectedTime}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm font-medium pt-1 border-t">
                          <span>Total:</span>
                          <span>ETB {service.price?.toFixed(2) || "0.00"}</span>
                        </div>
                      </div>
                    )}

                    <Button
                      onClick={handleBookAppointment}
                      disabled={
                        !isClient ||
                        !selectedDate ||
                        !selectedTime ||
                        isSubmitting
                      }
                      className="w-full"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Booking...
                        </>
                      ) : (
                        "Confirm Booking"
                      )}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <div className="text-center text-sm text-muted-foreground">
                <MessageCircle className="w-4 h-4 inline mr-1" />
                You'll receive a confirmation email and SMS
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
