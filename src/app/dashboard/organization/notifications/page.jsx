// src/app/dashboard/notifications/page.jsx
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Bell,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  Briefcase,
  CreditCard,
  Star,
  Loader2,
  Trash2,
  CheckCheck,
  User,
  UserPlus,
  UserMinus,
  Building2,
  MessageCircle,
  Settings,
  Send,
  Filter,
  Search,
  RefreshCw,
  Eye,
  AlertCircle,
  Archive,
  ArchiveRestore,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import RequestHandler from "@/lib/request-handler";
import { toast } from "sonner";

// Notification type configuration
const NOTIFICATION_TYPES = [
  {
    value: "account_created",
    label: "Account Created",
    icon: UserPlus,
    color: "text-green-500",
  },
  {
    value: "appointment_created",
    label: "Appointment Created",
    icon: Calendar,
    color: "text-green-500",
  },
  {
    value: "appointment_updated",
    label: "Appointment Updated",
    icon: Calendar,
    color: "text-blue-500",
  },
  {
    value: "appointment_cancelled",
    label: "Appointment Cancelled",
    icon: XCircle,
    color: "text-red-500",
  },
  {
    value: "appointment_reminder",
    label: "Appointment Reminder",
    icon: Clock,
    color: "text-yellow-500",
  },
  {
    value: "employee_hired",
    label: "Employee Hired",
    icon: UserPlus,
    color: "text-emerald-500",
  },
  {
    value: "employee_removed",
    label: "Employee Removed",
    icon: UserMinus,
    color: "text-red-500",
  },
  {
    value: "organization_created",
    label: "Organization Created",
    icon: Building2,
    color: "text-cyan-500",
  },
  {
    value: "profile_updated",
    label: "Profile Updated",
    icon: Settings,
    color: "text-blue-500",
  },
  {
    value: "task_assigned",
    label: "Task Assigned",
    icon: Briefcase,
    color: "text-purple-500",
  },
  {
    value: "task_submission_received",
    label: "Task Submission",
    icon: MessageCircle,
    color: "text-indigo-500",
  },
  {
    value: "task_completed",
    label: "Task Completed",
    icon: CheckCircle,
    color: "text-green-500",
  },
  {
    value: "task_requires_action",
    label: "Task Requires Action",
    icon: Clock,
    color: "text-orange-500",
  },
  {
    value: "payment_received",
    label: "Payment Received",
    icon: CreditCard,
    color: "text-emerald-500",
  },
  {
    value: "payment_failed",
    label: "Payment Failed",
    icon: CreditCard,
    color: "text-red-500",
  },
  {
    value: "service_rated",
    label: "Service Rated",
    icon: Star,
    color: "text-pink-500",
  },
  {
    value: "system_alert",
    label: "System Alert",
    icon: Bell,
    color: "text-indigo-500",
  },
];

const PRIORITIES = [
  { value: "low", label: "Low", color: "bg-gray-100 text-gray-700" },
  { value: "medium", label: "Medium", color: "bg-blue-100 text-blue-700" },
  { value: "high", label: "High", color: "bg-yellow-100 text-yellow-700" },
  { value: "urgent", label: "Urgent", color: "bg-red-100 text-red-700" },
];

const USER_ROLES = [
  { value: "all", label: "All Client and Employees" },
  { value: "client", label: "Clients" },
  { value: "employee", label: "Employees" },
  // { value: "organization_admin", label: "Organization Admins" },
  // { value: "super_admin", label: "Super Admins" },
];

