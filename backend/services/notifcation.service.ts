// backend/services/notification.service.ts

import { db } from "~/db";
import { tables } from "~/db/schema";
import { eq, and, desc, sql, inArray } from "drizzle-orm";
import EmailService from "./email.service";

// Valid notification types for validation
const VALID_NOTIFICATION_TYPES = [
  "appointment_created",
  "appointment_updated",
  "appointment_cancelled",
  "appointment_reminder",
  "task_assigned",
  "task_completed",
  "task_requires_action",
  "task_submission_received",
  "payment_received",
  "payment_failed",
  "service_rated",
  "organization_created",
  "organization_updated",
  "employee_hired",
  "employee_removed",
  "account_created",
  "profile_updated",
  "system_alert",
] as const;

type NotificationType = (typeof VALID_NOTIFICATION_TYPES)[number];

export default class NotificationService {
  /**
   * Create a single notification
   */
  static async create(
    userId: string,
    data: {
      type: NotificationType;
      title: string;
      message: string;
      priority?: "low" | "medium" | "high" | "urgent";
      metadata?: Record<string, any>;
      actionUrl?: string;
      expiresAt?: Date;
    },
  ) {
    try {
      // Validate notification type
      if (!VALID_NOTIFICATION_TYPES.includes(data.type)) {
        console.error(
          `[NotificationService] Invalid notification type: ${data.type}`,
        );
        return null;
      }

      const [notification] = await db
        .insert(tables.notification)
        .values({
          userId,
          type: data.type,
          title: data.title,
          message: data.message,
          priority: data.priority || "medium",
          metadata: JSON.stringify(data.metadata || {}),
          actionUrl: data.actionUrl,
          expiresAt: data.expiresAt,
        })
        .returning();

      // Send email for high priority notifications
      if (data.priority === "high" || data.priority === "urgent") {
        await this.sendEmailNotification(userId, data);
      }

      return notification;
    } catch (error) {
      console.error(
        "[NotificationService] Failed to create notification:",
        error,
      );
      return null;
    }
  }

  /**
   * Create multiple notifications for multiple users (bulk insert)
   */
  static async createBulk(
    notifications: Array<{
      userId: string;
      type: NotificationType;
      title: string;
      message: string;
      priority?: "low" | "medium" | "high" | "urgent";
      metadata?: Record<string, any>;
      actionUrl?: string;
      expiresAt?: Date;
    }>,
  ) {
    if (!notifications || notifications.length === 0) {
      return [];
    }

    try {
      // Validate all notifications before inserting
      const validNotifications = [];
      const invalidNotifications = [];

      for (const notif of notifications) {
        if (!VALID_NOTIFICATION_TYPES.includes(notif.type)) {
          console.error(
            `[NotificationService] Invalid notification type in bulk: ${notif.type}`,
          );
          invalidNotifications.push(notif);
          continue;
        }

        if (!notif.userId) {
          console.error(
            `[NotificationService] Missing userId in bulk notification`,
          );
          invalidNotifications.push(notif);
          continue;
        }

        validNotifications.push({
          userId: notif.userId,
          type: notif.type,
          title: notif.title,
          message: notif.message,
          priority: notif.priority || "medium",
          metadata: JSON.stringify(notif.metadata || {}),
          actionUrl: notif.actionUrl,
          expiresAt: notif.expiresAt,
        });
      }

      if (validNotifications.length === 0) {
        console.warn("[NotificationService] No valid notifications to insert");
        return [];
      }

      // Bulk insert all valid notifications
      const inserted = await db
        .insert(tables.notification)
        .values(validNotifications)
        .returning();

      // Send emails for high priority notifications (do this after insert, don't block)
      const highPriorityNotifs = validNotifications.filter(
        (n) => n.priority === "high" || n.priority === "urgent",
      );

      for (const notif of highPriorityNotifs) {
        this.sendEmailNotification(notif.userId, {
          type: notif.type,
          title: notif.title,
          message: notif.message,
          priority: notif.priority,
        }).catch((err) =>
          console.error(
            "[NotificationService] Failed to send email for bulk notification:",
            err,
          ),
        );
      }

      if (invalidNotifications.length > 0) {
        console.warn(
          `[NotificationService] Skipped ${invalidNotifications.length} invalid notifications`,
        );
      }

      return inserted;
    } catch (error) {
      console.error(
        "[NotificationService] Failed to create bulk notifications:",
        error,
      );
      return [];
    }
  }

