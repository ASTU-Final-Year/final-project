// src/app/org-dashboard/calendar/page.jsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Clock,
  Users,
  ChevronLeft,
  ChevronRight,
  Plus,
  Filter,
  ArrowLeft,
  MoreVertical,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertCircle,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState("week");

  const appointments = [
    {
      id: 1,
      title: "Business Consultation",
      client: "John Smith",
      service: "Business Consultation",
      employee: "Sarah Johnson",
      date: "2024-12-20",
      time: "09:00",
      duration: 60,
      status: "confirmed",
      avatar: "https://i.pravatar.cc/150?u=client1",
    },
    {
      id: 2,
      title: "Financial Planning",
      client: "Emma Wilson",
      service: "Financial Planning",
      employee: "Michael Chen",
      date: "2024-12-20",
      time: "11:30",
      duration: 90,
      status: "pending",
      avatar: "https://i.pravatar.cc/150?u=client2",
    },
    {
      id: 3,
      title: "Legal Advisory",
      client: "Robert Brown",
      service: "Legal Advisory",
      employee: "Emily Rodriguez",
      date: "2024-12-20",
      time: "14:00",
      duration: 45,
      status: "confirmed",
      avatar: "https://i.pravatar.cc/150?u=client3",
    },
    {
      id: 4,
      title: "IT Support",
      client: "Lisa Anderson",
      service: "IT Support",
      employee: "David Kim",
      date: "2024-12-20",
      time: "16:30",
      duration: 30,
      status: "cancelled",
      avatar: "https://i.pravatar.cc/150?u=client4",
    },
    {
      id: 5,
      title: "Marketing Strategy",
      client: "James Taylor",
      service: "Marketing Strategy",
      employee: "Sarah Johnson",
      date: "2024-12-21",
      time: "10:00",
      duration: 60,
      status: "confirmed",
      avatar: "https://i.pravatar.cc/150?u=client5",
    },
  ];

  const timeSlots = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
  ];

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "pending":
        return "bg-orange-500/10 text-orange-600 border-orange-500/20";
      case "cancelled":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      default:
        return "";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle2 className="h-3 w-3 mr-1" />;
      case "pending":
        return <AlertCircle className="h-3 w-3 mr-1" />;
      case "cancelled":
        return <XCircle className="h-3 w-3 mr-1" />;
      default:
        return null;
    }
  };

  const todayAppointments = appointments.filter(
    (apt) => apt.date === currentDate.toISOString().split("T")[0]
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50">
        <div className="container mx-auto px-4 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/org-dashboard">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
              <p className="text-muted-foreground mt-1">
                Manage appointments and availability
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-600/10">
                  <CalendarDays className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {appointments.length}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Total Appointments
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-600/10">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {appointments.filter((a) => a.status === "confirmed").length}
                  </p>
                  <p className="text-xs text-muted-foreground">Confirmed</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-600/10">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {appointments.filter((a) => a.status === "pending").length}
                  </p>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-600/10">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">32h</p>
                  <p className="text-xs text-muted-foreground">Booked Hours</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 lg:px-8 py-8">
        {/* Calendar Controls */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                const newDate = new Date(currentDate);
                newDate.setDate(currentDate.getDate() - 7);
                setCurrentDate(newDate);
              }}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              onClick={() => setCurrentDate(new Date())}
            >
              Today
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                const newDate = new Date(currentDate);
                newDate.setDate(currentDate.getDate() + 7);
                setCurrentDate(newDate);
              }}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <h2 className="text-lg font-semibold ml-2">
              {currentDate.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <Tabs value={view} onValueChange={setView} className="w-[300px]">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="day">Day</TabsTrigger>
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="month">Month</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button className="bg-orange-600 hover:bg-orange-700">
              <Plus className="h-4 w-4 mr-2" />
              New Appointment
            </Button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Calendar View */}
          <Card className="lg:col-span-3">
            <CardContent className="p-0">
              {/* Week View Header */}
              {view === "week" && (
                <div>
                  <div className="grid grid-cols-7 border-b">
                    {weekDays.map((day, index) => {
                      const date = new Date(currentDate);
                      date.setDate(currentDate.getDate() - currentDate.getDay() + index + 1);
                      const isToday = date.toDateString() === new Date().toDateString();
                      return (
                        <div
                          key={day}
                          className={`p-4 text-center border-r last:border-r-0 ${
                            isToday ? "bg-orange-600/5" : ""
                          }`}
                        >
                          <p className="text-sm font-medium">{day}</p>
                          <p
                            className={`text-2xl font-bold ${
                              isToday ? "text-orange-600" : ""
                            }`}
                          >
                            {date.getDate()}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                  <div className="divide-y">
                    {timeSlots.map((time) => (
                      <div key={time} className="grid grid-cols-7 min-h-[80px]">
                        {weekDays.map((_, index) => {
                          const date = new Date(currentDate);
                          date.setDate(currentDate.getDate() - currentDate.getDay() + index + 1);
                          const dateStr = date.toISOString().split("T")[0];
                          const appointment = appointments.find(
                            (a) => a.date === dateStr && a.time === time
                          );
                          return (
                            <div
                              key={`${time}-${index}`}
                              className="relative border-r last:border-r-0 p-2 hover:bg-muted/50 transition-colors cursor-pointer"
                            >
                              {appointment && (
                                <div
                                  className={`absolute inset-2 p-2 rounded-lg ${
                                    appointment.status === "confirmed"
                                      ? "bg-green-600/10 border border-green-600/20"
                                      : appointment.status === "pending"
                                      ? "bg-orange-600/10 border border-orange-600/20"
                                      : "bg-red-600/10 border border-red-600/20"
                                  }`}
                                >
                                  <p className="text-xs font-medium truncate">
                                    {appointment.title}
                                  </p>
                                  <p className="text-xs text-muted-foreground truncate">
                                    {appointment.client}
                                  </p>
                                  <div className="flex items-center gap-1 mt-1">
                                    <Avatar className="h-4 w-4">
                                      <AvatarImage src={appointment.avatar} />
                                      <AvatarFallback className="text-[8px]">
                                        {appointment.client
                                          .split(" ")
                                          .map((n) => n[0])
                                          .join("")}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span className="text-[10px] text-muted-foreground">
                                      {appointment.duration}min
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Sidebar - Today's Schedule */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Today's Schedule</CardTitle>
                <CardDescription>
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {todayAppointments.length > 0 ? (
                    todayAppointments.map((apt) => (
                      <div
                        key={apt.id}
                        className="p-3 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={apt.avatar} />
                              <AvatarFallback>
                                {apt.client
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{apt.client}</p>
                              <p className="text-xs text-muted-foreground">
                                {apt.service}
                              </p>
                            </div>
                          </div>
                          <Badge
                            variant="outline"
                            className={getStatusColor(apt.status)}
                          >
                            {getStatusIcon(apt.status)}
                            {apt.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {apt.time} ({apt.duration}min)
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {apt.employee}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <CalendarDays className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                      <p className="text-sm text-muted-foreground">
                        No appointments today
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Availability Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Availability</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Working Hours</p>
                    <p className="text-xs text-muted-foreground">Mon - Fri</p>
                  </div>
                  <p className="text-sm">9:00 AM - 6:00 PM</p>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Break Time</p>
                    <p className="text-xs text-muted-foreground">Daily</p>
                  </div>
                  <p className="text-sm">12:00 PM - 1:00 PM</p>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Slot Duration</p>
                    <p className="text-xs text-muted-foreground">Default</p>
                  </div>
                  <p className="text-sm">30 minutes</p>
                </div>
                <Button variant="outline" className="w-full">
                  Configure Availability
                </Button>
              </CardContent>
            </Card>

            {/* Upcoming Week Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Week Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Total Appointments</span>
                    <span className="font-medium">24</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Available Slots</span>
                    <span className="font-medium">18</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Utilization</span>
                    <span className="font-medium text-green-600">72%</span>
                  </div>
                  <Progress value={72} className="h-2 bg-orange-600/20" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}