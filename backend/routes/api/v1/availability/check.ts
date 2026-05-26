// ROUTE /api/v1/availability/check.ts
import { json, type RouterHandlers } from "@bepalo/router";
import { db } from "~/db";
import { tables } from "~/db/schema";
import { and, eq, sql } from "drizzle-orm";

export default {
  GET: {
    HANDLER: [
      async (request, ctx) => {
        const url = new URL(request.url);
        const serviceId = url.searchParams.get("serviceId");
        const dateTime = url.searchParams.get("dateTime");

        if (!serviceId || !dateTime) {
          return json({ error: "Missing parameters" }, { status: 400 });
        }

        const startTime = new Date(dateTime);

        // Get service capacity
        const [service] = await db
          .select({
            maxClientsPerSlot: tables.organizationService.maxClientsPerSlot,
            slotDuration: tables.organizationService.slotDuration,
          })
          .from(tables.organizationService)
          .where(eq(tables.organizationService.id, serviceId))
          .limit(1);

        const maxCapacity = service?.maxClientsPerSlot || 5;
        const slotDuration = service?.slotDuration || 60;

        const endTime = new Date(startTime);
        endTime.setMinutes(endTime.getMinutes() + slotDuration);

        // Count current bookings
        const [currentBookings] = await db
          .select({ count: sql<number>`count(*)` })
          .from(tables.appointment)
          .where(
            and(
              eq(tables.appointment.serviceId, serviceId),
              eq(tables.appointment.isActive, true),
              eq(tables.appointment.status, "scheduled"),
              sql`${tables.appointment.startTime} < ${endTime.toISOString()}`,
              sql`${tables.appointment.endTime} > ${startTime.toISOString()}`,
            ),
          );

        return json({
          available: currentBookings.count < maxCapacity,
          currentBookings: currentBookings.count,
          maxCapacity: maxCapacity,
          remaining: maxCapacity - currentBookings.count,
        });
      },
    ],
  },
} satisfies RouterHandlers;
