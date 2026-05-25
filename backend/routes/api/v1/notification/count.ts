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
        // const limit = parseInt(url.searchParams.get("limit") || "20");
        // const offset = parseInt(url.searchParams.get("offset") || "0");
        const isUnread = url.searchParams.has("unread")
          ? url.searchParams.get("unread") === "true"
          : undefined;
        const isArchived = url.searchParams.has("archived")
          ? url.searchParams.get("archived") === "true"
          : undefined;
        const type = url.searchParams.has("type")
          ? url.searchParams.get("type") || undefined
          : undefined;
        const count = await NotificationService.getCount(ctx.session.userId, {
          isUnread,
          isArchived,
          type,
        });
        return json({ count });
      },
    ],
  },
} satisfies RouterHandlers<CTXCookie & CTXAuth & CTXSession>;
