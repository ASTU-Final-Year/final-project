// backend/routes/api/v1/notification/test.ts
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
    FILTER: [parseCookie(), authenticate({ parseAuth }), parseSession()],
    HANDLER: [
      async (request, ctx) => {
        if (!ctx.session?.userId) {
          return json({ error: "Unauthorized" }, { status: 401 });
        }

        // Create a test notification
        await NotificationService.create(ctx.session.userId, {
          type: "system_alert",
          title: "Welcome to ServeSync+!",
          message: "Your notification system is working correctly.",
          priority: "medium",
          metadata: { test: true },
          actionUrl: "/dashboard",
        });

        return json({ success: true, message: "Test notification sent" });
      },
    ],
  },
} satisfies RouterHandlers<CTXCookie & CTXAuth & CTXSession>;
