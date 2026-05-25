// backend/routes/api/v1/notification/index.ts
import {
  authenticate,
  json,
  parseCookie,
  type CTXAuth,
  type CTXCookie,
  type RouterHandlers,
} from "@bepalo/router";
import { parseAuth, parseSession, type CTXSession } from "~/middleware";
import NotificationService from "~/services/notifcation.service";

export default {
  GET: {
    // Add ACL for authentication
    FILTER: [parseCookie(), authenticate({ parseAuth }), parseSession()],
    HANDLER: [
      async (request, ctx) => {
        const url = new URL(request.url);
        const limit = parseInt(url.searchParams.get("limit") || "20");
        const offset = parseInt(url.searchParams.get("offset") || "0");
        const unreadOnly = url.searchParams.has("unread")
          ? url.searchParams.get("unread") === "true"
          : undefined;
        const getArchived = url.searchParams.has("archived")
          ? url.searchParams.get("archived") === "true"
          : undefined;
        const type = url.searchParams.has("type")
          ? url.searchParams.get("type") || undefined
          : undefined;

        // Ensure user is authenticated
        if (!ctx.session?.userId) {
          return json({ error: "Unauthorized" }, { status: 401 });
        }

        const result = await NotificationService.getUserNotifications(
          ctx.session.userId,
          { limit, offset, unreadOnly, getArchived, type },
        );

        return json(result);
      },
    ],
  },

  PATCH: {
    FILTER: [parseCookie(), authenticate({ parseAuth }), parseSession()],
    HANDLER: [
      async (request, ctx) => {
        const url = new URL(request.url);
        const notificationId = url.searchParams.get("id");

        if (!notificationId) {
          return json({ error: "Notification ID required" }, { status: 400 });
        }

        if (!ctx.session?.userId) {
          return json({ error: "Unauthorized" }, { status: 401 });
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
    FILTER: [parseCookie(), authenticate({ parseAuth }), parseSession()],
    HANDLER: [
      async (request, ctx) => {
        const url = new URL(request.url);
        const action = url.searchParams.get("action");

        if (!ctx.session?.userId) {
          return json({ error: "Unauthorized" }, { status: 401 });
        }

        if (action === "mark-all-read") {
          await NotificationService.markAllAsRead(ctx.session.userId);
          return json({ success: true });
        }

        return json({ error: "Invalid action" }, { status: 400 });
      },
    ],
  },

  DELETE: {
    FILTER: [parseCookie(), authenticate({ parseAuth }), parseSession()],
    HANDLER: [
      async (request, ctx) => {
        const url = new URL(request.url);
        const notificationId = url.searchParams.get("id");
        const deleteNotification = url.searchParams.has("delete")
          ? url.searchParams.get("delete") === "true"
          : undefined;

        if (!notificationId) {
          return json({ error: "Notification ID required" }, { status: 400 });
        }
        let result;
        if (deleteNotification) {
          result = await NotificationService.delete(
            notificationId,
            ctx.session.userId,
          );
        } else {
          result = await NotificationService.archive(
            notificationId,
            ctx.session.userId,
          );
        }
        return result
          ? json({ count: result.length, notifications: result })
          : json(
              {
                error: "Failed to delete notification",
              },
              {
                status: 500,
              },
            );
      },
    ],
  },
} satisfies RouterHandlers<CTXCookie & CTXAuth & CTXSession>;
