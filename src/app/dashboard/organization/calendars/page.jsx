// src/app/dashboard/organization/calendar/page.jsx
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
  LayoutGrid,
  List,
  MoreVertical,
  Loader2,
  X,
  CalendarIcon,
  Clock,
  PlusCircle,
  MinusCircle,
  Copy,
  Check,
  AlarmClock,
  Sun,
  Moon,
  Coffee,
  CalendarDays,
  Sparkles,
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
import { Checkbox } from "@/components/ui/checkbox";
import { EthiopianCalendar } from "@/components/ui/ethiopian-calendar";
import { Calendar } from "@/components/ui/calendar";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Badge } from "@/components/ui/badge";
import { EthDateTime } from "ethiopian-calendar-date-converter";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useOrganizationStore } from "@/store";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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

const DAYS = [
  { value: 0, label: "Monday", short: "M" },
  { value: 1, label: "Tuesday", short: "T" },
  { value: 2, label: "Wednesday", short: "W" },
  { value: 3, label: "Thursday", short: "T" },
  { value: 4, label: "Friday", short: "F" },
  { value: 5, label: "Saturday", short: "S" },
  { value: 6, label: "Sunday", short: "S" },
];

// Predefined time slot templates
const TIME_SLOT_TEMPLATES = {
  "Standard Business": [["09:00", "17:00"]],
  "Morning Shift": [["08:00", "12:00"]],
  "Afternoon Shift": [["13:00", "17:00"]],
  "Full Day": [["08:00", "20:00"]],
  "Split Shift": [
    ["09:00", "12:00"],
    ["13:00", "17:00"],
  ],
  "Extended Hours": [["07:00", "19:00"]],
  "Night Shift": [
    ["20:00", "23:00"],
    ["00:00", "04:00"],
  ],
  "Weekend Special": [["10:00", "15:00"]],
};

const BREAK_TEMPLATES = {
  "Lunch Break": ["12:00", "13:00"],
  "Coffee Break": ["10:30", "11:00"],
  "Afternoon Break": ["15:30", "16:00"],
  "Prayer Break": ["13:00", "13:30"],
  "Tea Break": ["11:00", "11:15"],
};
// Collapsible Section Component
const CollapsibleSection = ({
  title,
  icon: Icon,
  children,
  defaultOpen = true,
  color = "primary",
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors",
          color === "green" && "hover:bg-green-50/50",
          color === "orange" && "hover:bg-orange-50/50",
        )}
      >
        <div className="flex items-center gap-2">
          <Icon
            className={cn(
              "h-5 w-5",
              color === "green"
                ? "text-green-600"
                : color === "orange"
                  ? "text-orange-600"
                  : "text-primary",
            )}
          />
          <h3
            className={cn(
              "font-semibold",
              color === "green"
                ? "text-green-600"
                : color === "orange"
                  ? "text-orange-600"
                  : "",
            )}
          >
            {title}
          </h3>
        </div>
        <ChevronRight
          className={cn("h-4 w-4 transition-transform", isOpen && "rotate-90")}
        />
      </button>
      {isOpen && <div className="p-4 border-t">{children}</div>}
    </div>
  );
};

