import { eq } from "drizzle-orm";
import { db } from "~/db";
import { tasks, users, organizationServices } from "~/db/schema";
import { authenticate, authorize, json, RouterHandlers } from "@bepalo/router";

export default {
  GET: {
    FILTER: [
      authenticate({ parseAuth }),
      authorize({ allowRole: (r) => r === "employee" }),
    ],
    HANDLER: async (req, { session }) => {
      const employeeId = session.userId;
      
      const taskList = await db
        .select({
          id: tasks.id,
          name: tasks.name,
          status: tasks.status,
          isDone: tasks.isDone,
          progress: tasks.progress,
          clientName: sql`${users.firstname} || ' ' || ${users.lastname}`,
          clientEmail: users.email,
          serviceName: organizationServices.name,
          createdAt: tasks.createdAt,
          updatedAt: tasks.updatedAt,
        })
        .from(tasks)
        .leftJoin(users, eq(tasks.clientId, users.id))
        .leftJoin(organizationServices, eq(tasks.serviceId, organizationServices.id))
        .where(eq(tasks.employeeId, employeeId));
        
      return json({ tasks: taskList });
    },
  },
} satisfies RouterHandlers;