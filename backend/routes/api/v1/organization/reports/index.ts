import { and, between, eq, sql } from "drizzle-orm";
import { db } from "~/db";
import { tasks, appointments, organizationServices, employees } from "~/db/schema";
import { authenticate, authorize, json, RouterHandlers } from "@bepalo/router";

export default {
  GET: {
    FILTER: [
      authenticate({ parseAuth }),
      authorize({ allowRole: (r) => r === "organization_admin" }),
    ],
    HANDLER: async (req, { session, query }) => {
      const { startDate, endDate, type } = query;
      const orgId = session.organization?.id; // Adjust based on your session object

      if (!orgId) return json({ error: "Organization not found" }, { status: 400 });

      const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const end = endDate ? new Date(endDate) : new Date();

      let data = {};

      switch (type) {
        case "appointments":
          const appointmentStats = await db
            .select({
              date: sql`DATE(${appointments.createdAt})`,
              count: sql<number>`COUNT(*)`,
            })
            .from(appointments)
            .where(
              and(
                eq(appointments.organizationId, orgId),
                between(appointments.createdAt, start, end)
              )
            )
            .groupBy(sql`DATE(${appointments.createdAt})`);
          data = appointmentStats;
          break;

        case "employeePerformance":
          const employeeStats = await db
            .select({
              employeeId: employees.id,
              employeeName: sql`${employees.firstname} || ' ' || ${employees.lastname}`,
              completedTasks: sql<number>`SUM(CASE WHEN ${tasks.status} = 'completed' THEN 1 ELSE 0 END)`,
              totalTasks: sql<number>`COUNT(${tasks.id})`,
            })
            .from(employees)
            .leftJoin(tasks, eq(employees.id, tasks.employeeId))
            .where(eq(employees.organizationId, orgId))
            .groupBy(employees.id);
          data = employeeStats;
          break;

        case "servicePopularity":
          const serviceStats = await db
            .select({
              serviceId: organizationServices.id,
              serviceName: organizationServices.name,
              bookingCount: sql<number>`COUNT(${appointments.id})`,
            })
            .from(organizationServices)
            .leftJoin(appointments, eq(organizationServices.id, appointments.serviceId))
            .where(eq(organizationServices.organizationId, orgId))
            .groupBy(organizationServices.id)
            .orderBy(sql`COUNT(${appointments.id})`, "desc");
          data = serviceStats;
          break;

        default:
          return json({ error: "Invalid report type" }, { status: 400 });
      }

      return json({ data, type, startDate: start, endDate: end });
    },
  },
} satisfies RouterHandlers;