// Improved TimeSlot Editor Component with collapsible
const TimeSlotEditor = ({
  value = [],
  onChange,
  label,
  color = "primary",
  collapsible = false,
}) => {
  const [hours, setHours] = useState(
    value.map((v) => ({ from: v[0], to: v[1] })),
  );
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [isOpen, setIsOpen] = useState(true);

  const updateHours = (newHours) => {
    setHours(newHours);
    onChange(newHours.map((h) => [h.from, h.to]));
  };

  const addSlot = () => {
    updateHours([...hours, { from: "09:00", to: "17:00" }]);
  };

  const removeSlot = (index) => {
    updateHours(hours.filter((_, i) => i !== index));
  };

  const updateSlot = (index, field, val) => {
    const newHours = [...hours];
    newHours[index][field] = val;
    updateHours(newHours);
  };

  const applyTemplate = () => {
    if (selectedTemplate && TIME_SLOT_TEMPLATES[selectedTemplate]) {
      const template = TIME_SLOT_TEMPLATES[selectedTemplate];
      updateHours(template.map(([from, to]) => ({ from, to })));
    }
  };

  const addBreak = (breakTemplate) => {
    if (BREAK_TEMPLATES[breakTemplate]) {
      const [from, to] = BREAK_TEMPLATES[breakTemplate];
      updateHours([...hours, { from, to }]);
    }
  };

  const duplicateSlot = (index) => {
    const slot = hours[index];
    updateHours([...hours, { ...slot }]);
  };

  const EditorContent = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <Label
          className={cn(
            "text-sm font-medium",
            color === "orange" && "text-orange-600",
          )}
        >
          {label}
        </Label>
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button type="button" variant="outline" size="sm">
                <Sparkles className="h-3.5 w-3.5 mr-1" />
                Templates
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-2">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground mb-2">
                  Time Slot Templates
                </p>
                {Object.keys(TIME_SLOT_TEMPLATES).map((template) => (
                  <Button
                    key={template}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-sm"
                    onClick={() => {
                      setSelectedTemplate(template);
                      applyTemplate();
                    }}
                  >
                    <Clock className="h-3.5 w-3.5 mr-2" />
                    {template}
                  </Button>
                ))}
                <div className="border-t my-2" />
                <p className="text-xs font-medium text-muted-foreground mb-2">
                  Add Break
                </p>
                {Object.keys(BREAK_TEMPLATES).map((breakTemplate) => (
                  <Button
                    key={breakTemplate}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-sm"
                    onClick={() => addBreak(breakTemplate)}
                  >
                    <Coffee className="h-3.5 w-3.5 mr-2" />
                    {breakTemplate}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
          <Button type="button" variant="outline" size="sm" onClick={addSlot}>
            <PlusCircle className="h-3.5 w-3.5 mr-1" />
            Add Slot
          </Button>
        </div>
      </div>

      {hours.length === 0 ? (
        <div className="text-sm text-muted-foreground p-4 border-2 border-dashed rounded-md text-center">
          <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>No time slots configured</p>
          <p className="text-xs mt-1">
            Click "Add Slot" or use a template to get started
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {hours.map((slot, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 p-2 bg-muted/20 rounded-md"
            >
              <div className="flex-1 flex items-center gap-2">
                <Input
                  type="time"
                  value={slot.from}
                  onChange={(e) => updateSlot(idx, "from", e.target.value)}
                  className="w-28"
                />
                <span className="text-muted-foreground">to</span>
                <Input
                  type="time"
                  value={slot.to}
                  onChange={(e) => updateSlot(idx, "to", e.target.value)}
                  className="w-28"
                />
              </div>
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => duplicateSlot(idx)}
                  className="h-8 w-8"
                >
                  <Copy className="h-3.5 w-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeSlot(idx)}
                  className="h-8 w-8 text-destructive hover:text-destructive"
                >
                  <MinusCircle className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  if (collapsible) {
    return (
      <div className="border rounded-lg overflow-hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors"
        >
          <span
            className={cn(
              "text-sm font-medium",
              color === "orange" && "text-orange-600",
            )}
          >
            {label}
          </span>
          <ChevronRight
            className={cn(
              "h-4 w-4 transition-transform",
              isOpen && "rotate-90",
            )}
          />
        </button>
        {isOpen && <div className="p-4 border-t">{EditorContent()}</div>}
      </div>
    );
  }

  return EditorContent();
};

// Improved Weekly Hours Editor Component with collapsible days
const WeeklyHoursEditor = ({
  value = {},
  onChange,
  label,
  color = "primary",
}) => {
  const [weeklyHours, setWeeklyHours] = useState(value);
  const [copyFromDay, setCopyFromDay] = useState(null);
  const [expandedDays, setExpandedDays] = useState({});

  const toggleDay = (dayIndex) => {
    setExpandedDays((prev) => ({ ...prev, [dayIndex]: !prev[dayIndex] }));
  };

  const updateDayHours = (dayIndex, from, to) => {
    const newHours = { ...weeklyHours };
    if (from && to) {
      newHours[dayIndex] = [from, to];
    } else {
      delete newHours[dayIndex];
    }
    setWeeklyHours(newHours);
    onChange(newHours);
  };

  const copyHoursToAll = () => {
    const sourceDay = copyFromDay !== null ? copyFromDay : 0;
    const sourceHours = weeklyHours[sourceDay];
    if (sourceHours) {
      const newHours = {};
      DAYS.forEach((day) => {
        newHours[day.value] = [...sourceHours];
      });
      setWeeklyHours(newHours);
      onChange(newHours);
    }
  };

  const applyToAllDays = (from, to) => {
    const newHours = {};
    DAYS.forEach((day) => {
      newHours[day.value] = [from, to];
    });
    setWeeklyHours(newHours);
    onChange(newHours);
  };

  const clearAllDays = () => {
    setWeeklyHours({});
    onChange({});
  };

  const hasHours = (dayIndex) => {
    return (
      weeklyHours[dayIndex] &&
      weeklyHours[dayIndex][0] &&
      weeklyHours[dayIndex][1]
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <Label
          className={cn(
            "text-sm font-medium",
            color === "orange" && "text-orange-600",
          )}
        >
          {label}
        </Label>
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button type="button" variant="outline" size="sm">
                <Copy className="h-3.5 w-3.5 mr-1" />
                Bulk Actions
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-2">
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">
                  Copy from day:
                </p>
                <Select onValueChange={(val) => setCopyFromDay(parseInt(val))}>
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent>
                    {DAYS.map((day) => (
                      <SelectItem key={day.value} value={day.value.toString()}>
                        {day.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  size="sm"
                  className="w-full"
                  onClick={copyHoursToAll}
                  disabled={copyFromDay === null}
                >
                  Copy to All Days
                </Button>
                <div className="border-t my-2" />
                <div className="flex gap-2">
                  <Input
                    type="time"
                    placeholder="Start"
                    className="h-8 text-sm"
                    id="bulk-start"
                  />
                  <Input
                    type="time"
                    placeholder="End"
                    className="h-8 text-sm"
                    id="bulk-end"
                  />
                </div>
                <Button
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    const start = document.getElementById("bulk-start")?.value;
                    const end = document.getElementById("bulk-end")?.value;
                    if (start && end) applyToAllDays(start, end);
                  }}
                >
                  Apply to All Days
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  className="w-full"
                  onClick={clearAllDays}
                >
                  Clear All Days
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {DAYS.map((day) => {
          const isExpanded = expandedDays[day.value];
          const configured = hasHours(day.value);

          return (
            <div key={day.value} className="border rounded-md overflow-hidden">
              <button
                onClick={() => toggleDay(day.value)}
                className={cn(
                  "w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors",
                  configured && "bg-green-50/30 dark:bg-green-950/20",
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium">{day.label}</span>
                  {configured && (
                    <Badge
                      variant="outline"
                      className="text-[10px] bg-green-100 text-green-700 border-green-200"
                    >
                      {weeklyHours[day.value][0]} - {weeklyHours[day.value][1]}
                    </Badge>
                  )}
                </div>
                <ChevronRight
                  className={cn(
                    "h-4 w-4 transition-transform",
                    isExpanded && "rotate-90",
                  )}
                />
              </button>
              {isExpanded && (
                <div className="p-3 border-t bg-muted/10">
                  <div className="flex items-center gap-2">
                    <Input
                      type="time"
                      value={weeklyHours[day.value]?.[0] || ""}
                      onChange={(e) =>
                        updateDayHours(
                          day.value,
                          e.target.value,
                          weeklyHours[day.value]?.[1] || "",
                        )
                      }
                      placeholder="Start"
                      className="w-28"
                    />
                    <span>to</span>
                    <Input
                      type="time"
                      value={weeklyHours[day.value]?.[1] || ""}
                      onChange={(e) =>
                        updateDayHours(
                          day.value,
                          weeklyHours[day.value]?.[0] || "",
                          e.target.value,
                        )
                      }
                      placeholder="End"
                      className="w-28"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => updateDayHours(day.value, "", "")}
                      className="text-destructive"
                    >
                      Clear
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Quick Stats Component
const QuickStats = ({ calendars }) => {
  const totalCalendars = calendars.length;
  const calendarsWithHours = calendars.filter(
    (c) =>
      c.available?.hours?.length > 0 ||
      Object.keys(c.available?.weeklyHours || {}).length > 0,
  ).length;
  const calendarsWithWeekly = calendars.filter(
    (c) => c.available?.weekly?.length > 0,
  ).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Calendars</p>
              <p className="text-2xl font-bold">{totalCalendars}</p>
            </div>
            <CalendarIcon className="h-8 w-8 text-primary" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">With Time Slots</p>
              <p className="text-2xl font-bold">{calendarsWithHours}</p>
            </div>
            <Clock className="h-8 w-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Weekly Schedule</p>
              <p className="text-2xl font-bold">{calendarsWithWeekly}</p>
            </div>
            <CalendarDays className="h-8 w-8 text-green-500" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-2xl font-bold">
                {calendars.filter((c) => c.isActive !== false).length}
              </p>
            </div>
            <Check className="h-8 w-8 text-green-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
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

  const [calendarMode, setCalendarMode] = useState("ethiopian");
  const [selectedCalendars, setSelectedCalendars] = useState({});
  const [activeAvailableRange, setActiveAvailableRange] = useState(0);
  const [activeUnavailableRange, setActiveUnavailableRange] = useState(0);
  const [selectedDateMode, setSelectedDateMode] = useState("multiple");
  const [isLoading, setIsLoading] = useState(calendars == null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showStats, setShowStats] = useState(true);

  // View & Filter States
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
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
    available: {
      weekly: [],
      weeklyHours: {},
      hours: [],
      ranges: [],
      exactly: [],
    },
    unavailable: {
      weekly: [],
      weeklyHours: {},
      hours: [],
      ranges: [],
      exactly: [],
    },
  });

  const organizationId = organization?.id;

  // ... (keep existing fetch logic)
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

    const offset = (page - 1) * limit;
    const params = new URLSearchParams({
      offset: offset.toFixed(),
      limit: limit.toFixed(),
    });

    const [countRes, dataRes] = await Promise.all([
      RequestHandler.Get(`/query/v1/organizationCalendar?mine&countOnly`),
      RequestHandler.Get(
        `/query/v1/organizationCalendar?mine&${params.toString()}`,
      ),
    ]);

    if (countRes.ok) {
      const { count } = await countRes.json();
      setCalendarCount(count);
    }

    if (dataRes.ok) {
      const { organizationCalendars } = await dataRes.json();
      let results = organizationCalendars || [];

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
          weekly: res.available?.weekly || [],
          weeklyHours: res.available?.weeklyHours || {},
          hours: res.available?.hours || [],
          ranges:
            res.available?.ranges?.map(({ from, to }) => ({
              from: new Date(from),
              to: new Date(to),
            })) || [],
          exactly: res.available?.exactly?.map((e) => new Date(e)) || [],
        },
        unavailable: {
          weekly: res.unavailable?.weekly || [],
          weeklyHours: res.unavailable?.weeklyHours || {},
          hours: res.unavailable?.hours || [],
          ranges:
            res.unavailable?.ranges?.map(({ from, to }) => ({
              from: new Date(from),
              to: new Date(to),
            })) || [],
          exactly: res.unavailable?.exactly?.map((e) => new Date(e)) || [],
        },
      }));
      setCalendars(results);
    }
    setIsLoading(false);
  }, [
    setCalendarCount,
    setCalendars,
    organizationId,
    page,
    limit,
    searchQuery,
  ]);

  useEffect(() => {
    (async () => fetchCalendars())();
  }, [fetchCalendars]);

  const formatLocaleShortDate = (d) => {
    const isEthiopian = calendarMode === "ethiopian";
    const ed = EthDateTime.fromEuropeanDate(d);
    const day = isEthiopian ? ed.date + 1 : d.getDate();
    const month = isEthiopian ? ed.month % 13 : d.getMonth();
    const year = isEthiopian ? ed.year : d.getFullYear();
    return `${monthStrs[isEthiopian ? "am" : "en"][month]} ${day}, ${year}`;
  };

  // CRUD Handlers
  const handleAddCalendar = async () => {
    setIsSubmitting(true);
    const payload = {
      name: formData.name,
      description: formData.description,
      available: formData.available,
      unavailable: formData.unavailable,
    };

    const res = await RequestHandler.Post(
      `/query/v1/organizationCalendar?mine`,
      { body: payload },
    );
    if (res.ok) {
      setIsAddOpen(false);
      setFormData({
        name: "",
        description: "",
        available: {
          weekly: [],
          weeklyHours: {},
          hours: [],
          ranges: [],
          exactly: [],
        },
        unavailable: {
          weekly: [],
          weeklyHours: {},
          hours: [],
          ranges: [],
          exactly: [],
        },
      });
      fetchCalendars();
      toast.success("Calendar created successfully");
    } else {
      toast.error("Failed to create calendar");
    }
    setIsSubmitting(false);
  };

  const handleEditCalendar = async () => {
    setIsSubmitting(true);
    const res = await RequestHandler.Patch(
      `/query/v1/organizationCalendar?mine&~id='${selectedCalendar.id}'`,
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
      toast.success("Calendar updated successfully");
    } else {
      toast.error("Failed to update calendar");
    }
    setIsSubmitting(false);
  };

  const handleDeleteCalendar = async () => {
    setIsSubmitting(true);
    const res = await RequestHandler.Delete(
      `/query/v1/organizationCalendar?mine&~id='${selectedCalendar.id}'`,
    );
    if (res.ok) {
      setIsDeleteOpen(false);
      setSelectedCalendar(null);
      fetchCalendars();
      toast.success("Calendar deleted successfully");
    } else {
      toast.error("Failed to delete calendar");
    }
    setIsSubmitting(false);
  };

  const openEdit = (calendar) => {
    setSelectedCalendar(calendar);
    setFormData({
      name: calendar.name,
      description: calendar.description,
      available: calendar.available || {
        weekly: [],
        weeklyHours: {},
        hours: [],
        ranges: [],
        exactly: [],
      },
      unavailable: calendar.unavailable || {
        weekly: [],
        weeklyHours: {},
        hours: [],
        ranges: [],
        exactly: [],
      },
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
            Manage your organization&apos;s calendars with availability
            schedules.
          </p>
        </div>
        <Button onClick={() => setIsAddOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Calendar
        </Button>
      </div>

      {/* Quick Stats */}
      {showStats && calendars && <QuickStats calendars={calendars} />}

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
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowStats(!showStats)}
              className="hidden sm:flex"
            >
              {showStats ? "Hide Stats" : "Show Stats"}
            </Button>
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
          <Table className="font-mono">
            <TableHeader className="bg-muted/30 uppercase">
              <TableRow>
                <TableHead className="px-2"></TableHead>
                <TableHead className="font-bold">Calendar</TableHead>
                <TableHead className="font-bold">Schedule</TableHead>
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
                    <div className="text-xs text-muted-foreground truncate max-w-[300px]">
                      {calendar.description}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {calendar.available?.weekly?.length > 0 && (
                        <Badge variant="outline" className="text-xs">
                          {calendar.available.weekly
                            .map(
                              (d) => DAYS.find((day) => day.value === d)?.short,
                            )
                            .join(", ")}
                        </Badge>
                      )}
                      {calendar.available?.weeklyHours &&
                        Object.keys(calendar.available.weeklyHours).length >
                          0 && (
                          <Badge variant="outline" className="text-xs">
                            Hours configured
                          </Badge>
                        )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
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
              <CardContent className="flex-grow space-y-3 pt-4">
                <p className="text-muted-foreground line-clamp-2 text-sm">
                  {calendar.description || "No description provided."}
                </p>
                <div className="flex flex-wrap gap-1">
                  {calendar.available?.weekly?.length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      {calendar.available.weekly
                        .map((d) => DAYS.find((day) => day.value === d)?.short)
                        .join(", ")}
                    </Badge>
                  )}
                </div>
              </CardContent>
              <CardFooter className="pt-4 border-t flex justify-between items-center bg-muted/5">
                <span className="text-[10px] font-mono text-muted-foreground">
                  ID: {calendar.id.slice(0, 8)}
                </span>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
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
              value={limit.toFixed()}
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

      {/* Add/Edit Calendar Dialog */}
      <Dialog
        open={isAddOpen || isEditOpen}
        onOpenChange={(val) => {
          if (!val) {
            setIsAddOpen(false);
            setIsEditOpen(false);
            setFormData({
              name: "",
              description: "",
              available: {
                weekly: [],
                weeklyHours: {},
                ranges: [],
                exactly: [],
              },
              unavailable: {
                weekly: [],
                weeklyHours: {},
                ranges: [],
                exactly: [],
              },
            });
          }
        }}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditOpen ? "Edit Calendar" : "Add New Calendar"}
            </DialogTitle>
            <DialogDescription>
              Configure calendar name, description, availability dates and
              hours.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Calendar Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., Standard Business Hours"
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Brief description"
                />
              </div>
            </div>

            {/* Availability Section - Collapsible */}
            <CollapsibleSection
              title="Availability Schedule"
              icon={Clock}
              color="green"
            >
              <div className="space-y-4">
                {/* Weekly Days Selection */}
                <div className="space-y-2">
                  <Label>Available Days</Label>
                  <ToggleGroup
                    className="flex flex-wrap gap-1"
                    type="multiple"
                    value={formData.available?.weekly || []}
                    onValueChange={(weekly) =>
                      setFormData((prev) => ({
                        ...prev,
                        available: { ...prev.available, weekly },
                      }))
                    }
                  >
                    {DAYS.map((day) => (
                      <ToggleGroupItem
                        key={day.value}
                        value={day.value}
                        className="data-[state=on]:bg-green-500/20"
                      >
                        {day.short}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </div>

                {/* Global Time Slots - Collapsible */}
                <TimeSlotEditor
                  value={formData.available?.hours || []}
                  onChange={(hours) =>
                    setFormData((prev) => ({
                      ...prev,
                      available: { ...prev.available, hours },
                    }))
                  }
                  label="Global Time Slots (applies to all selected days)"
                  color="green"
                />

                {/* Daily Hours Configuration - Collapsible */}
                <WeeklyHoursEditor
                  value={formData.available?.weeklyHours || {}}
                  onChange={(weeklyHours) =>
                    setFormData((prev) => ({
                      ...prev,
                      available: { ...prev.available, weeklyHours },
                    }))
                  }
                  label="Daily Hours (per day)"
                  color="green"
                />

                {/* Date Ranges */}
                <div className="space-y-2">
                  <Label>Available Date Ranges</Label>
                  <div className="flex flex-wrap gap-1">
                    {(formData.available?.ranges ?? []).map(
                      ({ from, to }, idx) => (
                        <Badge
                          key={idx}
                          variant={
                            activeAvailableRange === idx ? "default" : "outline"
                          }
                          onClick={() => setActiveAvailableRange(idx)}
                          className="cursor-pointer"
                        >
                          {`${formatLocaleShortDate(from)} - ${formatLocaleShortDate(to)}`}
                          <X
                            className="h-3 w-3 ml-1 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              setFormData((prev) => ({
                                ...prev,
                                available: {
                                  ...prev.available,
                                  ranges:
                                    prev.available?.ranges?.filter(
                                      (_, i) => i !== idx,
                                    ) || [],
                                },
                              }));
                            }}
                          />
                        </Badge>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </CollapsibleSection>

            {/* Unavailability Section - Collapsible */}
            <CollapsibleSection
              title="Unavailability Schedule"
              icon={X}
              color="orange"
            >
              <div className="space-y-4">
                {/* Weekly Days Unavailable */}
                <div className="space-y-2">
                  <Label>Unavailable Days</Label>
                  <ToggleGroup
                    className="flex flex-wrap gap-1"
                    type="multiple"
                    value={formData.unavailable?.weekly || []}
                    onValueChange={(weekly) =>
                      setFormData((prev) => ({
                        ...prev,
                        unavailable: { ...prev.unavailable, weekly },
                      }))
                    }
                  >
                    {DAYS.map((day) => (
                      <ToggleGroupItem
                        key={day.value}
                        value={day.value}
                        className="data-[state=on]:bg-orange-500/20"
                      >
                        {day.short}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </div>

                {/* Unavailable Hours - Collapsible */}
                <TimeSlotEditor
                  value={formData.unavailable?.hours || []}
                  onChange={(hours) =>
                    setFormData((prev) => ({
                      ...prev,
                      unavailable: { ...prev.unavailable, hours },
                    }))
                  }
                  label="Unavailable Time Slots"
                  color="orange"
                />

                {/* Daily Hours Configuration - Collapsible */}
                <WeeklyHoursEditor
                  value={formData.unavailable?.weeklyHours || {}}
                  onChange={(weeklyHours) =>
                    setFormData((prev) => ({
                      ...prev,
                      unavailable: { ...prev.unavailable, weeklyHours },
                    }))
                  }
                  label="Daily Hours (per day)"
                  color="green"
                />

                {/* Unavailable Date Ranges */}
                <div className="space-y-2">
                  <Label>Unavailable Date Ranges</Label>
                  <div className="flex flex-wrap gap-1">
                    {(formData.unavailable?.ranges ?? []).map(
                      ({ from, to }, idx) => (
                        <Badge
                          key={idx}
                          variant={
                            activeUnavailableRange === idx
                              ? "default"
                              : "outline"
                          }
                          onClick={() => setActiveUnavailableRange(idx)}
                          className="cursor-pointer bg-orange-100 hover:bg-orange-200"
                        >
                          {`${formatLocaleShortDate(from)} - ${formatLocaleShortDate(to)}`}
                          <X
                            className="h-3 w-3 ml-1 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              setFormData((prev) => ({
                                ...prev,
                                unavailable: {
                                  ...prev.unavailable,
                                  ranges:
                                    prev.unavailable?.ranges?.filter(
                                      (_, i) => i !== idx,
                                    ) || [],
                                },
                              }));
                            }}
                          />
                        </Badge>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </CollapsibleSection>

            {/* Date Selection Calendar */}
            <Card>
              <CardTitle className="px-4">
                <h3 className="font-semibold text-green-600 flex items-center gap-2">
                  <Clock className="h-4 w-4" /> Specific Date Selection
                </h3>
              </CardTitle>
              <CardContent className="pt-4">
                <Tabs
                  defaultValue="gregorian"
                  value={calendarMode}
                  onValueChange={setCalendarMode}
                  className="w-full"
                >
                  <div className="flex justify-between items-center mb-4">
                    <TabsList>
                      <TabsTrigger value="gregorian">Gregorian</TabsTrigger>
                      <TabsTrigger value="ethiopian">Ethiopian</TabsTrigger>
                    </TabsList>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setSelectedDateMode(
                            selectedDateMode === "range" ? "multiple" : "range",
                          )
                        }
                      >
                        {selectedDateMode === "range"
                          ? "Range Mode"
                          : "Multiple Mode"}
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Available Dates Calendar */}
                    <div className="border rounded-lg p-2">
                      <Label className="text-green-600 block mb-2">
                        Select Available Dates
                      </Label>
                      <TabsContent value="ethiopian" className="mt-0">
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
                                const ranges = [
                                  ...(prev.available?.ranges || []),
                                ];
                                if (activeAvailableRange >= ranges.length) {
                                  ranges.push(values);
                                } else {
                                  ranges[activeAvailableRange] = values;
                                }
                                return {
                                  ...prev,
                                  available: {
                                    ...prev.available,
                                    ranges: ranges.filter((r) => r != null),
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
                          className="w-full"
                        />
                      </TabsContent>
                      <TabsContent value="gregorian" className="mt-0">
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
                                const ranges = [
                                  ...(prev.available?.ranges || []),
                                ];
                                if (activeAvailableRange >= ranges.length) {
                                  ranges.push(values);
                                } else {
                                  ranges[activeAvailableRange] = values;
                                }
                                return {
                                  ...prev,
                                  available: {
                                    ...prev.available,
                                    ranges: ranges.filter((r) => r != null),
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
                          className="w-full"
                        />
                      </TabsContent>
                    </div>

                    {/* Unavailable Dates Calendar */}
                    <div className="border rounded-lg p-2">
                      <Label className="text-orange-600 block mb-2">
                        Select Unavailable Dates
                      </Label>
                      <TabsContent value="ethiopian" className="mt-0">
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
                                const ranges = [
                                  ...(prev.unavailable?.ranges || []),
                                ];
                                if (activeUnavailableRange >= ranges.length) {
                                  ranges.push(values);
                                } else {
                                  ranges[activeUnavailableRange] = values;
                                }
                                return {
                                  ...prev,
                                  unavailable: {
                                    ...prev.unavailable,
                                    ranges: ranges.filter((r) => r != null),
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
                          className="w-full"
                        />
                      </TabsContent>
                      <TabsContent value="gregorian" className="mt-0">
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
                                const ranges = [
                                  ...(prev.unavailable?.ranges || []),
                                ];
                                if (activeUnavailableRange >= ranges.length) {
                                  ranges.push(values);
                                } else {
                                  ranges[activeUnavailableRange] = values;
                                }
                                return {
                                  ...prev,
                                  unavailable: {
                                    ...prev.unavailable,
                                    ranges: ranges.filter((r) => r != null),
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
                          className="w-full"
                        />
                      </TabsContent>
                    </div>
                  </div>
                </Tabs>
              </CardContent>
            </Card>
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

      {/* Delete Dialog */}
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
