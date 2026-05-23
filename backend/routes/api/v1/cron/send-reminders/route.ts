// backend/routes/api/v1/cron/send-reminders/route.ts
import { json, type RouterHandlers } from "@bepalo/router";
import { sendAppointmentReminders } from "~/hooks/notificationHooks";

export default {
  GET: {
    HANDLER: [
      async (request) => {
        // Verify cron secret
        const authHeader = request.headers.get("authorization");
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
          return json({ error: "Unauthorized" }, { status: 401 });
        }

        await sendAppointmentReminders();

        return json({ success: true, timestamp: new Date().toISOString() });
      },
    ],
  },
} satisfies RouterHandlers;
