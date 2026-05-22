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
import { redirect, useRouter } from "next/navigation";
import { useSessionStore } from "@/store";
import Link from "next/link";

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

const fallbackImage =
  "https://images.unsplash.com/photo-1604076850742-4c7221f3101b?w=800&auto=format";

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

    if (!user || (user && !isClient)) {
      toast.error("Please login as a client to book an appointment");
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
    <div className="container mx-auto px-4 pb-8 max-w-6xl">
      {/* Service Header */}
      <div
        className="flex flex-col justify-end mb-8 h-[400px] rounded"
        style={{
          background: `url('${service.imageUrl || fallbackImage}') left / cover no-repeat`,
        }}
      >
        <div className="p-4 text-white bg-black/50 rounded-[5px] backdrop-blur-md">
          {/* <Badge variant="secondary" className="mb-4 gap-2">
            {service.isActive ? (
              <>
                <CheckCircle className="w-3 h-3" />
                Available
              </>
            ) : (
              "Unavailable"
            )}
          </Badge> */}
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {service.name}
          </h1>
          <p className="text-muted text-lg">{service.description}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content - Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Service Details */}
          <Card>
            <CardHeader>
              <CardTitle>Service Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <span className="font-medium">Price</span>
                </div>
                <span className="text-2xl font-bold">
                  ETB {service.price?.toFixed(2) || "0.00"}
                </span>
              </div>

              {service.calendar && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>
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
            </CardContent>
          </Card>

          {/* Organization Info */}
          {service.organization && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {/* <SectorIcon className="w-5 h-5" /> */}
                  Service Provider
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    <Link href={`/organization/${service.organization.id}`}>
                      {service.organization.name}
                    </Link>
                  </h3>
                  <div className="space-y-2 text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{service.organization.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>{service.organization.email}</span>
                    </div>
                    {service.organization.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>{service.organization.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
                {service.organization.isGovernment && (
                  <Badge variant="outline" className="gap-1">
                    <Building2 className="w-3 h-3" />
                    Government Organization
                  </Badge>
                )}
              </CardContent>
            </Card>
          )}

          {/* Additional Info */}
          {/* <Card>
            <CardHeader>
              <CardTitle>What to Expect</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  <span>Professional service delivery</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  <span>Timely appointment handling</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  <span>Quality assurance guaranteed</span>
                </li>
              </ul>
            </CardContent>
          </Card> */}
        </div>

        {/* Booking Sidebar - Right Column */}
        <div className="lg:col-span-1">
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle>Book This Service</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-primary/10 rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  ETB {service.price?.toFixed(2) || "0.00"}
                </div>
                <div className="text-sm text-muted-foreground">
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
                    className="w-full"
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
                        !user ||
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
                      ) : isClient ? (
                        "Confirm Booking"
                      ) : (
                        "Login as a Client First"
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
