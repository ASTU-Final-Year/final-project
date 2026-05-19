// /api/v1/cron/process-tasks/route.ts
import { json, type RouterHandlers } from "@bepalo/router";
import {
  processPendingAppointments,
  reassignOrphanedTasks,
} from "~/lib/task-scheduler";

// Secret key for cron job authentication
const CRON_SECRET = process.env.CRON_SECRET || "your-secret-key-here";

// Run reassignment every 6th cron run (e.g., every 30 minutes if cron runs every 5 minutes)
let reassignmentCounter = 0;
function shouldRunReassignment(): boolean {
  reassignmentCounter++;
  if (reassignmentCounter >= 6) {
    reassignmentCounter = 0;
    return true;
  }
  return false;
}

export default {
  GET: {
    HANDLER: [
      async (request) => {
        // Verify cron job secret
        // const authHeader = request.headers.get("authorization");
        // if (authHeader !== `Bearer ${CRON_SECRET}`) {
        //   return json({ error: "Unauthorized" }, { status: 401 });
        // }

        const results = {
          timestamp: new Date().toISOString(),
          appointmentProcessing: null as any,
          reassignment: null as any,
        };

        try {
          // Process pending appointments (missed by ACL)
          results.appointmentProcessing = await processPendingAppointments();
        } catch (error) {
          console.error("Failed to process appointments:", error);
          results.appointmentProcessing = { error: String(error) };
        }

        try {
          // Reassign orphaned tasks (run less frequently)
          if (shouldRunReassignment()) {
            results.reassignment = await reassignOrphanedTasks();
          } else {
            results.reassignment = {
              skipped: true,
              message: "Not scheduled to run",
            };
          }
        } catch (error) {
          console.error("Failed to reassign tasks:", error);
          results.reassignment = { error: String(error) };
        }

        return json(results);
      },
    ],
  },
} satisfies RouterHandlers;
