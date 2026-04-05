// app/org-dashboard/page.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import {
  Building2,
  Users,
  CalendarDays,
  BarChart3,
  Plus,
  Edit,
  Trash2,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  Eye,
  Settings,
  UserPlus,
  Calendar,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  Timer,
  Star,
  ChevronRight,
  Search,
  Filter,
  RefreshCw,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  PieChart,
  LineChart,
  FileText,
  Printer,
  Share2,
  Package,
  ArrowRight,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Toaster } from "@/components/ui/sonner";

// Mock Data
const mockServices = [
  {
    id: "1",
    name: "Full Car Service",
    description: "Complete vehicle inspection and maintenance",
    duration: 180,
    price: 2500,
    status: "active",
    category: "Automotive",
    employeesAssigned: 3,
    bookingsThisMonth: 45,
    availableSlots: 12,
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Oil Change",
    description: "Engine oil and filter replacement",
    duration: 45,
    price: 450,
    status: "active",
    category: "Automotive",
    employeesAssigned: 2,
    bookingsThisMonth: 78,
    availableSlots: 8,
    createdAt: "2024-02-10",
  },
  {
    id: "3",
    name: "General Checkup",
    description: "Basic health consultation and checkup",
    duration: 30,
    price: 350,
    status: "active",
    category: "Healthcare",
    employeesAssigned: 4,
    bookingsThisMonth: 92,
    availableSlots: 15,
    createdAt: "2024-01-20",
  },
  {
    id: "4",
    name: "Dental Cleaning",
    description: "Professional teeth cleaning service",
    duration: 60,
    price: 800,
    status: "inactive",
    category: "Healthcare",
    employeesAssigned: 1,
    bookingsThisMonth: 12,
    availableSlots: 24,
    createdAt: "2024-03-05",
  },
];

const mockEmployees = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+251 911 123456",
    role: "Senior Mechanic",
    status: "active",
    tasksCompleted: 128,
    rating: 4.8,
    joinDate: "2024-01-15",
    avatar: "https://i.pravatar.cc/150?u=1",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+251 922 234567",
    role: "Service Advisor",
    status: "busy",
    tasksCompleted: 95,
    rating: 4.9,
    joinDate: "2024-02-01",
    avatar: "https://i.pravatar.cc/150?u=2",
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike.johnson@example.com",
    phone: "+251 933 345678",
    role: "Diagnostic Specialist",
    status: "active",
    tasksCompleted: 156,
    rating: 4.7,
    joinDate: "2023-11-10",
    avatar: "https://i.pravatar.cc/150?u=3",
  },
  {
    id: "4",
    name: "Sarah Williams",
    email: "sarah.williams@example.com",
    phone: "+251 944 456789",
    role: "Customer Support",
    status: "offline",
    tasksCompleted: 67,
    rating: 4.6,
    joinDate: "2024-03-05",
    avatar: "https://i.pravatar.cc/150?u=4",
  },
];

const mockCalendarEvents = [
  {
    id: "1",
    title: "Car Service - Toyota Camry",
    date: "2026-03-20",
    time: "09:00 AM",
    service: "Full Car Service",
    client: "Abebe Kebede",
    employee: "John Doe",
    status: "confirmed",
  },
  {
    id: "2",
    title: "Oil Change - Honda CRV",
    date: "2026-03-20",
    time: "11:30 AM",
    service: "Oil Change",
    client: "Tigist Haile",
    employee: "Jane Smith",
    status: "confirmed",
  },
  {
    id: "3",
    title: "General Checkup",
    date: "2026-03-21",
    time: "10:00 AM",
    service: "General Checkup",
    client: "Yonas Desta",
    employee: "Mike Johnson",
    status: "pending",
  },
];

function toast() {}

