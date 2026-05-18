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
  User,
  CalendarIcon,
  CalendarCogIcon,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
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

export default function EmployeesPage() {
  const organization = useOrganizationStore(({ organization }) => organization);
  const setOrganization = useOrganizationStore(
    ({ setOrganization }) => setOrganization,
  );
  const calendars = useOrganizationStore(({ calendars }) => calendars);
  const setCalendars = useOrganizationStore(({ setCalendars }) => setCalendars);
  const employees = useOrganizationStore(({ employees }) => employees);
  const setEmployees = useOrganizationStore(({ setEmployees }) => setEmployees);
  const employeeCount = useOrganizationStore(
    ({ employeeCount }) => employeeCount,
  );
  const setEmployeeCount = useOrganizationStore(
    ({ setEmployeeCount }) => setEmployeeCount,
  );
  // const [employees, setEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState({});
  const [filteredEmployees, setFilteredEmployees] = useState(employees);
  // const [employeeCount, setEmployeeCount] = useState(0);
  // const [organizationId, setOrganizationId] = useState(null);
  const [isLoading, setIsLoading] = useState(employees == null);
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
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Form States
  const [formData, setFormData] = useState({
    email: "",
    jobTitle: "",
    jobDescription: "",
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

  const fetchEmployees = useCallback(async () => {
    if (!organizationId) return;
    // (async () => setIsLoading(true))();

    const offset = (page - 1) * limit;
    const params = new URLSearchParams({
      offset: offset.toFixed(),
      limit: limit.toFixed(),
    });

    const [countRes, dataRes, calRes] = await Promise.all([
      RequestHandler.Get(`/query/v1/employee?countOnly`),
      RequestHandler.Get(`/query/v1/employee?${params.toString()}`),
      RequestHandler.Get(`/query/v1/organizationCalendar?mine`),
    ]);

    if (countRes.ok) {
      const { count } = await countRes.json();
      (async () => setEmployeeCount(count))();
    }

    if (dataRes.ok) {
      const { employees } = await dataRes.json();
      let results = employees || [];
      setEmployees(results);
    }

    if (calRes.ok) {
      const { organizationCalendars: calendars } = await calRes.json();
      setCalendars(calendars);
    }
    (async () => setIsLoading(false))();
  }, [
    setCalendars,
    setEmployees,
    setEmployeeCount,
    organizationId,
    page,
    limit,
    // statusFilter,
    // searchQuery,
  ]);

  useEffect(() => {
    let results = employees;
    if (statusFilter !== "all") {
      results = results.filter(
        (s) => s.isActive === (statusFilter === "active"),
      );
    }
    if (searchQuery) {
      results = results.filter(
        (e) =>
          e.user.firstname.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.user.lastname.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.jobDescription.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }
    (() => setFilteredEmployees(results))();
  }, [employees, searchQuery, setEmployees, statusFilter]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // --- CRUD Handlers ---
  const handleHireEmployee = async () => {
    setIsSubmitting(true);
    const res = await RequestHandler.Post(
      `/api/v1/organization/${organizationId}/employees`,
      { body: [formData] },
    );
    if (res.ok) {
      setIsAddOpen(false);
      setFormData({
        email: "",
        name: "",
        description: "",
        isActive: true,
        calendarId: null,
      });
      fetchEmployees();
    }
    setIsSubmitting(false);
  };

  const handleAddEmployee = async () => {
    setIsSubmitting(true);
    const res = await RequestHandler.Post(`/query/v1/employee`, {
      body: [formData],
    });
    if (res.ok) {
      setIsAddOpen(false);
      setFormData({
        email: "",
        name: "",
        description: "",
        isActive: true,
        calendarId: null,
      });
      fetchEmployees();
    }
    setIsSubmitting(false);
  };

  const handleEditEmployee = async () => {
    setIsSubmitting(true);
    console.log(formData);
    const res = await RequestHandler.Patch(
      `/query/v1/employee?~id=${selectedEmployee.id}`,
      { body: formData },
    );
    if (res.ok) {
      setIsEditOpen(false);
      setSelectedEmployee(null);
      fetchEmployees();
    }
    setIsSubmitting(false);
  };

  const handleDeleteEmployee = async () => {
    setIsSubmitting(true);
    const res = await RequestHandler.Delete(
      `/query/v1/employee?~id=${selectedEmployee.id}`,
    );
    if (res.ok) {
      setIsDeleteOpen(false);
      setSelectedEmployee(null);
      fetchEmployees();
    }
    setIsSubmitting(false);
  };

  const openEdit = (employee) => {
    setSelectedEmployee(employee);
    setFormData({
      email: employee.email,
      jobTitle: employee.jobTitle,
      jobDescription: employee.jobDescription,
      isActive: employee.isActive,
      calendarId: employee.calendarId,
    });
    setIsEditOpen(true);
  };

  const openDelete = (employee) => {
    setSelectedEmployee(employee);
    setIsDeleteOpen(true);
  };

  const totalPages = Math.ceil(employeeCount / limit);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
          <p className="text-sm text-muted-foreground">
            Manage your employees.
          </p>
        </div>
        <Button onClick={() => setIsAddOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Hire Employee
        </Button>
      </div>

      {/* Toolbar */}
      <Card className="p-3 bg-muted/20 border-none shadow-none">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex flex-1 items-center gap-3">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search employees..."
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
        <div className="h-64 flex items-center justify-center border rounded bg-card">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : view === "table" ? (
        <div className="rounded-xl border bg-card overflow-hidden shadow-sm">
          <Table className="font-sans text-lg text-black">
            <TableHeader className="bg-muted/30 uppercase text-black">
              <TableRow>
                <TableHead className="px-2"></TableHead>
                {/* <TableHead className="font-bold text-black text-base">ID</TableHead> */}
                <TableHead className="font-bold text-black text-base">Fullname</TableHead>
                <TableHead className="font-bold text-black text-base">Job</TableHead>
                <TableHead className="font-bold text-black text-base">Gender</TableHead>
                <TableHead className="font-bold text-black text-base">Calendar</TableHead>
                <TableHead className="font-bold text-center text-black text-base">Status</TableHead>
                <TableHead className="text-right font-bold text-black text-base">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="w-8">
                    <Checkbox
                      checked={selectedEmployees[employee.id]}
                      onCheckedChange={(checked) =>
                        setSelectedEmployees((prev) =>
                          Object.fromEntries(
                            Object.entries({
                              ...prev,
                              [employee.id]: checked,
                            }).filter((c) => c),
                          ),
                        )
                      }
                    />
                  </TableCell>
                  {/* <TableCell>
                    <div className="text-xs font-mono">
                      {employee.id.slice(0, 8)}
                    </div>
                  </TableCell> */}
                  <TableCell>
                    <div className="font-semibold text-lg text-black">
                      {`${employee.user.firstname} ${employee.user.lastname}`}
                    </div>
                    <div className="text-base">
                      <Link
                        href={`mailto:${employee.user.email}`}
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {employee.user.email}
                      </Link>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-base text-black/80 truncate max-w-[400px]">
                      <div className="text-lg font-bold text-black">
                        {employee.jobTitle}
                      </div>
                      <div>{employee.jobDescription}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-base text-black/80 truncate max-w-[400px]">
                      {employee.user.gender}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-base text-black/80 truncate max-w-[400px] overflow-auto">
                      {employee.calendar?.name || "-"}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <AcriveBadge isActive={employee.isActive} />
                  </TableCell>
                  <TableCell className="text-right">
                    {employee.calendarId != null ? (
                      <Button variant="ghost" size="icon" asChild>
                        <Link
                          href={`/dashboard/organization/employee/${employee.id}/calendar/${
                            employee.calendarId
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
                      onClick={() => openEdit(employee)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => openDelete(employee)}
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
          {filteredEmployees.map((employee) => (
            <Card
              key={employee.id}
              className="bg-background group flex flex-col relative overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-2xl"
            >
              <CardHeader className="pb-3 border-b bg-muted/5 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="font-bold text-primary truncate pr-4">
                  <div className="flex gap-3">
                    <div className="size-10 bg-primary/5 rounded-full flex justify-center items-center border border-border">
                      <User />
                    </div>
                    <div>
                      <div className="text-lg text-black">
                        {`${employee.user.firstname} ${employee.user.lastname}`}
                      </div>
                      <p className="text-black/80 font-normal text-base mt-1">
                        {employee.jobTitle}
                      </p>
                    </div>
                  </div>
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
                    <DropdownMenuItem onClick={() => openEdit(employee)}>
                      <Pencil className="mr-2 h-4 w-4" /> Edit Details
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => openDelete(employee)}
                      className="text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Delete Employee
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent className="flex-grow pt-4">
                <p className="text-black text-base line-clamp-3 min-h-[60px]">
                  {employee.jobDescription ||
                    "No job description provided for this employee."}
                </p>
              </CardContent>
              <CardFooter className="pt-4 border-t flex justify-between items-center bg-muted/5">
                <AcriveBadge isActive={employee.isActive} />
                <span className="text-[10px] font-mono text-muted-foreground">
                  ID: {employee.id.slice(0, 8)}
                </span>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* RESTORED PAGINATION WITH LIMIT SELECTOR */}
      <div className="flex items-center justify-between px-4 py-4 border rounded bg-card ">
        <div className="flex items-center gap-6">
          <div className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-medium">{(page - 1) * limit + 1}</span> to{" "}
            <span className="font-medium">
              {Math.min(page * limit, employeeCount)}
            </span>{" "}
            of <span className="font-medium">{employeeCount}</span>
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
        open={isAddOpen || isEditOpen}
        onOpenChange={(val) => {
          if (!val) {
            setIsAddOpen(false);
            setIsEditOpen(false);
          }
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border-0 p-6">
          <DialogHeader>
            <DialogTitle>
              {isEditOpen ? "Edit Employee" : "Hire New Employee"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {!isEditOpen && (
              <div className="space-y-2">
                <Label>Employee Email</Label>
                <Input
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, email: e.target.value }))
                  }
                />
              </div>
            )}

            <div className="space-y-2">
              <Label>Job Title</Label>
              <Input
                value={formData.jobTitle}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, jobTitle: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Job Description</Label>
              <Textarea
                value={formData.jobDescription}
                onChange={(e) =>
                  setFormData((p) => ({
                    ...p,
                    jobDescription: e.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Calendar</Label>
              <Select
                value={formData.calendarId ?? undefined}
                onValueChange={(calendarId) =>
                  setFormData((p) => ({ ...p, calendarId }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a calendar" />
                </SelectTrigger>
                <SelectContent position={"item-aligned"}>
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
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData((p) => ({
                    ...formData,
                    isActive: e.target.checked,
                  }))
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
              onClick={isEditOpen ? handleEditEmployee : handleHireEmployee}
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isEditOpen ? "Save Changes" : "Hire Employee"}
            </Button>
            {!isEditOpen && (
              <Button onClick={handleAddEmployee} disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {"Add Employee"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This will permanently delete &quot;{selectedEmployee?.name}&quot;.
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteEmployee}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Delete Employee"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
