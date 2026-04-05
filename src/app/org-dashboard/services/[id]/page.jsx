// src/app/org-dashboard/services/[id]/page.jsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  DollarSign,
  Star,
  MapPin,
  Building,
  CheckCircle,
  Phone,
  Mail,
  CalendarDays,
  Shield,
  Globe,
  Share2,
  Bookmark,
  CreditCard,
  Smartphone,
  AlertTriangle,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format } from "date-fns";

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const serviceId = params.id;

  // State
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
    paymentMethod: "card",
    agreeTerms: false,
  });
  const [loading, setLoading] = useState(true);
  const [service, setService] = useState(null);

  // Mock time slots
  const getTimeSlots = (date) => {
    const baseSlots = [
      "09:00 AM", "10:00 AM", "11:00 AM", 
      "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"
    ];
    return baseSlots.map(time => ({
      time,
      available: Math.random() > 0.3
    }));
  };

  const timeSlots = selectedDate ? getTimeSlots(selectedDate) : [];

  // Fetch service data
  useEffect(() => {
    setTimeout(() => {
      const mockService = {
        id: parseInt(serviceId),
        name: "Business Consultation",
        organization: "TechCorp Solutions",
        orgLogo: "https://i.pravatar.cc/150?u=techcorp",
        category: "Consulting",
        description: "Expert business advice for startups and enterprises.",
        longDescription: "Our comprehensive business consultation service is designed to help startups and established businesses navigate challenges and seize opportunities. Whether you're looking to launch a new product, enter a new market, or optimize your operations, our team of experienced consultants provides tailored advice and actionable strategies.\n\nWith over 15 years of industry experience, we've helped hundreds of businesses achieve their goals through strategic planning, market analysis, and growth optimization. Our approach combines data-driven insights with practical implementation strategies to ensure measurable results.\n\nWe specialize in working with businesses of all sizes - from early-stage startups to established enterprises. Each consultation is tailored to your specific needs, ensuring you get the most value from our expertise. Our consultants take the time to understand your unique challenges and opportunities before developing a customized roadmap for success.\n\nWhat sets us apart is our commitment to actionable advice. You won't just walk away with ideas - you'll have a clear, step-by-step plan that you can implement immediately. We provide ongoing support to ensure you're on track and achieving your goals.",
        duration: 60,
        price: 150,
        rating: 4.8,
        reviewCount: 124,
        availableSlots: 12,
        location: "San Francisco, CA",
        address: "123 Business Ave, Suite 100, San Francisco, CA 94105",
        contactEmail: "consulting@techcorp.com",
        contactPhone: "+1 (555) 123-4567",
        website: "www.techcorp.com",
        socialMedia: {
          facebook: "#",
          twitter: "#",
          linkedin: "#",
          instagram: "#",
        },
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3",
        features: [
          "Strategic Planning & Business Roadmapping",
          "Market Analysis & Competitive Research",
          "Growth Strategy Development",
          "Operational Efficiency Optimization",
          "Financial Modeling & Forecasting",
          "Risk Assessment & Mitigation"
        ],
        benefits: [
          "One-on-one consultation with industry experts",
          "Customized strategies for your specific needs",
          "Actionable insights and implementation guidance",
          "Post-consultation support and resources",
          "Flexible scheduling options",
          "Confidentiality guaranteed"
        ],
        requirements: [
          "Business plan or company overview",
          "Specific questions or challenges to address",
          "Any relevant documents or data",
          "Valid business registration (if applicable)",
        ],
      };
      setService(mockService);
      setLoading(false);
    }, 500);
  }, [serviceId]);

  const isDateAvailable = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today;
  };

  const handleBooking = () => {
    console.log("Booking confirmed:", {
      serviceId,
      date: selectedDate,
      time: selectedTime,
      employee: selectedEmployee,
      ...bookingDetails
    });
    setIsBookingDialogOpen(false);
    alert("✅ Booking confirmed! Check your email for details.");
    setSelectedDate(null);
    setSelectedTime("");
    setSelectedEmployee("");
    setBookingDetails({
      name: "",
      email: "",
      phone: "",
      notes: "",
      paymentMethod: "card",
      agreeTerms: false,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Loading service details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Back Navigation */}
      <div className="border-b border-border bg-card/50 sticky top-0 z-10 backdrop-blur-sm">
        <div className="container mx-auto px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Services
            </Button>
            <Badge variant="outline" className="bg-primary-600/10 text-primary-600 border-primary-600/20">
              <CalendarDays className="h-3.5 w-3.5 mr-1" />
              {service.availableSlots} slots available
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Expanded Service Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Service Header - Expanded */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-6">
                  <Avatar className="h-16 w-16 border-2 border-primary-600/20">
                    <AvatarImage src={service.orgLogo} />
                    <AvatarFallback>{service.organization[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h1 className="text-3xl font-bold">{service.name}</h1>
                      <Badge className="bg-primary-600/10 text-primary-600 border-primary-600/20">
                        {service.category}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground">{service.organization}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                        <span className="font-medium">{service.rating}</span>
                        <span className="text-sm text-muted-foreground">
                          ({service.reviewCount} reviews)
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-primary-600" />
                        <span className="text-sm">{service.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-primary-600" />
                        <span className="text-sm">{service.duration} minutes</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Expanded Description */}
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-3">About this service</h2>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                      {service.longDescription}
                    </p>
                  </div>

                  {/* Features Grid - Expanded */}
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Key Features</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {service.features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Benefits */}
                  <div>
                    <h3 className="font-semibold text-lg mb-3">What You'll Get</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {service.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Requirements */}
                  <div className="p-5 bg-yellow-500/5 rounded-lg border border-yellow-500/20">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      <h3 className="font-semibold text-lg">Before You Book</h3>
                    </div>
                    <ul className="list-disc list-inside space-y-1.5 text-sm text-muted-foreground">
                      {service.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Booking Card */}
          <div className="space-y-6">
            {/* Booking Card */}
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-xl">Book This Service</CardTitle>
                <CardDescription>
                  Select your preferred date and time
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Price & Duration */}
                <div className="bg-gradient-to-r from-primary-600/10 to-transparent p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Price</p>
                      <p className="text-3xl font-bold text-primary-600">
                        ${service.price}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Duration</p>
                      <p className="font-semibold text-lg">{service.duration} min</p>
                    </div>
                  </div>
                </div>

                {/* Calendar */}
                <div>
                  <Label className="text-base mb-3 block font-semibold">
                    Select Date
                  </Label>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => !isDateAvailable(date)}
                    className="rounded-lg border w-full"
                    classNames={{
                      day_selected: "bg-primary-600 text-white hover:bg-primary-700",
                      day_today: "bg-primary-600/10 text-primary-600 font-bold",
                    }}
                    fromDate={new Date()}
                  />
                </div>

                {/* Time Slots */}
                {selectedDate && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <Label className="text-base font-semibold">
                        Available Times
                      </Label>
                      <span className="text-xs text-muted-foreground">
                        {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {timeSlots.map(({ time, available }) => (
                        <TooltipProvider key={time}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div>
                                <Button
                                  variant={selectedTime === time ? "default" : "outline"}
                                  className={`w-full ${
                                    selectedTime === time
                                      ? "bg-primary-600 hover:bg-primary-700"
                                      : !available
                                      ? "opacity-50 cursor-not-allowed"
                                      : "hover:border-primary-600"
                                  }`}
                                  onClick={() => available && setSelectedTime(time)}
                                  disabled={!available}
                                >
                                  <Clock className="h-3.5 w-3.5 mr-1.5" />
                                  {time}
                                </Button>
                              </div>
                            </TooltipTrigger>
                            {!available && (
                              <TooltipContent>
                                <p>This slot is already booked</p>
                              </TooltipContent>
                            )}
                          </Tooltip>
                        </TooltipProvider>
                      ))}
                    </div>
                  </div>
                )}

                {/* Book Button */}
                <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      className="w-full bg-primary-600 hover:bg-primary-700 h-12 text-base"
                      disabled={!selectedDate || !selectedTime}
                    >
                      <CalendarDays className="h-5 w-5 mr-2" />
                      Proceed to Book
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-bold">Complete Your Booking</DialogTitle>
                      <DialogDescription>
                        Please provide your details to confirm the appointment
                      </DialogDescription>
                    </DialogHeader>

                    {/* Booking Summary */}
                    <div className="bg-primary-600/5 p-4 rounded-lg space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Service:</span>
                        <span className="font-medium">{service.name}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Date:</span>
                        <span className="font-medium">
                          {selectedDate && format(selectedDate, "PPP")}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Time:</span>
                        <span className="font-medium">{selectedTime}</span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between font-semibold">
                        <span>Total:</span>
                        <span className="text-primary-600">${service.price}</span>
                      </div>
                    </div>

                    {/* Contact Form */}
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            placeholder="John Doe"
                            value={bookingDetails.name}
                            onChange={(e) =>
                              setBookingDetails({ ...bookingDetails, name: e.target.value })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="john@example.com"
                            value={bookingDetails.email}
                            onChange={(e) =>
                              setBookingDetails({ ...bookingDetails, email: e.target.value })
                            }
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          placeholder="+1 (555) 000-0000"
                          value={bookingDetails.phone}
                          onChange={(e) =>
                            setBookingDetails({ ...bookingDetails, phone: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="notes">Additional Notes (Optional)</Label>
                        <Textarea
                          id="notes"
                          placeholder="Any special requirements or questions..."
                          value={bookingDetails.notes}
                          onChange={(e) =>
                            setBookingDetails({ ...bookingDetails, notes: e.target.value })
                          }
                          className="resize-none"
                          rows={3}
                        />
                      </div>

                      {/* Payment Method */}
                      <div className="space-y-2">
                        <Label>Payment Method</Label>
                        <RadioGroup
                          value={bookingDetails.paymentMethod}
                          onValueChange={(value) =>
                            setBookingDetails({ ...bookingDetails, paymentMethod: value })
                          }
                          className="grid grid-cols-2 gap-2"
                        >
                          <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:border-primary-600">
                            <RadioGroupItem value="card" id="card" />
                            <Label htmlFor="card" className="cursor-pointer flex items-center gap-2">
                              <CreditCard className="h-4 w-4" />
                              Card
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:border-primary-600">
                            <RadioGroupItem value="paypal" id="paypal" />
                            <Label htmlFor="paypal" className="cursor-pointer flex items-center gap-2">
                              <Smartphone className="h-4 w-4" />
                              PayPal
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      {/* Terms */}
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="terms"
                          checked={bookingDetails.agreeTerms}
                          onCheckedChange={(checked) =>
                            setBookingDetails({ ...bookingDetails, agreeTerms: checked === true })
                          }
                        />
                        <Label htmlFor="terms" className="text-sm">
                          I agree to the terms and conditions and cancellation policy
                        </Label>
                      </div>
                    </div>

                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsBookingDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button
                        onClick={handleBooking}
                        className="bg-primary-600 hover:bg-primary-700"
                        disabled={
                          !bookingDetails.name ||
                          !bookingDetails.email ||
                          !bookingDetails.phone ||
                          !bookingDetails.agreeTerms
                        }
                      >
                        Confirm Booking
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* Legend */}
                <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground pt-2">
                  <div className="flex items-center gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-primary-600"></div>
                    <span>Available</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-gray-300"></div>
                    <span>Booked</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <p className="text-xs text-center w-full text-muted-foreground">
                  <Shield className="h-3.5 w-3.5 inline mr-1" />
                  Free cancellation up to 24 hours before appointment
                </p>
              </CardFooter>
            </Card>

            {/* Organization Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Organization Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Building className="h-4 w-4 text-primary-600 flex-shrink-0" />
                  <span>{service.organization}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-primary-600 flex-shrink-0" />
                  <span className="text-muted-foreground">{service.address}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-primary-600 flex-shrink-0" />
                  <a href={`mailto:${service.contactEmail}`} className="hover:text-primary-600">
                    {service.contactEmail}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-primary-600 flex-shrink-0" />
                  <a href={`tel:${service.contactPhone}`} className="hover:text-primary-600">
                    {service.contactPhone}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="h-4 w-4 text-primary-600 flex-shrink-0" />
                  <a href={`https://${service.website}`} target="_blank" rel="noopener noreferrer" className="hover:text-primary-600">
                    {service.website}
                  </a>
                </div>

                <Separator className="my-2" />

                {/* Social Media */}
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary-600/10 hover:text-primary-600">
                    <Facebook className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary-600/10 hover:text-primary-600">
                    <Twitter className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary-600/10 hover:text-primary-600">
                    <Linkedin className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary-600/10 hover:text-primary-600">
                    <Instagram className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Share & Save */}
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 hover:border-primary-600 hover:text-primary-600">
                <Bookmark className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" className="flex-1 hover:border-primary-600 hover:text-primary-600">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}