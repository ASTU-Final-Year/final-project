import { eq } from "drizzle-orm";
import { db } from "~/db";
import { tasks } from "~/db/schema";
import { authenticate, authorize, json, status, RouterHandlers } from "@bepalo/router";
import { type } from "arktype";

const updateTaskSchema = type({
  status: "'pending'|'in_progress'|'completed'|'cancelled'",
  isDone: "boolean?",
  progress: "record?",
});

export default {
  GET: {
    FILTER: [authenticate({ parseAuth }), authorize({ allowRole: (r) => r === "employee" })],
    HANDLER: async (req, { params, session }) => {
      const { taskId } = params;
      const employeeId = session.userId;
      
      const [task] = await db
        .select()
        .from(tasks)
        .where(eq(tasks.id, taskId));
        
      if (!task) return status(404, "Task not found");
      if (task.employeeId !== employeeId) return status(403, "Not assigned to you");
      
      return json({ task });
    },
  },
  
  PATCH: {
    FILTER: [authenticate({ parseAuth }), authorize({ allowRole: (r) => r === "employee" })],
    HANDLER: async (req, { params, body, session }) => {
      const { taskId } = params;
      const employeeId = session.userId;
      
      const validated = updateTaskSchema(body);
      if (validated instanceof Error) return status(400, "Invalid request body");
      
      const [existing] = await db.select().from(tasks).where(eq(tasks.id, taskId));
      if (!existing) return status(404, "Task not found");
      if (existing.employeeId !== employeeId) return status(403, "Not assigned to you");
      
      const updated = await db
        .update(tasks)
        .set({ 
          status: validated.status, 
          isDone: validated.isDone ?? (validated.status === "completed"),
          updatedAt: new Date(),
        })
        .where(eq(tasks.id, taskId))
        .returning();
        
      return json({ task: updated[0] });
    },
  },
} satisfies RouterHandlers;