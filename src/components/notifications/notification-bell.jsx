// src/components/notifications/NotificationBell.jsx
"use client";

import { useState, useEffect, useRef } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import RequestHandler from "@/lib/request-handler";
import { toast } from "sonner";

const notificationIcons = {
  appointment_created: Calendar,
  appointment_updated: Calendar,
  appointment_cancelled: XCircle,
  appointment_reminder: Clock,
  task_assigned: Briefcase,
  task_completed: CheckCircle,
  task_requires_action: Clock,
  payment_received: CreditCard,
  payment_failed: XCircle,
  service_rated: Star,
  system_alert: Bell,
};

const notificationColors = {
  appointment_created: "text-green-500",
  appointment_updated: "text-blue-500",
  appointment_cancelled: "text-red-500",
  appointment_reminder: "text-yellow-500",
  task_assigned: "text-purple-500",
  task_completed: "text-green-500",
  task_requires_action: "text-orange-500",
  payment_received: "text-emerald-500",
  payment_failed: "text-red-500",
  system_alert: "text-indigo-500",
};

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const scrollRef = useRef(null);

  const fetchNotifications = async (reset = false) => {
    setIsLoading(true);
    const currentPage = reset ? 0 : page;
    const offset = currentPage * 20;

    try {
      const res = await RequestHandler.Get(
        `/api/v1/notification?limit=20&offset=${offset}`,
      );
      if (res.ok) {
        const data = await res.json();
        if (reset) {
          setNotifications(data.notifications);
        } else {
          setNotifications((prev) => [...prev, ...data.notifications]);
        }
        setHasMore(data.hasMore);
        setUnreadCount(data.notifications.filter((n) => !n.isRead).length);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotifications(true);
    }
  }, [isOpen]);

  const markAsRead = async (notificationId) => {
    try {
      await RequestHandler.Patch(`/api/v1/notification?id=${notificationId}`);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId
            ? { ...n, isRead: true, readAt: new Date() }
            : n,
        ),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await RequestHandler.Post("/api/v1/notification?action=mark-all-read");
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true, readAt: new Date() })),
      );
      setUnreadCount(0);
      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Failed to mark all as read:", error);
      toast.error("Failed to mark all as read");
    }
  };

  const archiveNotification = async (notificationId) => {
    try {
      await RequestHandler.Delete(`/api/v1/notification?id=${notificationId}`);
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
      toast.success("Notification archived");
    } catch (error) {
      console.error("Failed to archive:", error);
      toast.error("Failed to archive notification");
    }
  };

  const loadMore = () => {
    if (!isLoading && hasMore) {
      setPage((prev) => prev + 1);
      fetchNotifications();
    }
  };

  const handleScroll = (e) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight + 100;
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
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          )}
        </div>
        <ScrollArea
          className="h-[400px]"
          onScrollCapture={handleScroll}
          ref={scrollRef}
        >
          {notifications.length === 0 && !isLoading ? (
            <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
              <Bell className="h-8 w-8 mb-2 opacity-50" />
              <p className="text-sm">No notifications</p>
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
                      "p-4 hover:bg-muted/50 transition-colors cursor-pointer relative",
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
                          <p className="text-sm font-medium">
                            {notification.title}
                          </p>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              archiveNotification(notification.id);
                            }}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <XCircle className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(
                              new Date(notification.createdAt),
                              { addSuffix: true },
                            )}
                          </span>
                          {notification.priority === "high" && (
                            <Badge
                              variant="destructive"
                              className="text-[10px]"
                            >
                              High Priority
                            </Badge>
                          )}
                          {notification.priority === "urgent" && (
                            <Badge className="bg-red-600 text-white text-[10px]">
                              Urgent
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
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
