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
import { useParams } from "next/navigation";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";

export default function ServiceFirstEmployeesPage() {
  const { service_id } = useParams();
  const [employees, setEmployees] = useState([]);
  const [totalEmployeesCount, setTotalEmployeesCount] = useState(0);
  const [firstEmployees, setFirstEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState({});
  const [totalCount, setTotalCount] = useState(0);
  const [organizationId, setOrganizationId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // View & Filter States
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState("table");

  // Dialog States
  const [isAddOpen, setIsAddOpen] = useState(false);
  // const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Form States
  const [formData, setFormData] = useState({
    employeeId: "",
  });

  // --- Data Fetching ---
  useEffect(() => {
    RequestHandler.Get("/api/v1/organization").then(async (res) => {
      if (res.ok) {
        const { organization } = await res.json();
        setOrganizationId(organization.id);
      }
    });
  }, []);

  const fetchEmployees = useCallback(async () => {
    if (!organizationId) return;
    // (async () => setIsLoading(true))();

    const offset = (page - 1) * limit;
    const params = new URLSearchParams({
      o: offset.toString(),
      l: limit.toString(),
      iuser: 1,
      icalendar: 1,
    });

    const [countRes, dataRes] = await Promise.all([
      RequestHandler.Get(
        `/api/v1/organization/${organizationId}/employees/count`,
      ),
      RequestHandler.Get(
        `/api/v1/organization/${organizationId}/employees?${params.toString()}`,
      ),
    ]);

    if (countRes.ok) {
      const { count } = await countRes.json();
      (async () => setTotalEmployeesCount(count))();
    }

    if (dataRes.ok) {
      const data = await dataRes.json();
      let results = data.employees || [];

      if (statusFilter !== "all") {
        results = results.filter(
          (s) => s.isActive === (statusFilter === "active"),
        );
      }
      if (searchQuery) {
        results = results.filter(
          (e) =>
            e.user.firstname
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            e.user.lastname.toLowerCase().includes(searchQuery.toLowerCase()) ||
            e.user.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
            e.user.jobDescription
              .toLowerCase()
              .includes(searchQuery.toLowerCase()),
        );
      }
      console.log(results);
      (async () => setEmployees(results))();
    }
    // (async () => setIsLoading(false))();
  }, [organizationId, page, limit, statusFilter, searchQuery]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const fetchFirstEmployees = useCallback(async () => {
    if (!organizationId) return;
    (async () => setIsLoading(true))();

    const offset = (page - 1) * limit;
    const params = new URLSearchParams({
      o: offset.toString(),
      l: limit.toString(),
      iuser: 1,
      icalendar: 1,
    });

    const [countRes, dataRes] = await Promise.all([
      RequestHandler.Get(
        `/api/v1/organization/${organizationId}/service/${service_id}/first_employees/count`,
      ),
      RequestHandler.Get(
        `/api/v1/organization/${organizationId}/service/${service_id}/first_employees?${params.toString()}`,
      ),
    ]);

    if (countRes.ok) {
      const { count } = await countRes.json();
      (async () => setTotalCount(count))();
    }

    if (dataRes.ok) {
      const data = await dataRes.json();
      console.log(data);
      let results = data.firstEmployees || [];

      if (statusFilter !== "all") {
        results = results.filter(
          (s) => s.isActive === (statusFilter === "active"),
        );
      }
      if (searchQuery) {
        results = results.filter(
          (e) =>
            e.user.firstname
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            e.user.lastname.toLowerCase().includes(searchQuery.toLowerCase()) ||
            e.user.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
            e.user.jobDescription
              .toLowerCase()
              .includes(searchQuery.toLowerCase()),
        );
      }
      (async () => setFirstEmployees(results))();
    }
    (async () => setIsLoading(false))();
  }, [organizationId, service_id, page, limit, statusFilter, searchQuery]);

  useEffect(() => {
    fetchFirstEmployees();
  }, [fetchFirstEmployees]);

  // --- CRUD Handlers ---
  const handleAddFirstEmployee = async () => {
    setIsSubmitting(true);
    const res = await RequestHandler.Post(
      `/api/v1/organization/${organizationId}/service/${service_id}/first_employee/${selectedEmployee}`,
      { body: [formData] },
    );
    if (res.ok) {
      setIsAddOpen(false);
      setFormData({ employeeId: "" });
      fetchEmployees();
    }
    setIsSubmitting(false);
  };

  // const handleEditFirstEmployee = async () => {
  //   setIsSubmitting(true);
  //   const res = await RequestHandler.Patch(
  //     `/api/v1/organization/${organizationId}/service/${service_id}/first_employee/${selectedEmployee.userId}`,
  //     { body: formData },
  //   );
  //   if (res.ok) {
  //     setIsEditOpen(false);
  //     setSelectedEmployee(null);
  //     fetchEmployees();
  //   }
  //   setIsSubmitting(false);
  // };

  const handleDeleteFristEmployee = async () => {
    setIsSubmitting(true);
    const res = await RequestHandler.Delete(
      `/api/v1/organization/${organizationId}/service/${service_id}/first_employee/${selectedEmployee.userId}`,
    );
    if (res.ok) {
      setIsDeleteOpen(false);
      setSelectedEmployee(null);
      fetchEmployees();
    }
    setIsSubmitting(false);
  };

  // const openEdit = (employee) => {
  //   setSelectedEmployee(employee);
  //   setFormData({
  //     email: employee.email,
  //     jobTitle: employee.jobTitle,
  //     jobDescription: employee.jobDescription,
  //     isActive: employee.isActive,
  //     calendarId: null,
  //   });
  //   setIsEditOpen(true);
  // };

  const openDelete = (employee) => {
    setSelectedEmployee(employee);
    setIsDeleteOpen(true);
  };

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">First Employees</h1>
          <p className="text-sm text-muted-foreground">
            Manage your first first employees assigned to a service.
          </p>
        </div>
        <Button onClick={() => setIsAddOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add First Employee
        </Button>
      </div>

      {/* Toolbar */}
      <Card className="p-3 bg-muted/20 border-none shadow-none bg-background">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex flex-1 items-center gap-3">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search first employees..."
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
        <div className="h-64 flex items-center justify-center border rounded bg-card">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : view === "table" ? (
        <div className="rounded border bg-card  overflow-hidden">
          <Table className=" font-mono">
            <TableHeader className="bg-muted/30 uppercase">
              <TableRow>
                <TableHead className="px-2"></TableHead>
                <TableHead className="font-bold">ID</TableHead>
                <TableHead className="font-bold">Fullname</TableHead>
                <TableHead className="font-bold">Gender</TableHead>
                <TableHead className="font-bold">Job</TableHead>
                {/* <TableHead className="font-bold text-center">
                  Calendar
                </TableHead> */}
                <TableHead className="font-bold text-center">Status</TableHead>
                <TableHead className="text-right font-bold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {firstEmployees.map(({ employee }) => (
                <TableRow key={employee.userId}>
                  <TableCell className="w-8">
                    <Checkbox
                      checked={selectedEmployees[employee.userId]}
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
                  <TableCell>
                    <div className="text-xs font-mono">
                      {employee.userId.slice(0, 8)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold">
                      {`${employee.user?.firstname} ${employee.user?.lastname}`}
                    </div>
                    <div className="text-xs text-foreground/80">
                      <Link
                        href={`mailto:${employee.user?.email}`}
                        className="text-blue-800/90 hover:underline"
                      >
                        {employee.user?.email}
                      </Link>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs text-center text-muted-foreground truncate max-w-[400px]">
                      {employee.user?.gender}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs text-muted-foreground truncate max-w-[400px]">
                      <div className="text-sm font-bold">
                        {employee.jobTitle}
                      </div>
                      <div>{employee.jobDescription}</div>
                    </div>
                  </TableCell>
                  {/* <TableCell>
                    <div className="text-xs text-muted-foreground truncate max-w-[400px] overflow-auto">
                      {employee.calendar?.name}
                    </div>
                  </TableCell> */}
                  <TableCell className="text-center">
                    <AcriveBadge isActive={employee.isActive} />
                  </TableCell>
                  <TableCell className="text-right">
                    {employee.calendarId != null ? (
                      <Button variant="ghost" size="icon" asChild>
                        <Link
                          href={`/dashboard/organization/employee/${employee.userId}/calendar/${
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
          {firstEmployees.map((employee) => (
            <Card
              key={employee.userId}
              className="bg-background  group flex flex-col relative overflow-hidden transition-all hover:ring-2 hover:ring-primary/20"
            >
              <CardHeader className="pb-3 border-b bg-muted/5 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="font-bold text-primary truncate pr-4">
                  <div className="flex gap-3">
                    <div className="size-10 bg-primary/5 rounded-full flex justify-center items-center border border-border">
                      <User />
                    </div>
                    <div>
                      <div>
                        {`${employee.user?.firstname} ${employee.user?.lastname}`}
                      </div>
                      <p className="muted-foreground text-muted-foreground font-normal text-xs">
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
              <CardContent className="flex-grow">
                <p className="text-muted-foreground line-clamp-3 min-h-[60px]">
                  {employee.jobDescription ||
                    "No job description provided for this employee."}
                </p>
              </CardContent>
              <CardFooter className="pt-4 border-t flex justify-between items-center bg-muted/5">
                <AcriveBadge isActive={employee.isActive} />
                <span className="text-[10px] font-mono text-muted-foreground">
                  ID: {employee.userId.slice(0, 8)}
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
              {Math.min(page * limit, totalCount)}
            </span>{" "}
            of <span className="font-medium">{totalCount}</span>
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
        open={isAddOpen}
        onOpenChange={(val) => {
          if (!val) {
            setIsAddOpen(false);
            // setIsEditOpen(false);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Frst Employee</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              {/* <Label>Employee ID</Label>
              <Input
                value={formData.employeeId}
                onChange={(e) =>
                  setFormData({ ...formData, employeeId: e.target.value })
                }
              /> */}
              <FieldGroup className="w-full max-w-xs">
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldLabel htmlFor="align-item">Align Item</FieldLabel>
                    <FieldDescription>
                      Toggle to align the item with the trigger.
                    </FieldDescription>
                  </FieldContent>
                </Field>
                <Field>
                  <Select
                    value={selectedEmployee}
                    onValueChange={setSelectedEmployee}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent position="item-aligned">
                      <SelectGroup>
                        {employees?.map((employee, idx) => (
                          <SelectItem key={idx} value={employee.userId}>
                            {`${employee.user.firstname} ${employee.user.lastname}`}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
              </FieldGroup>
            </div>
            {/* <div className="flex items-center gap-2">
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
            </div> */}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddOpen(false);
                // setIsEditOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleAddFirstEmployee} disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {"Add Employee"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This will permanently delete "{selectedEmployee?.name}". This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteFristEmployee}
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