// Notification Row Component
const NotificationRow = ({
  notification,
  onArchive,
  onRestore,
  onMarkRead,
  onDelete,
  isAdmin,
}) => {
  const typeConfig =
    NOTIFICATION_TYPES.find((t) => t.value === notification.type) ||
    NOTIFICATION_TYPES[0];
  const Icon = typeConfig.icon;
  const priorityConfig =
    PRIORITIES.find((p) => p.value === notification.priority) || PRIORITIES[1];

  return (
    <div
      className={cn(
        "p-4 border-b last:border-b-0 hover:bg-muted/50 transition-colors group",
        !notification.isRead && !notification.isArchived && "bg-primary/5",
      )}
    >
      <div className="flex gap-3">
        <div className={cn("shrink-0 mt-0.5", typeConfig.color)}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p
                className={cn(
                  "text-sm",
                  !notification.isRead &&
                    !notification.isArchived &&
                    "font-semibold",
                )}
              >
                {notification.title}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {typeConfig.label} •{" "}
                {formatDistanceToNow(new Date(notification.createdAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
            <div className="flex items-center gap-1">
              {notification.isArchived && (
                <Badge variant="outline" className="text-[10px]">
                  Archived
                </Badge>
              )}
              {!notification.isRead && !notification.isArchived && (
                <Badge variant="outline" className="text-[10px]">
                  New
                </Badge>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (notification.isArchived) {
                    onRestore(notification.id);
                  } else {
                    onArchive(notification.id);
                  }
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground p-1"
              >
                {notification.isArchived ? (
                  <ArchiveRestore className="h-3.5 w-3.5" />
                ) : (
                  <Archive className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {notification.message}
          </p>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <Badge className={priorityConfig.color}>
              {priorityConfig.label}
            </Badge>
            {!notification.isRead && !notification.isArchived && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={() => onMarkRead(notification.id)}
              >
                <Eye className="h-3 w-3 mr-1" />
                Mark read
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={() => onDelete(notification.id)}
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Delete
            </Button>
          </div>
          {notification.actionUrl && (
            <a
              href={notification.actionUrl}
              className="text-xs text-primary hover:underline mt-2 inline-block"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              View Details →
            </a>
          )}
          {notification.metadata &&
            Object.keys(notification.metadata).length > 0 && (
              <details className="mt-2" onClick={(e) => e.stopPropagation()}>
                <summary className="text-xs text-muted-foreground cursor-pointer">
                  Metadata
                </summary>
                <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-auto">
                  {JSON.stringify(notification.metadata, null, 2)}
                </pre>
              </details>
            )}
        </div>
      </div>
    </div>
  );
};

// Stats Card Component
const StatsCard = ({ title, value, icon: Icon, color }) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className={cn("p-3 rounded-full", color)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </CardContent>
  </Card>
);

// Send Notification Dialog
const SendNotificationDialog = ({ open, onOpenChange, onSend, isLoading }) => {
  const [formData, setFormData] = useState({
    type: "system_alert",
    title: "",
    message: "",
    priority: "medium",
    targetRole: "all",
    actionUrl: "",
    sendEmail: false,
  });

  const handleSubmit = async () => {
    if (!formData.title || !formData.message) {
      toast.error("Title and message are required");
      return;
    }
    await onSend(formData);
    setFormData({
      type: "system_alert",
      title: "",
      message: "",
      priority: "medium",
      targetRole: "all",
      actionUrl: "",
      sendEmail: false,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Send Notification</DialogTitle>
          <DialogDescription>
            Create and send a notification to users
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Notification Type</Label>
            <Select
              value={formData.type}
              onValueChange={(v) => setFormData({ ...formData, type: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {NOTIFICATION_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center gap-2">
                      <type.icon className="h-4 w-4" />
                      {type.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              placeholder="Notification title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Message</Label>
            <Textarea
              placeholder="Notification message"
              rows={4}
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(v) => setFormData({ ...formData, priority: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITIES.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Target Audience</Label>
              <Select
                value={formData.targetRole}
                onValueChange={(v) =>
                  setFormData({ ...formData, targetRole: v })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {USER_ROLES.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Action URL (Optional)</Label>
            <Input
              placeholder="/dashboard or https://..."
              value={formData.actionUrl}
              onChange={(e) =>
                setFormData({ ...formData, actionUrl: e.target.value })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>Send email notification</Label>
            <Switch
              checked={formData.sendEmail}
              onCheckedChange={(v) =>
                setFormData({ ...formData, sendEmail: v })
              }
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Send className="h-4 w-4 mr-2" />
            )}
            Send Notification
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default function NotificationsDashboard() {
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    unread: 0,
    archived: 0,
    highPriority: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendDialogOpen, setSendDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [showArchived, setShowArchived] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const isAdmin =
    userRole === "super_admin" || userRole === "organization_admin";

  // Fetch notifications (including archived)
  const fetchNotifications = useCallback(
    async (reset = false) => {
      // if (isLoading) return;

      // setIsLoading(true);
      const currentPage = reset ? 0 : page;
      const offset = currentPage * 20;

      let filters = [];
      // if (activeTab === "unread") filters.push("unread=true");
      if (showArchived) filters.push("archived=true");
      if (typeFilter !== "all") filters.push(`type=${typeFilter}`);
      // if (priorityFilter !== "all") filters.push(`priority=${priorityFilter}`);

      const filterString = filters.length > 0 ? `&${filters.join("&")}` : "";

      try {
        const res = await RequestHandler.Get(
          `/api/v1/notification?limit=20&offset=${offset}${filterString}`,
        );
        if (!res.ok) throw new Error("Failed to fetch");

        const data = await res.json();
        const newNotifications = data.notifications || [];
        const unreadCount = await RequestHandler.Get(
          `/api/v1/notification/count?unread=true&archived=false`,
        ).then(async (res) => res.ok && (await res.json()).count);

        const archivedCount = await RequestHandler.Get(
          `/api/v1/notification/count?archived=true`,
        ).then(async (res) => res.ok && (await res.json()).count);

        if (reset) {
          setNotifications(newNotifications);
          setPage(0);
        } else {
          setNotifications((prev) => {
            const existingIds = new Set(prev.map((n) => n.id));
            const uniqueNew = newNotifications.filter(
              (n) => !existingIds.has(n.id),
            );
            return [...prev, ...uniqueNew];
          });
        }

        setHasMore(data.hasMore || false);
        setStats({
          total: newNotifications.length || 0,
          unread: unreadCount || 0,
          archived: archivedCount || 0,
          // highPriority: data.highPriorityCount || 0,
        });
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
        toast.error("Failed to load notifications");
      } finally {
        setIsLoading(false);
      }
    },
    [page, isLoading, activeTab, showArchived, typeFilter, priorityFilter],
  );

  // Initial fetch
  useEffect(() => {
    if (!userRole) return;
    (async () => fetchNotifications(true))();
  }, [userRole, activeTab, showArchived, typeFilter, priorityFilter]);

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

  const deleteNotification = async (notificationId) => {
    try {
      const res = await RequestHandler.Delete(
        `/api/v1/notification?id=${notificationId}&delete=true`,
      );
      if (res.ok) {
        const {
          notifications: [notification],
        } = await res.json();
        setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
        setStats((prev) => ({
          ...prev,
          total: Math.max(0, prev.total - 1),
          ...(notification.isArchived
            ? { archived: Math.max(0, prev.archived - 1) }
            : {}),
          ...(!notification.isRead
            ? { unread: Math.max(0, prev.unread - 1) }
            : {}),
        }));
      }
    } catch (error) {
      console.error("Failed to delete :", error);
      toast.error("Failed to delete ");
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const res = await RequestHandler.Patch(
        `/api/v1/notification?id=${notificationId}`,
      );
      if (res.ok) {
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notificationId ? { ...n, isRead: true } : n,
          ),
        );
        setStats((prev) => ({ ...prev, unread: Math.max(0, prev.unread - 1) }));
      }
    } catch (error) {
      console.error("Failed to mark as read:", error);
      toast.error("Failed to mark as read");
    }
  };

  const markAllAsRead = async () => {
    try {
      const res = await RequestHandler.Post(
        "/api/v1/notification?action=mark-all-read",
      );
      if (res.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        setStats((prev) => ({ ...prev, unread: 0 }));
        toast.success("All notifications marked as read");
      }
    } catch (error) {
      console.error("Failed to mark all as read:", error);
      toast.error("Failed to mark all as read");
    }
  };

  const archiveNotification = async (notificationId) => {
    try {
      const res = await RequestHandler.Delete(
        `/api/v1/notification?id=${notificationId}`,
      );
      if (res.ok) {
        setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
        toast.success("Notification archived");
        fetchNotifications(true);
      }
    } catch (error) {
      console.error("Failed to archive:", error);
      toast.error("Failed to archive notification");
    }
  };

  const restoreNotification = async (notificationId) => {
    try {
      const res = await RequestHandler.Post(
        `/api/v1/notification?id=${notificationId}&action=restore`,
      );
      if (res.ok) {
        toast.success("Notification restored");
        fetchNotifications(true);
      }
    } catch (error) {
      console.error("Failed to restore:", error);
      toast.error("Failed to restore notification");
    }
  };

  const handleSendNotification = async (formData) => {
    setIsSending(true);
    try {
      const res = await RequestHandler.Post("/api/v1/notification/broadcast", {
        body: {
          ...formData,
          targetRole:
            formData.targetRole === "all" ? undefined : formData.targetRole,
        },
      });

      if (res.ok) {
        toast.success("Notification sent successfully!");
        setSendDialogOpen(false);
        fetchNotifications(true);
      } else {
        const error = await res.json();
        toast.error(error.error || "Failed to send notification");
      }
    } catch (error) {
      console.error("Failed to send notification:", error);
      toast.error("Failed to send notification");
    } finally {
      setIsSending(false);
    }
  };

  const loadMore = () => {
    if (!isLoading && hasMore) {
      setPage((prev) => prev + 1);
      fetchNotifications(false);
    }
  };

  const handleScroll = (e) => {
    const target = e.target;
    const bottom =
      target.scrollHeight - target.scrollTop <= target.clientHeight + 100;
    if (bottom && hasMore && !isLoading) {
      loadMore();
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        n.title.toLowerCase().includes(query) ||
        n.message.toLowerCase().includes(query)
      );
    }
    return true;
  });

  if (!userRole) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-sm text-muted-foreground">
            Manage and monitor all notifications
          </p>
        </div>
        {isAdmin && (
          <Button onClick={() => setSendDialogOpen(true)}>
            <Send className="h-4 w-4 mr-2" />
            Send Notification
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatsCard
          title="Total"
          value={stats.total}
          icon={Bell}
          color="bg-blue-100 text-blue-600"
        />
        <StatsCard
          title="Unread"
          value={stats.unread}
          icon={Eye}
          color="bg-yellow-100 text-yellow-600"
        />
        <StatsCard
          title="Archived"
          value={stats.archived}
          icon={Archive}
          color="bg-gray-100 text-gray-600"
        />
        {/* <StatsCard
          title="High Priority"
          value={stats.highPriority}
          icon={AlertCircle}
          color="bg-red-100 text-red-600"
        /> */}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="flex flex-1 items-center gap-3 flex-wrap">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search notifications..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {NOTIFICATION_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  {PRIORITIES.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex items-center gap-2">
                <Switch
                  id="show-archived"
                  checked={showArchived}
                  onCheckedChange={setShowArchived}
                />
                <Label htmlFor="show-archived" className="cursor-pointer">
                  Show archived
                </Label>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchNotifications(true)}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              {stats.unread > 0 && (
                <Button variant="outline" size="sm" onClick={markAllAsRead}>
                  <CheckCheck className="h-4 w-4 mr-2" />
                  Mark all read
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="all">
            All
            {stats.total > 0 && (
              <Badge variant="ghost" className="ml-2">
                {stats.total}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="unread">
            Unread
            {stats.unread > 0 && (
              <Badge variant="ghost" className="ml-2">
                {stats.unread}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="archived">
            Archived
            {stats.archived > 0 && (
              <Badge variant="ghost" className="ml-2">
                {stats.archived}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <ScrollArea className="h-[500px]" onScrollCapture={handleScroll}>
                {isLoading && notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                  </div>
                ) : filteredNotifications.filter((n) =>
                    showArchived ? true : !n.isArchived,
                  ).length === 0 ? (
                  <div className="p-8 text-center">
                    <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-3 opacity-30" />
                    <p className="text-muted-foreground">
                      No notifications found
                    </p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredNotifications
                      .filter((n) => !n.isArchived)
                      .map((notification) => (
                        <NotificationRow
                          key={notification.id}
                          notification={notification}
                          onArchive={archiveNotification}
                          onRestore={restoreNotification}
                          onMarkRead={markAsRead}
                          onDelete={deleteNotification}
                          isAdmin={isAdmin}
                        />
                      ))}
                  </div>
                )}

                {isLoading && notifications.length > 0 && (
                  <div className="flex justify-center p-4">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                )}

                {!hasMore && notifications.length > 0 && (
                  <div className="text-center py-4 text-xs text-muted-foreground">
                    You've seen all notifications
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="unread" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <ScrollArea className="h-[500px]">
                {filteredNotifications.filter((n) => !n.isRead && !n.isArchived)
                  .length === 0 ? (
                  <div className="p-8 text-center">
                    <CheckCheck className="h-12 w-12 mx-auto text-muted-foreground mb-3 opacity-30" />
                    <p className="text-muted-foreground">
                      All caught up! No unread notifications.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredNotifications
                      .filter((n) => !n.isRead && !n.isArchived)
                      .map((notification) => (
                        <NotificationRow
                          key={notification.id}
                          notification={notification}
                          onArchive={archiveNotification}
                          onRestore={restoreNotification}
                          onMarkRead={markAsRead}
                          onDelete={deleteNotification}
                          isAdmin={isAdmin}
                        />
                      ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="archived" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <ScrollArea className="h-[500px]">
                {filteredNotifications.filter((n) => n.isArchived).length ===
                0 ? (
                  <div className="p-8 text-center">
                    <CheckCheck className="h-12 w-12 mx-auto text-muted-foreground mb-3 opacity-30" />
                    <p className="text-muted-foreground">
                      All caught up! No unread notifications.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredNotifications
                      .filter((n) => n.isArchived)
                      .map((notification) => (
                        <NotificationRow
                          key={notification.id}
                          notification={notification}
                          onArchive={archiveNotification}
                          onRestore={restoreNotification}
                          onMarkRead={markAsRead}
                          onDelete={deleteNotification}
                          isAdmin={isAdmin}
                        />
                      ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Send Notification Dialog */}
      <SendNotificationDialog
        open={sendDialogOpen}
        onOpenChange={setSendDialogOpen}
        onSend={handleSendNotification}
        isLoading={isSending}
      />
    </div>
  );
}
