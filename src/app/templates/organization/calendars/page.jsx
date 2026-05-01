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
import { EthiopianCalendar } from "@/components/ui/ethiopian-calendar";
import { Calendar } from "@/components/ui/calendar";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Badge } from "@/components/ui/badge";
import { EthDateTime } from "ethiopian-calendar-date-converter";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useOrganizationStore } from "@/store";

const startMonth = new Date();
const endMonth = new Date(Date.now() + 10 * 365.25 * 24 * 60 * 60 * 1000);

const monthStrs = {
  en: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  am: [
    "መስ",
    "ጥቅ",
    "ህዳ",
    "ታህ",
    "ጥር",
    "የካ",
    "መጋ",
    "ሚያ",
    "ግን",
    "ሰኔ",
    "ሐም",
    "ነሃ",
    "ጳጉ",
  ],
};

export default function CalendarsPage() {
  const organization = useOrganizationStore(({ organization }) => organization);
  const setOrganization = useOrganizationStore(
    ({ setOrganization }) => setOrganization,
  );
  const calendars = useOrganizationStore(({ calendars }) => calendars);
  const setCalendars = useOrganizationStore(({ setCalendars }) => setCalendars);
  const calendarCount = useOrganizationStore(
    ({ calendarCount }) => calendarCount,
  );
  const setCalendarCount = useOrganizationStore(
    ({ setCalendarCount }) => setCalendarCount,
  );
  // const [calendars, setCalendars] = useState([]);
  const [calendarMode, setCalendarMode] = useState("ethiopian");
  const [selectedCalendars, setSelectedCalendars] = useState({});
  // const [selectedDates, setSelectedDates] = useState([]);
  const [activeAvailableRange, setActiveAvailableRange] = useState(0);
  const [activeUnavailableRange, setActiveUnavailableRange] = useState(0);
  const [weeklySelects, setWeeklySelects] = useState([]);
  const [weeklyDeselects, setWeeklyDeselects] = useState([]);
  const [selectedDateMode, setSelectedDateMode] = useState("multiple");
  // const [calendarCount, setCalendarCount] = useState(0);
  // const [organizationId, setOrganizationId] = useState(null);
  const [isLoading, setIsLoading] = useState(calendars == null);
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
  const [selectedCalendar, setSelectedCalendar] = useState(null);

  // Form States
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    available: null,
    unavailable: null,
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

  const fetchCalendars = useCallback(async () => {
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
        `/api/v1/organization/${organizationId}/calendars/count`,
      ),
      RequestHandler.Get(
        `/api/v1/organization/${organizationId}/calendars?${params.toString()}`,
      ),
    ]);

    if (countRes.ok) {
      const { count } = await countRes.json();
      (async () => setCalendarCount(count))();
    }

    if (dataRes.ok) {
      const data = await dataRes.json();
      let results = data.calendars || [];

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
      results = results.map((res) => ({
        ...res,
        available: {
          ...(res.available ?? {}),
          ranges: res.available?.ranges
            ? res.available.ranges.map(({ from, to }) => ({
                from: new Date(from),
                to: new Date(to),
              }))
            : [],
          exactly: res.available?.exactly
            ? res.available.exactly.map((e) => new Date(e))
            : [],
        },
        unavailable: {
          ...(res.unavailable ?? {}),
          ranges: res.unavailable?.ranges
            ? res.unavailable.ranges
                .map(({ from, to }) => ({
                  from: new Date(from),
                  to: new Date(to),
                }))
                .sort((a, b) => a.from.getTime() - b.from.getTime())
            : [],
          exactly: res.unavailable?.exactly
            ? res.unavailable.exactly
                .map((e) => new Date(e))
                .sort((a, b) => a.getTime() - b.getTime())
            : [],
        },
      }));
      setCalendars(results);
    }
    (async () => setIsLoading(false))();
  }, [
    setCalendarCount,
    setCalendars,
    organizationId,
    page,
    limit,
    statusFilter,
    searchQuery,
  ]);

  useEffect(() => {
    fetchCalendars();
  }, [fetchCalendars]);

  const formatLocaleShortDate = (d) => {
    const isEthiopian = calendarMode === "ethiopian";
    const ed = EthDateTime.fromEuropeanDate(d);
    const day = isEthiopian ? ed.date + 1 : d.getDate();
    const month = isEthiopian ? ed.month % 13 : d.getMonth();
    const year = isEthiopian ? ed.year : d.getFullYear();
    return `${monthStrs[isEthiopian ? "am" : "en"][month]} ${day}, ${year}`;
  };

  // --- CRUD Handlers ---
  const handleAddCalendar = async () => {
    setIsSubmitting(true);
    const res = await RequestHandler.Post(
      `/api/v1/organization/${organizationId}/calendar`,
      {
        body: {
          name: formData.name,
          description: formData.description,
          available: formData.available,
          unavailable: formData.unavailable,
        },
      },
    );
    if (res.ok) {
      setIsAddOpen(false);
      setFormData({
        name: "",
        description: "",
        available: null,
        unavailable: null,
      });
      fetchCalendars();
    }
    setIsSubmitting(false);
  };

  const handleEditCalendar = async () => {
    setIsSubmitting(true);
    const res = await RequestHandler.Patch(
      `/api/v1/organization/${organizationId}/calendar/${selectedCalendar.id}`,
      {
        body: {
          name: formData.name,
          description: formData.description,
          available: formData.available,
          unavailable: formData.unavailable,
        },
      },
    );
    if (res.ok) {
      setIsEditOpen(false);
      setSelectedCalendar(null);
      fetchCalendars();
    }
    setIsSubmitting(false);
  };

  const handleDeleteCalendar = async () => {
    setIsSubmitting(true);
    const res = await RequestHandler.Delete(
      `/api/v1/organization/${organizationId}/calendar/${selectedCalendar.id}`,
    );
    if (res.ok) {
      setIsDeleteOpen(false);
      setSelectedCalendar(null);
      fetchCalendars();
    }
    setIsSubmitting(false);
  };

  // const handleMarkAvailable = (selectedDates) => {
  //   const { ranges, weekly, monthly, exactly } = formData.available ?? {};
  //   const rangeMode = selectedDateMode !== "multiple";
  //   const available =
  //     rangeMode && !Array.isArray(selectedDates)
  //       ? {
  //           ...formData.available,
  //           ranges: [
  //             ...(ranges ?? []),
  //             {
  //               from: selectedDates.from,
  //               to: selectedDates.to,
  //             },
  //           ],
  //         }
  //       : {
  //           ...formData.available,
  //           exactly: [...(exactly ?? []), ...(selectedDates ?? [])].filter(
  //             (d) => d != null,
  //           ),
  //         };
  //   if (available.ranges?.length === 0) delete available.ranges;
  //   if (available.exactly?.length === 0) delete available.exactly;
  //   setFormData((prev) => ({
  //     ...prev,
  //     available,
  //   }));
  // };

  // const handleMarkUnavailable = (selectedDates) => {
  //   const { ranges, weekly, monthly, exactly } = formData.unavailable ?? {};
  //   const rangeMode = selectedDateMode !== "multiple";
  //   const unavailable =
  //     rangeMode && !Array.isArray(selectedDates)
  //       ? {
  //           ...formData.available,
  //           ranges: [
  //             ...(ranges ?? []),
  //             {
  //               from: selectedDates.from,
  //               to: selectedDates.to,
  //             },
  //           ],
  //         }
  //       : {
  //           ...formData.available,
  //           exactly: [...(exactly ?? []), ...(selectedDates ?? [])].filter(
  //             (d) => d != null,
  //           ),
  //         };
  //   if (unavailable.ranges?.length === 0) delete unavailable.ranges;
  //   if (unavailable.exactly?.length === 0) delete unavailable.exactly;
  //   setFormData((prev) => ({
  //     ...prev,
  //     unavailable,
  //   }));
  // };

  const openEdit = (calendar) => {
    setSelectedCalendar(calendar);
    setFormData({
      name: calendar.name,
      description: calendar.description,
      available: calendar.available,
      unavailable: calendar.unavailable,
    });
    setIsEditOpen(true);
  };

  const openDelete = (calendar) => {
    setSelectedCalendar(calendar);
    setIsDeleteOpen(true);
  };

  const totalPages = Math.ceil(calendarCount / limit);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendars</h1>
          <p className="text-sm text-muted-foreground">
            Manage your organization&apos;s calendars.
          </p>
        </div>
        <Button onClick={() => setIsAddOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Calendar
        </Button>
      </div>

      {/* Toolbar */}
      <Card className="p-3 bg-muted/20 border-none shadow-none bg-background">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex flex-1 items-center gap-3">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search calendars..."
                className="pl-9 bg-background"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
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
                <TableHead className="font-bold">Calendar</TableHead>
                {/* <TableHead className="font-bold text-center">Status</TableHead> */}
                <TableHead className="text-right font-bold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {calendars.map((calendar) => (
                <TableRow key={calendar.id}>
                  <TableCell className="w-8">
                    <Checkbox
                      checked={selectedCalendars[calendar.id]}
                      onCheckedChange={(checked) =>
                        setSelectedCalendars((prev) =>
                          Object.fromEntries(
                            Object.entries({
                              ...prev,
                              [calendar.id]: checked,
                            }).filter((c) => c),
                          ),
                        )
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold text-primary">
                      <Link
                        href={"/dashboard/organization/calendar/" + calendar.id}
                      >
                        {calendar.name}
                      </Link>
                    </div>
                    <div className="text-xs text-muted-foreground truncate max-w-[400px]">
                      {calendar.description}
                    </div>
                  </TableCell>
                  {/* <TableCell className="text-center">
                    <AcriveBadge isActive={calendar.isActive} />
                  </TableCell> */}
                  <TableCell className="text-right">
                    {/* <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openViewCalendar(calendar)}
                    >
                      <CalendarClock className="h-4 w-4" />
                    </Button> */}
                    <Button variant="ghost" size="icon" asChild>
                      <Link
                        href={"/dashboard/organization/calendar/" + calendar.id}
                      >
                        <CalendarIcon />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEdit(calendar)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => openDelete(calendar)}
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
          {calendars.map((calendar) => (
            <Card
              key={calendar.id}
              className="bg-background shadow-md group flex flex-col relative overflow-hidden transition-all hover:ring-2 hover:ring-primary/20"
            >
              <CardHeader className="pb-3 border-b bg-muted/5 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="font-bold text-primary truncate pr-4">
                  <Link
                    href={"/dashboard/organization/calendar/" + calendar.id}
                  >
                    {calendar.name}
                  </Link>
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
                    <DropdownMenuItem onClick={() => openEdit(calendar)}>
                      <Pencil className="mr-2 h-4 w-4" /> Edit Details
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => openDelete(calendar)}
                      className="text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Delete Calendar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground line-clamp-3 min-h-[60px]">
                  {calendar.description ||
                    "No description provided for this calendar."}
                </p>
              </CardContent>
              <CardFooter className="pt-4 border-t flex justify-between items-center bg-muted/5">
                {/* <AcriveBadge isActive={calendar.isActive} /> */}
                <span className="text-[10px] font-mono text-muted-foreground">
                  ID: {calendar.id.slice(0, 8)}
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
              {Math.min(page * limit, calendarCount)}
            </span>{" "}
            of <span className="font-medium">{calendarCount}</span>
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
              {isEditOpen ? "Edit Calendar" : "Add New Calendar"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Calendar Name</Label>
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
            <div className="space-y-2">
              <Label>Availablity</Label>
              <div className="flex flex-wrap gap-1 overflow-auto">
                {(formData.available?.ranges ?? []).map(({ from, to }, idx) => (
                  <Badge
                    key={idx}
                    variant={
                      activeAvailableRange === idx ? "default" : "outline"
                    }
                    onClick={() => setActiveAvailableRange(idx)}
                  >
                    {`${formatLocaleShortDate(from)} - ${formatLocaleShortDate(to)}`}
                  </Badge>
                ))}
                {(formData.available?.exactly ?? []).map((e, idx) => (
                  <Badge key={idx} variant="default">
                    {`${formatLocaleShortDate(e)}`}
                  </Badge>
                ))}
              </div>
              {/* <Textarea
                defaultValue=""
                value={
                  formData.available == null
                    ? "<null>"
                    : JSON.stringify(formData.available, null, 2)
                }
              /> */}
            </div>
            <div className="space-y-2">
              <Label>Unavailablity</Label>
              <div className="flex flex-wrap gap-1 overflow-auto">
                {(formData.unavailable?.ranges ?? []).map(
                  ({ from, to }, idx) => (
                    <Badge
                      key={idx}
                      variant={
                        activeUnavailableRange === idx ? "default" : "outline"
                      }
                      onClick={() => setActiveUnavailableRange(idx)}
                      className="bg-orange-600"
                    >
                      {`${formatLocaleShortDate(from)} - ${formatLocaleShortDate(to)}`}
                    </Badge>
                  ),
                )}
                {(formData.unavailable?.exactly ?? []).map((e, idx) => (
                  <Badge key={idx} variant="default" className="bg-orange-600">
                    {formatLocaleShortDate(e)}
                  </Badge>
                ))}
              </div>
              {/* <Textarea
                defaultValue=""
                value={
                  formData.unavailable == null
                    ? "<null>"
                    : JSON.stringify(formData.unavailable, null, 2)
                }
              /> */}
            </div>
            <div>
              <Card className="ring-ring/40">
                <CardContent>
                  <Tabs
                    defaultValue="ethiopian"
                    value={calendarMode}
                    onValueChange={setCalendarMode}
                    className="w-full"
                  >
                    {/* Tab Select */}
                    <div className="flex flex-col items-center gap-1">
                      <div className="border rounded space-x-1 p-1 w-auto mx-auto flex justify-center">
                        <Button
                          variant="destructive"
                          className="border border-danger h-8"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              available: null,
                            }));
                          }}
                        >
                          <X />
                          Availables
                        </Button>
                        {selectedDateMode === "range" && (
                          <Button
                            variant="outline"
                            className="size-8"
                            onClick={() => {
                              setActiveAvailableRange(
                                formData.available?.ranges?.length || 0,
                              );
                            }}
                          >
                            <Plus />
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          className=""
                          onClick={() => {
                            setSelectedDateMode((m) =>
                              m === "range" ? "multiple" : "range",
                            );
                          }}
                        >
                          {selectedDateMode === "range" ? "R" : "M"}
                        </Button>

                        <TabsList className="grid grid-cols-2 border data-[active=true]:bg-primary/15">
                          <TabsTrigger value="ethiopian">ኢትዮጵያዊ</TabsTrigger>
                          <TabsTrigger value="gregorian">Gregorian</TabsTrigger>
                        </TabsList>
                        {selectedDateMode === "range" && (
                          <Button
                            variant="outline"
                            className="size-8"
                            onClick={() => {
                              setActiveUnavailableRange(
                                formData.unavailable?.ranges?.length || 0,
                              );
                            }}
                          >
                            <Plus />
                          </Button>
                        )}
                        <Button
                          variant="destructive"
                          className="border border-danger h-8"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              unavailable: null,
                            }));
                          }}
                        >
                          <X />
                          Unavailables
                        </Button>
                      </div>
                    </div>
                    {/* Calendars */}
                    <div className="flex gap-2">
                      <div className="p-2 border border-primary/50 rounded space-y-2">
                        {/* Weekly */}
                        <div className="border-b">
                          <ToggleGroup
                            className="p-1 bg-background space-x-1 [&>button[data-state=on]]:bg-primary/15 [&>button[data-state=on]]:text-primary [&>button[data-state=on]]:rounded-full"
                            type="multiple"
                            value={formData.available?.weekly ?? []}
                            onValueChange={(weekly) =>
                              setFormData((prev) => ({
                                ...prev,
                                available: { ...prev.available, weekly },
                              }))
                            }
                          >
                            <ToggleGroupItem size="sm" value={6}>
                              S
                            </ToggleGroupItem>
                            <ToggleGroupItem size="sm" value={0}>
                              M
                            </ToggleGroupItem>
                            <ToggleGroupItem size="sm" value={1}>
                              T
                            </ToggleGroupItem>
                            <ToggleGroupItem size="sm" value={2}>
                              W
                            </ToggleGroupItem>
                            <ToggleGroupItem size="sm" value={3}>
                              T
                            </ToggleGroupItem>
                            <ToggleGroupItem size="sm" value={4}>
                              F
                            </ToggleGroupItem>
                            <ToggleGroupItem size="sm" value={5}>
                              S
                            </ToggleGroupItem>
                          </ToggleGroup>
                        </div>
                        {/* Availablity Calendars */}
                        <TabsContent
                          value="ethiopian"
                          className="flex justify-center mt-0"
                        >
                          <EthiopianCalendar
                            mode={selectedDateMode}
                            selected={
                              selectedDateMode === "range"
                                ? formData.available?.ranges?.length > 0
                                  ? formData.available.ranges[
                                      activeAvailableRange
                                    ]
                                  : null
                                : formData.available?.exactly
                            }
                            onSelect={(values) => {
                              if (selectedDateMode === "range") {
                                setFormData((prev) => {
                                  const prevRanges =
                                    prev.available?.ranges ?? [];
                                  let ranges = [...prevRanges];
                                  if (activeAvailableRange >= ranges.length) {
                                    ranges.push(values);
                                  } else {
                                    ranges[activeAvailableRange] = values;
                                  }
                                  ranges = ranges.filter((r) => r != null);
                                  // if(activeAvailableRange > ranges.length) {
                                  //   setActiveAvailableRange(ranges.length);
                                  // }
                                  return {
                                    ...prev,
                                    available: {
                                      ...prev.available,
                                      ranges,
                                    },
                                  };
                                });
                              } else {
                                setFormData((prev) => ({
                                  ...prev,
                                  available: {
                                    ...prev.available,
                                    exactly: values,
                                  },
                                }));
                              }
                            }}
                            startMonth={startMonth}
                            endMonth={endMonth}
                            reverseYears
                            className="px-0 py-0 pb-1 w-full"
                            captionLayout="dropdown"
                          />
                        </TabsContent>
                        <TabsContent
                          value="gregorian"
                          className="flex justify-center mt-0"
                        >
                          <Calendar
                            mode={selectedDateMode}
                            selected={
                              selectedDateMode === "range"
                                ? formData.available?.ranges?.length > 0
                                  ? formData.available.ranges[
                                      activeAvailableRange
                                    ]
                                  : null
                                : formData.available?.exactly
                            }
                            onSelect={(values) => {
                              if (selectedDateMode === "range") {
                                setFormData((prev) => {
                                  const prevRanges =
                                    prev.available?.ranges ?? [];
                                  let ranges = [...prevRanges];
                                  if (activeAvailableRange >= ranges.length) {
                                    ranges.push(values);
                                  } else {
                                    ranges[activeAvailableRange] = values;
                                  }
                                  ranges = ranges.filter((r) => r != null);
                                  return {
                                    ...prev,
                                    available: {
                                      ...prev.available,
                                      ranges,
                                    },
                                  };
                                });
                              } else {
                                setFormData((prev) => ({
                                  ...prev,
                                  available: {
                                    ...prev.available,
                                    exactly: values,
                                  },
                                }));
                              }
                            }}
                            startMonth={startMonth}
                            endMonth={endMonth}
                            reverseYears
                            className="px-0 py-2 w-full"
                            captionLayout="dropdown"
                          />
                        </TabsContent>
                      </div>
                      <div className="p-2 border border-orange-600/50 rounded space-y-2">
                        {/* Weekly */}
                        <div className="border-b">
                          <ToggleGroup
                            className="p-1 bg-background space-x-1 [&>button[data-state=on]]:bg-orange-600/15 [&>button[data-state=on]]:text-orange-900 [&>button[data-state=on]]:rounded-full"
                            type="multiple"
                            value={formData.unavailable?.weekly}
                            onValueChange={(weekly) =>
                              setFormData((prev) => ({
                                ...prev,
                                unavailable: { ...prev.unavailable, weekly },
                              }))
                            }
                          >
                            <ToggleGroupItem size="sm" value={6}>
                              S
                            </ToggleGroupItem>
                            <ToggleGroupItem size="sm" value={0}>
                              M
                            </ToggleGroupItem>
                            <ToggleGroupItem size="sm" value={1}>
                              T
                            </ToggleGroupItem>
                            <ToggleGroupItem size="sm" value={2}>
                              W
                            </ToggleGroupItem>
                            <ToggleGroupItem size="sm" value={3}>
                              T
                            </ToggleGroupItem>
                            <ToggleGroupItem size="sm" value={4}>
                              F
                            </ToggleGroupItem>
                            <ToggleGroupItem size="sm" value={5}>
                              S
                            </ToggleGroupItem>
                          </ToggleGroup>
                        </div>
                        {/* Unavailablity Calendars */}
                        <TabsContent
                          value="ethiopian"
                          className="flex justify-center mt-0"
                        >
                          <EthiopianCalendar
                            mode={selectedDateMode}
                            selected={
                              selectedDateMode === "range"
                                ? formData.unavailable?.ranges?.length > 0
                                  ? formData.unavailable.ranges[
                                      activeUnavailableRange
                                    ]
                                  : null
                                : formData.unavailable?.exactly
                            }
                            onSelect={(values) => {
                              if (selectedDateMode === "range") {
                                setFormData((prev) => {
                                  const prevRanges =
                                    prev.unavailable?.ranges ?? [];
                                  let ranges = [...prevRanges];
                                  if (activeUnavailableRange >= ranges.length) {
                                    ranges.push(values);
                                  } else {
                                    ranges[activeUnavailableRange] = values;
                                  }
                                  ranges = ranges.filter((r) => r != null);
                                  return {
                                    ...prev,
                                    unavailable: {
                                      ...prev.unavailable,
                                      ranges,
                                    },
                                  };
                                });
                              } else {
                                setFormData((prev) => ({
                                  ...prev,
                                  unavailable: {
                                    ...prev.unavailable,
                                    exactly: values,
                                  },
                                }));
                              }
                            }}
                            startMonth={startMonth}
                            endMonth={endMonth}
                            reverseYears
                            className="px-0 py-0 pb-1 w-full"
                            captionLayout="dropdown"
                          />
                        </TabsContent>
                        <TabsContent
                          value="gregorian"
                          className="flex justify-center mt-0"
                        >
                          <Calendar
                            mode={selectedDateMode}
                            selected={
                              selectedDateMode === "range"
                                ? formData.unavailable?.ranges?.length > 0
                                  ? formData.unavailable.ranges[
                                      activeUnavailableRange
                                    ]
                                  : null
                                : formData.unavailable?.exactly
                            }
                            onSelect={(values) => {
                              if (selectedDateMode === "range") {
                                setFormData((prev) => {
                                  const prevRanges =
                                    prev.unavailable?.ranges ?? [];
                                  let ranges = [...prevRanges];
                                  if (activeUnavailableRange >= ranges.length) {
                                    ranges.push(values);
                                  } else {
                                    ranges[activeUnavailableRange] = values;
                                  }
                                  ranges = ranges.filter((r) => r != null);
                                  return {
                                    ...prev,
                                    unavailable: {
                                      ...prev.unavailable,
                                      ranges,
                                    },
                                  };
                                });
                              } else {
                                setFormData((prev) => ({
                                  ...prev,
                                  unavailable: {
                                    ...prev.unavailable,
                                    exactly: values,
                                  },
                                }));
                              }
                            }}
                            startMonth={startMonth}
                            endMonth={endMonth}
                            reverseYears
                            className="px-0 py-2 w-full"
                            captionLayout="dropdown"
                          />
                        </TabsContent>
                      </div>
                    </div>
                  </Tabs>
                </CardContent>
              </Card>
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
                setIsEditOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={isEditOpen ? handleEditCalendar : handleAddCalendar}
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isEditOpen ? "Save Changes" : "Create Calendar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This will permanently delete "{selectedCalendar?.name}". This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteCalendar}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Delete Calendar"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
