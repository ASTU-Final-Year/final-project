"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ClipboardList,
  Calendar,
  Users,
  Clock,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Star,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"

// Mock data
const stats = [
  {
    title: "Tasks Today",
    value: "8",
    change: "+2 from yesterday",
    icon: ClipboardList,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    title: "Appointments",
    value: "5",
    change: "Next in 30 min",
    icon: Calendar,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
  {
    title: "Clients Served",
    value: "124",
    change: "This month",
    icon: Users,
    color: "text-violet-600",
    bgColor: "bg-violet-50",
  },
  {
    title: "Hours Worked",
    value: "32.5",
    change: "This week",
    icon: Clock,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
  },
]

const upcomingAppointments = [
  {
    id: 1,
    client: { name: "John Smith", avatarUrl: null },
    service: "Haircut",
    time: "10:00 AM",
    duration: "45 min",
  },
  {
    id: 2,
    client: { name: "Emily Davis", avatarUrl: null },
    service: "Hair Coloring",
    time: "11:00 AM",
    duration: "2h",
  },
  {
    id: 3,
    client: { name: "Michael Brown", avatarUrl: null },
    service: "Beard Trim",
    time: "1:30 PM",
    duration: "20 min",
  },
]

const recentTasks = [
  {
    id: 1,
    title: "Prepare station for morning appointments",
    status: "completed",
    priority: "high",
    dueTime: "9:00 AM",
  },
  {
    id: 2,
    title: "Inventory check - hair products",
    status: "in_progress",
    priority: "medium",
    dueTime: "12:00 PM",
  },
  {
    id: 3,
    title: "Client follow-up calls",
    status: "pending",
    priority: "low",
    dueTime: "3:00 PM",
  },
  {
    id: 4,
    title: "Update client notes from morning sessions",
    status: "pending",
    priority: "medium",
    dueTime: "5:00 PM",
  },
]

const recentClients = [
  {
    id: 1,
    name: "Alice Johnson",
    lastVisit: "2 days ago",
    service: "Highlights",
    rating: 5,
  },
  {
    id: 2,
    name: "Robert Chen",
    lastVisit: "1 week ago",
    service: "Haircut",
    rating: 4,
  },
  {
    id: 3,
    name: "Maria Garcia",
    lastVisit: "2 weeks ago",
    service: "Keratin Treatment",
    rating: 5,
  },
]

const statusColors = {
  completed: "default",
  in_progress: "secondary",
  pending: "outline",
}

const statusLabels = {
  completed: "Completed",
  in_progress: "In Progress",
  pending: "Pending",
}

const priorityColors = {
  high: "text-red-600 bg-red-50",
  medium: "text-amber-600 bg-amber-50",
  low: "text-emerald-600 bg-emerald-50",
}

export default function EmployeeDashboard() {
  const currentUser = {
    firstName: "Sarah",
    lastName: "Johnson",
    position: "Senior Stylist",
  }

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const completedTasks = recentTasks.filter((t) => t.status === "completed").length
  const totalTasks = recentTasks.length
  const taskProgress = (completedTasks / totalTasks) * 100

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Good morning, {currentUser.firstName}!
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s what&apos;s happening with your schedule today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className={cn("rounded-lg p-3", stat.bgColor)}>
                  <stat.icon className={cn("h-5 w-5", stat.color)} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.change}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming Appointments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>Your schedule for today</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/employee/calendar">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingAppointments.map((appointment, index) => (
                <div
                  key={appointment.id}
                  className="flex items-center gap-4 rounded-lg border p-4"
                >
                  <Avatar>
                    <AvatarImage src={appointment.client.avatarUrl} />
                    <AvatarFallback>
                      {getInitials(appointment.client.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <p className="font-medium">{appointment.client.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {appointment.service}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{appointment.time}</p>
                    <p className="text-sm text-muted-foreground">
                      {appointment.duration}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tasks Overview */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Today&apos;s Tasks</CardTitle>
              <CardDescription>
                {completedTasks} of {totalTasks} tasks completed
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/employee/tasks">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Progress value={taskProgress} className="h-2" />
            </div>
            <div className="space-y-3">
              {recentTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 rounded-lg border p-3"
                >
                  {task.status === "completed" ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  ) : task.status === "in_progress" ? (
                    <Clock className="h-5 w-5 text-blue-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-muted-foreground" />
                  )}
                  <div className="flex-1">
                    <p
                      className={cn(
                        "text-sm font-medium",
                        task.status === "completed" && "line-through text-muted-foreground"
                      )}
                    >
                      {task.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Due: {task.dueTime}
                    </p>
                  </div>
                  <Badge variant={statusColors[task.status]}>
                    {statusLabels[task.status]}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Clients */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Clients</CardTitle>
              <CardDescription>Clients you&apos;ve served recently</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/employee/clients">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentClients.map((client) => (
                <div
                  key={client.id}
                  className="flex items-center gap-4"
                >
                  <Avatar>
                    <AvatarFallback>{getInitials(client.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{client.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {client.service} - {client.lastVisit}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: client.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Performance This Week</CardTitle>
            <CardDescription>Your key metrics summary</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-emerald-50 p-2">
                    <TrendingUp className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Client Satisfaction</p>
                    <p className="text-xs text-muted-foreground">Based on reviews</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">4.8</p>
                  <p className="text-xs text-emerald-600">+0.2</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-blue-50 p-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Tasks Completed</p>
                    <p className="text-xs text-muted-foreground">This week</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">28</p>
                  <p className="text-xs text-emerald-600">+5</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-violet-50 p-2">
                    <Users className="h-4 w-4 text-violet-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Clients Served</p>
                    <p className="text-xs text-muted-foreground">This week</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">31</p>
                  <p className="text-xs text-emerald-600">+8</p>
                </div>
              </div>
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
