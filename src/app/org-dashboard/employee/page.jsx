// src/app/org-dashboard/employees/page.jsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Users,
  Plus,
  Search,
  Edit,
  Trash2,
  MoreVertical,
  Mail,
  Phone,
  Calendar,
  Star,
  Clock,
  Filter,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  UserPlus,
  Briefcase,
  Eye,
  Copy,
  Archive,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.j@techcorp.com",
      phone: "+1 (555) 123-4567",
      role: "Senior Consultant",
      department: "Consulting",
      avatar: "https://i.pravatar.cc/150?u=1",
      services: ["Business Consultation", "Marketing Strategy"],
      rating: 4.8,
      status: "available",
      joinedDate: "2023-06-15",
      active: true,
    },
    {
      id: 2,
      name: "Michael Chen",
      email: "michael.c@techcorp.com",
      phone: "+1 (555) 234-5678",
      role: "Financial Advisor",
      department: "Finance",
      avatar: "https://i.pravatar.cc/150?u=2",
      services: ["Financial Planning", "Investment Advisory"],
      rating: 4.9,
      status: "busy",
      joinedDate: "2023-08-20",
      active: true,
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      email: "emily.r@techcorp.com",
      phone: "+1 (555) 345-6789",
      role: "Legal Counsel",
      department: "Legal",
      avatar: "https://i.pravatar.cc/150?u=3",
      services: ["Legal Advisory", "Contract Review"],
      rating: 4.7,
      status: "available",
      joinedDate: "2023-09-10",
      active: true,
    },
    {
      id: 4,
      name: "David Kim",
      email: "david.k@techcorp.com",
      phone: "+1 (555) 456-7890",
      role: "IT Specialist",
      department: "Technology",
      avatar: "https://i.pravatar.cc/150?u=4",
      services: ["IT Support", "System Architecture"],
      rating: 4.6,
      status: "offline",
      joinedDate: "2023-07-05",
      active: false,
    },
    {
      id: 5,
      name: "Lisa Thompson",
      email: "lisa.t@techcorp.com",
      phone: "+1 (555) 567-8901",
      role: "HR Manager",
      department: "HR",
      avatar: "https://i.pravatar.cc/150?u=5",
      services: ["HR Consulting", "Recruitment"],
      rating: 4.8,
      status: "available",
      joinedDate: "2023-10-01",
      active: true,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    department: "",
    services: [],
    status: "available",
    active: true,
  });

  const departments = [
    "Consulting",
    "Finance",
    "Legal",
    "Technology",
    "HR",
    "Operations",
    "Marketing",
  ];

  const availableServices = [
    "Business Consultation",
    "Financial Planning",
    "Legal Advisory",
    "IT Support",
    "Marketing Strategy",
    "HR Consulting",
    "Investment Advisory",
    "Contract Review",
    "System Architecture",
    "Recruitment",
  ];

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === "all" || emp.department === departmentFilter;
    const matchesStatus = statusFilter === "all" || emp.status === statusFilter;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const handleAddEmployee = () => {
    const newEmployee = {
      id: employees.length + 1,
      ...formData,
      avatar: `https://i.pravatar.cc/150?u=${Date.now()}`,
      rating: 4.5,
      joinedDate: new Date().toISOString().split("T")[0],
    };
    setEmployees([...employees, newEmployee]);
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEditEmployee = () => {
    const updatedEmployees = employees.map((e) =>
      e.id === selectedEmployee.id ? { ...e, ...formData } : e
    );
    setEmployees(updatedEmployees);
    setIsEditDialogOpen(false);
    resetForm();
  };

  const handleDeleteEmployee = () => {
    const updatedEmployees = employees.filter((e) => e.id !== selectedEmployee.id);
    setEmployees(updatedEmployees);
    setIsDeleteDialogOpen(false);
    setSelectedEmployee(null);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      role: "",
      department: "",
      services: [],
      status: "available",
      active: true,
    });
    setSelectedEmployee(null);
  };

  const openEditDialog = (employee) => {
    setSelectedEmployee(employee);
    setFormData({
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      role: employee.role,
      department: employee.department,
      services: employee.services,
      status: employee.status,
      active: employee.active,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (employee) => {
    setSelectedEmployee(employee);
    setIsDeleteDialogOpen(true);
  };

  const toggleEmployeeStatus = (employeeId) => {
    const updatedEmployees = employees.map((e) =>
      e.id === employeeId ? { ...e, active: !e.active } : e
    );
    setEmployees(updatedEmployees);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "available":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "busy":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      case "offline":
        return "bg-gray-500/10 text-gray-600 border-gray-500/20";
      default:
        return "";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "available":
        return <CheckCircle2 className="h-3 w-3 mr-1" />;
      case "busy":
        return <Clock className="h-3 w-3 mr-1" />;
      case "offline":
        return <XCircle className="h-3 w-3 mr-1" />;
      default:
        return null;
    }
  };

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
              <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
              <p className="text-muted-foreground mt-1">
                Manage your team members and their assignments
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 lg:px-8 py-8">
        {/* Actions Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
          <div className="flex flex-1 items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search employees by name, role, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 border-green-600/20 focus-visible:ring-green-600/30"
              />
            </div>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-[150px] border-green-600/20">
                <Filter className="h-4 w-4 mr-2 text-green-600" />
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[130px] border-green-600/20">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="busy">Busy</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <UserPlus className="h-4 w-4 mr-2" />
                Add New Employee
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-green-600">Add New Employee</DialogTitle>
                <DialogDescription>
                  Add a new team member to your organization.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John Doe"
                      className="border-green-600/20 focus-visible:ring-green-600/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input
                      id="role"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      placeholder="e.g., Senior Consultant"
                      className="border-green-600/20 focus-visible:ring-green-600/30"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john@company.com"
                      className="border-green-600/20 focus-visible:ring-green-600/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 (555) 000-0000"
                      className="border-green-600/20 focus-visible:ring-green-600/30"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select
                      value={formData.department}
                      onValueChange={(value) => setFormData({ ...formData, department: value })}
                    >
                      <SelectTrigger className="border-green-600/20">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData({ ...formData, status: value })}
                    >
                      <SelectTrigger className="border-green-600/20">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="busy">Busy</SelectItem>
                        <SelectItem value="offline">Offline</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Assign Services</Label>
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 border border-green-600/20 rounded-lg">
                    {availableServices.map((service) => (
                      <div
                        key={service}
                        className={`flex items-center space-x-2 p-2 rounded-lg cursor-pointer transition-all ${
                          formData.services.includes(service)
                            ? 'bg-green-600/5 border border-green-600/20'
                            : 'hover:bg-green-600/5'
                        }`}
                        onClick={() => {
                          const updated = formData.services.includes(service)
                            ? formData.services.filter((s) => s !== service)
                            : [...formData.services, service];
                          setFormData({ ...formData, services: updated });
                        }}
                      >
                        <input
                          type="checkbox"
                          id={`service-${service}`}
                          checked={formData.services.includes(service)}
                          onChange={() => {}}
                          className="rounded border-green-600 text-green-600 focus:ring-green-600"
                        />
                        <Label htmlFor={`service-${service}`} className="text-sm cursor-pointer flex-1">
                          {service}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-600/5 rounded-lg">
                  <Label htmlFor="active" className="font-medium">Active Status</Label>
                  <Switch
                    id="active"
                    checked={formData.active}
                    onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                    className="data-[state=checked]:bg-green-600"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddEmployee} className="bg-green-600 hover:bg-green-700">
                  Add Employee
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Employees Table */}
        <Card className="border-green-600/20 overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-green-600/5">
                <TableRow>
                  <TableHead className="font-semibold">Employee</TableHead>
                  <TableHead className="font-semibold">Department</TableHead>
                  <TableHead className="font-semibold">Contact</TableHead>
                  <TableHead className="font-semibold">Services</TableHead>
                  <TableHead className="font-semibold">Rating</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Active</TableHead>
                  <TableHead className="text-right font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee) => (
                  <TableRow key={employee.id} className="hover:bg-green-600/5 transition-colors group">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border-2 border-green-600/20 group-hover:border-green-600/40 transition-all">
                          <AvatarImage src={employee.avatar} />
                          <AvatarFallback className="bg-green-600/10 text-green-600">
                            {employee.name.split(" ").map((n) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium group-hover:text-green-600 transition-colors">
                            {employee.name}
                          </p>
                          <p className="text-xs text-muted-foreground">{employee.role}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-600/10 text-green-600 border-green-600/20">
                        {employee.department}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-xs">
                          <Mail className="h-3 w-3 text-green-600" />
                          <span className="text-muted-foreground truncate max-w-[150px]">
                            {employee.email}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs">
                          <Phone className="h-3 w-3 text-green-600" />
                          <span className="text-muted-foreground">{employee.phone}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {employee.services.slice(0, 2).map((service) => (
                          <Badge key={service} variant="secondary" className="text-xs bg-green-600/5 text-green-600">
                            {service.length > 15 ? service.substring(0, 12) + '...' : service}
                          </Badge>
                        ))}
                        {employee.services.length > 2 && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Badge variant="secondary" className="text-xs bg-green-600/5 text-green-600 cursor-help">
                                  +{employee.services.length - 2}
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{employee.services.slice(2).join(", ")}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-green-600 text-green-600" />
                        <span className="font-semibold">{employee.rating}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(employee.status)}>
                        {getStatusIcon(employee.status)}
                        {employee.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={employee.active}
                        onCheckedChange={() => toggleEmployeeStatus(employee.id)}
                        className="data-[state=checked]:bg-green-600"
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 hover:bg-green-600/10 hover:text-green-600"
                                onClick={() => openEditDialog(employee)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Edit employee</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-green-600/10">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem className="cursor-pointer">
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                              <Mail className="h-4 w-4 mr-2" />
                              Send Email
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                              <Calendar className="h-4 w-4 mr-2" />
                              View Schedule
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                              <Copy className="h-4 w-4 mr-2" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600 cursor-pointer"
                              onClick={() => openDeleteDialog(employee)}
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
          <CardFooter className="border-t border-green-600/20 px-6 py-4 bg-green-600/5">
            <div className="flex items-center justify-between w-full text-sm">
              <div className="text-muted-foreground">
                Showing <span className="font-medium text-green-600">{filteredEmployees.length}</span> of{" "}
                <span className="font-medium text-green-600">{employees.length}</span> employees
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled className="border-green-600/20">
                  Previous
                </Button>
                <Button size="sm" className="bg-green-600 text-white hover:bg-green-700">1</Button>
                <Button variant="outline" size="sm" className="border-green-600/20 hover:border-green-600">2</Button>
                <Button variant="outline" size="sm" className="border-green-600/20 hover:border-green-600">3</Button>
                <Button variant="outline" size="sm" className="border-green-600/20 hover:border-green-600">
                  Next
                </Button>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-green-600">Edit Employee</DialogTitle>
            <DialogDescription>
              Update the employee information below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Full Name</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="border-green-600/20 focus-visible:ring-green-600/30"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-role">Role</Label>
                <Input
                  id="edit-role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="border-green-600/20 focus-visible:ring-green-600/30"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="border-green-600/20 focus-visible:ring-green-600/30"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone</Label>
                <Input
                  id="edit-phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="border-green-600/20 focus-visible:ring-green-600/30"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-department">Department</Label>
                <Select
                  value={formData.department}
                  onValueChange={(value) => setFormData({ ...formData, department: value })}
                >
                  <SelectTrigger className="border-green-600/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger className="border-green-600/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="busy">Busy</SelectItem>
                    <SelectItem value="offline">Offline</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-600/5 rounded-lg">
              <Label htmlFor="edit-active" className="font-medium">Active Status</Label>
              <Switch
                id="edit-active"
                checked={formData.active}
                onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                className="data-[state=checked]:bg-green-600"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditEmployee} className="bg-green-600 hover:bg-green-700">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-bold text-red-600">Delete Employee</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>This action cannot be undone. This will permanently delete:</p>
              <div className="p-3 bg-red-600/5 rounded-lg border border-red-600/20">
                <p className="font-semibold">{selectedEmployee?.name}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Role: {selectedEmployee?.role} • Department: {selectedEmployee?.department}
                </p>
              </div>
              <p className="text-sm">All associated data will be removed from our servers.</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteEmployee}
              className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600"
            >
              Delete Employee
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}