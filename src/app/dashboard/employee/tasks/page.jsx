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
  Search,
  ChevronLeft,
  ChevronRight,
  Filter,
  LayoutGrid,
  List,
  MoreVertical,
  Loader2,
  Clock,
  CheckCircle,
  PlayCircle,
  AlertCircle,
  XCircle,
  ArrowUpDown,
  Eye,
  CreditCard,
  FileText,
  Upload,
  DollarSign,
  Plus,
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
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { toast } from "sonner";
import { config } from "@/lib/config";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";

// Dynamic Form Components
const DynamicForm = ({
  requirements,
  onSubmit,
  initialSubmissions = {},
  isSubmitting,
}) => {
  const [formData, setFormData] = useState(initialSubmissions);
  const [files, setFiles] = useState({});

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (field, fileList) => {
    const file = fileList[0];
    if (file) {
      // Validate file type
      const fieldConfig = requirements[field];
      if (fieldConfig.accept && !fieldConfig.accept.includes(file.type)) {
        toast.error(
          `Invalid file type for ${field}. Accepted: ${fieldConfig.accept.join(", ")}`,
        );
        return;
      }
      // Validate file size
      if (fieldConfig.maxSize && file.size > fieldConfig.maxSize) {
        toast.error(
          `File too large for ${field}. Max size: ${fieldConfig.maxSize / (1024 * 1024)}MB`,
        );
        return;
      }
      setFiles((prev) => ({ ...prev, [field]: file }));
      handleInputChange(field, {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
      });
    }
  };

  const handleSubmit = () => {
    onSubmit(formData, files);
  };

  const renderField = (fieldName, config) => {
    switch (config.type) {
      case "string":
        return (
          <div key={fieldName} className="space-y-2">
            <Label>
              {fieldName
                .replace(/-/g, " ")
                .replace(/\b\w/g, (l) => l.toUpperCase())}
              {!config.optional && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              value={formData[fieldName] || ""}
              onChange={(e) => handleInputChange(fieldName, e.target.value)}
              placeholder={config.placeholder || `Enter ${fieldName}`}
              required={!config.optional}
            />
            {config.description && (
              <p className="text-xs text-foreground">{config.description}</p>
            )}
          </div>
        );

      case "number":
        return (
          <div key={fieldName} className="space-y-2">
            <Label>
              {fieldName
                .replace(/-/g, " ")
                .replace(/\b\w/g, (l) => l.toUpperCase())}
              {!config.optional && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              type="number"
              value={formData[fieldName] || ""}
              onChange={(e) =>
                handleInputChange(fieldName, parseFloat(e.target.value))
              }
              placeholder={config.placeholder || `Enter ${fieldName}`}
              min={config.min}
              max={config.max}
              step={config.step || 1}
              required={!config.optional}
            />
          </div>
        );

      case "textarea":
        return (
          <div key={fieldName} className="space-y-2">
            <Label>
              {fieldName
                .replace(/-/g, " ")
                .replace(/\b\w/g, (l) => l.toUpperCase())}
              {!config.optional && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Textarea
              value={formData[fieldName] || ""}
              onChange={(e) => handleInputChange(fieldName, e.target.value)}
              placeholder={config.placeholder || `Enter ${fieldName}`}
              rows={config.rows || 4}
              required={!config.optional}
            />
          </div>
        );

      case "file":
        return (
          <div key={fieldName} className="space-y-2">
            <Label>
              {fieldName
                .replace(/-/g, " ")
                .replace(/\b\w/g, (l) => l.toUpperCase())}
              {!config.optional && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <div className="border-2 border-dashed rounded-lg p-4 text-center">
              <input
                type="file"
                id={`file-${fieldName}`}
                className="hidden"
                accept={config.accept?.join(",") || "*/*"}
                onChange={(e) => handleFileChange(fieldName, e.target.files)}
                multiple={config.multiple}
              />
              <label
                htmlFor={`file-${fieldName}`}
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                <Upload className="w-8 h-8 text-foreground" />
                <span className="text-sm text-foreground">
                  Click to upload {config.accept?.join(", ") || "files"}
                </span>
                {config.maxSize && (
                  <span className="text-xs text-foreground">
                    Max size: {config.maxSize / (1024 * 1024)}MB
                  </span>
                )}
              </label>
              {files[fieldName] && (
                <div className="mt-2 text-sm text-green-600">
                  Selected: {files[fieldName].name}
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {Object.entries(requirements).map(([fieldName, config]) =>
        renderField(fieldName, config),
      )}
      <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full">
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit"}
      </Button>
    </div>
  );
};

const PaymentForm = ({ paymentConfig, onSubmit, isSubmitting }) => {
  const [paymentMethod, setPaymentMethod] = useState(
    Object.keys(paymentConfig.methods || {})[0],
  );
  const [paymentData, setPaymentData] = useState({});

  const handleSubmit = () => {
    onSubmit({
      method: paymentMethod,
      amount: paymentConfig.amount,
      currency: paymentConfig.currency || "ETB",
      ...paymentData,
      timestamp: new Date().toISOString(),
    });
  };

  return (
    <div className="space-y-4">
      <div className="p-4 bg-muted rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-foreground">Amount to Pay</p>
            <p className="text-2xl font-bold">
              {paymentConfig.amount} {paymentConfig.currency || "ETB"}
            </p>
          </div>
          <DollarSign className="w-8 h-8 text-green-500" />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Payment Method</Label>
        <Select value={paymentMethod} onValueChange={setPaymentMethod}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(paymentConfig.methods || {}).map(
              ([method, methodConfig]) => (
                <SelectItem key={method} value={method}>
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    {method.charAt(0).toUpperCase() + method.slice(1)}
                  </div>
                </SelectItem>
              ),
            )}
          </SelectContent>
        </Select>
      </div>

      {paymentMethod === "chapa" && (
        <div className="space-y-2">
          <Label>Email (for receipt)</Label>
          <Input
            type="email"
            placeholder="your@email.com"
            onChange={(e) =>
              setPaymentData({ ...paymentData, email: e.target.value })
            }
          />
        </div>
      )}

      <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full">
        {isSubmitting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          `Pay ${paymentConfig.amount} ${paymentConfig.currency || "ETB"}`
        )}
      </Button>
    </div>
  );
};

const TaskRequirementsRenderer = ({ task, onComplete, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const requirements = task.requirements;

  const handleFormSubmit = async (formData, files) => {
    setIsSubmitting(true);
    try {
      // Upload files if any
      const uploadedFiles = {};
      for (const [field, file] of Object.entries(files)) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/v1/upload", {
          method: "POST",
          body: formData,
        });
        if (res.ok) {
          const { url } = await res.json();
          uploadedFiles[field] = url;
        }
      }

      const submissions = {
        ...formData,
        uploadedFiles,
        completedAt: new Date().toISOString(),
      };

      await onComplete(submissions);
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to submit");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentSubmit = async (paymentData) => {
    setIsSubmitting(true);
    try {
      // Process payment
      const res = await RequestHandler.Post("/api/v1/payment/initialize", {
        body: paymentData,
      });

      if (res.ok) {
        const { paymentUrl, reference } = await res.json();
        // Store payment reference
        await onComplete({ paymentReference: reference, status: "pending" });
        // Redirect to payment gateway
        window.location.href = paymentUrl;
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if requirements contain payment
  if (requirements?.payment) {
    return (
      <PaymentForm
        paymentConfig={requirements.payment}
        onSubmit={handlePaymentSubmit}
        isSubmitting={isSubmitting}
      />
    );
  }

  // Check if requirements contain form
  if (requirements?.form) {
    return (
      <DynamicForm
        requirements={requirements.form}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
      />
    );
  }

  return null;
};

// Task status badges
const statusConfig = {
  pending: { label: "Pending", variant: "secondary", icon: Clock },
  active: { label: "In Progress", variant: "default", icon: PlayCircle },
  completed: { label: "Completed", variant: "success", icon: CheckCircle },
  blocked: { label: "Blocked", variant: "destructive", icon: AlertCircle },
  cancelled: { label: "Cancelled", variant: "outline", icon: XCircle },
};

export default function TasksPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [employments, setEmployments] = useState([]);
  const [userRole, setUserRole] = useState(null);

  // View & Filter States
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState("table");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [employeeFilter, setEmployeeFilter] = useState("all");

  // Dialog States
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isRequirementsOpen, setIsRequirementsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [updateForm, setUpdateForm] = useState({
    status: "",
    requirements: null,
    isDone: false,
  });

  // Add to your TasksPage component state:
  const [isCreateNextTaskOpen, setIsCreateNextTaskOpen] = useState(false);
  const [selectedTaskForNext, setSelectedTaskForNext] = useState(null);

  // Get user role on mount
  useEffect(() => {
    const getUserRole = async () => {
      try {
        const res = await RequestHandler.Get("/query/v1/user?mine");
        if (res.ok) {
          const { users } = await res.json();
          if (users?.[0]) {
            setUserRole(users[0].role);
          }
        }
      } catch (error) {
        console.error("Failed to get user role:", error);
      }
    };
    getUserRole();
  }, []);

  // Fetch employments for filter (only for admins)
  useEffect(() => {
    const fetchEmployments = async () => {
      try {
        const res = await RequestHandler.Get("/query/v1/employee?mine");
        if (res.ok) {
          const { employees } = await res.json();
          setEmployments(employees || []);
        }
      } catch (error) {
        console.error("Failed to fetch employments:", error);
      }
    };

    if (userRole === "organization_admin" || userRole === "super_admin") {
      fetchEmployments();
    }
  }, [userRole]);

  // Fetch tasks with filters
  const fetchTasks = useCallback(async () => {
    if (!userRole) return;

    setIsLoading(true);
    const offset = (page - 1) * limit;
    const ilike = config.prodDatabase ? "ilike" : "like";

    let filters = [];
    if (statusFilter !== "all") {
      filters.push(`~status=${statusFilter}`);
    }
    if (employeeFilter !== "all" && employeeFilter) {
      filters.push(`~employeeId=${employeeFilter}`);
    }
    if (searchQuery) {
      filters.push(
        searchQuery
          .split(/\s,/g)
          .map(
            (q) =>
              `~client.firstname.${ilike}=%${q}%|~client.lastname.${ilike}=%${q}%|~service.name.${ilike}=%${q}%`,
          )
          .join("|"),
      );
    }

    const filterString = filters.length > 0 ? `&${filters.join("&")}` : "";
    const sortString = `&order=["${sortBy}.${sortOrder}"]`;
    const url = `/query/v1/task?offset=${offset}&limit=${limit}${filterString}${sortString}`;

    try {
      const res = await RequestHandler.Get(encodeURI(url));
      if (res.ok) {
        const { tasks: taskList, count } = await res.json();
        setTasks(taskList || []);
        setTotalCount(count || 0);
      }
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      toast.error("Failed to load tasks");
    } finally {
      setIsLoading(false);
    }
  }, [
    page,
    limit,
    statusFilter,
    searchQuery,
    sortBy,
    sortOrder,
    employeeFilter,
    userRole,
  ]);

  useEffect(() => {
    if (userRole) {
      fetchTasks();
    }
  }, [fetchTasks, userRole]);

  const handleCompleteRequirements = async (submissions) => {
    setIsSubmitting(true);
    try {
      const res = await RequestHandler.Patch(`/query/v1/task?mine`, {
        body: {
          id: selectedTask.id,
          submissions: { ...selectedTask.submissions, ...submissions },
          status: "completed",
          isDone: true,
        },
      });

      if (res.ok) {
        toast.success("Task completed successfully!");
        setIsRequirementsOpen(false);
        setSelectedTask(null);
        fetchTasks();
      } else {
        const error = await res.json();
        toast.error(error.message || "Failed to complete task");
      }
    } catch (error) {
      console.error("Failed to complete task:", error);
      toast.error("Failed to complete task");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateTask = async () => {
    setIsSubmitting(true);
    try {
      const res = await RequestHandler.Patch(
        `/query/v1/task?mine&~id=${selectedTask.id}`,
        {
          body: {
            status: updateForm.status,
            requirements: updateForm.requirements,
            isDone: updateForm.status === "completed",
          },
        },
      );

      if (res.ok) {
        toast.success("Task updated successfully");
        setIsUpdateOpen(false);
        setSelectedTask(null);
        fetchTasks();
      }
    } catch (error) {
      console.error("Failed to update task:", error);
      toast.error("Failed to update task");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTask = async () => {
    setIsSubmitting(true);
    try {
      const res = await RequestHandler.Delete(
        `/query/v1/task?mine&~id=${selectedTask.id}`,
      );
      if (res.ok) {
        toast.success("Task deleted successfully");
        setIsDeleteOpen(false);
        setSelectedTask(null);
        fetchTasks();
      }
    } catch (error) {
      console.error("Failed to delete task:", error);
      toast.error("Failed to delete task");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openView = (task) => {
    setSelectedTask(task);
    setIsViewOpen(true);
  };

  const openRequirements = (task) => {
    setSelectedTask(task);
    setIsRequirementsOpen(true);
  };

  const openUpdate = (task) => {
    setSelectedTask(task);
    setUpdateForm({
      status: task.status,
      requirements: task.requirements || {},
      isDone: task.isDone,
    });
    setIsUpdateOpen(true);
  };

  const openDelete = (task) => {
    setSelectedTask(task);
    setIsDeleteOpen(true);
  };

  const getStatusBadge = (status, isDone) => {
    if (isDone && status !== "completed") {
      return (
        <Badge variant="success" className="gap-1">
          <CheckCircle className="h-3 w-3" />
          Done
        </Badge>
      );
    }
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  // Add to your TasksPage component state:
  const [isRequirementsBuilderOpen, setIsRequirementsBuilderOpen] =
    useState(false);

  // Add the handler:
  const handleSaveRequirements = async (requirements) => {
    const res = await RequestHandler.Patch(
      `/query/v1/task?mine&~id=${selectedTask.id}`,
      {
        body: {
          requirements: requirements,
        },
      },
    );

    if (res.ok) {
      toast.success("Requirements saved successfully");
      console.log(await res.json());
      fetchTasks();
      return true;
    } else {
      toast.error("Failed to save requirements");
      throw new Error("Failed to save");
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return format(new Date(date), "MMM dd, yyyy h:mm a");
  };

  const isAdmin =
    userRole === "organization_admin" || userRole === "super_admin";
  const totalPages = Math.ceil(totalCount / limit);

  // Check if task has pending requirements
  const hasPendingRequirements = (task) => {
    return (
      task.requirements &&
      (!task.submissions || Object.keys(task.submissions).length === 0)
    );
  };

  if (!userRole) {
    return (
      <div className="h-64 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-foreground" />
      </div>
    );
  }

  const pendingCount = tasks.filter(
    (t) => t.status === "pending" && !t.isDone,
  ).length;
  const activeCount = tasks.filter((t) => t.status === "active").length;
  const completedCount = tasks.filter(
    (t) => t.status === "completed" || t.isDone,
  ).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-sm text-muted-foreground">
            {isAdmin
              ? "Manage all organization tasks"
              : "Manage your assigned tasks"}
          </p>
        </div>
        {/* {
          <Button onClick={() => setIsCreateTaskOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Task
          </Button>
        } */}
      </div>
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground">Total Tasks</p>
                <p className="text-2xl font-bold">{totalCount}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground">Pending</p>
                <p className="text-2xl font-bold">{pendingCount}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground">In Progress</p>
                <p className="text-2xl font-bold">{activeCount}</p>
              </div>
              <PlayCircle className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground">Completed</p>
                <p className="text-2xl font-bold">{completedCount}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Toolbar */}
      <Card className="p-3 bg-muted/20 border-none shadow-none">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex flex-1 items-center gap-3 flex-wrap">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="active">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="blocked">Blocked</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            {isAdmin && employments.length > 0 && (
              <Select value={employeeFilter} onValueChange={setEmployeeFilter}>
                <SelectTrigger className="w-[220px] bg-background">
                  <Filter className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                  <SelectValue placeholder="Filter by Employee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Employees</SelectItem>
                  {employments.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.user?.firstname} {emp.user?.lastname} -{" "}
                      {emp.jobTitle}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[160px] bg-background">
                <ArrowUpDown className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">Created Date</SelectItem>
                <SelectItem value="startTime">Start Time</SelectItem>
                <SelectItem value="endTime">End Time</SelectItem>
                <SelectItem value="status">Status</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="icon"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="h-10 w-10"
            >
              {sortOrder === "asc" ? "↑" : "↓"}
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
      ) : tasks.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center border rounded bg-card gap-4">
          <Clock className="h-12 w-12 text-muted-foreground" />
          <p className="text-muted-foreground">No tasks found</p>
        </div>
      ) : view === "table" ? (
        <div className="rounded border bg-card overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/30 uppercase">
              <TableRow>
                <TableHead className="font-bold">Task / Service</TableHead>
                <TableHead className="font-bold">Client</TableHead>
                <TableHead className="font-bold">Status</TableHead>
                <TableHead className="font-bold">Timeline</TableHead>
                <TableHead className="text-right font-bold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell
                    onClick={() =>
                      router.push(`/dashboard/employee/task/${task.id}`)
                    }
                    className="cursor-pointer"
                  >
                    <div className="font-semibold text-primary">
                      {task.name || "Untitled Task"} / {task.service?.name}
                    </div>
                    {task.service?.description && (
                      <div className="text-sm text-foreground">
                        {task.service.description}
                      </div>
                    )}
                    <div className="text-muted-foreground">{task.name}</div>
                  </TableCell>
                  <TableCell>
                    {task.client ? (
                      <div>
                        {`${task.client.gender === "F" ? "Mrs." : "Mr."} ${task.client.firstname} ${task.client.lastname}`}
                      </div>
                    ) : (
                      <span className="text-foreground text-sm">N/A</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(task.status, task.isDone)}

                    {hasPendingRequirements(task) && (
                      <Badge variant="outline" className="mt-1 gap-1">
                        <FileText className="h-3 w-3" />
                        Requirements Pending
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-xs space-y-1">
                      {task.appointment?.startTime && (
                        <div>
                          Start: {formatDate(task.appointment.startTime)}
                        </div>
                      )}
                      {task.appointment?.endTime && (
                        <div>End: {formatDate(task.appointment.endTime)}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openView(task)}>
                          <Eye className="mr-2 h-4 w-4" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedTask(task);
                            setIsRequirementsBuilderOpen(true);
                          }}
                        >
                          <FileText className="mr-2 h-4 w-4" /> Set Requirements
                        </DropdownMenuItem>
                        {/* {hasPendingRequirements(task) && (
                          <DropdownMenuItem
                            onClick={() => openRequirements(task)}
                          >
                            <FileText className="mr-2 h-4 w-4" /> Complete
                            Requirements
                          </DropdownMenuItem>
                        )} */}
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedTaskForNext(task);
                            setIsCreateNextTaskOpen(true);
                          }}
                        >
                          <Plus className="mr-2 h-4 w-4" /> Create Next Task
                        </DropdownMenuItem>
                        {!task.isDone && task.status !== "completed" && (
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedTaskForNext(task);
                              setIsCreateNextTaskOpen(true);
                            }}
                          >
                            <Plus className="mr-2 h-4 w-4" /> Create Follow-up
                            Task
                          </DropdownMenuItem>
                        )}
                        {!task.isDone && task.status !== "completed" && (
                          <DropdownMenuItem onClick={() => openUpdate(task)}>
                            <PlayCircle className="mr-2 h-4 w-4" /> Update
                            Status
                          </DropdownMenuItem>
                        )}
                        {isAdmin && (
                          <DropdownMenuItem
                            onClick={() => openDelete(task)}
                            className="text-destructive"
                          >
                            <XCircle className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <Card
              key={task.id}
              className="bg-background shadow-md group flex flex-col"
            >
              <CardHeader className="pb-3 border-b bg-muted/5">
                <div className="flex items-start justify-between">
                  <CardTitle className="font-bold text-primary truncate pr-4">
                    {task.name || "Untitled Task"} / {task.service?.name}
                  </CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openView(task)}>
                        <Eye className="mr-2 h-4 w-4" /> View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedTask(task);
                          setIsRequirementsBuilderOpen(true);
                        }}
                      >
                        <FileText className="mr-2 h-4 w-4" /> Set Requirements
                      </DropdownMenuItem>
                      {hasPendingRequirements(task) && (
                        <DropdownMenuItem
                          onClick={() => openRequirements(task)}
                        >
                          <FileText className="mr-2 h-4 w-4" /> Complete
                          Requirements
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  {getStatusBadge(task.status, task.isDone)}
                  {hasPendingRequirements(task) && (
                    <Badge variant="outline" className="gap-1">
                      <FileText className="h-3 w-3" />
                      Pending
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex-grow space-y-3 pt-4">
                {task.service?.description && (
                  <p className="text-sm text-foreground">
                    {task.service.description}
                  </p>
                )}
                <div className="pt-2 border-t">
                  <p className="text-xs font-medium text-foreground">Client:</p>
                  {task.client ? (
                    <p className="text-sm">
                      {`${task.client.gender === "F" ? "Mrs." : "Mr."} ${task.client.firstname} ${task.client.lastname}`}
                    </p>
                  ) : (
                    <p className="text-sm text-foreground">N/A</p>
                  )}
                </div>
                {task.appointment?.startTime && (
                  <div className="flex justify-between text-xs text-foreground">
                    <span>Start: {formatDate(task.appointment.startTime)}</span>
                    <span>End: {formatDate(task.appointment.endTime)}</span>
                  </div>
                )}
              </CardContent>
              <CardFooter className="pt-4 border-t flex justify-between items-center bg-muted/5">
                <span className="text-[10px] font-mono text-foreground">
                  ID: {task.id?.slice(0, 8)}...
                </span>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      {/* Pagination */}
      {totalCount > limit && (
        <div className="flex items-center justify-between px-4 py-4 border rounded bg-card">
          <div className="flex items-center gap-6">
            <div className="text-sm text-foreground">
              Showing {(page - 1) * limit + 1} to{" "}
              {Math.min(page * limit, totalCount)} of {totalCount}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-foreground">Rows:</span>
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
                  {[5, 10, 20, 50].map((size) => (
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
      )}
      {/* Requirements Dialog */}
      <Dialog open={isRequirementsOpen} onOpenChange={setIsRequirementsOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Complete Task Requirements</DialogTitle>
            <DialogDescription>
              Please provide the required information to complete this task.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <TaskRequirementsRenderer
              task={selectedTask}
              onComplete={handleCompleteRequirements}
              onClose={() => setIsRequirementsOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
      {/* Other Dialogs remain the same... */}
      {/* View Task Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Task Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Service</Label>
              <p className="text-sm font-medium">
                {selectedTask?.service?.name || "N/A"}
              </p>
            </div>
            <div>
              <Label>Description</Label>
              <p className="text-sm">
                {selectedTask?.service?.description || "N/A"}
              </p>
            </div>
            <div>
              <Label>Client</Label>
              {selectedTask?.client && (
                <p className="text-sm">
                  {`${selectedTask.client.gender === "F" ? "Mrs." : "Mr."} ${selectedTask.client.firstname} ${selectedTask.client.lastname}`}
                </p>
              )}
            </div>
            <div>
              <Label>Status</Label>
              <div className="mt-1">
                {selectedTask &&
                  getStatusBadge(selectedTask.status, selectedTask.isDone)}
              </div>
            </div>
            {selectedTask?.submissions &&
              Object.keys(selectedTask.submissions).length > 0 && (
                <div>
                  <Label>Submissions</Label>
                  <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-auto max-h-40">
                    {JSON.stringify(selectedTask.submissions, null, 2)}
                  </pre>
                </div>
              )}
          </div>
          <DialogFooter>
            <Button onClick={() => setIsViewOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Update Task Dialog */}
      <Dialog open={isUpdateOpen} onOpenChange={setIsUpdateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={updateForm.status}
                onValueChange={(v) =>
                  setUpdateForm({ ...updateForm, status: v })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="active">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUpdateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateTask} disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Update"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/*  */}
      <CreateNextTaskDialog
        open={isCreateNextTaskOpen}
        onOpenChange={setIsCreateNextTaskOpen}
        currentTask={selectedTaskForNext}
        onTaskCreated={fetchTasks}
      />

      {/*  */}
      <RequirementsBuilderDialog
        open={isRequirementsBuilderOpen}
        onOpenChange={setIsRequirementsBuilderOpen}
        task={selectedTask}
        onSave={handleSaveRequirements}
      />

      {/* Delete Task Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Task</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this task? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteTask}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Requirements Builder Dialog Component
const RequirementsBuilderDialog = ({ open, onOpenChange, task, onSave }) => {
  const [requirements, setRequirements] = useState({
    form: {},
    payment: null,
  });
  const [activeTab, setActiveTab] = useState("form");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Common MIME type options
  const mimeTypeOptions = [
    {
      label: "Images (JPEG, PNG)",
      value: "image/jpeg, image/png",
      types: ["image/jpeg", "image/png"],
    },
    { label: "Images (All)", value: "image/*", types: ["image/*"] },
    {
      label: "Documents (PDF)",
      value: "application/pdf",
      types: ["application/pdf"],
    },
    {
      label: "Documents (Word)",
      value:
        "application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      types: [
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ],
    },
    {
      label: "Documents (Excel)",
      value:
        "application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      types: [
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ],
    },
    {
      label: "Documents (All)",
      value:
        "application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      types: [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ],
    },
    {
      label: "Videos",
      value: "video/mp4, video/mpeg, video/quicktime",
      types: ["video/mp4", "video/mpeg", "video/quicktime"],
    },
    {
      label: "Audio",
      value: "audio/mpeg, audio/wav, audio/ogg",
      types: ["audio/mpeg", "audio/wav", "audio/ogg"],
    },
    { label: "Any File", value: "*/*", types: ["*/*"] },
  ];

  // Load existing requirements when task changes
  useEffect(() => {
    if (task?.requirements) {
      (async () =>
        setRequirements({
          form: task.requirements.form || {},
          payment: task.requirements.payment || null,
        }))();
    }
  }, [task]);

  // Get preset label for existing accept types
  const getAcceptPreset = (acceptArray) => {
    if (!acceptArray || acceptArray.length === 0) return "";
    const acceptString = acceptArray.join(", ");
    const preset = mimeTypeOptions.find((opt) => opt.value === acceptString);
    return preset ? preset.value : "custom";
  };

  // Form field handlers
  const addFormField = () => {
    const fieldName = prompt("Enter field name (e.g., national-id):");
    if (!fieldName) return;

    const fieldType = "text";

    const isOptional = false;

    const newField = {
      type: fieldType,
      optional: !isOptional,
    };

    if (fieldType === "text") {
      newField.placeholder = "";
      newField.description = "";
    }

    if (fieldType === "file") {
      newField.accept = ["image/jpeg", "image/png"];
      newField.maxSize = 2 * 1024 * 1024;
      newField.multiple = false;
    }

    setRequirements({
      ...requirements,
      form: {
        ...requirements.form,
        [fieldName]: newField,
      },
    });
  };

  const removeFormField = (fieldName) => {
    const newForm = { ...requirements.form };
    delete newForm[fieldName];
    setRequirements({ ...requirements, form: newForm });
  };

  const updateFormField = (fieldName, key, value) => {
    setRequirements({
      ...requirements,
      form: {
        ...requirements.form,
        [fieldName]: {
          ...requirements.form[fieldName],
          [key]: value,
        },
      },
    });
  };

  const handleMimeTypeChange = (fieldName, presetValue) => {
    if (presetValue === "custom") {
      // Allow custom input
      const customTypes = prompt(
        "Enter custom MIME types (comma-separated):",
        "",
      );
      if (customTypes) {
        const types = customTypes.split(",").map((s) => s.trim());
        updateFormField(fieldName, "accept", types);
      }
    } else {
      const selectedOption = mimeTypeOptions.find(
        (opt) => opt.value === presetValue,
      );
      if (selectedOption) {
        updateFormField(fieldName, "accept", selectedOption.types);
      }
    }
  };

  // Payment handlers
  const enablePayment = () => {
    const amount = 100;
    const currency = "ETB";

    setRequirements({
      ...requirements,
      payment: {
        amount,
        currency,
        reason: "Service Fee",
        methods: {
          chapa: {
            enabled: true,
          },
        },
      },
    });
  };

  const disablePayment = () => {
    setRequirements({ ...requirements, payment: null });
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      const finalRequirements = {};
      if (Object.keys(requirements.form).length > 0) {
        finalRequirements.form = requirements.form;
      }
      if (requirements.payment) {
        finalRequirements.payment = requirements.payment;
      }

      await onSave(finalRequirements);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to save requirements:", error);
      toast.error("Failed to save requirements");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Configure Task Requirements</DialogTitle>
          <DialogDescription>
            Set up requirements that need to be completed before the task can be
            marked as done.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="form">Form Fields</TabsTrigger>
            <TabsTrigger value="payment">Payment</TabsTrigger>
          </TabsList>

          {/* Form Fields Tab */}
          <TabsContent value="form" className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Form Fields</Label>
              <Button size="sm" onClick={addFormField}>
                <FileText className="h-4 w-4 mr-1" />
                Add Field
              </Button>
            </div>

            {Object.keys(requirements.form).length === 0 ? (
              <div className="text-center py-8 text-foreground border-2 border-dashed rounded-lg">
                <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No form fields added yet</p>
                <p className="text-sm">
                  Click "Add Field" to create form requirements
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(requirements.form).map(
                  ([fieldName, config]) => (
                    <Card key={fieldName} className="relative">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-base">
                            {fieldName}
                          </CardTitle>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => removeFormField(fieldName)}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label className="text-xs">Type</Label>
                            <Select
                              value={config.type}
                              onValueChange={(v) =>
                                updateFormField(fieldName, "type", v)
                              }
                            >
                              <SelectTrigger className="h-8 text-foreground">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="text">Text</SelectItem>
                                <SelectItem value="number">Number</SelectItem>
                                <SelectItem value="textarea">
                                  Textarea
                                </SelectItem>
                                <SelectItem value="file">
                                  File Upload
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-1">
                            <Label className="text-xs">Required</Label>
                            <Switch
                              checked={!config.optional}
                              onCheckedChange={(v) =>
                                updateFormField(fieldName, "optional", !v)
                              }
                            />
                          </div>
                        </div>

                        {config.type === "text" && (
                          <>
                            <div className="space-y-1">
                              <Label className="text-xs">Placeholder</Label>
                              <Input
                                value={config.placeholder || ""}
                                onChange={(e) =>
                                  updateFormField(
                                    fieldName,
                                    "placeholder",
                                    e.target.value,
                                  )
                                }
                                className="h-8"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Description</Label>
                              <Input
                                value={config.description || ""}
                                onChange={(e) =>
                                  updateFormField(
                                    fieldName,
                                    "description",
                                    e.target.value,
                                  )
                                }
                                className="h-8"
                              />
                            </div>
                          </>
                        )}

                        {config.type === "number" && (
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <Label className="text-xs">Min Value</Label>
                              <Input
                                type="number"
                                value={config.min || ""}
                                onChange={(e) =>
                                  updateFormField(
                                    fieldName,
                                    "min",
                                    parseFloat(e.target.value),
                                  )
                                }
                                className="h-8"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Max Value</Label>
                              <Input
                                type="number"
                                value={config.max || ""}
                                onChange={(e) =>
                                  updateFormField(
                                    fieldName,
                                    "max",
                                    parseFloat(e.target.value),
                                  )
                                }
                                className="h-8"
                              />
                            </div>
                          </div>
                        )}

                        {config.type === "textarea" && (
                          <>
                            <div className="space-y-1">
                              <Label className="text-xs">Rows</Label>
                              <Input
                                type="number"
                                value={config.rows || 4}
                                onChange={(e) =>
                                  updateFormField(
                                    fieldName,
                                    "rows",
                                    parseInt(e.target.value),
                                  )
                                }
                                className="h-8"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Placeholder</Label>
                              <Input
                                value={config.placeholder || ""}
                                onChange={(e) =>
                                  updateFormField(
                                    fieldName,
                                    "placeholder",
                                    e.target.value,
                                  )
                                }
                                className="h-8"
                              />
                            </div>
                          </>
                        )}

                        {config.type === "file" && (
                          <>
                            <div className="space-y-1">
                              <Label className="text-xs">
                                Accepted File Types
                              </Label>
                              <Select
                                value={getAcceptPreset(config.accept)}
                                onValueChange={(v) =>
                                  handleMimeTypeChange(fieldName, v)
                                }
                              >
                                <SelectTrigger className="h-8">
                                  <SelectValue placeholder="Select file types" />
                                </SelectTrigger>
                                <SelectContent>
                                  {mimeTypeOptions.map((option) => (
                                    <SelectItem
                                      key={option.value}
                                      value={option.value}
                                    >
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                  <SelectItem value="custom">
                                    Custom (enter manually)
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Show current accept types as badges */}
                            {config.accept &&
                              config.accept.length > 0 &&
                              config.accept[0] !== "*/*" && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {config.accept.map((type, idx) => (
                                    <Badge
                                      key={idx}
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      {type}
                                    </Badge>
                                  ))}
                                </div>
                              )}

                            <div className="space-y-1">
                              <Label className="text-xs">
                                Max File Size (MB)
                              </Label>
                              <Input
                                type="number"
                                step="0.5"
                                value={
                                  config.maxSize
                                    ? config.maxSize / (1024 * 1024)
                                    : 2
                                }
                                onChange={(e) =>
                                  updateFormField(
                                    fieldName,
                                    "maxSize",
                                    parseFloat(e.target.value) * 1024 * 1024,
                                  )
                                }
                                className="h-8"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Allow Multiple</Label>
                              <Switch
                                checked={config.multiple || false}
                                onCheckedChange={(v) =>
                                  updateFormField(fieldName, "multiple", v)
                                }
                              />
                            </div>
                          </>
                        )}
                      </CardContent>
                    </Card>
                  ),
                )}
              </div>
            )}
          </TabsContent>

          {/* Payment Tab */}
          <TabsContent value="payment" className="space-y-4">
            {!requirements.payment ? (
              <div className="text-center py-8 border-2 border-dashed rounded-lg">
                <DollarSign className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="mb-4">No payment requirement set</p>
                <Button onClick={enablePayment}>
                  <DollarSign className="h-4 w-4 mr-1" />
                  Enable Payment
                </Button>
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Payment Configuration</CardTitle>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={disablePayment}
                    >
                      Remove Payment
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label>Amount</Label>
                      <Input
                        type="number"
                        value={requirements.payment.amount}
                        onChange={(e) =>
                          setRequirements({
                            ...requirements,
                            payment: {
                              ...requirements.payment,
                              amount: parseFloat(e.target.value),
                            },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>Currency</Label>
                      <Input
                        value={requirements.payment.currency}
                        onChange={(e) =>
                          setRequirements({
                            ...requirements,
                            payment: {
                              ...requirements.payment,
                              currency: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label>Payment Reason</Label>
                    <Input
                      value={requirements.payment.reason || ""}
                      onChange={(e) =>
                        setRequirements({
                          ...requirements,
                          payment: {
                            ...requirements.payment,
                            reason: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Payment Methods</Label>
                    <div className="space-y-2">
                      {requirements.payment.methods?.chapa && (
                        <div className="flex items-center justify-between p-2 border rounded">
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            <span>Chapa</span>
                          </div>
                          <Switch
                            checked={requirements.payment.methods.chapa.enabled}
                            onCheckedChange={(v) =>
                              setRequirements({
                                ...requirements,
                                payment: {
                                  ...requirements.payment,
                                  methods: {
                                    ...requirements.payment.methods,
                                    chapa: { enabled: v },
                                  },
                                },
                              })
                            }
                          />
                        </div>
                      )}
                      {/* Add more payment methods as needed */}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Save Requirements"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Task Creation Form Component (for creating next task in chain)
const CreateNextTaskDialog = ({
  open,
  onOpenChange,
  currentTask,
  onTaskCreated,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [employments, setEmployments] = useState([]);
  const [availableSubmissions, setAvailableSubmissions] = useState({});
  const [selectedForwardFields, setSelectedForwardFields] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    assignedTo: "",
    startTime: "",
    endTime: "",
    requirements: null,
    forwardSubmissions: {},
  });

  // Fetch employees for the organization
  const fetchEmployees = async (organizationId) => {
    if (!organizationId) throw new Error("null organizationId");
    try {
      const res = await RequestHandler.Get(
        `/query/v1/employee?~organizationId=${organizationId}`,
      );
      if (res.ok) {
        const { employees } = await res.json();
        // Filter out the current employee if needed
        setEmployments(employees || []);
      }
    } catch (error) {
      console.error("Failed to fetch employees:", error);
    }
  };

  // Load current task data and available submissions
  useEffect(() => {
    if (open && currentTask) {
      // Extract submissions from current task to forward
      if (currentTask.submissions) {
        const flattened = {};
        const flattenObject = (obj, prefix = "") => {
          for (const key in obj) {
            if (
              typeof obj[key] === "object" &&
              obj[key] !== null &&
              !(obj[key] instanceof File)
            ) {
              flattenObject(obj[key], `${prefix}${key}.`);
            } else {
              flattened[`${prefix}${key}`] = obj[key];
            }
          }
        };
        flattenObject(currentTask.submissions);
        setAvailableSubmissions(flattened);
      }

      // Pre-fill task name based on current task
      setFormData((prev) => ({
        ...prev,
        name: `Next: ${currentTask.name || currentTask.appointment?.service?.name || "Task"}`,
        description: `Continuation of task ${currentTask.id}`,
      }));

      // Fetch available employees from the same organization
      fetchEmployees(currentTask.service.organizationId);
    }
  }, [open, currentTask]);

  // Toggle field selection for forwarding
  const toggleForwardField = (fieldPath, fieldValue) => {
    setSelectedForwardFields((prev) => {
      const newState = { ...prev, [fieldPath]: !prev[fieldPath] };

      // Build forwardSubmissions object
      const forwardData = {};
      Object.keys(newState).forEach((path) => {
        if (newState[path]) {
          const keys = path.split(".");
          let current = forwardData;
          for (let i = 0; i < keys.length - 1; i++) {
            if (!current[keys[i]]) current[keys[i]] = {};
            current = current[keys[i]];
          }
          current[keys[keys.length - 1]] = availableSubmissions[path];
        }
      });

      setFormData((prev) => ({ ...prev, forwardSubmissions: forwardData }));
      return newState;
    });
  };

  const handleSubmit = async () => {
    if (!formData.assignedTo) {
      toast.error("Please select an assignee");
      return;
    }

    setIsSubmitting(true);
    try {
      // Step 1: Create the new task linked to the current task
      const newTaskData = {
        appointmentId: currentTask.appointmentId,
        employeeId: formData.assignedTo,
        organizationId: currentTask.organizationId,
        previousTaskId: currentTask.id, // Link to current task as previous
        name: formData.name || `Next: ${currentTask.name}`,
        description: formData.description,
        startTime: formData.startTime
          ? new Date(formData.startTime).toISOString()
          : null,
        endTime: formData.endTime
          ? new Date(formData.endTime).toISOString()
          : null,
        requirements: formData.requirements,
      };

      // If forwarding submissions, include them
      if (Object.keys(formData.forwardSubmissions).length > 0) {
        newTaskData.submissions = formData.forwardSubmissions;
      }

      const createRes = await RequestHandler.Post("/query/v1/task", {
        body: newTaskData,
      });

      if (!createRes.ok) {
        const error = await createRes.json();
        throw new Error(error.message || "Failed to create next task");
      }

      const {
        tasks: [newTask],
      } = await createRes.json();

      // Step 2: Mark the current task as completed
      const updateRes = await RequestHandler.Patch(
        `/query/v1/task?~id=${currentTask.id}`,
        {
          body: {
            status: "completed",
            isDone: true,
            nextTaskId: newTask.id, // Link to the next task
          },
        },
      );

      if (!updateRes.ok) {
        // If marking complete fails, log but don't rollback (user can manually complete)
        console.error("Failed to mark current task as complete");
        toast.warning(
          "Next task created but current task could not be auto-completed",
        );
      } else {
        toast.success("Task completed and next task created successfully!");
      }

      onTaskCreated?.();
      onOpenChange(false);

      // Reset form
      setFormData({
        name: "",
        description: "",
        assignedTo: "",
        startTime: "",
        endTime: "",
        requirements: null,
        forwardSubmissions: {},
      });
      setSelectedForwardFields({});
    } catch (error) {
      console.error("Failed to create next task:", error);
      toast.error(error.message || "Failed to create next task");
    } finally {
      setIsSubmitting(false);
    }
  };

  const requirementTemplates = {
    approval: {
      type: "form",
      form: {
        "approval-notes": {
          type: "textarea",
          optional: false,
          placeholder: "Enter approval notes...",
          description: "Please provide any additional notes for approval",
        },
      },
    },
    review: {
      type: "form",
      form: {
        "review-comments": {
          type: "textarea",
          optional: false,
          placeholder: "Enter review comments...",
          description: "Please review the work and provide feedback",
        },
        rating: {
          type: "number",
          optional: true,
          min: 1,
          max: 5,
          description: "Rate the work (1-5)",
        },
      },
    },
    document: {
      type: "form",
      form: {
        document: {
          type: "file",
          optional: false,
          accept: ["application/pdf", "image/jpeg", "image/png"],
          maxSize: 5 * 1024 * 1024,
          description: "Upload the required document",
        },
      },
    },
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Next Task</DialogTitle>
          <DialogDescription>
            Create a follow-up task and assign it to another employee. The
            current task will be marked as complete.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Current Task Info */}
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm font-medium mb-1">Previous Task</p>
            <p className="text-sm">
              {currentTask?.name || currentTask?.appointment?.service?.name}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              This will be linked as the previous task in the chain
            </p>
          </div>

          <Separator />

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Next Task Details</h3>

            <div className="space-y-2">
              <Label>Task Name</Label>
              <Input
                placeholder="Enter task name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Enter task description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Time (Optional)</Label>
                <Input
                  type="datetime-local"
                  value={formData.startTime}
                  onChange={(e) =>
                    setFormData({ ...formData, startTime: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>End Time (Optional)</Label>
                <Input
                  type="datetime-local"
                  value={formData.endTime}
                  onChange={(e) =>
                    setFormData({ ...formData, endTime: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Forward Submissions from Current Task */}
          {Object.keys(availableSubmissions).length > 0 && (
            <>
              <div className="space-y-4">
                <h3 className="text-sm font-semibold">Forward Submissions</h3>
                <p className="text-xs text-muted-foreground">
                  Select which data from the completed task to forward to the
                  next task
                </p>
                <div className="space-y-2 border rounded-lg p-4 max-h-60 overflow-y-auto">
                  {Object.entries(availableSubmissions).map(
                    ([fieldPath, value]) => (
                      <div
                        key={fieldPath}
                        className="flex items-center justify-between p-2 border rounded"
                      >
                        <div className="flex-1">
                          <div className="text-sm font-medium">{fieldPath}</div>
                          <div className="text-xs text-muted-foreground truncate max-w-md">
                            {typeof value === "object"
                              ? JSON.stringify(value).slice(0, 50)
                              : String(value).slice(0, 50)}
                          </div>
                        </div>
                        <Switch
                          checked={selectedForwardFields[fieldPath] || false}
                          onCheckedChange={() =>
                            toggleForwardField(fieldPath, value)
                          }
                        />
                      </div>
                    ),
                  )}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Assignment */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Assign To</h3>

            <div className="space-y-2">
              <Label>Select Employee</Label>
              <Select
                value={formData.assignedTo}
                onValueChange={(v) =>
                  setFormData({ ...formData, assignedTo: v })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an employee" />
                </SelectTrigger>
                <SelectContent>
                  {employments.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.user?.firstname} {emp.user?.lastname} -{" "}
                      {emp.jobTitle}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* Requirements Template */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Requirements (Optional)</h3>

            <div className="space-y-2">
              <Label>Use Template</Label>
              <Select
                onValueChange={(v) => {
                  if (v === "none") {
                    setFormData({ ...formData, requirements: null });
                  } else {
                    setFormData({
                      ...formData,
                      requirements: requirementTemplates[v],
                    });
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a requirement template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="approval">Approval Required</SelectItem>
                  <SelectItem value="review">Review Required</SelectItem>
                  <SelectItem value="document">Document Upload</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Create & Complete Current Task"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
