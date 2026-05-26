// backend/routes/api/v1/payment/index.ts
import {
  authenticate,
  json,
  parseCookie,
  type CTXAuth,
  type CTXCookie,
  type RouterHandlers,
} from "@bepalo/router";
import { parseAuth, parseSession, type CTXSession } from "~/middleware";
import { db } from "~/db";
import { tables } from "~/db/schema";
import { eq } from "drizzle-orm";

export default {
  GET: {
    FILTER: [parseCookie(), authenticate({ parseAuth }), parseSession()],
    HANDLER: [
      async (request, ctx) => {
        const url = new URL(request.url);
        const appointmentId = url.searchParams.get("appointmentId");

        if (!appointmentId) {
          return json({ error: "appointmentId is required" }, { status: 400 });
        }

        const payments = await db
          .select()
          .from(tables.payment)
          .where(eq(tables.payment.appointmentId, appointmentId))
          .orderBy(tables.payment.createdAt);

        return json({ payments });
      },
    ],
  },
} satisfies RouterHandlers<CTXCookie & CTXAuth & CTXSession>;
