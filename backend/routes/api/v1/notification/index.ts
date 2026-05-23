// backend/routes/api/v1/notification/index.ts
import {
  json,
  type CTXCookie,
  type CTXAuth,
  type RouterHandlers,
} from "@bepalo/router";
import type { CTXSession } from "~/middleware";
import NotificationService from "~/services/notifcation.service";

export default {
  GET: {
    // Get user's notifications
    HANDLER: [
      async (request, ctx) => {
        const url = new URL(request.url);
        const limit = parseInt(url.searchParams.get("limit") || "20");
        const offset = parseInt(url.searchParams.get("offset") || "0");
        const unreadOnly = url.searchParams.get("unread") === "true";
        const type = url.searchParams.get("type") || undefined;

        const result = await NotificationService.getUserNotifications(
          ctx.session.userId,
          { limit, offset, unreadOnly, type },
        );

        return json(result);
      },
    ],
  },

  PATCH: {
    // Mark notification as read
    HANDLER: [
      async (request, ctx) => {
        const url = new URL(request.url);
        const notificationId = url.searchParams.get("id");

        if (!notificationId) {
          return json({ error: "Notification ID required" }, { status: 400 });
        }

        await NotificationService.markAsRead(
          notificationId,
          ctx.session.userId,
        );
        return json({ success: true });
      },
    ],
  },

  POST: {
    // Mark all as read
    HANDLER: [
      async (request, ctx) => {
        const url = new URL(request.url);
        const action = url.searchParams.get("action");

        if (action === "mark-all-read") {
          await NotificationService.markAllAsRead(ctx.session.userId);
          return json({ success: true });
        }

        return json({ error: "Invalid action" }, { status: 400 });
      },
    ],
  },

  DELETE: {
    // Archive notification
    HANDLER: [
      async (request, ctx) => {
        const url = new URL(request.url);
        const notificationId = url.searchParams.get("id");

        if (!notificationId) {
          return json({ error: "Notification ID required" }, { status: 400 });
        }

        await NotificationService.archive(notificationId, ctx.session.userId);
        return json({ success: true });
      },
    ],
  },
} satisfies RouterHandlers<CTXAuth & CTXCookie & CTXSession>;
