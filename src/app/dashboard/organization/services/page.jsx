"use client";

import { useEffect, useState, useCallback } from "react";
import RequestHandler from "@/lib/request-handler";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  Filter,
  LayoutGrid,
  List,
  MoreVertical,
  Loader2,
  CalendarIcon,
  UserIcon,
  Clock,
  DollarSign,
  Tag,
  Sparkles,
  Eye,
  TrendingUp,
  Star,
  Zap,
  Heart,
  Shield,
  Activity,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import AcriveBadge from "@/components/ui/active-badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { useOrganizationStore } from "@/store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Sample service data for demonstration cards
const sampleServicesList = [
  {
    id: "1",
    name: "Professional teeth cleaning",
    description: "Comprehensive dental cleaning including plaque removal, polishing, and fluoride treatment.",
    price: 500,
    isActive: true,
    calendar: { name: "Weekdays Only" },
    category: "Dental",
    duration: "30 min",
    bookingRate: 78,
    icon: "🦷",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "2",
    name: "Dental Checkup",
    description: "Complete oral examination, X-rays, and professional consultation with dentist.",
    price: 750,
    isActive: true,
    calendar: { name: "Full Week" },
    category: "Dental",
    duration: "45 min",
    bookingRate: 92,
    icon: "👨‍⚕️",
    color: "from-emerald-500 to-teal-500",
  },
  {
    id: "3",
    name: "Urgent Care",
    description: "Emergency medical consultation and treatment for non-life-threatening conditions.",
    price: 1200,
    isActive: true,
    calendar: { name: "24/7 Emergency" },
    category: "Medical",
    duration: "60 min",
    bookingRate: 85,
    icon: "🚑",
    color: "from-red-500 to-rose-500",
  },
  {
    id: "4",
    name: "X-Ray Analysis",
    description: "Digital radiographic imaging for skeletal assessment and internal examination.",
    price: 2000,
    isActive: true,
    calendar: { name: "Weekdays Only" },
    category: "Diagnostic",
    duration: "20 min",
    bookingRate: 45,
    icon: "📷",
    color: "from-purple-500 to-indigo-500",
  },
  {
    id: "5",
    name: "Physical Therapy",
    description: "One-on-one session focused on rehabilitation, mobility improvement, and pain management.",
    price: 1100,
    isActive: true,
    calendar: { name: "Full Week" },
    category: "Therapy",
    duration: "45 min",
    bookingRate: 95,
    icon: "💪",
    color: "from-orange-500 to-amber-500",
  },
  {
    id: "6",
    name: "Vaccination",
    description: "Administration of routine immunizations and travel vaccines with professional care.",
    price: 300,
    isActive: false,
    calendar: { name: "Weekends" },
    category: "Preventive",
    duration: "15 min",
    bookingRate: 25,
    icon: "💉",
    color: "from-cyan-500 to-sky-500",
  },
];

