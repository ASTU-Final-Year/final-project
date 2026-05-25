// backend/routes/api/v1/notification/broadcast.ts
import {
  authenticate,
  authorize,
  json,
  parseCookie,
  type CTXAuth,
  type CTXCookie,
  type RouterHandlers,
} from "@bepalo/router";
import {
  parseAuth,
  parseSession,
  type CTXSession,
  type OrganizationSession,
} from "~/middleware";
import NotificationService from "~/services/notifcation.service";
import { db } from "~/db";
import { tables } from "~/db/schema";
import { and, eq } from "drizzle-orm";

export default {
  POST: {
    FILTER: [
      parseCookie(),
      authenticate({ parseAuth }),
      authorize({ allowRole: (role) => role === "organization_admin" }),
      parseSession(),
    ],
    HANDLER: [
      async (request, ctx) => {
        // // Only admins can broadcast
        // if (
        //   ctx.session.user?.role !== "super_admin" &&
        //   ctx.session.user?.role !== "organization_admin"
        // ) {
        //   return json({ error: "Unauthorized" }, { status: 403 });
        // }
        const orgSession = ctx.session as OrganizationSession;

        const body = await request.json();
        const {
          type,
          title,
          message,
          priority,
          targetRole,
          actionUrl,
          sendEmail,
        } = body;

        // Get target users based on role
        let users = [];
        console.log(targetRole);

        if (targetRole === "all" || targetRole === "employee") {
          users = await db
            .select({ id: tables.user.id })
            .from(tables.user)
            .leftJoin(
              tables.employee,
              eq(tables.employee.userId, tables.user.id),
            )
            .where(
              eq(tables.employee.organizationId, orgSession.organization.id),
            );
        }
        if (targetRole === "all" || targetRole === "client") {
          users = [
            ...users,
            ...(await db
              .select({ id: tables.user.id })
              .from(tables.user)
              .leftJoin(
                tables.appointment,
                eq(tables.appointment.clientId, tables.user.id),
              )
              .where(
                eq(
                  tables.appointment.organizationId,
                  orgSession.organization.id,
                ),
              )),
          ];
        }

        if (users.length === 0) {
          return json(
            { error: "No users found for target role" },
            { status: 400 },
          );
        }

        // Create notifications
        const notifications = await NotificationService.broadcast(
          users.map((u) => u.id),
          {
            type,
            title,
            message,
            priority: priority || "medium",
            actionUrl,
            metadata: {
              broadcastBy: ctx.session.user.id,
              broadcastAt: new Date().toISOString(),
              targetRole: targetRole || "all",
              sendEmail,
            },
          },
        );

        // Send emails if requested
        if (sendEmail) {
          // Emails are already sent in broadcast for high priority
          // Could add additional logic here
        }

        return json({
          success: true,
          count: notifications.length,
          message: `Notification sent to ${notifications.length} users`,
        });
      },
    ],
  },
} satisfies RouterHandlers<CTXCookie & CTXAuth & CTXSession>;
