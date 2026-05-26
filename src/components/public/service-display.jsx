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
  CheckCircle,
  AlertCircle,
  Building2,
  MessageCircle,
  CreditCard,
  Loader2,
  Scissors,
  Stethoscope,
  Dumbbell,
  Wrench,
  Coffee,
  Laptop,
  Landmark,
  Wifi,
} from "lucide-react";
import RequestHandler from "@/lib/request-handler";
import { CalendarDatePicker } from "../calendar-date-picker";
import { useRouter } from "next/navigation";
import { useSessionStore } from "@/store";
import Link from "next/link";
import { fallbackServiceImage } from "@/lib/constants";
import PaymentButton from "@/components/payment/button";

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

const fallbackImage = fallbackServiceImage;

export default function PublicOrganizationService({ service }) {
  const router = useRouter();
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [bookingForm, setBookingForm] = useState({ notes: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [user, setUser] = useState(null);
  const [createdAppointment, setCreatedAppointment] = useState(null);
  const [slotCapacities, setSlotCapacities] = useState({});
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

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

  useEffect(() => {
    // Reset slot capacities when date changes
    (async () => setSlotCapacities({}))();
    (async () => setSelectedTime(null))();
  }, [selectedDate]);

  useEffect(() => {
    let isMounted = true;

    const generateTimeSlots = async () => {
      if (!selectedDate || !service.calendar) return;

      setIsLoadingSlots(true);
      // Clear previous slots and capacities immediately
      setAvailableTimeSlots([]);
      setSlotCapacities({});
      setSelectedTime(null);

      const dayOfWeek = selectedDate.getDay();
      const adjustedDay = dayOfWeek === 0 ? 7 : dayOfWeek;
      const isToday =
        selectedDate.setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0);
      const todayHour = new Date().getHours();
      const todayMinute = new Date().getMinutes();
      const todayTime = todayHour * 60 + todayMinute;

      const calendar = service.calendar;
      const availableDays = calendar.available?.weekly || [];
      const availableHours =
        calendar.available?.hours?.length > 0
          ? calendar.available.hours
          : [["00:00", "24:00"]];
      const unavailableHours = calendar.unavailable?.hours || [];

      const slots = [];

      if (availableDays.includes(adjustedDay)) {
        availableHours.forEach((availableHour, idx) => {
          const unavailableHour = unavailableHours[idx];
          const [startHour, startMinute] = (availableHour?.[0] || "00:00")
            .split(":")
            .map(Number);
          const [endHour, endMinute] = (availableHour?.[1] || "24:00")
            .split(":")
            .map(Number);
          const [startHourU, startMinuteU] = (unavailableHour?.[0] || "00:00")
            .split(":")
            .map(Number);
          const [endHourU, endMinuteU] = (unavailableHour?.[1] || "00:00")
            .split(":")
            .map(Number);

          for (let hour = startHour; hour < endHour; hour++) {
            const isBeforeNow = isToday && hour * 60 < todayTime;
            const isInUnavailable = hour >= startHourU && hour < endHourU;

            if (!isBeforeNow && !isInUnavailable) {
              const ampm = hour >= 12 ? "PM" : "AM";
              const displayHour =
                hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
              slots.push(`${displayHour}:00 ${ampm}`);
            }
          }
        });

        if (isMounted) {
          setAvailableTimeSlots(slots);
        }

        // Fetch capacity for each slot
        const capacities = {};
        for (const slot of slots) {
          try {
            const [time, period] = slot.split(" ");
            let [hours, minutes] = time.split(":");
            hours = parseInt(hours);
            if (period === "PM" && hours !== 12) hours += 12;
            if (period === "AM" && hours === 12) hours = 0;

            const slotDateTime = new Date(selectedDate);
            slotDateTime.setHours(hours, parseInt(minutes), 0);

            const availabilityRes = await RequestHandler.Get(
              `/api/v1/availability/check?serviceId=${service.id}&dateTime=${slotDateTime.toISOString()}`,
            );

            if (availabilityRes.ok && isMounted) {
              const data = await availabilityRes.json();
              capacities[slot] = {
                available: data.available,
                current: data.currentBookings || 0,
                max: data.maxCapacity || service.maxClientsPerSlot || 5,
                remaining: data.remaining || 0,
              };
            } else if (isMounted) {
              capacities[slot] = {
                available: true,
                current: 0,
                max: service.maxClientsPerSlot || 5,
                remaining: service.maxClientsPerSlot || 5,
              };
            }
          } catch (error) {
            console.error("Error fetching slot capacity:", error);
            if (isMounted) {
              capacities[slot] = {
                available: true,
                current: 0,
                max: service.maxClientsPerSlot || 5,
                remaining: service.maxClientsPerSlot || 5,
              };
            }
          }
        }

        if (isMounted) {
          setSlotCapacities(capacities);
        }
      } else if (isMounted) {
        setAvailableTimeSlots([]);
        setSlotCapacities({});
        toast.info("This service is not available on the selected day");
      }

      if (isMounted) {
        setIsLoadingSlots(false);
      }
    };

    generateTimeSlots();

    return () => {
      isMounted = false;
    };
  }, [selectedDate, service.calendar, service.id, service.maxClientsPerSlot]);

  const resetBooking = () => {
    setSelectedDate(new Date());
    setSelectedTime(null);
    setBookingForm({ notes: "" });
    setCreatedAppointment(null);
  };
  const handleCreateAppointment = async () => {
    if (!selectedDate || !selectedTime) {
      toast.error("Please select both date and time");
      return;
    }

    if (!user || !isClient) {
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

    const endDateTime = new Date(startDateTime);
    endDateTime.setHours(endDateTime.getHours() + 1);

    setIsSubmitting(true);
    try {
      const res = await RequestHandler.Post("/query/v1/appointment", {
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
          const newAppointment = appointments[0];

          if (requiresPayment) {
            // Paid service - show payment step
            setCreatedAppointment(newAppointment);
            toast.success("Appointment created! Please complete payment.");
          } else {
            // Free service - redirect to success directly
            toast.success("Appointment booked successfully!");
            setShowBookingDialog(false);
            resetBooking();
            setTimeout(() => {
              router.push(
                `/success/appointment?id=${encodeURIComponent(newAppointment.id)}`,
              );
            }, 1000);
          }
        }
      } else {
        const error = await res.json();
        throw new Error(error.error || "Failed to book appointment");
      }
    } catch (error) {
      console.error("Booking error:", error);
      toast.error(error.message || "Failed to book appointment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentSuccess = (paymentData) => {
    toast.success("Payment completed! Your appointment is confirmed.");
    setShowBookingDialog(false);
    resetBooking();
    setTimeout(() => {
      router.push(
        `/success/appointment?id=${encodeURIComponent(createdAppointment?.id)}`,
      );
    }, 1000);
  };

  const handlePaymentError = () => {
    toast.error("Payment failed. You can retry or contact support.");
  };

  if (!service) return null;

  const requiresPayment = service.price > 0;
  const showPaymentStep = requiresPayment && createdAppointment;

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
                onOpenChange={(open) => {
                  setShowBookingDialog(open);
                  if (!open) resetBooking();
                }}
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
                    <DialogTitle>
                      {showPaymentStep && createdAppointment
                        ? "Complete Payment"
                        : "Book Appointment"}
                    </DialogTitle>
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

                    {/* Payment Step */}
                    {showPaymentStep && createdAppointment ? (
                      <div className="space-y-4">
                        <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Amount Due
                              </p>
                              <p className="text-3xl font-bold">
                                ETB {service.price?.toFixed(2)}
                              </p>
                              <p className="text-sm text-gray-500 mt-1">
                                Payment for {service.name}
                              </p>
                            </div>
                            <CreditCard className="h-12 w-12 text-blue-500" />
                          </div>
                        </div>

                        <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <div>
                              <p className="font-medium text-green-800 dark:text-green-400">
                                Appointment Created!
                              </p>
                              <p className="text-sm text-green-700 dark:text-green-500">
                                Please complete payment to confirm your booking.
                              </p>
                            </div>
                          </div>
                        </div>

                        <PaymentButton
                          amount={service.price}
                          appointmentId={createdAppointment.id}
                          email={user?.email}
                          reason={`Payment for ${service.name}`}
                          onSuccess={handlePaymentSuccess}
                          onError={handlePaymentError}
                        />
                      </div>
                    ) : (
                      /* Step 1: Date & Time Selection */
                      <>
                        <div className="flex gap-4">
                          {/* Date Selection */}
                          <div className="flex-1 space-y-2">
                            <Label>Select Date</Label>
                            <CalendarDatePicker
                              mode="single"
                              selected={selectedDate}
                              onSelect={setSelectedDate}
                              disabled={(date) => {
                                if (
                                  date <
                                  new Date(
                                    new Date().getTime() - 24 * 60 * 60000,
                                  )
                                )
                                  return true;
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
                          {selectedDate && (
                            <div className="flex-1 space-y-2">
                              <Label>Select Time</Label>
                              {isLoadingSlots ? (
                                <div className="flex items-center justify-center p-8">
                                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                </div>
                              ) : availableTimeSlots.length > 0 ? (
                                <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto">
                                  {availableTimeSlots.map((time) => {
                                    const capacity = slotCapacities[time];
                                    const currentBookings =
                                      capacity?.current || 0;
                                    const maxCapacity =
                                      capacity?.max ||
                                      service.maxClientsPerSlot ||
                                      5;
                                    const isFull =
                                      currentBookings >= maxCapacity;
                                    const remaining =
                                      capacity?.remaining ||
                                      maxCapacity - currentBookings;

                                    return (
                                      <Button
                                        key={time}
                                        variant={
                                          selectedTime === time
                                            ? "default"
                                            : "outline"
                                        }
                                        onClick={() =>
                                          !isFull && setSelectedTime(time)
                                        }
                                        className="text-sm relative"
                                        disabled={isFull}
                                      >
                                        <Clock className="w-3 h-3 mr-1" />
                                        {time}
                                        {!isFull &&
                                          remaining > 0 &&
                                          remaining < maxCapacity && (
                                            <span className="ml-1 text-[10px] text-yellow-600">
                                              ({remaining} left)
                                            </span>
                                          )}
                                        {isFull && (
                                          <span className="ml-1 text-xs text-red-500">
                                            (Full)
                                          </span>
                                        )}
                                      </Button>
                                    );
                                  })}
                                </div>
                              ) : (
                                <div className="text-center text-sm text-muted-foreground p-4 bg-muted rounded-lg">
                                  No available time slots for this date
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Booking Summary */}
                        {selectedDate && selectedTime && (
                          <div className="p-3 bg-muted rounded-lg space-y-1">
                            <p className="font-medium text-sm">
                              Booking Summary
                            </p>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                Service:
                              </span>
                              <span>{service.name}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                Date:
                              </span>
                              <span>
                                {selectedDate?.toLocaleDateString()} at{" "}
                                {selectedTime}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm font-medium pt-1 border-t">
                              <span>Total:</span>
                              <span>
                                ETB {service.price?.toFixed(2) || "0.00"}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Notes */}
                        <div className="space-y-2">
                          <Label htmlFor="notes">
                            Additional Notes (Optional)
                          </Label>
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
                        <Button
                          onClick={handleCreateAppointment}
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
                              Creating Appointment...
                            </>
                          ) : requiresPayment ? (
                            "Continue to Payment"
                          ) : (
                            "Book Appointment"
                          )}
                        </Button>
                      </>
                    )}
                  </div>
                </DialogContent>
              </Dialog>

              <div className="text-center text-sm text-muted-foreground">
                <MessageCircle className="w-4 h-4 inline mr-1" />
                You'll receive a confirmation email and SMS after payment
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
