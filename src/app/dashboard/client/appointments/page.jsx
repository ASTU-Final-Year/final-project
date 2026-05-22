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
  CalendarClock,
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
import SearchComponent from "@/components/public/search";
import { useClientStore } from "@/store";
import Link from "next/link";

export default function AppointmentsPage() {
  const client = useClientStore(({ client }) => client);
  const setClient = useClientStore(({ setClient }) => setClient);
  const appointments = useClientStore(({ appointments }) => appointments);
  const setAppointments = useClientStore(
    ({ setAppointments }) => setAppointments,
  );
  // const [appointments, setAppointments] = useState([]);
  const [selectedAppointments, setSelectedAppointments] = useState({});
  const [totalCount, setTotalCount] = useState(0);
  // const [clientId, setClientId] = useState(null);
  const [isLoading, setIsLoading] = useState(appointments == null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // View & Filter States
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState("table");

  // Dialog States
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const clientId = client?.id;
  // --- Data Fetching ---
  useEffect(() => {
    (async () => {
      const clientRes = await RequestHandler.Get(
        "/query/v1/user?mine&~role=client",
      );
      if (clientRes.ok) {
        const {
          users: [client],
        } = await clientRes.json();
        setClient(client);
        const clientId = client.id;
      }
    })();
  }, [setClient]);

  const fetchAppointments = useCallback(async () => {
    if (!clientId) return;
    // (async () => setIsLoading(true))();

    const offset = (page - 1) * limit;
    const params = new URLSearchParams({
      offset: offset.toFixed(),
      limit: limit.toFixed(),
      order: `["startTime.asc"]`,
    });

    const [dataRes] = await Promise.all([
      // RequestHandler.Get(`/query/v1/appointment?countOnly`),
      RequestHandler.Get(`/query/v1/appointment?mine&${params.toString()}`),
    ]);

    if (dataRes.ok) {
      const { count, appointments } = await dataRes.json();
      (async () => setTotalCount(count))();
      let results = appointments || [];

      console.log(results);
      if (statusFilter !== "all") {
        results = results.filter(
          (s) => s.isActive === (statusFilter === "active"),
        );
      }
      if (searchQuery) {
        results = results.filter(
          (s) =>
            s.service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.service.description
              .toLowerCase()
              .includes(searchQuery.toLowerCase()),
        );
      }
      (async () => setAppointments(results))();
    }
    (async () => setIsLoading(false))();
  }, [setAppointments, clientId, page, limit, statusFilter, searchQuery]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // --- CRUD Handlers ---
  const handleDeleteAppointment = async () => {
    setIsSubmitting(true);
    const res = await RequestHandler.Delete(
      `/query/v1/appointment?~id='${selectedAppointment.id}'`,
    );
    if (res.ok) {
      setIsDeleteOpen(false);
      setSelectedAppointment(null);
      fetchAppointments();
    }
    setIsSubmitting(false);
  };

  const openDelete = (appointment) => {
    setSelectedAppointment(appointment);
    setIsDeleteOpen(true);
  };

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
          <p className="text-sm text-muted-foreground">
            Manage your appointments.
          </p>
        </div>
        <Button onClick={() => setIsAddOpen(true)}>Book an Appointment</Button>
      </div>

      {/* Toolbar */}
      <Card className="p-3 bg-muted/20 border-none shadow-none bg-background">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex flex-1 items-center gap-3">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search appointments..."
                className="pl-9 bg-background"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
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
                <TableHead className="font-bold">Appointment</TableHead>
                <TableHead className="font-bold">Date</TableHead>
                <TableHead className="font-bold">Status</TableHead>
                <TableHead className="text-right font-bold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell className="w-8">
                    <Checkbox
                      checked={selectedAppointments[appointment.id]}
                      onCheckedChange={(checked) =>
                        setSelectedAppointments((prev) =>
                          Object.fromEntries(
                            Object.entries({
                              ...prev,
                              [appointment.id]: checked,
                            }).filter((c) => c),
                          ),
                        )
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Link href={`/dashboard/client/appointment/${appointment.id}`}>
                      <div className="font-semibold text-primary">
                        {appointment.service.name}
                      </div>
                      <div className="text-xs text-muted-foreground truncate max-w-[400px]">
                        {appointment.service.description}
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell className="">
                    {new Date(appointment.startTime).toLocaleString("en", {
                      dateStyle: "full",
                      timeStyle: "short",
                    })}
                  </TableCell>
                  <TableCell>
                    {appointment.status}
                    {/* <AcriveBadge isActive={appointment.isActive} /> */}
                  </TableCell>
                  <TableCell className="text-right">
                    {/* <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openViewCalendar(appointment)}
                    >
                      <CalendarClock className="h-4 w-4" />
                    </Button> */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => openDelete(appointment)}
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
          {appointments.map((appointment) => (
            <Card
              key={appointment.id}
              className="bg-background  group flex flex-col relative overflow-hidden transition-all hover:ring-2 hover:ring-primary/20"
            >
              <CardHeader className="pb-3 border-b bg-muted/5 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="font-bold text-primary truncate pr-4">
                  {appointment.service.name}
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
                    <DropdownMenuItem
                      onClick={() => openDelete(appointment)}
                      className="text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Delete Appointment
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground line-clamp-3 min-h-[60px]">
                  {appointment.service.description ||
                    "No description provided for this appointment."}
                </p>
              </CardContent>
              <CardFooter className="pt-4 border-t flex justify-between items-center bg-muted/5">
                <AcriveBadge isActive={appointment.isActive} />
                <span className="text-[10px] font-mono text-muted-foreground">
                  ID: {appointment.id.slice(0, 8)}
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
              {Math.min(page * limit, totalCount)}
            </span>{" "}
            of <span className="font-medium">{totalCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Rows:</span>
            <Select
              value={limit.toFixed()}
              onValueChange={(v) => {
                setLimit(Number(v));
                setPage(1); // Reset to page 1 on limit change
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
        open={isAddOpen}
        onOpenChange={(val) => {
          if (!val) {
            setIsAddOpen(false);
          }
        }}
        className="min-w-lg"
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Find a service to book an appointment</DialogTitle>
          </DialogHeader>
          <div className="py-4 overflow-y-auto">
            <SearchComponent
              searchBarOnly={true}
              resultsClassName="max-h-100 p-2"
              resultClassName="shadow-none hover:shadow-none"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddOpen(false);
              }}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This will permanently delete &quot;{selectedAppointment?.id}
              &quot;. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAppointment}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Delete Appointment"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
