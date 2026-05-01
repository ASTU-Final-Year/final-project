"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import { CalendarIcon, Plus, Clock, User, Search, LogOut, Trash2, CalendarDays, Activity } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
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
import { cn } from "@/lib/utils";

// Mock data
const initialAppointments = [
  {
    id: "1",
    clientName: "Tahani Al-Jamil",
    service: "Wellness Screening",
    date: "2025-04-15",
    time: "09:15",
    duration: 45,
    provider: "Dr. Gupta",
    price: 120,
    status: "pending",
    statusMessage: null,
  },
  {
    id: "2",
    clientName: "Jason Mendoza",
    service: "Physical Examination",
    date: "2025-04-15",
    time: "11:00",
    duration: 60,
    provider: "Dr. Blake",
    price: 340,
    status: "confirmed",
    statusMessage: null,
  },
  {
    id: "3",
    clientName: "Janet Dell-Trello",
    service: "Routine Vaccination",
    date: "2025-04-15",
    time: "08:00",
    duration: 30,
    provider: "Dr. Miller",
    price: 50,
    status: "completed",
    statusMessage: null,
  },
  {
    id: "4",
    clientName: "Mindy St. Claire",
    service: "Urgent Consultation",
    date: "2025-04-15",
    time: "08:45",
    duration: 20,
    provider: "Dr. Aries",
    price: 0,
    status: "cancelled",
    statusMessage: "CANCELLED",
  },
  {
    id: "5",
    clientName: "Chidi Anagonye",
    service: "Lab Results Review",
    date: "2025-04-15",
    time: "10:30",
    duration: 20,
    provider: "Dr. Miller",
    price: 85,
    status: "pending",
    statusMessage: "Needs follow‑up call",
  },
  {
    id: "6",
    clientName: "Eleanor Shellstrop",
    service: "Initial Consultation",
    date: "2025-04-16",
    time: "09:30",
    duration: 45,
    provider: "Dr. Avis",
    price: 120,
    status: "confirmed",
    statusMessage: null,
  },
];

