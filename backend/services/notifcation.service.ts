// backend/services/NotificationService.ts
import { db } from "~/db";
import { tables } from "~/db/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import EmailService from "./email.service";

export type NotificationType = typeof tables.notification.$inferInsert;
export type NotificationWithUser = NotificationType & { user?: any };

export default class NotificationService {
  /**
   * Create a notification for a user
   */
  static async create(
    userId: string,
    data: {
      type: string;
      title: string;
      message: string;
      priority?: "low" | "medium" | "high" | "urgent";
      metadata?: Record<string, any>;
      actionUrl?: string;
      expiresAt?: Date;
    },
  ) {
    const notification = await db
      .insert(tables.notification)
      .values({
        userId,
        type: data.type,
        title: data.title,
        message: data.message,
        priority: data.priority || "medium",
        metadata: data.metadata || {},
        actionUrl: data.actionUrl,
        expiresAt: data.expiresAt,
      })
      .returning();

    // Send email for high priority notifications
    if (data.priority === "high" || data.priority === "urgent") {
      await this.sendEmailNotification(userId, data);
    }

    return notification[0];
  }

  /**
   * Create notifications for multiple users (broadcast)
   */
  static async createBulk(
    userIds: string[],
    data: {
      type: string;
      title: string;
      message: string;
      priority?: "low" | "medium" | "high" | "urgent";
      metadata?: Record<string, any>;
      actionUrl?: string;
    },
  ) {
    const notifications = await db
      .insert(tables.notification)
      .values(
        userIds.map((userId) => ({
          userId,
          type: data.type,
          title: data.title,
          message: data.message,
          priority: data.priority || "medium",
          metadata: data.metadata || {},
          actionUrl: data.actionUrl,
        })),
      )
      .returning();

    // Send emails for high priority
    if (data.priority === "high" || data.priority === "urgent") {
      for (const userId of userIds) {
        await this.sendEmailNotification(userId, data);
      }
    }

    return notifications;
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
      type?: string;
    } = {},
  ) {
    const { limit = 20, offset = 0, unreadOnly = false, type } = options;

    let query = db
      .select()
      .from(tables.notification)
      .where(
        and(
          eq(tables.notification.userId, userId),
          eq(tables.notification.isArchived, false),
          unreadOnly ? eq(tables.notification.isRead, false) : undefined,
          type ? eq(tables.notification.type, type) : undefined,
          sql`(${tables.notification.expiresAt} IS NULL OR ${tables.notification.expiresAt} > datetime('now'))`,
        ),
      )
      .orderBy(desc(tables.notification.createdAt))
      .limit(limit)
      .offset(offset);

    const notifications = await query;
    const [countResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(tables.notification)
      .where(
        and(
          eq(tables.notification.userId, userId),
          eq(tables.notification.isArchived, false),
          unreadOnly ? eq(tables.notification.isRead, false) : undefined,
        ),
      );

    return {
      notifications,
      total: countResult?.count || 0,
      hasMore: offset + limit < (countResult?.count || 0),
    };
  }

  /**
   * Mark notification as read
   */
  static async markAsRead(notificationId: string, userId: string) {
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
  }

  /**
   * Mark all notifications as read for a user
   */
  static async markAllAsRead(userId: string) {
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
        ),
      );
  }

  /**
   * Archive notification
   */
  static async archive(notificationId: string, userId: string) {
    return await db
      .update(tables.notification)
      .set({ isArchived: true })
      .where(
        and(
          eq(tables.notification.id, notificationId),
          eq(tables.notification.userId, userId),
        ),
      );
  }

  /**
   * Delete old notifications (cleanup)
   */
  static async cleanupOldNotifications(daysOld = 30) {
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
  }

  /**
   * Get unread count for a user
   */
  static async getUnreadCount(userId: string) {
    const [result] = await db
      .select({ count: sql<number>`count(*)` })
      .from(tables.notification)
      .where(
        and(
          eq(tables.notification.userId, userId),
          eq(tables.notification.isRead, false),
          eq(tables.notification.isArchived, false),
        ),
      );
    return result?.count || 0;
  }

  /**
   * Send email notification
   */
  private static async sendEmailNotification(userId: string, data: any) {
    try {
      // Get user email
      const [user] = await db
        .select({ email: tables.user.email })
        .from(tables.user)
        .where(eq(tables.user.id, userId));

      if (!user) return;

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
      console.error("Failed to send email notification:", error);
    }
  }
}
