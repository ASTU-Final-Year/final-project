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
  Minus,
  X,
  CalendarIcon,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function EmploymentsPage() {
  const [employments, setEmployments] = useState([]);
  const [selectedEmployments, setSelectedEmployments] = useState({});
  // const [selectedDates, setSelectedDates] = useState([]);
  const [activeAvailableRange, setActiveAvailableRange] = useState(0);
  const [activeUnavailableRange, setActiveUnavailableRange] = useState(0);
  const [activeEmploymentId, setActiveEmploymentId] = useState(null);
  const [selectedDateMode, setSelectedDateMode] = useState("multiple");
  const [totalCount, setTotalCount] = useState(0);
  const [employeeId, setEmployeeId] = useState(null);
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
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedEmployment, setSelectedEmployment] = useState(null);

  // // Form States
  // const [formData, setFormData] = useState({
  //   name: "",
  //   description: "",
  //   available: null,
  //   unavailable: null,
  // });

  // --- Data Fetching ---

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const empRes = await RequestHandler.Get("/api/v1/employee");
        if (empRes.ok) {
          const { employee: employments } = await empRes.json();
          setEmployments(employments);
        }
      } catch (error) {
        console.error("Failed to load overview data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // const fetchEmployments = useCallback(async () => {
  //   if (!employeeId) return;
  //   (async () => setIsLoading(true))();

  //   const offset = (page - 1) * limit;
  //   const params = new URLSearchParams({
  //     o: offset.toString(),
  //     l: limit.toString(),
  //     iemployee: 1,
  //   });

  //   const [countRes, dataRes] = await Promise.all([
  //     RequestHandler.Get(`/api/v1/employee/${employeeId}/employments/count`),
  //     RequestHandler.Get(
  //       `/api/v1/employee/${employeeId}/employments?${params.toString()}`,
  //     ),
  //   ]);

  //   if (countRes.ok) {
  //     const { count } = await countRes.json();
  //     (async () => setTotalCount(count))();
  //   }

  //   if (dataRes.ok) {
  //     const data = await dataRes.json();
  //     let results = data.employments || [];

  //     if (statusFilter !== "all") {
  //       results = results.filter(
  //         (s) => s.isActive === (statusFilter === "active"),
  //       );
  //     }
  //     if (searchQuery) {
  //       results = results.filter(
  //         (s) =>
  //           s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //           s.description.toLowerCase().includes(searchQuery.toLowerCase()),
  //       );
  //     }
  //     results = results.map((res) => ({
  //       ...res,
  //       available: {
  //         ...(res.available ?? {}),
  //         ranges: res.available?.ranges
  //           ? res.available.ranges.map(({ from, to }) => ({
  //               from: new Date(from),
  //               to: new Date(to),
  //             }))
  //           : [],
  //         exactly: res.available?.exactly
  //           ? res.available.exactly.map((e) => new Date(e))
  //           : [],
  //       },
  //       unavailable: {
  //         ...(res.unavailable ?? {}),
  //         ranges: res.unavailable?.ranges
  //           ? res.unavailable.ranges
  //               .map(({ from, to }) => ({
  //                 from: new Date(from),
  //                 to: new Date(to),
  //               }))
  //               .sort((a, b) => a.from.getTime() - b.from.getTime())
  //           : [],
  //         exactly: res.unavailable?.exactly
  //           ? res.unavailable.exactly
  //               .map((e) => new Date(e))
  //               .sort((a, b) => a.getTime() - b.getTime())
  //           : [],
  //       },
  //     }));
  //     (async () => setEmployments(results))();
  //     console.log(results);
  //   }
  //   (async () => setIsLoading(false))();
  // }, [employeeId, page, limit, statusFilter, searchQuery]);

  // useEffect(() => {
  //   fetchEmployments();
  // }, [fetchEmployments]);

  // // --- CRUD Handlers ---
  // const handleAddEmployment = async () => {
  //   setIsSubmitting(true);
  //   const res = await RequestHandler.Post(
  //     `/api/v1/employee/${employeeId}/employment`,
  //     {
  //       body: {
  //         name: formData.name,
  //         description: formData.description,
  //         available: formData.available,
  //         unavailable: formData.unavailable,
  //       },
  //     },
  //   );
  //   if (res.ok) {
  //     setIsAddOpen(false);
  //     setFormData({
  //       name: "",
  //       description: "",
  //       available: null,
  //       unavailable: null,
  //     });
  //     fetchEmployments();
  //   }
  //   setIsSubmitting(false);
  // };

  // const handleEditEmployment = async () => {
  //   setIsSubmitting(true);
  //   const res = await RequestHandler.Patch(
  //     `/api/v1/employee/${employeeId}/employment/${selectedEmployment.id}`,
  //     {
  //       body: {
  //         name: formData.name,
  //         description: formData.description,
  //         available: formData.available,
  //         unavailable: formData.unavailable,
  //       },
  //     },
  //   );
  //   if (res.ok) {
  //     setIsEditOpen(false);
  //     setSelectedEmployment(null);
  //     fetchEmployments();
  //   }
  //   setIsSubmitting(false);
  // };

  // const handleSetDefaultEmployment = async (employmentId) => {
  //   console.log({
  //     employmentId,
  //   });
  //   setIsSubmitting(true);
  //   const res = await RequestHandler.Patch(`/api/v1/employee/${employeeId}`, {
  //     body: {
  //       employmentId,
  //     },
  //   });
  //   if (res.ok) {
  //     setSelectedEmployment(null);
  //     fetchEmployments();
  //   }
  //   setIsSubmitting(false);
  // };

  // const handleDeleteEmployment = async () => {
  //   setIsSubmitting(true);
  //   const res = await RequestHandler.Delete(
  //     `/api/v1/employee/${employeeId}/employment/${selectedEmployment.id}`,
  //   );
  //   if (res.ok) {
  //     setIsDeleteOpen(false);
  //     setSelectedEmployment(null);
  //     fetchEmployments();
  //   }
  //   setIsSubmitting(false);
  // };

  // const openEdit = (employment) => {
  //   setSelectedEmployment(employment);
  //   setFormData({
  //     name: employment.name,
  //     description: employment.description,
  //     available: employment.available,
  //     unavailable: employment.unavailable,
  //   });
  //   setIsEditOpen(true);
  // };

  // const openDelete = (employment) => {
  //   setSelectedEmployment(employment);
  //   setIsDeleteOpen(true);
  // };

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Employments</h1>
          <p className="text-sm text-muted-foreground">
            Manage your employments.
          </p>
        </div>
        {/* <Button onClick={() => setIsAddOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Employment
        </Button> */}
      </div>

      {/* Toolbar */}
      <Card className="p-3 bg-muted/20 border-none shadow-none bg-background">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex flex-1 items-center gap-3">
            <h2 className="text-md text-muted-foreground">Read Only</h2>
            {/* <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search employments..."
                className="pl-9 bg-background"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div> */}
            {/* <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px] bg-background">
                <Filter className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select> */}
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
        <div className="rounded border bg-card overflow-hidden">
          <Table className=" font-mono">
            <TableHeader className="bg-muted/30 uppercase">
              <TableRow>
                <TableHead className="px-2"></TableHead>
                <TableHead className="font-bold">Employment</TableHead>
                <TableHead className="font-bold">Organization</TableHead>
                <TableHead className="text-right font-bold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employments.map((employment) => (
                <TableRow key={employment.id}>
                  <TableCell className="w-8">
                    <Checkbox
                      checked={selectedEmployments[employment.id]}
                      onCheckedChange={(checked) =>
                        setSelectedEmployments((prev) =>
                          Object.fromEntries(
                            Object.entries({
                              ...prev,
                              [employment.id]: checked,
                            }).filter((c) => c),
                          ),
                        )
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold text-primary">
                      <Link href={"/dashboard/employee/" + employment.id}>
                        {employment.jobTitle}
                      </Link>
                    </div>
                    <div className="text-xs text-muted-foreground truncate max-w-[400px]">
                      {employment.jobDescription}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      {employment.organization?.id && (
                        <h2 className="text-md">
                          <Link
                            href={`/organization/${employment.organization.id}`}
                          >
                            {employment.organization.name || ""}
                          </Link>
                        </h2>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {/* <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openViewEmployment(employment)}
                    >
                      <EmploymentClock className="h-4 w-4" />
                    </Button> */}
                    {employment.calendarId ? (
                      <Button variant="ghost" size="icon" asChild>
                        <Link
                          href={
                            "/dashboard/employee/calendar/" +
                            employment.calendarId
                          }
                        >
                          <CalendarIcon />
                        </Link>
                      </Button>
                    ) : (
                      <Button variant="ghost" size="icon" disabled>
                        <CalendarIcon />
                      </Button>
                    )}

                    {/* <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEdit(employment)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button> */}
                    {/* <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => openDelete(employment)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button> */}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        /* IMPROVED GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {employments.map((employment) => (
            <Card
              key={employment.id}
              className="bg-background shadow-md group flex flex-col relative overflow-hidden transition-all hover:ring-2 hover:ring-primary/20"
            >
              <CardHeader className="pb-3 border-b bg-muted/5 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="font-bold text-primary truncate pr-4 flex justify-between gap-1 w-full">
                  <Link href={"/dashboard/employee/" + employment.id}>
                    {employment.jobTitle}
                  </Link>
                  {/* <Badge
                    variant={
                      activeEmploymentId === employment.id
                        ? "default"
                        : "outline"
                    }
                    onClick={() => {
                      handleSetDefaultEmployment(employment.id);
                      setActiveEmploymentId((prev) =>
                        prev === employment.id ? null : employment.id,
                      );
                    }}
                    className={cn(
                      activeEmploymentId === employment.id
                        ? ""
                        : "text-foreground/50",
                    )}
                    disabled={isSubmitting}
                  >
                    main
                  </Badge> */}
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
                    <DropdownMenuItem asChild>
                      {employment.calendarId ? (
                        <Button variant="ghost" size="icon" asChild>
                          <Link
                            href={
                              "/dashboard/employee/calendar/" +
                              employment.calendarId
                            }
                          >
                            <CalendarIcon />
                          </Link>
                        </Button>
                      ) : (
                        <Button variant="ghost" size="icon" disabled>
                          <CalendarIcon />
                        </Button>
                      )}
                    </DropdownMenuItem>
                    {/* <DropdownMenuItem onClick={() => openEdit(employment)}>
                      <Pencil className="mr-2 h-4 w-4" /> Edit Details
                    </DropdownMenuItem> */}
                    {/* <DropdownMenuItem
                      onClick={() => openDelete(employment)}
                      className="text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Delete Employment
                    </DropdownMenuItem> */}
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground line-clamp-3 min-h-[60px]">
                  {employment.jobDescription ||
                    "No description provided for this employment."}
                </p>
              </CardContent>
              <CardFooter className="pt-4 border-t flex justify-between items-center bg-muted/5">
                {/* <AcriveBadge isActive={employment.isActive} /> */}
                {employment.organization?.id && (
                  <h2 className="text-md">
                    <Link href={`/organization/${employment.organization.id}`}>
                      @{employment.organization.name || ""}
                    </Link>
                  </h2>
                )}
                <span className="text-[10px] font-mono text-muted-foreground">
                  ID: {employment.id}
                </span>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* RESTORED PAGINATION WITH LIMIT SELECTOR */}
      {/* <div className="flex items-center justify-between px-4 py-4 border rounded bg-card">
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
      </div> */}

      {/* <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This will permanently delete "{selectedEmployment?.name}". This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteEmployment}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Delete Employment"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}
    </div>
  );
}
