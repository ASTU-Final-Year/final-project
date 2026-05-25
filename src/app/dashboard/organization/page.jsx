// src/app/dashboard/organization/page.jsx
"use client";

import { useEffect, useState } from "react";
import RequestHandler from "@/lib/request-handler";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Briefcase,
  Users,
  CalendarDays,
  Activity,
  Building2,
  Loader2,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  UserPlus,
  UserMinus,
  Star,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  PieChart,
  LineChart,
} from "lucide-react";
import { useOrganizationStore } from "@/store";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RePieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format, subDays, subMonths, startOfMonth, endOfMonth } from "date-fns";

export default function DashboardOverview() {
  const organization = useOrganizationStore(({ organization }) => organization);
  const setOrganization = useOrganizationStore(
    ({ setOrganization }) => setOrganization,
  );
  const stats = useOrganizationStore(
    ({ organizationStats }) => organizationStats,
  );
  const setStats = useOrganizationStore(
    ({ setOrganizationStats }) => setOrganizationStats,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [appointmentStats, setAppointmentStats] = useState({
    total: 0,
    completed: 0,
    cancelled: 0,
    scheduled: 0,
    inProgress: 0,
    completionRate: 0,
    averageRating: 0,
  });
  const [revenueStats, setRevenueStats] = useState({
    total: 0,
    monthly: [],
    projected: 0,
    growth: 0,
  });
  const [activityData, setActivityData] = useState([]);
  const [servicePerformance, setServicePerformance] = useState([]);
  const [employeePerformance, setEmployeePerformance] = useState([]);
  const [timeRange, setTimeRange] = useState("week");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch organization details
        const orgRes = await RequestHandler.Get("/query/v1/organization");
        if (orgRes.ok) {
          const {
            organizations: [organization],
          } = await orgRes.json();
          setOrganization(organization);
        }

        // Fetch counts
        const [
          empRes,
          srvRes,
          acSrvRes,
          calRes,
          aptRes,
          revRes,
          activityRes,
          servicePerfRes,
          empPerfRes,
        ] = await Promise.all([
          RequestHandler.Get("/query/v1/employee?countOnly"),
          RequestHandler.Get("/query/v1/organizationService?countOnly"),
          RequestHandler.Get(
            "/query/v1/organizationService?countOnly&~isActive=true",
          ),
          RequestHandler.Get("/query/v1/organizationCalendar?countOnly"),
          RequestHandler.Get("/query/v1/appointment?countOnly"),
          RequestHandler.Get('/query/v1/appointment?select={"":["price"]}'),
          RequestHandler.Get(
            '/query/v1/appointment?select={"":["status","createdAt"]}&order=["createdAt.desc"]&limit=50',
          ),
          RequestHandler.Get(
            '/query/v1/organizationService?select={"":["name","price","rating","totalAppointments"]}',
          ),
          RequestHandler.Get(
            '/query/v1/employee?select={"":["id","jobTitle","user":["firstname","lastname"],"tasks":["status"]}',
          ),
        ]);

        const empCount = empRes.ok ? (await empRes.json()).count : 0;
        const srvCount = srvRes.ok ? (await srvRes.json()).count : 0;
        const activeServicesCount = acSrvRes.ok
          ? (await acSrvRes.json()).count
          : 0;
        const calCount = calRes.ok ? (await calRes.json()).count : 0;
        let totalAppointments = 0;

        // Appointment stats
        if (aptRes.ok) {
          const { count, appointments } = await aptRes.json();
          totalAppointments = count || 0;
          const completed =
            appointments?.filter((a) => a.status === "completed").length || 0;
          const cancelled =
            appointments?.filter((a) => a.status === "canceled").length || 0;
          const scheduled =
            appointments?.filter((a) => a.status === "scheduled").length || 0;
          const inProgress =
            appointments?.filter((a) => a.status === "in-progress").length || 0;

          const totalRevenue =
            appointments?.reduce((sum, a) => sum + (a.price || 0), 0) || 0;

          setAppointmentStats({
            total: totalAppointments,
            completed,
            cancelled,
            scheduled,
            inProgress,
            completionRate:
              totalAppointments > 0 ? (completed / totalAppointments) * 100 : 0,
            averageRating: 4.5, // Fetch from ratings
          });

          setRevenueStats({
            total: totalRevenue,
            monthly: calculateMonthlyRevenue(appointments),
            projected: totalRevenue * 1.2,
            growth: 15.5,
          });
        }

        setStats({
          employees: empCount,
          services: srvCount,
          activeServices: activeServicesCount,
          calendars: calCount,
        });

        // Activity timeline
        if (activityRes.ok) {
          const { appointments } = await activityRes.json();
          setActivityData(processActivityData(appointments));
        }

        // Service performance
        if (servicePerfRes.ok) {
          const { organizationServices } = await servicePerfRes.json();
          setServicePerformance(organizationServices?.slice(0, 5) || []);
        }

        // Employee performance
        if (empPerfRes.ok) {
          const { employees } = await empPerfRes.json();
          const enhancedEmployees =
            employees?.map((emp) => ({
              ...emp,
              taskCount: emp.tasks?.length || 0,
              completedTasks:
                emp.tasks?.filter((t) => t.status === "completed").length || 0,
            })) || [];
          setEmployeePerformance(enhancedEmployees);
        }
      } catch (error) {
        console.error("Failed to load overview data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, [setOrganization, setStats]);

  const calculateMonthlyRevenue = (appointments) => {
    const monthly = {};
    appointments?.forEach((apt) => {
      const month = format(new Date(apt.createdAt), "MMM yyyy");
      monthly[month] = (monthly[month] || 0) + (apt.price || 0);
    });
    return Object.entries(monthly).map(([name, revenue]) => ({
      name,
      revenue,
    }));
  };

  const processActivityData = (appointments) => {
    const days = timeRange === "week" ? 7 : 30;
    const activity = {};

    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const key = format(date, "MMM dd");
      activity[key] = { date: key, appointments: 0, revenue: 0 };
    }

    appointments?.forEach((apt) => {
      const date = format(new Date(apt.createdAt), "MMM dd");
      if (activity[date]) {
        activity[date].appointments++;
        activity[date].revenue += apt.price || 0;
      }
    });

    return Object.values(activity);
  };

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82CA9D",
  ];

  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center border rounded bg-card">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isLoading && !organization) {
    return <div className="text-center py-12">Organization not found.</div>;
  }

  const appointmentStatusData = [
    { name: "Completed", value: appointmentStats.completed, color: "#10b981" },
    { name: "Scheduled", value: appointmentStats.scheduled, color: "#3b82f6" },
    {
      name: "In Progress",
      value: appointmentStats.inProgress,
      color: "#f59e0b",
    },
    { name: "Cancelled", value: appointmentStats.cancelled, color: "#ef4444" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Organization Profile Header */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
        <CardContent className="p-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex items-start gap-6">
              <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center border-2 border-primary/20">
                <Building2 className="h-10 w-10 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <h2 className="text-2xl font-bold">{organization.name}</h2>
                  <Badge
                    className={cn(
                      organization.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700",
                    )}
                  >
                    {organization.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <p className="text-muted-foreground mb-3">
                  {organization.address}
                </p>
                <div className="flex gap-6 flex-wrap">
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-medium">{organization.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="text-sm font-medium">
                      {organization.phone || "Not set"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Member Since
                    </p>
                    <p className="text-sm font-medium">
                      {format(new Date(organization.createdAt), "MMMM yyyy")}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Sector</p>
                    <p className="text-sm font-medium">
                      {organization.sector || "Not specified"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <Button variant="outline" asChild>
              <Link href="/dashboard/organization/profile">Edit Profile</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <StatCard
          title="Total Employees"
          value={stats.employees}
          href="/dashboard/organization/employees"
          icon={Users}
          trend="+12%"
          trendUp
        />
        <StatCard
          title="Active Services"
          value={stats.activeServices}
          href="/dashboard/organization/services"
          icon={Briefcase}
          trend={`/${stats.services} total`}
        />
        <StatCard
          title="Appointments"
          value={appointmentStats.total}
          href="/dashboard/organization/appointments"
          icon={Calendar}
          trend={`${appointmentStats.completionRate.toFixed(0)}% completed`}
          trendUp={appointmentStats.completionRate > 50}
        />
        <StatCard
          title="Revenue"
          value={`ETB ${revenueStats.total.toLocaleString()}`}
          icon={DollarSign}
          trend={`+${revenueStats.growth}%`}
          trendUp
        />
        <StatCard
          title="Avg Rating"
          value={appointmentStats.averageRating.toFixed(1)}
          icon={Star}
          trend="from 45 reviews"
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="employees">Employees</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Activity Chart */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Activity Timeline</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant={timeRange === "week" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTimeRange("week")}
                  >
                    7 Days
                  </Button>
                  <Button
                    variant={timeRange === "month" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTimeRange("month")}
                  >
                    30 Days
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={activityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="appointments"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.2}
                      name="Appointments"
                    />
                    <Area
                      yAxisId="right"
                      type="monotone"
                      dataKey="revenue"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.2}
                      name="Revenue (ETB)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Appointment Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Appointment Status</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RePieChart>
                    <Pie
                      data={appointmentStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {appointmentStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </RePieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">
                      {appointmentStats.completed}
                    </p>
                    <p className="text-xs text-green-600">Completed</p>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">
                      {appointmentStats.scheduled}
                    </p>
                    <p className="text-xs text-blue-600">Scheduled</p>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <p className="text-2xl font-bold text-yellow-600">
                      {appointmentStats.inProgress}
                    </p>
                    <p className="text-xs text-yellow-600">In Progress</p>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <p className="text-2xl font-bold text-red-600">
                      {appointmentStats.cancelled}
                    </p>
                    <p className="text-xs text-red-600">Cancelled</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Revenue Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueStats.monthly}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => `ETB ${value.toLocaleString()}`}
                  />
                  <Legend />
                  <Bar dataKey="revenue" fill="#10b981" name="Revenue (ETB)" />
                </BarChart>
              </ResponsiveContainer>
              <div className="flex justify-between mt-4 p-4 bg-muted/30 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-600">
                    ETB {revenueStats.total.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Projected (Next Month)
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    ETB {revenueStats.projected.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Growth Rate</p>
                  <p className="text-2xl font-bold text-green-600 flex items-center gap-1">
                    <TrendingUp className="h-5 w-5" />
                    {revenueStats.growth}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appointments Tab */}
        <TabsContent value="appointments" className="space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total"
              value={appointmentStats.total}
              icon={Calendar}
            />
            <StatCard
              title="Completed"
              value={appointmentStats.completed}
              icon={CheckCircle}
            />
            <StatCard
              title="Cancelled"
              value={appointmentStats.cancelled}
              icon={XCircle}
            />
            <StatCard
              title="Completion Rate"
              value={`${appointmentStats.completionRate.toFixed(0)}%`}
              icon={Activity}
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Appointment Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="appointments"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.2}
                    name="Appointments"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Services Tab */}
        <TabsContent value="services" className="space-y-4">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Services</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {servicePerformance.map((service, idx) => (
                    <div
                      key={service.id}
                      className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{service.name}</p>
                        <p className="text-sm text-muted-foreground">
                          ETB {service.price} • {service.totalAppointments || 0}{" "}
                          bookings
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">
                            {service.rating || 4.5}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {servicePerformance.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      No services yet
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Service Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-2">
                  <p className="text-4xl font-bold text-primary">
                    {stats.activeServices}
                  </p>
                  <p className="text-muted-foreground">Active Services</p>
                  <div className="flex justify-center gap-4 mt-4">
                    <div className="text-center">
                      <p className="text-2xl font-semibold">{stats.services}</p>
                      <p className="text-xs text-muted-foreground">
                        Total Services
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-semibold text-green-600">
                        {stats.activeServices}
                      </p>
                      <p className="text-xs text-muted-foreground">Active</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-semibold text-gray-500">
                        {stats.services - stats.activeServices}
                      </p>
                      <p className="text-xs text-muted-foreground">Inactive</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Employees Tab */}
        <TabsContent value="employees" className="space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Employees"
              value={stats.employees}
              icon={Users}
            />
            <StatCard title="Active" value={stats.employees} icon={UserPlus} />
            <StatCard title="New This Month" value={0} icon={UserPlus} />
            <StatCard title="Avg Tasks/Employee" value="0" icon={Briefcase} />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Employee Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {employeePerformance.map((emp) => (
                  <div
                    key={emp.id}
                    className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">
                        {emp.user?.firstname} {emp.user?.lastname}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {emp.jobTitle}
                      </p>
                    </div>
                    <div className="flex gap-6 text-center">
                      <div>
                        <p className="font-semibold">{emp.taskCount}</p>
                        <p className="text-xs text-muted-foreground">Tasks</p>
                      </div>
                      <div>
                        <p className="font-semibold text-green-600">
                          {emp.completedTasks}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Completed
                        </p>
                      </div>
                      <div>
                        <p className="font-semibold">
                          {emp.taskCount > 0
                            ? (
                                (emp.completedTasks / emp.taskCount) *
                                100
                              ).toFixed(0)
                            : 0}
                          %
                        </p>
                        <p className="text-xs text-muted-foreground">Success</p>
                      </div>
                    </div>
                  </div>
                ))}
                {employeePerformance.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No employees yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

const StatCardTitle = ({ href, className, children, ...props }) => {
  return href ? (
    <Link
      href={href}
      className={cn(
        "flex flex-row items-center justify-between space-y-0 hover:underline w-full",
        className,
      )}
      {...props}
    >
      {children}
    </Link>
  ) : (
    <div
      className={cn(
        "flex flex-row items-center justify-between space-y-0 w-full",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

function StatCard({ title, value, icon: Icon, href, trend, trendUp }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <StatCardTitle href={href}>
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </StatCardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p
            className={cn(
              "text-xs mt-1 flex items-center gap-1",
              trendUp ? "text-green-600" : "text-red-600",
            )}
          >
            {trendUp ? (
              <ArrowUpRight className="h-3 w-3" />
            ) : (
              <ArrowDownRight className="h-3 w-3" />
            )}
            {trend}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
