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
} from "lucide-react";
import {
  Select,
  SelectContent,
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
import Link from "next/link";
import { useOrganizationStore } from "@/store";

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
  // const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState({});
  // const [serviceCount, setServiceCount] = useState(0);
  // const [organizationId, setOrganizationId] = useState(null);
  const [isLoading, setIsLoading] = useState(services == null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // View & Filter States
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
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
  });

  const organizationId = organization?.id;

  // --- Data Fetching ---
  useEffect(() => {
    if (organization == null) {
      RequestHandler.Get("/api/v1/organization").then(async (res) => {
        if (res.ok) {
          const { organization } = await res.json();
          setOrganization(organization);
        }
      });
    }
  }, [organization, setOrganization]);

  const fetchServices = useCallback(async () => {
    if (!organizationId) return;
    // (async () => setIsLoading(true))();

    const offset = (page - 1) * limit;
    const params = new URLSearchParams({
      o: offset.toString(),
      l: limit.toString(),
      iorganization: 1,
      icalendar: 1,
    });

    const [countRes, dataRes] = await Promise.all([
      RequestHandler.Get(
        `/api/v1/organization/${organizationId}/services/count`,
      ),
      RequestHandler.Get(
        `/api/v1/organization/${organizationId}/services?${params.toString()}`,
      ),
    ]);

    if (countRes.ok) {
      const { count } = await countRes.json();
      (async () => setServiceCount(count))();
    }

    if (dataRes.ok) {
      const data = await dataRes.json();
      let results = data.services || [];

      if (statusFilter !== "all") {
        results = results.filter(
          (s) => s.isActive === (statusFilter === "active"),
        );
      }
      if (searchQuery) {
        results = results.filter(
          (s) =>
            s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.description.toLowerCase().includes(searchQuery.toLowerCase()),
        );
      }
      setServices(results);
      // (async () => setServices(results))();
    }
    (async () => setIsLoading(false))();
  }, [
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

  // --- CRUD Handlers ---
  const handleAddService = async () => {
    setIsSubmitting(true);
    const res = await RequestHandler.Post(
      `/api/v1/organization/${organizationId}/service`,
      { body: formData },
    );
    if (res.ok) {
      setIsAddOpen(false);
      setFormData({
        name: "",
        description: "",
        isActive: true,
        calendarId: null,
      });
      fetchServices();
    }
    setIsSubmitting(false);
  };

  const handleEditService = async () => {
    setIsSubmitting(true);
    const res = await RequestHandler.Patch(
      `/api/v1/organization/${organizationId}/service/${selectedService.id}`,
      { body: formData },
    );
    if (res.ok) {
      setIsEditOpen(false);
      setSelectedService(null);
      fetchServices();
    }
    setIsSubmitting(false);
  };

  const handleDeleteService = async () => {
    setIsSubmitting(true);
    const res = await RequestHandler.Delete(
      `/api/v1/organization/${organizationId}/service/${selectedService.id}`,
    );
    if (res.ok) {
      setIsDeleteOpen(false);
      setSelectedService(null);
      fetchServices();
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
    });
    setIsEditOpen(true);
  };

  const openDelete = (service) => {
    setSelectedService(service);
    setIsDeleteOpen(true);
  };

  const totalPages = Math.ceil(serviceCount / limit);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Services</h1>
          <p className="text-sm text-muted-foreground">
            Manage your organization&apos;s service offerings.
          </p>
        </div>
        <Button onClick={() => setIsAddOpen(true)}>
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
                className="pl-9 bg-background"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px] bg-background">
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

      {/* Main Content */}
      {isLoading ? (
        <div className="h-64 flex items-center justify-center border rounded-xl bg-card">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : view === "table" ? (
        <div className="rounded border bg-card overflow-hidden">
          <Table className=" font-mono">
            <TableHeader className="bg-muted/30 uppercase">
              <TableRow>
                <TableHead className="px-2"></TableHead>
                <TableHead className="font-bold">Service</TableHead>
                <TableHead className="font-bold text-center">Status</TableHead>
                <TableHead className="text-right font-bold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((service) => (
                <TableRow key={service.id}>
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
                    <div className="font-semibold text-primary">
                      {service.name}
                    </div>
                    <div className="text-xs text-muted-foreground truncate max-w-[400px]">
                      {service.description}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <AcriveBadge isActive={service.isActive} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" asChild>
                      <Link
                        href={`/dashboard/organization/service/${service.id}/first_employees`}
                      >
                        <UserIcon />
                      </Link>
                    </Button>
                    {service.calendarId != null ? (
                      <Button variant="ghost" size="icon" asChild>
                        <Link
                          href={`/dashboard/organization/service/${service.id}/calendar/${
                            service.calendarId
                          }`}
                        >
                          <CalendarIcon />
                        </Link>
                      </Button>
                    ) : (
                      <Button variant="ghost" disabled size="icon">
                        <CalendarIcon />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEdit(service)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => openDelete(service)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        /* IMPROVED GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card
              key={service.id}
              className="bg-background  group flex flex-col relative overflow-hidden transition-all hover:ring-2 hover:ring-primary/20"
            >
              <CardHeader className="pb-3 border-b bg-muted/5 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="font-bold text-primary truncate pr-4">
                  {service.name}
                </CardTitle>
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
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground line-clamp-3 min-h-[60px]">
                  {service.description ||
                    "No description provided for this service."}
                </p>
              </CardContent>
              <CardFooter className="pt-4 border-t flex justify-between items-center bg-muted/5">
                <AcriveBadge isActive={service.isActive} />
                <span className="text-[10px] font-mono text-muted-foreground">
                  ID: {service.id.slice(0, 8)}
                </span>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* RESTORED PAGINATION WITH LIMIT SELECTOR */}
      <div className="flex items-center justify-between px-4 py-4 border rounded bg-card">
        <div className="flex items-center gap-6">
          <div className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-medium">{(page - 1) * limit + 1}</span> to{" "}
            <span className="font-medium">
              {Math.min(page * limit, serviceCount)}
            </span>{" "}
            of <span className="font-medium">{serviceCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Rows:</span>
            <Select
              value={limit.toString()}
              onValueChange={(v) => {
                setLimit(Number(v));
                setPage(2); // Reset to page 1 on limit change
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
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
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-sm font-medium">
            Page {page} of {totalPages || 1}
          </div>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* --- Modals (Keep Existing) --- */}
      <Dialog
        open={isAddOpen || isEditOpen}
        onOpenChange={(val) => {
          if (!val) {
            setIsAddOpen(false);
            setIsEditOpen(false);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEditOpen ? "Edit Service" : "Add New Service"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Service Name</Label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
            {/* <div className="space-y-2">
              <Label>Calendar</Label>
              <input
                value={formData.calendarId}
                onChange={(e) =>
                  setFormData({ ...formData, calendarId: e.target.value })
                }
              />
            </div> */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
                id="active-check"
                className="h-4 w-4 rounded border-gray-300 accent-primary"
              />
              <Label htmlFor="active-check">Set as Active</Label>
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
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This will permanently delete "{selectedService?.name}". This
              action cannot be undone.
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