  /**
   * Create notifications for multiple users with the same content (broadcast)
   */
  static async broadcast(
    userIds: string[],
    data: {
      type: NotificationType;
      title: string;
      message: string;
      priority?: "low" | "medium" | "high" | "urgent";
      metadata?: Record<string, any>;
      actionUrl?: string;
      expiresAt?: Date;
    },
  ) {
    if (!userIds || userIds.length === 0) {
      return [];
    }

    // Filter out invalid user IDs and duplicates
    const uniqueUserIds = [
      ...new Set(userIds.filter((id) => id && typeof id === "string")),
    ];

    if (uniqueUserIds.length === 0) {
      console.warn("[NotificationService] No valid user IDs for broadcast");
      return [];
    }

    // Create notification objects for each user
    const notifications = uniqueUserIds.map((userId) => ({
      userId,
      type: data.type,
      title: data.title,
      message: data.message,
      priority: data.priority || "medium",
      metadata: data.metadata,
      actionUrl: data.actionUrl,
      expiresAt: data.expiresAt,
    }));

    return this.createBulk(notifications);
  }

  /**
   * Get user's notifications with pagination
   */
  static async getUserNotifications(
    userId: string,
    options: {
      limit?: number;
      offset?: number;
      unreadOnly?: boolean;
      getArchived?: boolean;
      type?: string;
    } = {},
  ) {
    try {
      const { limit = 20, offset = 0, unreadOnly, getArchived, type } = options;

      const whereConditions = [eq(tables.notification.userId, userId)];
      if (getArchived != null) {
        whereConditions.push(eq(tables.notification.isArchived, getArchived));
      }
      if (unreadOnly) {
        whereConditions.push(eq(tables.notification.isRead, false));
      }
      if (type && VALID_NOTIFICATION_TYPES.includes(type as NotificationType)) {
        whereConditions.push(eq(tables.notification.type, type as any));
      }
      // whereConditions.push(
      //   sql`(${tables.notification.expiresAt} IS NULL OR ${tables.notification.expiresAt} > NOW())`,
      // );

      const notifications = await db
        .select()
        .from(tables.notification)
        .where(and(...whereConditions))
        .orderBy(desc(tables.notification.createdAt))
        .limit(limit)
        .offset(offset);

      // Parse metadata JSON for each notification
      const parsedNotifications = notifications.map((n) => ({
        ...n,
        metadata:
          typeof n.metadata === "string" ? JSON.parse(n.metadata) : n.metadata,
      }));

      const [countResult] = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(tables.notification)
        .where(and(...whereConditions.slice(0, -1)));

      return {
        notifications: parsedNotifications,
        total: Number(countResult?.count) || 0,
        hasMore: offset + limit < (Number(countResult?.count) || 0),
      };
    } catch (error) {
      console.error(
        "[NotificationService] Failed to get user notifications:",
        error,
      );
      return {
        notifications: [],
        total: 0,
        hasMore: false,
      };
    }
  }

  /**
   * Mark a single notification as read
   */
  static async markAsRead(notificationId: string, userId: string) {
    try {
      return await db
        .update(tables.notification)
        .set({
          isRead: true,
          readAt: new Date(),
        })
        .where(
          and(
            eq(tables.notification.id, notificationId),
            eq(tables.notification.userId, userId),
          ),
        );
    } catch (error) {
      console.error("[NotificationService] Failed to mark as read:", error);
      throw error;
    }
  }

  /**
   * Mark multiple notifications as read (bulk)
   */
  static async markMultipleAsRead(notificationIds: string[], userId: string) {
    if (!notificationIds || notificationIds.length === 0) {
      return [];
    }

    try {
      return await db
        .update(tables.notification)
        .set({
          isRead: true,
          readAt: new Date(),
        })
        .where(
          and(
            inArray(tables.notification.id, notificationIds),
            eq(tables.notification.userId, userId),
          ),
        );
    } catch (error) {
      console.error(
        "[NotificationService] Failed to mark multiple as read:",
        error,
      );
      throw error;
    }
  }

  /**
   * Mark all notifications as read for a user
   */
  static async markAllAsRead(userId: string) {
    try {
      return await db
        .update(tables.notification)
        .set({
          isRead: true,
          readAt: new Date(),
        })
        .where(
          and(
            eq(tables.notification.userId, userId),
            eq(tables.notification.isRead, false),
            eq(tables.notification.isArchived, false),
          ),
        );
    } catch (error) {
      console.error("[NotificationService] Failed to mark all as read:", error);
      throw error;
    }
  }

