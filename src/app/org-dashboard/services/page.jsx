// src/app/org-dashboard/services/page.jsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import {
  Package,
  Plus,
  Search,
  Edit,
  Trash2,
  MoreVertical,
  Clock,
  DollarSign,
  Users,
  Calendar,
  Filter,
  ArrowLeft,
  CheckCircle2,
  XCircle,
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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function ServicesPage() {
  const router = useRouter();
  const [services, setServices] = useState([
    {
      id: 1,
      name: "Business Consultation",
      category: "Consulting",
      description: "Expert business advice for startups and enterprises",
      duration: 60,
      price: 150,
      employees: ["Sarah Johnson", "Michael Chen"],
      active: true,
      bookings: 45,
      createdAt: "2024-01-15",
    },
    {
      id: 2,
      name: "Financial Planning",
      category: "Finance",
      description: "Comprehensive financial planning and investment advice",
      duration: 90,
      price: 250,
      employees: ["Michael Chen", "Emily Rodriguez"],
      active: true,
      bookings: 32,
      createdAt: "2024-02-10",
    },
    {
      id: 3,
      name: "Legal Advisory",
      category: "Legal",
      description: "Legal counsel for business and personal matters",
      duration: 45,
      price: 180,
      employees: ["Emily Rodriguez"],
      active: true,
      bookings: 28,
      createdAt: "2024-01-20",
    },
    {
      id: 4,
      name: "IT Support",
      category: "Technology",
      description: "Technical support and IT consulting",
      duration: 30,
      price: 90,
      employees: ["David Kim", "Sarah Johnson"],
      active: false,
      bookings: 56,
      createdAt: "2024-03-05",
    },
    {
      id: 5,
      name: "Marketing Strategy",
      category: "Marketing",
      description: "Digital marketing and brand strategy",
      duration: 60,
      price: 200,
      employees: ["Sarah Johnson"],
      active: true,
      bookings: 23,
      createdAt: "2024-02-28",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    duration: 30,
    price: 0,
    employees: [],
    active: true,
  });

  const categories = [
    "Consulting",
    "Finance",
    "Legal",
    "Technology",
    "Marketing",
    "HR",
    "Operations",
  ];

  const employees = [
    { id: 1, name: "Sarah Johnson", role: "Senior Consultant" },
    { id: 2, name: "Michael Chen", role: "Financial Advisor" },
    { id: 3, name: "Emily Rodriguez", role: "Legal Counsel" },
    { id: 4, name: "David Kim", role: "IT Specialist" },
  ];

  const filteredServices = services.filter((service) => {
    const matchesSearch = service.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || service.category === categoryFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && service.active) ||
      (statusFilter === "inactive" && !service.active);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleAddService = () => {
    const newService = {
      id: services.length + 1,
      ...formData,
      bookings: 0,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setServices([...services, newService]);
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEditService = () => {
    const updatedServices = services.map((s) =>
      s.id === selectedService.id ? { ...s, ...formData } : s
    );
    setServices(updatedServices);
    setIsEditDialogOpen(false);
    resetForm();
  };

  const handleDeleteService = () => {
    const updatedServices = services.filter((s) => s.id !== selectedService.id);
    setServices(updatedServices);
    setIsDeleteDialogOpen(false);
    setSelectedService(null);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      description: "",
      duration: 30,
      price: 0,
      employees: [],
      active: true,
    });
    setSelectedService(null);
  };

  const openEditDialog = (service) => {
    setSelectedService(service);
    setFormData({
      name: service.name,
      category: service.category,
      description: service.description,
      duration: service.duration,
      price: service.price,
      employees: service.employees,
      active: service.active,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (service) => {
    setSelectedService(service);
    setIsDeleteDialogOpen(true);
  };

  const toggleServiceStatus = (serviceId) => {
    const updatedServices = services.map((s) =>
      s.id === serviceId ? { ...s, active: !s.active } : s
    );
    setServices(updatedServices);
  };

  // Calculate totals for stats cards
  const totalServices = services.length;
  const activeServices = services.filter(s => s.active).length;
  const totalBookings = services.reduce((acc, s) => acc + s.bookings, 0);
  const totalRevenue = services.reduce((acc, s) => acc + s.price * s.bookings, 0);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      <main className="flex-1 container mx-auto px-4 lg:px-8 py-8">
        {/* Back Navigation */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/org-dashboard">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Services</h1>
            <p className="text-muted-foreground mt-1">
              Manage your organization's services and offerings
            </p>
          </div>
        </div>
        {/* Actions Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
          <div className="flex flex-1 items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 border-primary-600/20 focus-visible:ring-primary-600/30"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[150px] border-primary-600/20">
                <Filter className="h-4 w-4 mr-2 text-primary-600" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[130px] border-primary-600/20">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary">
                <Plus className="h-4 w-4 mr-2" />
                   Add New Service 
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-primary-600">Add New Service</DialogTitle>
                <DialogDescription>
                  Create a new service offering for your organization.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Service Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="e.g., Business Consultation"
                      className="border-primary-600/20 focus-visible:ring-primary-600/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        setFormData({ ...formData, category: value })
                      }
                    >
                      <SelectTrigger className="border-primary-600/20">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Describe the service..."
                    className="resize-none border-primary-600/20 focus-visible:ring-primary-600/30"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={formData.duration}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          duration: parseInt(e.target.value),
                        })
                      }
                      min="15"
                      step="15"
                      className="border-primary-600/20 focus-visible:ring-primary-600/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          price: parseInt(e.target.value),
                        })
                      }
                      min="0"
                      step="5"
                      className="border-primary-600/20 focus-visible:ring-primary-600/30"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Assign Employees</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {employees.map((emp) => (
                      <div
                        key={emp.id}
                        className={`flex items-center space-x-2 p-2 border rounded-lg cursor-pointer transition-all ${
                          formData.employees.includes(emp.name)
                            ? 'border-primary-600 bg-primary-600/5'
                            : 'border-primary-600/20 hover:border-primary-600/40'
                        }`}
                        onClick={() => {
                          const updated = formData.employees.includes(emp.name)
                            ? formData.employees.filter((n) => n !== emp.name)
                            : [...formData.employees, emp.name];
                          setFormData({ ...formData, employees: updated });
                        }}
                      >
                        <input
                          type="checkbox"
                          id={`emp-${emp.id}`}
                          checked={formData.employees.includes(emp.name)}
                          onChange={() => {}}
                          className="rounded border-primary-600 text-primary-600 focus:ring-primary-600"
                        />
                        <Label htmlFor={`emp-${emp.id}`} className="text-sm cursor-pointer flex-1">
                          {emp.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-primary-600/5 rounded-lg">
                  <Label htmlFor="active" className="font-medium">Active Status</Label>
                  <Switch
                    id="active"
                    checked={formData.active}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, active: checked })
                    }
                    className="data-[state=checked]:bg-primary-600"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddService} className="bg-primary-600 hover:bg-primary-700">
                  Create Service
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Services Table */}
        <Card className="border-primary-600/20 overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-primary-600/5">
                <TableRow>
                  <TableHead className="font-semibold">Service</TableHead>
                  <TableHead className="font-semibold">Category</TableHead>
                  <TableHead className="font-semibold">Duration</TableHead>
                  <TableHead className="font-semibold">Price</TableHead>
                  <TableHead className="font-semibold">Employees</TableHead>
                  <TableHead className="font-semibold">Bookings</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="text-right font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredServices.map((service) => (
                  <TableRow key={service.id} className="hover:bg-primary-600/5 transition-colors group">
                    <TableCell>
                      <div>
                        <p className="font-medium group-hover:text-primary-600 transition-colors">
                          {service.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Created: {service.createdAt}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-primary-600/10 text-primary-600 border-primary-600/20">
                        {service.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-primary-600" />
                        <span>{service.duration} min</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-primary-600">${service.price}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex -space-x-2">
                        {service.employees.slice(0, 3).map((emp, i) => (
                          <TooltipProvider key={i}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Avatar className="h-6 w-6 border-2 border-background hover:z-10 transition-transform hover:scale-110">
                                  <AvatarFallback className="text-xs bg-primary-600/10 text-primary-600">
                                    {emp.split(" ").map((n) => n[0]).join("")}
                                  </AvatarFallback>
                                </Avatar>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{emp}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ))}
                        {service.employees.length > 3 && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="h-6 w-6 rounded-full bg-primary-600/10 flex items-center justify-center text-xs border-2 border-background text-primary-600 font-medium hover:scale-110 transition-transform cursor-help">
                                  +{service.employees.length - 3}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{service.employees.slice(3).join(", ")}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{service.bookings}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={service.active}
                          onCheckedChange={() => toggleServiceStatus(service.id)}
                          className="data-[state=checked]:bg-primary-600"
                        />
                        <Badge
                          variant="outline"
                          className={
                            service.active
                              ? "bg-primary-500/10 text-primary-600 border-primary-500/20"
                              : "bg-gray-500/10 text-gray-600 border-gray-500/20"
                          }
                        >
                          {service.active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 hover:bg-primary-600/10 hover:text-primary-600"
                                onClick={() => openEditDialog(service)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Edit service</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary-600/10">
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
                              <Copy className="h-4 w-4 mr-2" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                              <Archive className="h-4 w-4 mr-2" />
                              Archive
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600 cursor-pointer"
                              onClick={() => openDeleteDialog(service)}
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
          <CardFooter className="border-t border-primary-600/20 px-6 py-4 bg-primary-600/5">
            <div className="flex items-center justify-between w-full text-sm">
              <div className="text-muted-foreground">
                Showing <span className="font-medium text-primary-600">{filteredServices.length}</span> of{" "}
                <span className="font-medium text-primary-600">{services.length}</span> services
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled className="border-primary-600/20">
                  Previous
                </Button>
                <Button size="sm" className="bg-primary-600 text-white hover:bg-primary-700">1</Button>
                <Button variant="outline" size="sm" className="border-primary-600/20 hover:border-primary-600">2</Button>
                <Button variant="outline" size="sm" className="border-primary-600/20 hover:border-primary-600">3</Button>
                <Button variant="outline" size="sm" className="border-primary-600/20 hover:border-primary-600">
                  Next
                </Button>
              </div>
            </div>
          </CardFooter>
        </Card>
      </main>

      <SiteFooter />

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-primary-600">Edit Service</DialogTitle>
            <DialogDescription>
              Update the service details below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Service Name</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="border-primary-600/20 focus-visible:ring-primary-600/30"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger className="border-primary-600/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="resize-none border-primary-600/20 focus-visible:ring-primary-600/30"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-duration">Duration (minutes)</Label>
                <Input
                  id="edit-duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      duration: parseInt(e.target.value),
                    })
                  }
                  className="border-primary-600/20 focus-visible:ring-primary-600/30"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-price">Price ($)</Label>
                <Input
                  id="edit-price"
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: parseInt(e.target.value) })
                  }
                  className="border-primary-600/20 focus-visible:ring-primary-600/30"
                />
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-primary-600/5 rounded-lg">
              <Label htmlFor="edit-active" className="font-medium">Active Status</Label>
              <Switch
                id="edit-active"
                checked={formData.active}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, active: checked })
                }
                className="data-[state=checked]:bg-primary-600"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditService} className="bg-primary-600 hover:bg-primary-700">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-bold text-red-600">Delete Service</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>This action cannot be undone. This will permanently delete:</p>
              <div className="p-3 bg-red-600/5 rounded-lg border border-red-600/20">
                <p className="font-semibold">{selectedService?.name}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Category: {selectedService?.category} • Bookings: {selectedService?.bookings}
                </p>
              </div>
              <p className="text-sm">All associated data will be removed from our servers.</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteService}
              className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}