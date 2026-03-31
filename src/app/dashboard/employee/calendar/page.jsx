"use client"

import { useState } from "react"
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Plus,
  User,
  Scissors,
  MoreHorizontal,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

// Mock appointments data
const mockAppointments = [
  {
    id: "apt-1",
    clientName: "John Smith",
    clientAvatar: null,
    service: "Haircut",
    date: "2024-01-15",
    startTime: "10:00",
    endTime: "10:45",
    status: "confirmed",
    notes: "Regular customer, prefers classic style",
  },
  {
    id: "apt-2",
    clientName: "Emily Davis",
    clientAvatar: null,
    service: "Hair Coloring",
    date: "2024-01-15",
    startTime: "11:00",
    endTime: "13:00",
    status: "confirmed",
    notes: "Full color, bringing reference photos",
  },
  {
    id: "apt-3",
    clientName: "Michael Brown",
    clientAvatar: null,
    service: "Beard Trim",
    date: "2024-01-15",
    startTime: "13:30",
    endTime: "13:50",
    status: "pending",
    notes: "",
  },
  {
    id: "apt-4",
    clientName: "Sarah Wilson",
    clientAvatar: null,
    service: "Highlights",
    date: "2024-01-15",
    startTime: "14:00",
    endTime: "15:30",
    status: "confirmed",
    notes: "Partial highlights, money piece",
  },
  {
    id: "apt-5",
    clientName: "Robert Chen",
    clientAvatar: null,
    service: "Haircut",
    date: "2024-01-15",
    startTime: "16:00",
    endTime: "16:45",
    status: "confirmed",
    notes: "",
  },
  {
    id: "apt-6",
    clientName: "Lisa Martinez",
    clientAvatar: null,
    service: "Deep Conditioning",
    date: "2024-01-16",
    startTime: "09:00",
    endTime: "09:30",
    status: "confirmed",
    notes: "Damaged hair, recommend treatment series",
  },
  {
    id: "apt-7",
    clientName: "David Lee",
    clientAvatar: null,
    service: "Haircut",
    date: "2024-01-16",
    startTime: "10:00",
    endTime: "10:45",
    status: "pending",
    notes: "",
  },
]

// Working hours
const workingHours = [
  { hour: "09:00", label: "9 AM" },
  { hour: "10:00", label: "10 AM" },
  { hour: "11:00", label: "11 AM" },
  { hour: "12:00", label: "12 PM" },
  { hour: "13:00", label: "1 PM" },
  { hour: "14:00", label: "2 PM" },
  { hour: "15:00", label: "3 PM" },
  { hour: "16:00", label: "4 PM" },
  { hour: "17:00", label: "5 PM" },
]

