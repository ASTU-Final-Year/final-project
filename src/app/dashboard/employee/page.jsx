// src/app/dashboard/employee/page.jsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CalendarDays,
  Clock,
  Building2,
  User,
  Phone,
  Mail,
  CheckCircle,
  Circle,
  AlertCircle,
  ChevronRight,
  Loader2,
  FileText,
  MessageCircle,
  Calendar,
  Award,
  Clock as ClockIcon,
  TrendingUp,
  Briefcase,
  Users,
  Activity,
  Star,
  MapPin,
  Bell,
  CreditCard,
  DollarSign,
} from "lucide-react";
import RequestHandler from "@/lib/request-handler";
import Link from "next/link";
import { format } from "date-fns";
import { useSessionStore } from "@/store";

// Helper functions
const formatDate = (dateString) => {
  if (!dateString) return "Not scheduled";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatTime = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusColor = (status) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-700 border-green-200";
    case "in-progress":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "scheduled":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    case "canceled":
      return "bg-red-100 text-red-700 border-red-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

const getTaskStatusColor = (status, isDone) => {
  if (isDone || status === "completed") return "bg-green-100 text-green-700";
  if (status === "active") return "bg-blue-100 text-blue-700";
  if (status === "pending") return "bg-yellow-100 text-yellow-700";
  return "bg-gray-100 text-gray-700";
};

// Task Status Badge Component
const TaskStatusBadge = ({ task }) => {
  const isCompleted = task.isDone || task.status === "completed";
  const isActive = task.status === "active" && !isCompleted;
  const isPending = task.status === "pending" && !isCompleted;

  if (isCompleted) {
    return <Badge className="bg-green-100 text-green-700">Completed</Badge>;
  }
  if (isActive) {
    return <Badge className="bg-blue-100 text-blue-700">In Progress</Badge>;
  }
  if (isPending) {
    return <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>;
  }
  return <Badge variant="secondary">Unknown</Badge>;
};

export default function EmployeeDashboard() {
  const router = useRouter();
  const session = useSessionStore(({ session }) => session);
  const [employments, setEmployments] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({
    tasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
    employments: 0,
    activeEmployments: 0,
    appointments: 0,
    upcomingAppointments: 0,
    completionRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  const fetchDashboardData = useCallback(async () => {
    try {
      // Fetch employee details
      const empRes = await RequestHandler.Get("/query/v1/employee?mine");
      if (empRes.ok) {
        const { employees } = await empRes.json();
        setEmployments(employees || []);
        const activeCount = (employees || []).filter((e) => e.isActive).length;
        setStats((prev) => ({
          ...prev,
          employments: employees?.length || 0,
          activeEmployments: activeCount,
        }));
      }

      // Fetch tasks
      const taskRes = await RequestHandler.Get(
        '/query/v1/task?mine&order=["createdAt.desc"]',
      );
      if (taskRes.ok) {
        const { tasks: taskList } = await taskRes.json();
        setTasks(taskList || []);
        const completed = (taskList || []).filter(
          (t) => t.isDone || t.status === "completed",
        ).length;
        const pending = (taskList || []).filter(
          (t) => t.status === "pending" && !t.isDone,
        ).length;
        const inProgress = (taskList || []).filter(
          (t) => t.status === "active" && !t.isDone,
        ).length;
        const completionRate =
          taskList?.length > 0 ? (completed / taskList.length) * 100 : 0;

        setStats((prev) => ({
          ...prev,
          tasks: taskList?.length || 0,
          completedTasks: completed,
          pendingTasks: pending,
          inProgressTasks: inProgress,
          completionRate: completionRate,
        }));
      }

      // Fetch appointments
      const aptRes = await RequestHandler.Get(
        '/query/v1/appointment?order=["startTime.asc"]',
      );
      if (aptRes.ok) {
        const { appointments: aptList } = await aptRes.json();
        setAppointments(aptList || []);
        const upcoming = (aptList || []).filter(
          (a) => a.status === "scheduled" && new Date(a.startTime) > new Date(),
        ).length;

        setStats((prev) => ({
          ...prev,
          appointments: aptList?.length || 0,
          upcomingAppointments: upcoming,
        }));
      }
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-96" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  const activeTasks = tasks.filter((t) => t.status === "active" && !t.isDone);
  const pendingTasks = tasks.filter((t) => t.status === "pending" && !t.isDone);
  const completedTasks = tasks.filter(
    (t) => t.isDone || t.status === "completed",
  );
  const upcomingAppointments = appointments.filter(
    (a) => a.status === "scheduled" && new Date(a.startTime) > new Date(),
  );
  const todayAppointments = appointments.filter((a) => {
    const today = new Date();
    const aptDate = new Date(a.startTime);
    return (
      a.status === "scheduled" &&
      ((aptDate.getDate() === today.getDate() &&
        aptDate.getMonth() === today.getMonth() &&
        aptDate.getFullYear() === today.getFullYear()) ||
        aptDate <= today)
    );
  });

  const fullName =
    session.user?.firstname && session.user?.lastname
      ? `${session.user.firstname} ${session.user.lastname}`
      : "Employee";
  const memberSince = session.user?.createdAt
    ? new Date(session.user.createdAt).getFullYear()
    : "2024";

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Welcome Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Employee Dashboard
          </h1>
          <p className="text-muted-foreground">
            Track your tasks, appointments, and performance
          </p>
        </div>
        {/* <Button onClick={() => router.push("/dashboard/employee/profile")}>
          <User className="h-4 w-4 mr-2" />
          My Profile
        </Button> */}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Tasks</p>
                <p className="text-2xl font-bold">{stats.tasks}</p>
              </div>
              <Briefcase className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold">{stats.inProgressTasks}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{stats.completedTasks}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completion Rate</p>
                <p className="text-2xl font-bold">
                  {Math.round(stats.completionRate)}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full max-w-2xl grid-cols-5 p-0">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="pending">
            Pending Tasks
            {stats.pendingTasks > 0 && (
              <Badge variant="ghost" className="ml-2">
                {stats.pendingTasks}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="active">
            Active Tasks
            {stats.activeTasks > 0 && (
              <Badge variant="ghost" className="ml-2">
                {stats.activeTasks}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="employments">Employments</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Today's Schedule */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Due Appointments
                </CardTitle>
              </CardHeader>
              <CardContent>
                {todayAppointments.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No appointments scheduled for today</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {todayAppointments.map((apt) => (
                      <div
                        key={apt.id}
                        className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{apt.service?.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {apt.organization?.name}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {formatTime(apt.startTime)}
                          </p>
                          <Badge className={getStatusColor(apt.status)}>
                            {apt.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Active and Pending Tasks */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Active / Pending Tasks
                </CardTitle>
              </CardHeader>
              <CardContent>
                {
                  <div className="space-y-3">
                    {pendingTasks.slice(0, 3).map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center justify-between p-3 bg-muted/30 border rounded-lg cursor-pointer hover:bg-muted/50"
                        onClick={() =>
                          router.push(`/dashboard/employee/task/${task.id}`)
                        }
                      >
                        <div>
                          <p className="font-medium">{task.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {task.appointment?.service?.name}
                          </p>
                        </div>
                        <Badge className="bg-blue-100 text-blue-700">
                          In Progress
                        </Badge>
                      </div>
                    ))}
                    {pendingTasks.length > 3 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full"
                        onClick={() => setPendingTab("tasks")}
                      >
                        View all {pendingTasks.length} pending tasks →
                      </Button>
                    )}
                  </div>
                }
                {activeTasks.slice(0, 3).map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3 bg-muted/30 border rounded-lg cursor-pointer hover:bg-muted/50"
                    onClick={() =>
                      router.push(`/dashboard/employee/task/${task.id}`)
                    }
                  >
                    <div>
                      <p className="font-medium">{task.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {task.appointment?.service?.name}
                      </p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-700">
                      In Progress
                    </Badge>
                  </div>
                ))}
                {activeTasks.length > 3 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full"
                    onClick={() => setActiveTab("tasks")}
                  >
                    View all {activeTasks.length} active tasks →
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Active Tasks */}
            {/* <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Active Tasks
                </CardTitle>
              </CardHeader>
              <CardContent>
                {activeTasks.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No active tasks</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activeTasks.slice(0, 3).map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center justify-between p-3 bg-muted/30 border rounded-lg cursor-pointer hover:bg-muted/50"
                        onClick={() =>
                          router.push(`/dashboard/employee/task/${task.id}`)
                        }
                      >
                        <div>
                          <p className="font-medium">{task.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {task.appointment?.service?.name}
                          </p>
                        </div>
                        <Badge className="bg-blue-100 text-blue-700">
                          In Progress
                        </Badge>
                      </div>
                    ))}
                    {activeTasks.length > 3 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full"
                        onClick={() => setActiveTab("tasks")}
                      >
                        View all {activeTasks.length} active tasks →
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card> */}
          </div>

          {/* Performance Metrics */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">
                    Task Completion Rate
                  </p>
                  <Award className="h-5 w-5 text-green-500" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span className="font-medium">
                      {Math.round(stats.completionRate)}%
                    </span>
                  </div>
                  <Progress value={stats.completionRate} className="h-2" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">Pending Tasks</p>
                  <ClockIcon className="h-5 w-5 text-yellow-500" />
                </div>
                <p className="text-3xl font-bold">{stats.pendingTasks}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Tasks awaiting your attention
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">
                    Productivity Score
                  </p>
                  <TrendingUp className="h-5 w-5 text-purple-500" />
                </div>
                <p className="text-3xl font-bold">
                  {Math.round(stats.completionRate)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Out of 100</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tasks Tab */}
        <TabsContent value="pending" className="space-y-4">
          {pendingTasks.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                <p className="text-muted-foreground">
                  No pending pendingTasks assigned yet
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {pendingTasks.map((task) => (
                <Card
                  key={task.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() =>
                    router.push(`/dashboard/employee/task/${task.id}`)
                  }
                >
                  <CardContent className="p-4">
                    <div className="flex flex-wrap justify-between items-start gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold">{task.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {task.description?.slice(0, 100)}
                        </p>
                        <div className="flex flex-wrap gap-4 mt-2 text-sm">
                          <span className="text-muted-foreground">
                            Service: {task.appointment?.service?.name || "N/A"}
                          </span>
                          {task.appointment?.startTime && (
                            <span className="text-muted-foreground">
                              Due: {formatDate(task.appointment.startTime)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          className={getTaskStatusColor(
                            task.status,
                            task.isDone,
                          )}
                        >
                          {task.isDone || task.status === "completed"
                            ? "Completed"
                            : task.status === "active"
                              ? "In Progress"
                              : "Pending"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Tasks Tab */}
        <TabsContent value="active" className="space-y-4">
          {activeTasks.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                <p className="text-muted-foreground">
                  No active tasks assigned yet
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {activeTasks.map((task) => (
                <Card
                  key={task.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() =>
                    router.push(`/dashboard/employee/task/${task.id}`)
                  }
                >
                  <CardContent className="p-4">
                    <div className="flex flex-wrap justify-between items-start gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold">{task.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {task.description?.slice(0, 100)}
                        </p>
                        <div className="flex flex-wrap gap-4 mt-2 text-sm">
                          <span className="text-muted-foreground">
                            Service: {task.appointment?.service?.name || "N/A"}
                          </span>
                          {task.appointment?.startTime && (
                            <span className="text-muted-foreground">
                              Due: {formatDate(task.appointment.startTime)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          className={getTaskStatusColor(
                            task.status,
                            task.isDone,
                          )}
                        >
                          {task.isDone || task.status === "completed"
                            ? "Completed"
                            : task.status === "active"
                              ? "In Progress"
                              : "Pending"}
                        </Badge>
                        {task.submissions?.payment?.status === "pending" && (
                          <Badge className="bg-yellow-100 text-yellow-700">
                            Awaiting Payment
                          </Badge>
                        )}
                        {task.submissions?.payment?.status === "completed" && (
                          <Badge className="bg-green-100 text-green-700">
                            Payment Received
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Appointments Tab */}
        <TabsContent value="appointments" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Appointments
                    </p>
                    <p className="text-2xl font-bold">{stats.appointments}</p>
                  </div>
                  <CalendarDays className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Upcoming</p>
                    <p className="text-2xl font-bold">
                      {stats.upcomingAppointments}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {appointments.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <CalendarDays className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                <p className="text-muted-foreground">
                  No appointments scheduled
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {appointments.map((apt) => (
                <Card key={apt.id}>
                  <CardContent className="p-4">
                    <div className="flex flex-wrap justify-between items-start gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold">{apt.service?.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {apt.organization?.name}
                        </p>
                        <div className="flex flex-wrap gap-4 mt-2 text-sm">
                          <div className="flex items-center gap-1">
                            <CalendarDays className="h-3 w-3" />
                            {formatDate(apt.startTime)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatTime(apt.startTime)} -{" "}
                            {formatTime(apt.endTime)}
                          </div>
                          {apt.organization?.address && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {apt.organization.address}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(apt.status)}>
                          {apt.status?.replace("-", " ")}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-2"
                          onClick={() =>
                            router.push(
                              `/dashboard/employee/appointment/${apt.id}`,
                            )
                          }
                        >
                          View Details <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Employments Tab */}
        <TabsContent value="employments" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Positions
                    </p>
                    <p className="text-2xl font-bold">{stats.employments}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Active Positions
                    </p>
                    <p className="text-2xl font-bold">
                      {stats.activeEmployments}
                    </p>
                  </div>
                  <Activity className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {employments.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                <p className="text-muted-foreground">
                  No employment records found
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {employments.map((emp) => (
                <Card key={emp.id}>
                  <CardContent className="p-4">
                    <div className="flex flex-wrap justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">
                            {emp.organization?.name || "Organization"}
                          </h3>
                          <Badge
                            variant={emp.isActive ? "default" : "secondary"}
                          >
                            {emp.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <p className="text-sm font-medium mt-1">
                          {emp.jobTitle}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {emp.jobDescription}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
