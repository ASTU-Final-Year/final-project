"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Users,
  Briefcase,
  CheckCircle2,
  Building2,
  Plus,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";

// Mock data matching the database schema
const stats = [
  {
    title: "Total Employees",
    value: "24",
    change: "+2 from last month",
    icon: Users,
    trend: "up",
  },
  {
    title: "Active Services",
    value: "12",
    change: "+1 new service",
    icon: Briefcase,
    trend: "up",
  },
  {
    title: "Tasks Completed",
    value: "156",
    change: "This month",
    icon: CheckCircle2,
    trend: "up",
  },
  {
    title: "Branches",
    value: "3",
    change: "Across 2 cities",
    icon: Building2,
    trend: "neutral",
  },
];

const recentEmployees = [
  {
    id: "1",
    name: "Abebe Kebede",
    email: "abebe.k@org.com",
    jobTitle: "Software Engineer",
    office: "Main Branch - Office A",
    avatar: null,
  },
  {
    id: "2",
    name: "Tigist Haile",
    email: "tigist.h@org.com",
    jobTitle: "Project Manager",
    office: "Main Branch - Office B",
    avatar: null,
  },
  {
    id: "3",
    name: "Dawit Tadesse",
    email: "dawit.t@org.com",
    jobTitle: "Customer Support",
    office: "North Branch - Office A",
    avatar: null,
  },
];

const recentServices = [
  {
    id: "1",
    name: "Document Processing",
    description: "Handle document submissions and approvals",
    employeeCount: 5,
  },
  {
    id: "2",
    name: "Customer Consultation",
    description: "One-on-one customer advisory sessions",
    employeeCount: 8,
  },
  {
    id: "3",
    name: "Technical Support",
    description: "IT and technical assistance services",
    employeeCount: 4,
  },
];

export default function OrgAdminDashboard() {
  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Overview of your organization&apos;s performance and activity
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                {stat.trend === "up" && (
                  <TrendingUp className="size-3 text-emerald-500" />
                )}
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/dashboard/org-admin/employees">
            <Plus className="mr-2 size-4" />
            Add Employee
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/dashboard/org-admin/services">
            <Plus className="mr-2 size-4" />
            Add Service
          </Link>
        </Button>
      </div>

      {/* Recent Activity Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Employees */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Employees</CardTitle>
                <CardDescription>Latest additions to your team</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/org-admin/employees">
                  View all
                  <ArrowUpRight className="ml-1 size-3" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {recentEmployees.map((employee) => (
                <div
                  key={employee.id}
                  className="flex items-center gap-3"
                >
                  <Avatar size="sm">
                    <AvatarImage src={employee.avatar} alt={employee.name} />
                    <AvatarFallback>
                      {employee.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-1 flex-col">
                    <span className="text-sm font-medium">{employee.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {employee.jobTitle}
                    </span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {employee.office.split(" - ")[0]}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Services */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Active Services</CardTitle>
                <CardDescription>Services offered by your organization</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/org-admin/services">
                  View all
                  <ArrowUpRight className="ml-1 size-3" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {recentServices.map((service) => (
                <div
                  key={service.id}
                  className="flex items-start justify-between gap-3"
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium">{service.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {service.description}
                    </span>
                  </div>
                  <Badge variant="outline" className="shrink-0">
                    {service.employeeCount} staff
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