  /**
   * Delete a notification
   */
  static async delete(notificationId: string, userId: string) {
    try {
      return await db
        .delete(tables.notification)
        .where(
          and(
            eq(tables.notification.id, notificationId),
            eq(tables.notification.userId, userId),
          ),
        )
        .returning();
    } catch (error) {
      console.error("[NotificationService] Failed to delete:", error);
      throw error;
    }
  }

  /**
   * Archive a notification
   */
  static async archive(notificationId: string, userId: string) {
    try {
      return await db
        .update(tables.notification)
        .set({ isArchived: true })
        .where(
          and(
            eq(tables.notification.id, notificationId),
            eq(tables.notification.userId, userId),
          ),
        )
        .returning();
    } catch (error) {
      console.error("[NotificationService] Failed to archive:", error);
      throw error;
    }
  }

  /**
   * Archive multiple notifications (bulk)
   */
  static async archiveMultiple(notificationIds: string[], userId: string) {
    if (!notificationIds || notificationIds.length === 0) {
      return [];
    }

    try {
      return await db
        .update(tables.notification)
        .set({ isArchived: true })
        .where(
          and(
            inArray(tables.notification.id, notificationIds),
            eq(tables.notification.userId, userId),
          ),
        );
    } catch (error) {
      console.error("[NotificationService] Failed to archive multiple:", error);
      throw error;
    }
  }

  /**
   * Delete old notifications (cleanup)
   */
  static async cleanupOldNotifications(daysOld = 30) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      return await db
        .delete(tables.notification)
        .where(
          and(
            eq(tables.notification.isArchived, true),
            sql`${tables.notification.createdAt} < ${cutoffDate.toISOString()}`,
          ),
        );
    } catch (error) {
      console.error(
        "[NotificationService] Failed to cleanup old notifications:",
        error,
      );
      throw error;
    }
  }

  /**
   * Get unread count for a user
   */
  static async getUnreadCount(userId: string) {
    try {
      const [result] = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(tables.notification)
        .where(
          and(
            eq(tables.notification.userId, userId),
            eq(tables.notification.isRead, false),
            eq(tables.notification.isArchived, false),
          ),
        );
      return Number(result?.count) || 0;
    } catch (error) {
      console.error("[NotificationService] Failed to get unread count:", error);
      return 0;
    }
  }

  /**
   * Get unread count for a user
   */
  static async getCount(
    userId: string,
    {
      isUnread,
      isArchived,
      type,
    }: { isUnread?: boolean; isArchived?: boolean; type?: string },
  ) {
    try {
      const whereFilters = [];
      if (isUnread != null)
        whereFilters.push(eq(tables.notification.isRead, !isUnread));
      if (isArchived != null)
        whereFilters.push(eq(tables.notification.isArchived, isArchived));
      const [result] = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(tables.notification)
        .where(and(...whereFilters, eq(tables.notification.userId, userId)));
      return Number(result?.count) || 0;
    } catch (error) {
      console.error("[NotificationService] Failed to get unread count:", error);
      return 0;
    }
  }

  /**
   * Send email notification (private method)
   */
  private static async sendEmailNotification(userId: string, data: any) {
    try {
      const [user] = await db
        .select({
          email: tables.user.email,
          firstname: tables.user.firstname,
          lastname: tables.user.lastname,
        })
        .from(tables.user)
        .where(eq(tables.user.id, userId));

      if (!user || !user.email) return;

      await EmailService.send({
        to: user.email,
        from: {
          name: "ServeSync+",
          address: process.env.SMTP_EMAIL!,
        },
        subject: data.title,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #4f46e5;">${data.title}</h2>
            <p style="font-size: 16px; line-height: 1.5;">${data.message}</p>
            ${data.actionUrl ? `<a href="${data.actionUrl}" style="display: inline-block; background: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 15px;">View Details</a>` : ""}
            <hr style="margin: 20px 0;" />
            <p style="color: #666; font-size: 12px;">ServeSync+ Notification System</p>
          </div>
        `,
        text: `${data.title}\n\n${data.message}\n\n${data.actionUrl || ""}`,
      });
    } catch (error) {
      console.error(
        "[NotificationService] Failed to send email notification:",
        error,
      );
    }
  }
}