export default function OrgDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("services");
  const [services, setServices] = useState(mockServices);
  const [employees, setEmployees] = useState(mockEmployees);
  const [calendarEvents, setCalendarEvents] = useState(mockCalendarEvents);
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedService, setSelectedService] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isDeleteEmployeeDialogOpen, setIsDeleteEmployeeDialogOpen] = useState(false);

  // Service Management Handlers
  const handleAddService = (service) => {
    const newService = {
      ...service,
      id: Date.now().toString(),
      bookingsThisMonth: 0,
      availableSlots: 10,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setServices([...services, newService]);
    setIsAddServiceOpen(false);
    toast({
      title: "Service Added",
      description: `${service.name} has been added successfully.`,
    });
  };

  const handleDeleteService = () => {
    setServices(services.filter((s) => s.id !== selectedService.id));
    setIsDeleteDialogOpen(false);
    setSelectedService(null);
    toast({
      title: "Service Deleted",
      description: "The service has been removed.",
    });
  };

  const handleToggleServiceStatus = (id) => {
    setServices(
      services.map((s) =>
        s.id === id
          ? { ...s, status: s.status === "active" ? "inactive" : "active" }
          : s,
      ),
    );
    toast({
      title: "Status Updated",
      description: "Service status has been changed.",
    });
  };

  // Employee Management Handlers
  const handleAddEmployee = (employee) => {
    const newEmployee = {
      ...employee,
      id: Date.now().toString(),
      tasksCompleted: 0,
      rating: 0,
      joinDate: new Date().toISOString().split("T")[0],
      avatar: `https://i.pravatar.cc/150?u=${Date.now()}`,
    };
    setEmployees([...employees, newEmployee]);
    setIsAddEmployeeOpen(false);
    toast({
      title: "Employee Added",
      description: `${employee.name} has been added to your organization.`,
    });
  };

  const handleDeleteEmployee = () => {
    setEmployees(employees.filter((e) => e.id !== selectedEmployee.id));
    setIsDeleteEmployeeDialogOpen(false);
    setSelectedEmployee(null);
    toast({
      title: "Employee Removed",
      description: "The employee has been removed.",
    });
  };

  // Filtered data for search
  const filteredServices = services.filter(
    (s) =>
      (s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (statusFilter === "all" || s.status === statusFilter)
  );

  const filteredEmployees = employees.filter(
    (e) =>
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Status badge color mapping
  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-primary/10 text-primary border-primary/20";
      case "inactive":
        return "bg-gray-500/10 text-gray-600 border-gray-500/20";
      case "busy":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      case "offline":
        return "bg-gray-500/10 text-gray-600 border-gray-500/20";
      case "confirmed":
        return "bg-primary/10 text-primary border-primary/20";
      case "pending":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-500/20";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      <main className="flex-1 container mx-auto px-4 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Organization Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your services, employees, and track performance
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => router.push("/org-dashboard/settings")}
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Organization Profile Card */}
        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
          <CardContent className="p-6">
            <div className="flex items-start gap-6">
              <div className="h-20 w-20 rounded-xl bg-primary/10 flex items-center justify-center border-2 border-primary/20">
                <Building2 className="h-10 w-10 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold">TechCorp Solutions</h2>
                  <Badge className="bg-primary/10 text-primary border-primary/20">
                    Verified
                  </Badge>
                </div>
                <p className="text-muted-foreground mb-4">
                  123 Business Ave, Suite 100, San Francisco, CA 94105
                </p>
                <div className="flex gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">contact@techcorp.com</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">+1 (555) 123-4567</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Founded</p>
                    <p className="font-medium">2020</p>
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions Cards - Services, Employees, Calendar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/org-dashboard/services" className="block">
            <Card className="hover:border-primary/50 transition-all hover:shadow-md group cursor-pointer">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <Package className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">Manage Services</p>
                  <p className="text-sm text-muted-foreground">
                    {services.length} total services
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </CardContent>
            </Card>
          </Link>

          <Link href="/org-dashboard/employees" className="block">
            <Card className="hover:border-primary/50 transition-all hover:shadow-md group cursor-pointer">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <Users className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">Manage Employees</p>
                  <p className="text-sm text-muted-foreground">
                    {employees.length} total employees
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </CardContent>
            </Card>
          </Link>

          <Link href="/org-dashboard/calendar" className="block">
            <Card className="hover:border-primary/50 transition-all hover:shadow-md group cursor-pointer">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <CalendarDays className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">Calendar Settings</p>
                  <p className="text-sm text-muted-foreground">
                    Manage availability and slots
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-flex">
            <TabsTrigger value="services" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Services
            </TabsTrigger>
            <TabsTrigger value="employees" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Employees
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              Calendar
            </TabsTrigger>
          </TabsList>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-6 mt-6">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 border-primary/20 focus-visible:ring-primary/30"
                />
              </div>
              <div className="flex gap-3">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[130px] border-primary/20">
                    <Filter className="h-4 w-4 mr-2 text-primary" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={() => setIsAddServiceOpen(true)} className="bg-primary hover:bg-primary">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Service
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-primary/5">
                    <TableRow>
                      <TableHead>Service Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Price (ETB)</TableHead>
                      <TableHead>Available Slots</TableHead>
                      <TableHead>Bookings</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredServices.map((service) => (
                      <TableRow key={service.id} className="hover:bg-primary/5 transition-colors">
                        <TableCell className="font-medium">
                          <div>
                            <p className="font-medium group-hover:text-primary transition-colors">
                              {service.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Created: {service.createdAt}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                            {service.category}
                          </Badge>
                        </TableCell>
                        <TableCell>{service.duration} min</TableCell>
                        <TableCell className="font-semibold text-primary">
                          {service.price.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={
                            service.availableSlots > 10 
                              ? "bg-primary/10 text-primary" 
                              : service.availableSlots > 5 
                              ? "bg-yellow-500/10 text-yellow-600"
                              : "bg-red-500/10 text-red-600"
                          }>
                            {service.availableSlots} slots
                          </Badge>
                        </TableCell>
                        <TableCell>{service.bookingsThisMonth}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStatusColor(service.status)}>
                            {service.status === "active" ? (
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                            ) : (
                              <XCircle className="h-3 w-3 mr-1" />
                            )}
                            {service.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Link href={`/org-dashboard/calendar?service=${service.id}`}>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10 hover:text-primary">
                                      <Calendar className="h-4 w-4" />
                                    </Button>
                                  </Link>
                                </TooltipTrigger>
                                <TooltipContent>View calendar</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleToggleServiceStatus(service.id)}
                                >
                                  {service.status === "active" ? (
                                    <>Deactivate</>
                                  ) : (
                                    <>Activate</>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => {
                                    setSelectedService(service);
                                    setIsDeleteDialogOpen(true);
                                  }}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="border-t border-primary/20 px-6 py-4 bg-primary/5">
                <div className="flex items-center justify-between w-full text-sm">
                  <div className="text-muted-foreground">
                    Showing <span className="font-medium text-primary">{filteredServices.length}</span> of{" "}
                    <span className="font-medium text-primary">{services.length}</span> services
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" disabled className="border-primary/20">
                      Previous
                    </Button>
                    <Button size="sm" className="bg-primary text-white hover:bg-primary">1</Button>
                    <Button variant="outline" size="sm" className="border-primary/20 hover:border-primary">2</Button>
                    <Button variant="outline" size="sm" className="border-primary/20 hover:border-primary">3</Button>
                    <Button variant="outline" size="sm" className="border-primary/20 hover:border-primary">
                      Next
                    </Button>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Employees Tab */}
          <TabsContent value="employees" className="space-y-6 mt-6">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search employees..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 border-primary/20 focus-visible:ring-primary/30"
                />
              </div>
              <Button onClick={() => setIsAddEmployeeOpen(true)} className="bg-primary hover:bg-primary">
                <UserPlus className="mr-2 h-4 w-4" />
                Hire Employee
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredEmployees.map((employee) => (
                <Card key={employee.id} className="border-primary/20 hover:shadow-lg transition-all">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 border-2 border-primary/20">
                          <AvatarImage src={employee.avatar} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {employee.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-base">
                            {employee.name}
                          </CardTitle>
                          <CardDescription>{employee.role}</CardDescription>
                        </div>
                      </div>
                      <Badge variant="outline" className={getStatusColor(employee.status)}>
                        {employee.status === "active" ? (
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                        ) : employee.status === "busy" ? (
                          <Clock className="h-3 w-3 mr-1" />
                        ) : (
                          <XCircle className="h-3 w-3 mr-1" />
                        )}
                        {employee.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-primary" />
                        <span className="text-muted-foreground">{employee.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-primary" />
                        <span className="text-muted-foreground">{employee.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        <span>{employee.tasksCompleted} tasks completed</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                        <span>{employee.rating} / 5.0</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0 flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-4 w-4 mr-2" />
                      View Profile
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-100/10"
                      onClick={() => {
                        setSelectedEmployee(employee);
                        setIsDeleteEmployeeDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Calendar Tab */}
          <TabsContent value="calendar" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Appointments</CardTitle>
                <CardDescription>
                  Manage and track scheduled services
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Employee</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {calendarEvents.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell>{event.date}</TableCell>
                        <TableCell>{event.time}</TableCell>
                        <TableCell className="font-medium">{event.service}</TableCell>
                        <TableCell>{event.client}</TableCell>
                        <TableCell>{event.employee}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStatusColor(event.status)}>
                            {event.status === "confirmed" ? (
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                            ) : (
                              <Clock className="h-3 w-3 mr-1" />
                            )}
                            {event.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Button variant="outline" className="w-full">
                  <Calendar className="mr-2 h-4 w-4" />
                  Sync with Google Calendar
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Add Service Dialog */}
      <Dialog open={isAddServiceOpen} onOpenChange={setIsAddServiceOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-primary">Add New Service</DialogTitle>
            <DialogDescription>
              Fill in the details to add a new service offering.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Service Name</Label>
              <Input placeholder="e.g., Full Car Service" className="border-primary/20 focus-visible:ring-primary/30" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea placeholder="Describe the service..." className="border-primary/20 focus-visible:ring-primary/30" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Duration (minutes)</Label>
                <Input type="number" placeholder="60" className="border-primary/20 focus-visible:ring-primary/30" />
              </div>
              <div className="space-y-2">
                <Label>Price (ETB)</Label>
                <Input type="number" placeholder="500" className="border-primary/20 focus-visible:ring-primary/30" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select>
                <SelectTrigger className="border-primary/20">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="automotive">Automotive</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="beauty">Beauty & Salon</SelectItem>
                  <SelectItem value="government">Government</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Available Slots</Label>
              <Input type="number" placeholder="10" className="border-primary/20 focus-visible:ring-primary/30" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddServiceOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                toast({ title: "Demo", description: "Service would be added in production" });
                setIsAddServiceOpen(false);
              }}
              className="bg-primary hover:bg-primary"
            >
              Add Service
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Employee Dialog */}
      <Dialog open={isAddEmployeeOpen} onOpenChange={setIsAddEmployeeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-primary">Hire New Employee</DialogTitle>
            <DialogDescription>
              Send an invitation to join your organization.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input placeholder="Enter full name" className="border-primary/20 focus-visible:ring-primary/30" />
            </div>
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input type="email" placeholder="employee@example.com" className="border-primary/20 focus-visible:ring-primary/30" />
            </div>
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input placeholder="+251 911 123456" className="border-primary/20 focus-visible:ring-primary/30" />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Input placeholder="e.g., Mechanic, Advisor" className="border-primary/20 focus-visible:ring-primary/30" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddEmployeeOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                toast({ title: "Invitation Sent", description: "Employee will receive an email invitation" });
                setIsAddEmployeeOpen(false);
              }}
              className="bg-primary hover:bg-primary"
            >
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Service Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-bold text-red-600">Delete Service</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>This action cannot be undone. This will permanently delete:</p>
              <div className="p-3 bg-red-600/5 rounded-lg border border-red-600/20">
                <p className="font-semibold">{selectedService?.name}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Category: {selectedService?.category} • Bookings: {selectedService?.bookingsThisMonth}
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteService} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Employee Confirmation Dialog */}
      <AlertDialog open={isDeleteEmployeeDialogOpen} onOpenChange={setIsDeleteEmployeeDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-bold text-red-600">Remove Employee</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>This action cannot be undone. This will permanently remove:</p>
              <div className="p-3 bg-red-600/5 rounded-lg border border-red-600/20">
                <p className="font-semibold">{selectedEmployee?.name}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Role: {selectedEmployee?.role} • Tasks: {selectedEmployee?.tasksCompleted}
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteEmployee} className="bg-red-600 hover:bg-red-700">
              Remove Employee
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <SiteFooter />
    </div>
  );
}