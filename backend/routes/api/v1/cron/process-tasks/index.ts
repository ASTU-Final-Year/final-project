// backend/routes/api/v1/cron/process-tasks/route.ts
import { json, type RouterHandlers } from "@bepalo/router";
import {
  processPendingAppointments,
  reassignOrphanedTasks,
  archiveOldTasks,
} from "~/lib/task-scheduler";

// Secret key for cron job authentication
const CRON_SECRET = process.env.CRON_SECRET || "your-secret-key-here";

// Simple in-memory lock to prevent concurrent runs
let isRunning = false;
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

        // Prevent concurrent runs
        if (isRunning) {
          return json(
            {
              error: "Previous cron job still running",
              timestamp: new Date().toISOString(),
            },
            { status: 409 },
          );
        }

        isRunning = true;
        const results = {
          timestamp: new Date().toISOString(),
          appointmentProcessing: null as any,
          reassignment: null as any,
          archiving: null as any,
        };

        try {
          // Process pending appointments and create tasks (only for appointments without tasks)
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
              nextRunIn: `${(6 - reassignmentCounter) * 5} minutes`,
            };
          }
        } catch (error) {
          console.error("Failed to reassign tasks:", error);
          results.reassignment = { error: String(error) };
        }

        try {
          // Archive old tasks (run daily)
          const hour = new Date().getHours();
          if (hour === 2) {
            // Run at 2 AM daily
            results.archiving = await archiveOldTasks(30);
          } else {
            results.archiving = {
              skipped: true,
              message: "Scheduled for 2 AM",
            };
          }
        } catch (error) {
          console.error("Failed to archive tasks:", error);
          results.archiving = { error: String(error) };
        }

        isRunning = false;
        return json(results);
      },
    ],
  },
} satisfies RouterHandlers;