const statusColors = {
  confirmed: "default",
  pending: "secondary",
  cancelled: "destructive",
}

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 0, 15)) // Jan 15, 2024
  const [selectedDate, setSelectedDate] = useState(new Date(2024, 0, 15))
  const [viewMode, setViewMode] = useState("day")
  const [isAvailabilityDialogOpen, setIsAvailabilityDialogOpen] = useState(false)

  const formatDate = (date) => {
    return date.toISOString().split("T")[0]
  }

  const getAppointmentsForDate = (date) => {
    const dateStr = formatDate(date)
    return mockAppointments.filter((apt) => apt.date === dateStr)
  }

  const todayAppointments = getAppointmentsForDate(selectedDate)

  const navigateDate = (direction) => {
    const newDate = new Date(currentDate)
    if (viewMode === "day") {
      newDate.setDate(newDate.getDate() + direction)
    } else if (viewMode === "week") {
      newDate.setDate(newDate.getDate() + direction * 7)
    } else {
      newDate.setMonth(newDate.getMonth() + direction)
    }
    setCurrentDate(newDate)
    setSelectedDate(newDate)
  }

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const getAppointmentPosition = (startTime, endTime) => {
    const [startHour, startMin] = startTime.split(":").map(Number)
    const [endHour, endMin] = endTime.split(":").map(Number)
    
    const startOffset = (startHour - 9) * 60 + startMin
    const duration = (endHour - startHour) * 60 + (endMin - startMin)
    
    return {
      top: `${startOffset}px`,
      height: `${duration}px`,
    }
  }

  const formatTime = (time) => {
    const [hour, minute] = time.split(":")
    const h = parseInt(hour)
    const ampm = h >= 12 ? "PM" : "AM"
    const hour12 = h % 12 || 12
    return `${hour12}:${minute} ${ampm}`
  }

  // Generate calendar days for month view
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startPadding = firstDay.getDay()
    const days = []

    // Previous month padding
    for (let i = startPadding - 1; i >= 0; i--) {
      const day = new Date(year, month, -i)
      days.push({ date: day, isCurrentMonth: false })
    }

    // Current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const day = new Date(year, month, i)
      days.push({ date: day, isCurrentMonth: true })
    }

    // Next month padding
    const remaining = 42 - days.length
    for (let i = 1; i <= remaining; i++) {
      const day = new Date(year, month + 1, i)
      days.push({ date: day, isCurrentMonth: false })
    }

    return days
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground">
            View and manage your appointments and availability.
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAvailabilityDialogOpen} onOpenChange={setIsAvailabilityDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Clock className="mr-2 h-4 w-4" />
                Set Availability
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Set Your Availability</DialogTitle>
                <DialogDescription>
                  Configure your working hours for the week.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                  <div key={day} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Switch defaultChecked={day !== "Sunday"} />
                      <Label className="w-24">{day}</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select defaultValue="09:00">
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {workingHours.map((h) => (
                            <SelectItem key={h.hour} value={h.hour}>
                              {h.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <span className="text-muted-foreground">to</span>
                      <Select defaultValue="17:00">
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {workingHours.map((h) => (
                            <SelectItem key={h.hour} value={h.hour}>
                              {h.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAvailabilityDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsAvailabilityDialogOpen(false)}>
                  Save Changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Calendar Navigation */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" onClick={() => navigateDate(-1)}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-lg font-semibold min-w-[200px] text-center">
                {viewMode === "month"
                  ? `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`
                  : currentDate.toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
              </h2>
              <Button variant="outline" size="icon" onClick={() => navigateDate(1)}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === "day" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("day")}
              >
                Day
              </Button>
              <Button
                variant={viewMode === "week" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("week")}
              >
                Week
              </Button>
              <Button
                variant={viewMode === "month" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("month")}
              >
                Month
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Day/Week Timeline View */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              {viewMode === "month" ? "Monthly View" : "Daily Schedule"}
            </CardTitle>
            <CardDescription>
              {todayAppointments.length} appointment{todayAppointments.length !== 1 ? "s" : ""} scheduled
            </CardDescription>
          </CardHeader>
          <CardContent>
            {viewMode === "month" ? (
              <div className="grid grid-cols-7 gap-1">
                {daysOfWeek.map((day) => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                    {day}
                  </div>
                ))}
                {generateCalendarDays().map(({ date, isCurrentMonth }, index) => {
                  const dayAppointments = getAppointmentsForDate(date)
                  const isSelected = formatDate(date) === formatDate(selectedDate)
                  const isToday = formatDate(date) === formatDate(new Date())
                  
                  return (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedDate(date)
                        setViewMode("day")
                        setCurrentDate(date)
                      }}
                      className={cn(
                        "p-2 min-h-[80px] text-left rounded-lg border transition-colors",
                        !isCurrentMonth && "text-muted-foreground opacity-50",
                        isSelected && "border-primary bg-primary/5",
                        isToday && "bg-accent",
                        "hover:bg-accent"
                      )}
                    >
                      <span className={cn(
                        "text-sm font-medium",
                        isToday && "text-primary"
                      )}>
                        {date.getDate()}
                      </span>
                      {dayAppointments.length > 0 && (
                        <div className="mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {dayAppointments.length} apt
                          </Badge>
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            ) : (
              <div className="relative">
                {/* Time slots */}
                <div className="space-y-0">
                  {workingHours.map((slot) => (
                    <div key={slot.hour} className="flex border-t">
                      <div className="w-16 py-4 pr-4 text-right text-sm text-muted-foreground">
                        {slot.label}
                      </div>
                      <div className="flex-1 h-[60px] border-l" />
                    </div>
                  ))}
                </div>

                {/* Appointments overlay */}
                <div className="absolute left-16 right-0 top-0">
                  {todayAppointments.map((apt) => {
                    const position = getAppointmentPosition(apt.startTime, apt.endTime)
                    return (
                      <div
                        key={apt.id}
                        className="absolute left-1 right-1 rounded-lg border bg-primary/10 border-primary/20 p-2 overflow-hidden"
                        style={position}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-sm truncate">{apt.clientName}</p>
                            <p className="text-xs text-muted-foreground">{apt.service}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatTime(apt.startTime)} - {formatTime(apt.endTime)}
                            </p>
                          </div>
                          <Badge variant={statusColors[apt.status]} className="text-xs shrink-0">
                            {apt.status}
                          </Badge>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Appointment List */}
        <Card>
          <CardHeader>
            <CardTitle>Appointments</CardTitle>
            <CardDescription>
              {selectedDate.toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
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
                    className="flex items-start gap-3 rounded-lg border p-3"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={apt.clientAvatar} />
                      <AvatarFallback>{getInitials(apt.clientName)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{apt.clientName}</p>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Reschedule</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              Cancel
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Scissors className="h-3 w-3" />
                        {apt.service}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {formatTime(apt.startTime)} - {formatTime(apt.endTime)}
                      </div>
                      {apt.notes && (
                        <p className="text-xs text-muted-foreground mt-2 italic">
                          {apt.notes}
                        </p>
                      )}
                      <Badge variant={statusColors[apt.status]} className="mt-2">
                        {apt.status}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8">
                  <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No appointments</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function cn(...classes) {
  return classes.filter(Boolean).join(" ")
}