export default function ServicesPage() {
  const organization = useOrganizationStore(({ organization }) => organization);
  const setOrganization = useOrganizationStore(
    ({ setOrganization }) => setOrganization,
  );
  const services = useOrganizationStore(({ services }) => services);
  const setServices = useOrganizationStore(({ setServices }) => setServices);
  const serviceCount = useOrganizationStore(({ serviceCount }) => serviceCount);
  const setServiceCount = useOrganizationStore(
    ({ setServiceCount }) => setServiceCount,
  );
  const calendars = useOrganizationStore(({ calendars }) => calendars);
  const setCalendars = useOrganizationStore(({ setCalendars }) => setCalendars);
  
  const [selectedServices, setSelectedServices] = useState({});
  const [isLoading, setIsLoading] = useState(services == null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // View & Filter States
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState("table");

  // Dialog States
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  // Form States
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isActive: true,
    calendarId: null,
    price: 0.0,
  });

  const organizationId = organization?.id;

  // --- Data Fetching ---
  useEffect(() => {
    if (organization == null) {
      RequestHandler.Get("/query/v1/organization").then(async (res) => {
        if (res.ok) {
          const {
            organizations: [organization],
          } = await res.json();
          setOrganization(organization);
        }
      });
    }
  }, [organization, setOrganization]);

  const fetchServices = useCallback(async () => {
    if (!organizationId) return;

    const offset = (page - 1) * limit;
    const params = new URLSearchParams({
      order: `["isActive.desc"]`,
      offset: offset.toFixed(),
      limit: limit.toFixed(),
    });

    const [countRes, dataRes, calRes] = await Promise.all([
      RequestHandler.Get(`/query/v1/organizationService?countOnly`),
      RequestHandler.Get(`/query/v1/organizationService?${params.toString()}`),
      RequestHandler.Get(`/query/v1/organizationCalendar`),
    ]);

    if (countRes.ok) {
      const { count } = await countRes.json();
      setServiceCount(count);
    }

    if (dataRes.ok) {
      const { organizationServices } = await dataRes.json();
      let results = organizationServices || [];

      if (statusFilter !== "all") {
        results = results.filter(
          (s) => s.isActive === (statusFilter === "active"),
        );
      }
      if (searchQuery) {
        results = results.filter(
          (s) =>
            s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.description?.toLowerCase().includes(searchQuery.toLowerCase()),
        );
      }
      setServices(results);
      if (calRes.ok) {
        const { organizationCalendars } = await calRes.json();
        setCalendars(organizationCalendars);
      }
    }
    setIsLoading(false);
  }, [
    setCalendars,
    setServiceCount,
    setServices,
    organizationId,
    page,
    limit,
    statusFilter,
    searchQuery,
  ]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  // Get display services (use API data if available, otherwise use sample)
  const displayServices = services?.length > 0 ? services : sampleServicesList;
  const displayCount = services?.length > 0 ? serviceCount : sampleServicesList.length;

  // Filter services based on search and status
  const getFilteredServices = () => {
    let filtered = displayServices || [];
    
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (s) => s.isActive === (statusFilter === "active"),
      );
    }
    if (searchQuery) {
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.description?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }
    return filtered;
  };

  const filteredServices = getFilteredServices();
  const totalPages = Math.ceil(filteredServices.length / limit);
  const paginatedServices = filteredServices.slice(
    (page - 1) * limit,
    page * limit
  );

  // --- CRUD Handlers ---
  const handleAddService = async () => {
    setIsSubmitting(true);
    const res = await RequestHandler.Post(`/query/v1/organizationService`, {
      body: formData,
    });
    if (res.ok) {
      toast.success("Service created successfully");
      setIsAddOpen(false);
      setFormData({
        name: "",
        description: "",
        isActive: true,
        calendarId: null,
        price: 0.0,
      });
      fetchServices();
    } else {
      toast.error("Failed to create service");
    }
    setIsSubmitting(false);
  };

  const handleEditService = async () => {
    setIsSubmitting(true);
    const res = await RequestHandler.Patch(
      `/query/v1/organizationService?~id=${selectedService.id}`,
      { body: formData },
    );
    if (res.ok) {
      toast.success("Service updated successfully");
      setIsEditOpen(false);
      setSelectedService(null);
      fetchServices();
    } else {
      toast.error("Failed to update service");
    }
    setIsSubmitting(false);
  };

  const handleDeleteService = async () => {
    setIsSubmitting(true);
    const res = await RequestHandler.Delete(
      `/query/v1/organizationService?~id=${selectedService.id}`,
    );
    if (res.ok) {
      toast.success("Service deleted successfully");
      setIsDeleteOpen(false);
      setSelectedService(null);
      fetchServices();
    } else {
      toast.error("Failed to delete service");
    }
    setIsSubmitting(false);
  };

  const openEdit = (service) => {
    setSelectedService(service);
    setFormData({
      name: service.name,
      description: service.description,
      isActive: service.isActive,
      calendarId: service.calendarId,
      price: service.price,
    });
    setIsEditOpen(true);
  };

  const openDelete = (service) => {
    setSelectedService(service);
    setIsDeleteOpen(true);
  };

  // Get icon component based on service name
  const getServiceIcon = (serviceName) => {
    const icons = {
      dental: <Activity className="h-5 w-5" />,
      cleaning: <Sparkles className="h-5 w-5" />,
      urgent: <Zap className="h-5 w-5" />,
      ray: <Eye className="h-5 w-5" />,
      physical: <Heart className="h-5 w-5" />,
      vaccination: <Shield className="h-5 w-5" />,
    };
    const lowerName = serviceName.toLowerCase();
    for (const [key, icon] of Object.entries(icons)) {
      if (lowerName.includes(key)) return icon;
    }
    return <Star className="h-5 w-5" />;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 font-sans">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
            Services
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your organization's service offerings.
          </p>
        </div>
        <Button onClick={() => setIsAddOpen(true)} className="shadow-md hover:shadow-lg transition-all">
          <Plus className="mr-2 h-4 w-4" /> Add Service
        </Button>
      </div>

      {/* Toolbar */}
      <Card className="p-3 bg-muted/20 border-none shadow-none bg-background">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex flex-1 items-center gap-3">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search services..."
                className="pl-9 bg-background font-medium"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => {
              setStatusFilter(v);
              setPage(1);
            }}>
              <SelectTrigger className="w-[160px] bg-background">
                <Filter className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Tabs value={view} onValueChange={setView}>
            <TabsList className="bg-background border">
              <TabsTrigger value="table">
                <List className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="grid">
                <LayoutGrid className="h-4 w-4" />
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </Card>

      {/* Main Content - Table View */}
      {isLoading ? (
        <div className="h-64 flex items-center justify-center border rounded-xl bg-card">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : view === "table" ? (
        <>
          <div className="rounded-xl border bg-card overflow-hidden shadow-sm">
            <Table className="font-sans text-lg text-black">
              <TableHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                <TableRow>
                  <TableHead className="px-2 w-8"></TableHead>
                  <TableHead className="font-bold text-black text-base">SERVICE</TableHead>
                  <TableHead className="font-bold text-black text-base">PRICE</TableHead>
                  <TableHead className="font-bold text-black text-base">CALENDAR</TableHead>
                  <TableHead className="font-bold text-black text-base">STATUS</TableHead>
                  <TableHead className="text-right font-bold text-black text-base">ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedServices.map((service) => (
                  <TableRow key={service.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <TableCell className="w-8">
                      <Checkbox
                        checked={selectedServices[service.id]}
                        onCheckedChange={(checked) =>
                          setSelectedServices((prev) =>
                            Object.fromEntries(
                              Object.entries({
                                ...prev,
                                [service.id]: checked,
                              }).filter((c) => c),
                            ),
                          )
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold text-lg text-black">
                        {service.name}
                      </div>
                      <div className="text-base text-black/80 truncate max-w-[400px] mt-0.5">
                        {service.description}
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold text-base text-black">{service.price} Birr</TableCell>
                    <TableCell className="text-base text-black/80">
                      {service.calendar?.name || "-"}
                    </TableCell>
                    <TableCell>
                      <AcriveBadge isActive={service.isActive} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" asChild className="h-8 w-8">
                          <Link
                            href={`/dashboard/organization/service/${service.id}/first_employees`}
                          >
                            <UserIcon className="h-4 w-4" />
                          </Link>
                        </Button>
                        {service.calendarId != null ? (
                          <Button variant="ghost" size="icon" asChild className="h-8 w-8">
                            <Link
                              href={`/dashboard/organization/service/${service.id}/calendar/${service.calendarId}`}
                            >
                              <CalendarIcon className="h-4 w-4" />
                            </Link>
                          </Button>
                        ) : (
                          <Button variant="ghost" disabled size="icon" className="h-8 w-8">
                            <CalendarIcon className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEdit(service)}
                          className="h-8 w-8"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive h-8 w-8"
                          onClick={() => openDelete(service)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* BEAUTIFUL SERVICE CARDS - Between Table and Pagination */}
          {filteredServices.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    Service Highlights
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Premium services at a glance
                  </p>
                </div>
                <Badge variant="outline" className="gap-1">
                  <Sparkles className="h-3 w-3" />
                  {filteredServices.length} Services Available
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {paginatedServices.slice(0, 8).map((service) => (
                  <Card
                    key={service.id}
                    className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 border-0 shadow-md"
                    onClick={() => openEdit(service)}
                  >
                    {/* Gradient Border Top */}
                    <div className={cn(
                      "absolute top-0 left-0 right-0 h-1 bg-gradient-to-r",
                      service.isActive 
                        ? "from-green-500 via-emerald-500 to-teal-500" 
                        : "from-gray-400 via-gray-500 to-gray-600"
                    )} />
                    
                    <CardContent className="p-5">
                      {/* Icon and Status */}
                      <div className="flex items-start justify-between mb-3">
                        <div className={cn(
                          "h-12 w-12 rounded-xl flex items-center justify-center bg-gradient-to-br shadow-lg",
                          service.isActive 
                            ? sampleServicesList.find(s => s.id === service.id)?.color || "from-blue-500 to-cyan-500"
                            : "from-gray-400 to-gray-500"
                        )}>
                          <span className="text-white text-xl">
                            {sampleServicesList.find(s => s.id === service.id)?.icon || "⚕️"}
                          </span>
                        </div>
                        <AcriveBadge isActive={service.isActive} />
                      </div>
                      
                      {/* Service Name */}
                      <h3 className="font-bold text-xl mb-1 line-clamp-1 text-black">
                        {service.name}
                      </h3>
                      
                      {/* Description */}
                      <p className="text-base text-black/80 line-clamp-2 mb-3 leading-relaxed">
                        {service.description}
                      </p>
                      
                      {/* Duration and Price */}
                      <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-1 text-base text-black/80">
                          <Clock className="h-4 w-4" />
                          <span>{service.duration || "30 min"}</span>
                        </div>
                        <div className="flex items-center gap-1 font-bold text-lg text-blue-600 dark:text-blue-400">
                          <DollarSign className="h-4 w-4" />
                          <span>{service.price} ETB</span>
                        </div>
                      </div>
                      
                      {/* Calendar Info */}
                      <div className="flex items-center gap-1.5 text-base text-black/80 mb-3">
                        <CalendarIcon className="h-4 w-4" />
                        <span className="truncate">{service.calendar?.name || "No calendar"}</span>
                      </div>
                      
                      {/* Booking Rate Progress */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Popularity</span>
                          <span className="font-semibold text-gray-700 dark:text-gray-300">
                            {service.bookingRate || Math.floor(Math.random() * 100)}%
                          </span>
                        </div>
                        <Progress 
                          value={service.bookingRate || 65} 
                          className="h-1.5"
                          indicatorClassName={
                            (service.bookingRate || 65) >= 80 ? "bg-red-500" : 
                            (service.bookingRate || 65) >= 50 ? "bg-yellow-500" : 
                            "bg-green-500"
                          }
                        />
                      </div>
                      
                      {/* Footer */}
                      <div className="flex items-center justify-between mt-3 pt-2">
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                          <Tag className="h-2.5 w-2.5" />
                          <span>ID: {service.id?.slice(0, 6) || "SRV"}</span>
                        </div>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-6 text-xs gap-1 text-blue-600 hover:text-blue-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEdit(service);
                          }}
                        >
                          Manage <ChevronRight className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {paginatedServices.map((service) => (
            <Card
              key={service.id}
              className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 border-0 shadow-md"
            >
              <div className={cn(
                "h-1 bg-gradient-to-r",
                service.isActive ? "from-green-500 to-emerald-500" : "from-gray-400 to-gray-500"
              )} />
              
              <CardHeader className="pb-3 pt-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={cn(
                        "h-10 w-10 rounded-xl flex items-center justify-center",
                        service.isActive ? "bg-blue-100 dark:bg-blue-900/30" : "bg-gray-100 dark:bg-gray-800"
                      )}>
                        {getServiceIcon(service.name)}
                      </div>
                      <AcriveBadge isActive={service.isActive} />
                    </div>
                    <CardTitle className="text-lg font-bold line-clamp-1 text-black">
                      {service.name}
                    </CardTitle>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => openEdit(service)}>
                        <Pencil className="mr-2 h-4 w-4" /> Edit Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => openDelete(service)}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete Service
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <p className="text-base text-black/80 line-clamp-2">
                  {service.description}
                </p>
                
                <div className="flex items-center justify-between text-base">
                  <div className="flex items-center gap-1 text-black/80">
                    <Clock className="h-4 w-4" />
                    <span className="text-base">30 min</span>
                  </div>
                  <div className="flex items-center gap-1 font-bold text-lg text-blue-600">
                    <DollarSign className="h-4 w-4" />
                    <span>{service.price} ETB</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-1 text-base text-black/80">
                  <CalendarIcon className="h-4 w-4" />
                  <span>{service.calendar?.name || "No calendar"}</span>
                </div>
              </CardContent>
              
              <CardFooter className="pt-2 pb-3 border-t bg-muted/5">
                <Button size="sm" variant="ghost" className="w-full text-xs" onClick={() => openEdit(service)}>
                  View Details →
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredServices.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Services Found</h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchQuery || statusFilter !== "all" 
                ? "Try adjusting your search or filter criteria"
                : "Get started by creating your first service offering"}
            </p>
            {(searchQuery || statusFilter !== "all") ? (
              <Button variant="outline" onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
              }}>
                Clear Filters
              </Button>
            ) : (
              <Button onClick={() => setIsAddOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Add Service
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {filteredServices.length > 0 && (
        <div className="flex items-center justify-between px-4 py-4 border rounded-lg bg-card shadow-sm">
          <div className="flex items-center gap-6">
            <div className="text-sm text-muted-foreground">
              Showing{" "}
              <span className="font-medium">{(page - 1) * limit + 1}</span> to{" "}
              <span className="font-medium">
                {Math.min(page * limit, filteredServices.length)}
              </span>{" "}
              of <span className="font-medium">{filteredServices.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Rows:</span>
              <Select
                value={limit.toString()}
                onValueChange={(v) => {
                  setLimit(Number(v));
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-8 w-[80px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[2, 5, 10, 20, 50].map((size) => (
                    <SelectItem key={size} value={size.toString()}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-sm font-medium">
              Page {page} of {Math.max(1, Math.ceil(filteredServices.length / limit))}
            </div>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setPage((p) => Math.min(Math.ceil(filteredServices.length / limit), p + 1))}
              disabled={page >= Math.ceil(filteredServices.length / limit)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Modals */}
      <Dialog
        open={isAddOpen || isEditOpen}
        onOpenChange={(val) => {
          if (!val) {
            setIsAddOpen(false);
            setIsEditOpen(false);
          }
        }}
      >
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border-0 p-6">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {isEditOpen ? "Edit Service" : "Add New Service"}
            </DialogTitle>
            <DialogDescription>
              {isEditOpen 
                ? "Update the service details below." 
                : "Fill in the details to create a new service."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-5 py-4">
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Service Name</Label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g., Dental Cleaning"
                className="font-medium"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Describe the service..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Calendar</Label>
              <Select
                value={formData.calendarId ?? undefined}
                onValueChange={(calendarId) =>
                  setFormData((p) => ({ ...p, calendarId }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a calendar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {calendars?.map((calendar, idx) => (
                      <SelectItem key={idx} value={calendar.id.toString()}>
                        {calendar.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Service Price (ETB)</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })
                }
                placeholder="0.00"
                className="font-mono"
              />
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
                id="active-check"
                className="h-4 w-4 rounded border-gray-300 accent-primary"
              />
              <Label htmlFor="active-check" className="cursor-pointer font-normal">
                Set as Active
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddOpen(false);
                setIsEditOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={isEditOpen ? handleEditService : handleAddService}
              disabled={isSubmitting}
              className="shadow-md"
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isEditOpen ? "Save Changes" : "Create Service"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete
              "<span className="font-semibold text-foreground">{selectedService?.name}</span>" and
              remove it from our servers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteService}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Delete Service"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}