export default function DashboardPage() {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);
  const [newAppointment, setNewAppointment] = useState({
    clientName: "",
    service: "",
    date: new Date(),
    time: "09:00",
    duration: 30,
    provider: "",
    price: 0,
  });

  // Filter & sort states
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("time"); // "time" or "date"
  const [filterDate, setFilterDate] = useState("");

  // Derived stats (only based on original appointments to keep stats consistent)
  const stats = {
    pending: appointments.filter((a) => a.status === "pending").length,
    confirmed: appointments.filter((a) => a.status === "confirmed").length,
    inProgress: appointments.filter((a) => a.status === "in-progress").length,
    completed: appointments.filter((a) => a.status === "completed").length,
    cancelled: appointments.filter((a) => a.status === "cancelled").length,
  };

  // Filtered and sorted appointments for display
  const filteredAppointments = useMemo(() => {
    let filtered = [...appointments];

    // Search by client name or service
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (apt) =>
          apt.clientName.toLowerCase().includes(term) ||
          apt.service.toLowerCase().includes(term)
      );
    }

    // Status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter((apt) => apt.status === filterStatus);
    }

    // Date filter
    if (filterDate) {
      filtered = filtered.filter((apt) => apt.date === filterDate);
    }

    // Sort
    if (sortBy === "time") {
      filtered.sort((a, b) => a.time.localeCompare(b.time));
    } else if (sortBy === "date") {
      filtered.sort((a, b) => a.date.localeCompare(b.date));
    }

    return filtered;
  }, [appointments, searchTerm, filterStatus, filterDate, sortBy]);

  const resetFilters = () => {
    setSearchTerm("");
    setFilterStatus("all");
    setSortBy("time");
    setFilterDate("");
  };

  const statusStyles = {
    pending: "bg-yellow-100 text-yellow-800 border-l-4 border-yellow-500",
    confirmed: "bg-green-100 text-green-800 border-l-4 border-green-500",
    "in-progress": "bg-blue-100 text-blue-800 border-l-4 border-blue-500",
    completed: "bg-purple-100 text-purple-800 border-l-4 border-purple-500",
    cancelled: "bg-red-100 text-red-800 border-l-4 border-red-500",
  };

  const handleAddAppointment = () => {
    const newApt = {
      id: String(Date.now()),
      clientName: newAppointment.clientName,
      service: newAppointment.service,
      date: format(newAppointment.date, "yyyy-MM-dd"),
      time: newAppointment.time,
      duration: newAppointment.duration,
      provider: newAppointment.provider,
      price: newAppointment.price,
      status: "pending",
      statusMessage: null,
    };
    setAppointments([newApt, ...appointments]);
    setNewAppointment({
      clientName: "",
      service: "",
      date: new Date(),
      time: "09:00",
      duration: 30,
      provider: "",
      price: 0,
    });
    setIsModalOpen(false);
  };

  const confirmDelete = (apt) => {
    setAppointmentToDelete(apt);
    setDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (appointmentToDelete) {
      setAppointments(appointments.filter((apt) => apt.id !== appointmentToDelete.id));
      setDeleteDialogOpen(false);
      setAppointmentToDelete(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-white/80 backdrop-blur-sm p-6 hidden md:flex flex-col justify-between shadow-sm">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-600 bg-clip-text text-transparent">ServeSync+</h1>
          <p className="text-sm text-muted-foreground mb-8">ADMIN CONSOLE</p>
          <nav className="space-y-2">
            {["Dashboard", "Services", "Employees", "Appointments", "Calendar", "Reports", "Settings"].map((item) => (
              <div key={item} className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-all cursor-pointer">
                {item}
              </div>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground border-t pt-4 cursor-pointer hover:text-red-600 transition-colors">
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </div>
      </aside>

      <main className="flex-1 p-6 overflow-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Appointment Management</h2>
            <p className="text-muted-foreground">Manage daily clinical traffic and provider availability.</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="shadow-md hover:shadow-lg transition-all">
            <Plus className="mr-2 h-4 w-4" /> New Appointment
          </Button>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <Card className="border-0 shadow-md bg-gradient-to-br from-yellow-50 to-white">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-yellow-700">PENDING</CardTitle></CardHeader>
            <CardContent><div className="text-3xl font-bold text-yellow-800">{stats.pending}</div></CardContent>
          </Card>
          <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-white">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-green-700">CONFIRMED</CardTitle></CardHeader>
            <CardContent><div className="text-3xl font-bold text-green-800">{stats.confirmed}</div></CardContent>
          </Card>
          <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-white">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-blue-700">IN PROGRESS</CardTitle></CardHeader>
            <CardContent><div className="text-3xl font-bold text-blue-800">{stats.inProgress}</div></CardContent>
          </Card>
          <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-white">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-purple-700">COMPLETED</CardTitle></CardHeader>
            <CardContent><div className="text-3xl font-bold text-purple-800">{stats.completed}</div></CardContent>
          </Card>
          <Card className="border-0 shadow-md bg-gradient-to-br from-red-50 to-white">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-red-700">CANCELLED</CardTitle></CardHeader>
            <CardContent><div className="text-3xl font-bold text-red-800">{stats.cancelled}</div></CardContent>
          </Card>
        </div>

        {/* Filter bar – fully functional */}
        <div className="flex flex-wrap gap-3 items-center justify-between py-3 border-b mb-4">
          <div className="relative w-64">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by service name or code..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="time">Time</SelectItem>
              <SelectItem value="date">Date</SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="date"
            className="w-40"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
          <Button variant="outline" onClick={resetFilters}>Reset</Button>
        </div>

        {/* Appointment cards – display filtered/sorted list */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {filteredAppointments.map((apt) => (
            <Card key={apt.id} className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 bg-white rounded-xl">
              <div className="h-1 w-full bg-gradient-to-r from-primary-500 via-primary-300 to-primary-500"></div>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <Badge className={cn("text-xs font-semibold px-2 py-1 rounded-md", statusStyles[apt.status])}>
                    {apt.status.toUpperCase()}
                  </Badge>
                  <span className="text-xl font-bold text-gray-900">${apt.price}</span>
                </div>
                <CardTitle className="text-lg font-bold mt-3 flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  {apt.clientName}
                </CardTitle>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Activity className="h-3 w-3" />
                  {apt.service}
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded-lg">
                  <div className="flex items-center gap-2 font-medium">
                    <CalendarDays className="h-3.5 w-3.5 text-primary" />
                    <span>{apt.provider}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{apt.time} • {apt.duration} min</span>
                  </div>
                </div>
                {apt.statusMessage && (
                  <div className="text-xs bg-gray-100 text-gray-700 p-2 rounded-md border-l-2 border-gray-400">
                    {apt.statusMessage}
                  </div>
                )}
              </CardContent>
              <CardFooter className="border-t pt-3 flex justify-between items-center bg-gray-50/50">
                <span className="text-xs text-muted-foreground font-mono">{apt.date}</span>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => confirmDelete(apt)} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                    <Trash2 className="h-3.5 w-3.5 mr-1" /> Cancel
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setIsModalOpen(true)} className="shadow-sm">
                    <Plus className="h-3 w-3 mr-1" /> Book
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
        {filteredAppointments.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">No appointments found. Try changing your filters.</div>
        )}

        {/* Delete Confirmation Modal */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Cancel Appointment</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to cancel the appointment for{" "}
                <span className="font-semibold text-foreground">{appointmentToDelete?.clientName}</span>?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>No, keep it</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">Yes, cancel</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* New Appointment Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader><DialogTitle>Book a New Appointment</DialogTitle><DialogDescription>Fill in all details below.</DialogDescription></DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2"><Label>Your Full Name</Label><Input value={newAppointment.clientName} onChange={(e) => setNewAppointment({ ...newAppointment, clientName: e.target.value })} placeholder="e.g., Hermela Girma" /></div>
              <div className="grid gap-2"><Label>Service / Reason</Label><Input value={newAppointment.service} onChange={(e) => setNewAppointment({ ...newAppointment, service: e.target.value })} placeholder="e.g., Emergency, Check-up" /></div>
              <div className="grid gap-2"><Label>Preferred Date</Label><Popover><PopoverTrigger asChild><Button variant="outline" className={cn("justify-start text-left font-normal", !newAppointment.date && "text-muted-foreground")}><CalendarIcon className="mr-2 h-4 w-4" />{newAppointment.date ? format(newAppointment.date, "PPP") : "Pick a date"}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={newAppointment.date} onSelect={(date) => setNewAppointment({ ...newAppointment, date: date || new Date() })} initialFocus /></PopoverContent></Popover></div>
              <div className="grid grid-cols-2 gap-4"><div className="grid gap-2"><Label>Time</Label><Input type="time" value={newAppointment.time} onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })} /></div><div className="grid gap-2"><Label>Duration (min)</Label><Input type="number" value={newAppointment.duration} onChange={(e) => setNewAppointment({ ...newAppointment, duration: parseInt(e.target.value) })} placeholder="30" /></div></div>
              <div className="grid gap-2"><Label>Provider / Staff</Label><Input value={newAppointment.provider} onChange={(e) => setNewAppointment({ ...newAppointment, provider: e.target.value })} placeholder="Name of provider" /></div>
              <div className="grid gap-2"><Label>Price ($)</Label><Input type="number" value={newAppointment.price} onChange={(e) => setNewAppointment({ ...newAppointment, price: parseInt(e.target.value) })} placeholder="0" /></div>
            </div>
            <DialogFooter><Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button><Button onClick={handleAddAppointment}>Save Appointment</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}