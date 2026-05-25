// src/components/notifications/NotificationBell.jsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import RequestHandler from "@/lib/request-handler";
import { toast } from "sonner";

const NOTIFICATION_FETCH_INTERVAL = 10000;

const notificationIcons = {
  account_created: UserPlus,
  appointment_created: Calendar,
  appointment_updated: Calendar,
  appointment_cancelled: XCircle,
  appointment_reminder: Clock,
  employee_hired: UserPlus,
  employee_removed: UserMinus,
  organization_created: Building2,
  profile_updated: Settings,
  task_assigned: Briefcase,
  task_submission_received: MessageCircle,
  task_completed: CheckCircle,
  task_requires_action: Clock,
  payment_received: CreditCard,
  payment_failed: XCircle,
  service_rated: Star,
  system_alert: Bell,
};

const notificationColors = {
  account_created: "text-green-500",
  appointment_created: "text-green-500",
  appointment_updated: "text-blue-500",
  appointment_cancelled: "text-red-500",
  appointment_reminder: "text-yellow-500",
  employee_hired: "text-emerald-500",
  employee_removed: "text-red-500",
  organization_created: "text-cyan-500",
  profile_updated: "text-blue-500",
  task_assigned: "text-purple-500",
  task_submission_received: "text-indigo-500",
  task_completed: "text-green-500",
  task_requires_action: "text-orange-500",
  payment_received: "text-emerald-500",
  payment_failed: "text-red-500",
  service_rated: "text-pink-500",
  system_alert: "text-indigo-500",
};

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isMarkingAll, setIsMarkingAll] = useState(false);
  const scrollRef = useRef(null);
  const pollingRef = useRef(null);

  // Fetch notifications
  const fetchNotifications = useCallback(
    async (reset = false) => {
      if (isLoading) return;

      setIsLoading(true);
      const currentPage = reset ? 0 : page;
      const offset = currentPage * 20;

      try {
        const res = await RequestHandler.Get(
          `/api/v1/notification?limit=20&offset=${offset}&archived=false`,
        );

        if (!res.ok) {
          console.error("Failed to fetch notifications:", res.status);
          return;
        }

        const data = await res.json();
        const newNotifications = data.notifications || [];

        if (reset) {
          setNotifications(newNotifications);
          setPage(0);
        } else {
          setNotifications((prev) => {
            // Avoid duplicates
            const existingIds = new Set(prev.map((n) => n.id));
            const uniqueNew = newNotifications.filter(
              (n) => !existingIds.has(n.id),
            );
            return [...prev, ...uniqueNew];
          });
        }

        setHasMore(data.hasMore || false);

        // Update unread count
        const unread = (reset ? newNotifications : notifications).filter(
          (n) => !n.isRead,
        ).length;
        setUnreadCount(unread);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [page, isLoading, notifications],
  );

  // Fetch only unread count (lightweight for background polling)
  const fetchUnreadCount = useCallback(async () => {
    try {
      const res = await RequestHandler.Get(
        "/api/v1/notification/count?unread=true&archived=false",
      );
      if (res.ok) {
        const data = await res.json();
        if (data.count != unreadCount) {
          fetchNotifications(true);
        }
        setUnreadCount(data.count);
      }
    } catch (error) {
      console.error("Failed to fetch unread count:", error);
    }
  }, [unreadCount]);

  // Poll fetch
  useEffect(() => {
    // if (pollingRef.current) clearInterval(pollingRef.current);
    if (pollingRef.current == null) {
      (async () => fetchUnreadCount())();
      pollingRef.current = setInterval(() => {
        fetchUnreadCount();
      }, NOTIFICATION_FETCH_INTERVAL);
    }
    // (async () => fetchNotifications(true))();
  }, []);

  useEffect(() => {
    if (unreadCount > 0) (async () => fetchNotifications(true))();
  }, [unreadCount]);

  const markAsRead = async (notificationId) => {
    try {
      const res = await RequestHandler.Patch(
        `/api/v1/notification?id=${notificationId}`,
      );
      if (res.ok) {
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notificationId
              ? { ...n, isRead: true, readAt: new Date() }
              : n,
          ),
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const markAllAsRead = async () => {
    if (isMarkingAll) return;

    setIsMarkingAll(true);
    try {
      const res = await RequestHandler.Post(
        "/api/v1/notification?action=mark-all-read",
      );
      if (res.ok) {
        setNotifications((prev) =>
          prev.map((n) => ({ ...n, isRead: true, readAt: new Date() })),
        );
        setUnreadCount(0);
        toast.success("All notifications marked as read");
      }
    } catch (error) {
      console.error("Failed to mark all as read:", error);
      toast.error("Failed to mark all as read");
    } finally {
      setIsMarkingAll(false);
    }
  };

  const archiveNotification = async (notificationId, e) => {
    e.stopPropagation();
    try {
      const res = await RequestHandler.Delete(
        `/api/v1/notification?id=${notificationId}`,
      );
      if (res.ok) {
        const archived = notifications.find((n) => n.id === notificationId);
        setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
        if (archived && !archived.isRead) {
          setUnreadCount((prev) => Math.max(0, prev - 1));
        }
        toast.success("Notification archived");
      }
    } catch (error) {
      console.error("Failed to archive:", error);
      toast.error("Failed to archive notification");
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

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[20px] h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center px-1">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              disabled={isMarkingAll}
              className="h-8 px-2 text-xs"
            >
              <CheckCheck className="h-3.5 w-3.5 mr-1" />
              Mark all read
            </Button>
          )}
        </div>

        <ScrollArea
          className="h-[450px]"
          onScrollCapture={handleScroll}
          ref={scrollRef}
        >
          {notifications.length === 0 && !isLoading ? (
            <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
              <Bell className="h-12 w-12 mb-3 opacity-30" />
              <p className="text-sm font-medium">No notifications</p>
              <p className="text-xs">You're all caught up!</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => {
                const Icon = notificationIcons[notification.type] || Bell;
                const colorClass =
                  notificationColors[notification.type] || "text-gray-500";

                return (
                  <div
                    key={notification.id}
                    className={cn(
                      "p-4 hover:bg-muted/50 transition-colors cursor-pointer relative group",
                      !notification.isRead && "bg-primary/5",
                    )}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex gap-3">
                      <div className={cn("shrink-0 mt-0.5", colorClass)}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p
                            className={cn(
                              "text-sm",
                              !notification.isRead && "font-semibold",
                            )}
                          >
                            {notification.title}
                          </p>
                          <button
                            onClick={(e) =>
                              archiveNotification(notification.id, e)
                            }
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(
                              new Date(notification.createdAt),
                              { addSuffix: true },
                            )}
                          </span>
                          {notification.priority === "high" && (
                            <Badge
                              variant="destructive"
                              className="text-[10px] px-1.5"
                            >
                              High Priority
                            </Badge>
                          )}
                          {notification.priority === "urgent" && (
                            <Badge className="bg-red-600 text-white text-[10px] px-1.5">
                              Urgent
                            </Badge>
                          )}
                          {!notification.isRead && (
                            <Badge
                              variant="outline"
                              className="text-[10px] px-1.5"
                            >
                              New
                            </Badge>
                          )}
                        </div>
                        {notification.actionUrl && (
                          <a
                            href={notification.actionUrl}
                            className="text-xs text-primary hover:underline mt-2 inline-block"
                            onClick={(e) => e.stopPropagation()}
                          >
                            View Details →
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex justify-center p-4">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              )}

              {!hasMore && notifications.length > 0 && (
                <div className="text-center py-4 text-xs text-muted-foreground">
                  You've seen all notifications
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
