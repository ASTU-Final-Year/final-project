// backend/routes/api/v1/notification/unread-count.ts
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

        const count = await NotificationService.getUnreadCount(
          ctx.session.userId,
        );
        return json({ count });
      },
    ],
  },
} satisfies RouterHandlers<CTXCookie & CTXAuth & CTXSession>;
