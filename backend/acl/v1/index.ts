// acl/v1/index.ts

import { and, eq, type InferSelectModel, sql } from "drizzle-orm";
import { tables } from "~/db/schema";
import {
  genArkSchemaValidator,
  HttpError,
  omit,
  type QueryAuth,
} from "~/lib/bepalo-query-utils";
import { ArkErrors, type } from "arktype";
import { db, type Transaction } from "~/db";
import { clearCookie, setCookie, Status } from "@bepalo/router";
import { config, securityConfig } from "~/config";
import {
  hashPassword,
  sessionJwt,
  verifyPassword,
  type CTXSession,
  type EmployeeSession,
  type OrganizationSession,
  type Session,
} from "~/middleware";
import { JWT } from "@bepalo/jwt";

export const queryAuth = {
  pricingPlan: {
    GET: {
      guest: {
        select: { ...tables.pricingPlan, price1: sql`price` },
      },

      allUsers: {
        select: tables.pricingPlan,
      },
    },
  },

  appointment: {
    GET: {
      client: {
        select: tables.appointment,
        include: {
          client: [
            omit(tables.user, ["password"]),
            eq(tables.user.id, tables.appointment.clientId),
            "user",
          ],
          service: [
            tables.organizationService,
            eq(tables.organizationService.id, tables.appointment.serviceId),
            "organizationService",
          ],
          organization: [
            omit(tables.organization, [
              "adminId",
              "billingStart",
              "billingEnd",
              "billingPeriod",
              "updatedAt",
            ]),
            eq(tables.organization.id, tables.appointment.organizationId),
          ],
        },
        where: (req, { session }) =>
          eq(tables.appointment.clientId, session.userId),
      },
    },

    POST: {
      client: {
        select: tables.appointment,
        validateBody: async (body, req, ctx) => {
          const b = genArkSchemaValidator(
            omit(tables.appointment, [
              "id",
              "clientId",
              "organizationId",
              "status",
              "notes",
              "metadata",
              "createdAt",
              "updatedAt",
            ]),
          )(body);
          if (b instanceof ArkErrors) {
            return b;
          }
          const [service] = await db
            .select()
            .from(tables.organizationService)
            .where(eq(tables.organizationService.id, b.serviceId as string));
          if (!service) {
            throw new HttpError("Service not found", 404);
          }
          ctx.data = { service };
          return b;
        },
        injectBody: (body, req, { session, data }) => ({
          ...body,
          clientId: session.userId,
          serviceId: (data as any).service.id,
          organizationId: (data as any).service.organizationId,
        }),
      },
    },

    DELETE: {
      client: {
        select: tables.appointment,
        where: (req, { session }) =>
          eq(tables.appointment.clientId, session.userId),
      },
    },
  },

  task: {
    GET: {
      client: {
        select: tables.task,
        include: {
          appointment: [
            tables.appointment,
            eq(tables.appointment.id, tables.task.appointmentId),
          ],
          // organization: [
          //   omit(tables.organization, [
          //     "adminId",
          //     "billingStart",
          //     "billingEnd",
          //     "billingPeriod",
          //     "updatedAt",
          //   ]),
          //   eq(tables.organization.id, tables.task.organizationId),
          // ],
          client: [
            omit(tables.user, ["password"]),
            eq(tables.user.id, tables.appointment.clientId),
          ],
        },
        where: (req, { session }) =>
          eq(tables.appointment.clientId, session.userId),
      },
      employee: {
        select: tables.task,
        where: (req, { session }) =>
          eq(tables.task.employeeId, (session as EmployeeSession).employee.id),
      },
    },

    POST: {
      client: {
        select: tables.task,
        validateBody: async (body, req, ctx) => {
          const b = genArkSchemaValidator(
            omit(tables.task, ["id", "isDone", "createdAt", "updatedAt"]),
          )(body);
          if (!(b instanceof ArkErrors)) {
            const [service] = await db
              .select({ id: tables.organizationService.id })
              .from(tables.organizationService)
              .where(eq(tables.organizationService.id, b.serviceId as string));
            if (!service) {
              throw new HttpError("Service not found", Status._400_BadRequest);
            }
            ctx.data.service = service;
          }
          return b;
        },
        injectBody: (body, req, { data, session }) => ({
          ...body,
          organizationId: (data as any).service.organizationId,
          sessionId: session.id,
        }),
      },

      employee: {
        select: tables.task,
        validateBody: async (body, req, ctx) => {
          const b = genArkSchemaValidator(
            omit(tables.task, ["id", "isDone", "createdAt", "updatedAt"]),
          )(body);
          if (!(b instanceof ArkErrors)) {
            const [service] = await db
              .select({ id: tables.organizationService.id })
              .from(tables.organizationService)
              .where(eq(tables.organizationService.id, b.serviceId as string));
            if (!service) {
              throw new HttpError("Service not found", Status._400_BadRequest);
            }
            ctx.data.service = service;
          }
          return b;
        },
        injectBody: (body, req, { data, session }) => ({
          ...body,
          organizationId: (session as EmployeeSession).employee.organizationId,
          sessionId: session.id,
        }),
      },
    },
  },

  organization: {
    GET: {
      guest: {
        select: omit(tables.organization, [
          "adminId",
          "billingStart",
          "billingEnd",
          "billingPeriod",
          "updatedAt",
        ]),
        include: {
          admin: [
            omit(tables.user, ["password", "createdAt", "updatedAt"]),
            eq(tables.user.id, tables.organization.adminId),
            "user",
          ],
          pricingPlan: [
            omit(tables.pricingPlan, ["createdAt", "updatedAt"]),
            eq(tables.pricingPlan.id, tables.organization.pricingPlanId),
          ],
        },
      },

      organization_admin: {
        select: tables.organization,
        include: {
          admin: [
            omit(tables.user, ["password", "createdAt", "updatedAt"]),
            eq(tables.user.id, tables.organization.adminId),
            "user",
          ],
          pricingPlan: [
            omit(tables.pricingPlan, ["createdAt", "updatedAt"]),
            eq(tables.pricingPlan.id, tables.organization.pricingPlanId),
          ],
        },
        where: (req, { session }) =>
          eq(tables.organization.adminId, session.userId),
      },
    },

    POST: {
      guest: {
        select: tables.organization,
        validateBody: genArkSchemaValidator({
          ...omit(tables.organization, [
            "id",
            "adminId",
            "rating",
            "billingStart",
            "billingEnd",
            "createdAt",
            "updatedAt",
          ]),
          admin: omit(tables.user, ["id", "createdAt", "updatedAt"]),
        }),
        injectBody: (body, req, ctx) => {
          const { admin, ...b } = body as Record<string, unknown>;
          ctx.data = { admin };
          return b;
        },
        beforeQuery: async (req, ctx) => {
          const body = ctx.body as Record<string, unknown>;
          const data = ctx.data as { admin: Record<string, unknown> };
          const [existingUser] = (await ctx.transaction
            .select({ count: sql`count (*)` })
            .from(tables.user)
            .where(eq(tables.user.email, data.admin.email as string))) as {
            count: number;
          }[];
          if (existingUser?.count && existingUser.count > 0) {
            throw new HttpError(
              "Admin with the same email already registered",
              400,
            );
          }
          const [admin] = await ctx.transaction
            .insert(tables.user)
            .values({
              ...(data.admin as InferSelectModel<typeof tables.user>),
              password: hashPassword(data.admin.password as string),
              role: "organization_admin",
            })
            .returning();
          ctx.data = { admin };
          if (!admin) throw new HttpError("Insert admin user failed", 500);
          body.adminId = admin.id;
        },
        // onQueryError: async (req, ctx) => {
        //   ctx.dontRollback = true;
        //   // const data = ctx.data as { admin: Record<string, unknown> };
        //   // if (data.admin?.id) {
        //   //   await db
        //   //     .delete(tables.user)
        //   //     .where(eq(tables.user.id, data.admin.id as string));
        //   // }
        // },
      },
    },

    DELETE: {
      organization_admin: {
        select: tables.organization,
        where: (req, { session }) =>
          eq(
            tables.organizationCalendar.organizationId,
            (session as OrganizationSession).organization.id,
          ),
      },
    },
  },

  organizationCalendar: {
    GET: {
      guest: {
        select: omit(tables.organizationCalendar, ["updatedAt"]),
        include: {
          organization: [
            omit(tables.organization, [
              "adminId",
              "billingStart",
              "billingEnd",
              "billingPeriod",
            ]),
            eq(
              tables.organization.id,
              tables.organizationCalendar.organizationId,
            ),
          ],
        },
      },

      organization_admin: {
        select: tables.organizationCalendar,
        include: {
          organization: [
            tables.organization,
            eq(
              tables.organization.id,
              tables.organizationCalendar.organizationId,
            ),
          ],
        },
        where: (req, { session }) =>
          eq(
            tables.organizationCalendar.organizationId,
            (session as OrganizationSession).organization.id,
          ),
      },

      employee: {
        select: tables.organizationCalendar,
        include: {
          organization: [
            tables.organization,
            eq(
              tables.organization.id,
              tables.organizationCalendar.organizationId,
            ),
          ],
          employee: [
            tables.employee,
            eq(
              tables.employee.organizationId,
              tables.organizationCalendar.organizationId,
            ),
          ],
        },
        where: (req, { session }) =>
          eq(tables.organizationCalendar.id, tables.employee.calendarId),
      },
    },

    POST: {
      organization_admin: {
        select: tables.organizationCalendar,
        validateBody: genArkSchemaValidator(
          omit(tables.organizationCalendar, [
            "id",
            "organizationId",
            "createdAt",
            "updatedAt",
          ]),
          { available: 1, unavailable: 1 },
        ),
        injectBody: (body, req, { session }) => ({
          ...body,
          organizationId: (session as OrganizationSession).organization.id,
        }),
      },
    },

    PATCH: {
      organization_admin: {
        select: tables.organizationCalendar,
        validateBody: genArkSchemaValidator(
          omit(tables.organizationCalendar, [
            "id",
            "organizationId",
            "createdAt",
            "updatedAt",
          ]),
          true,
        ),
        injectBody: (body, req, { session }) => ({
          ...body,
          organizationId: (session as OrganizationSession).organization.id,
        }),
        where: (req, { session }) =>
          eq(
            tables.organizationCalendar.organizationId,
            (session as OrganizationSession).organization.id,
          ),
      },
    },

    DELETE: {
      organization_admin: {
        select: tables.organizationCalendar,
        where: (req, { session }) =>
          eq(
            tables.organizationCalendar.organizationId,
            (session as OrganizationSession).organization.id,
          ),
      },
    },
  },

  organizationService: {
    GET: {
      guest: {
        select: tables.organizationService,
        include: {
          calendar: [
            tables.organizationCalendar,
            eq(
              tables.organizationCalendar.id,
              tables.organizationService.calendarId,
            ),
            "organizationCalendar",
          ],
          organization: [
            omit(tables.organization, [
              "adminId",
              "billingStart",
              "billingEnd",
              "billingPeriod",
              "updatedAt",
            ]),
            eq(
              tables.organization.id,
              tables.organizationService.organizationId,
            ),
          ],
        },
        where: () => eq(tables.organization.isActive, true),
      },

      organization_admin: {
        select: tables.organizationService,
        include: {
          calendar: [
            tables.organizationCalendar,
            eq(
              tables.organizationCalendar.id,
              tables.organizationService.calendarId,
            ),
            "organizationCalendar",
          ],
          organization: [
            tables.organization,
            eq(
              tables.organization.id,
              tables.organizationService.organizationId,
            ),
          ],
        },
        where: (req, { session }) =>
          eq(
            tables.organizationService.organizationId,
            (session as OrganizationSession).organization.id,
          ),
      },

      employee: {
        select: tables.organizationService,
        include: {
          organization: [
            tables.organization,
            eq(
              tables.organization.id,
              tables.organizationService.organizationId,
            ),
          ],
          employee: [
            tables.employee,
            eq(
              tables.employee.organizationId,
              tables.organizationService.organizationId,
            ),
          ],
        },
        where: () =>
          eq(tables.organizationService.id, tables.employee.calendarId),
      },
    },

    POST: {
      organization_admin: {
        select: tables.organizationService,
        validateBody: genArkSchemaValidator(
          omit(tables.organizationService, [
            "id",
            "organizationId",
            "createdAt",
            "updatedAt",
          ]),
        ),
        injectBody: (body, req, { session }) => ({
          ...body,
          organizationId: (session as OrganizationSession).organization.id,
        }),
      },
    },

    PATCH: {
      organization_admin: {
        select: tables.organizationService,
        validateBody: genArkSchemaValidator(
          omit(tables.organizationService, [
            "id",
            "organizationId",
            "createdAt",
            "updatedAt",
          ]),
          true,
        ),
        injectBody: (body, req, { session }) => ({
          ...body,
          organizationId: (session as OrganizationSession).organization.id,
          updatedAt: new Date(),
        }),
        where: (req, { session }) =>
          eq(
            tables.organizationService.organizationId,
            (session as OrganizationSession).organization.id,
          ),
      },
    },

    DELETE: {
      organization_admin: {
        select: tables.organizationService,
        where: (req, { session }) =>
          eq(
            tables.organizationService.organizationId,
            (session as OrganizationSession).organization.id,
          ),
      },
    },
  },

  employee: {
    GET: {
      employee: {
        select: tables.employee,
        include: {
          user: [tables.user, eq(tables.user.id, tables.employee.userId)],
          organization: [
            tables.organization,
            eq(tables.organization.id, tables.employee.organizationId),
          ],
          organizationCalendar: [
            tables.organizationCalendar,
            eq(tables.organizationCalendar.id, tables.employee.calendarId),
          ],
        },
        where: (req, { session }) => eq(tables.employee.userId, session.userId),
      },

      organization_admin: {
        select: tables.employee,
        include: {
          user: [
            omit(tables.user, ["password"]),
            eq(tables.user.id, tables.employee.userId),
          ],
          organization: [
            tables.organization,
            eq(tables.organization.id, tables.employee.organizationId),
          ],
          calendar: [
            tables.organizationCalendar,
            eq(tables.organizationCalendar.id, tables.employee.calendarId),
            "organizationCalendar",
          ],
        },
        where: (req, { session }) =>
          eq(
            tables.employee.organizationId,
            (session as OrganizationSession).organization.id,
          ),
      },
    },

    POST: {
      organization_admin: {
        select: tables.employee,
        validateBody: genArkSchemaValidator(
          omit({ ...tables.employee, email: tables.user.email }, [
            "id",
            "userId",
            "organizationId",
            "createdAt",
            "updatedAt",
          ]),
          { calendarId: true },
        ),
        injectBody: async (body, req, { session }) => {
          const [user] = await db
            .select({ id: tables.user.id })
            .from(tables.user)
            .where(
              and(
                eq(tables.user.email, body.email as string),
                eq(tables.user.role, "employee"),
              ),
            );
          if (!user) throw new HttpError(`Employee with email not found`, 400);
          const { email: userEmail, ...b } = body;
          return {
            ...b,
            userId: user.id,
            organizationId: (session as EmployeeSession).employee
              .organizationId,
          };
        },
      },
    },

    PATCH: {
      organization_admin: {
        select: tables.employee,
        validateBody: genArkSchemaValidator(
          omit(tables.employee, [
            "id",
            "organizationId",
            "createdAt",
            "updatedAt",
          ]),
          true,
        ),
        where: (req, { session }) =>
          eq(
            tables.employee.organizationId,
            (session as OrganizationSession).organization.id,
          ),
      },
    },

    DELETE: {
      organization_admin: {
        select: tables.employee,
        where: (req, { session }) =>
          eq(
            tables.employee.organizationId,
            (session as OrganizationSession).organization.id,
          ),
      },
    },
  },

  user: {
    GET: {
      mine: {
        select: omit(tables.user, ["password", "updatedAt"]),
        where: (req, { session }) => eq(tables.user.id, session.userId),
      },
    },

    POST: {
      guest: {
        select: omit(tables.user, ["password"]),
        validateBody: genArkSchemaValidator({
          ...omit(tables.user, ["id", "role", "createdAt", "updatedAt"]),
          omit: type("'user'|'organization_admin'"),
        }),
        injectBody: (body) => ({
          ...body,
          password: hashPassword(body.password as string),
        }),
      },
    },

    PATCH: {
      mine: {
        select: omit(tables.user, ["password"]),
        validateBody: genArkSchemaValidator(
          omit(tables.user, ["id", "role", "createdAt", "updatedAt"]),
          true,
        ),
        injectBody: (body) =>
          body.password
            ? {
                ...body,
                password: hashPassword(body.password as string),
              }
            : body,
        where: (req, { session }) => eq(tables.user.id, session.userId),
      },
    },

    DELETE: {
      mine: {
        select: omit(tables.user, ["password"]),
        where: (req, { session }) => eq(tables.user.id, session.userId),
      },
    },
  },

  session: {
    GET: {
      mine: {
        select: omit(tables.session, ["updatedAt"]),
        include: {
          user: [tables.user, eq(tables.user.id, tables.session.userId)],
        },
        where: (req, { session }) => eq(tables.session.id, session.id),
      },
    },

    POST: {
      guest: {
        select: omit(tables.session, ["updatedAt"]),
        validateBody: async (body, req, ctx) => {
          const b = type({
            email: "string.email",
            password: "4 <= string <= 40",
          })(body);
          if (b instanceof ArkErrors) {
            return b;
          }
          const [userUnsafe] = await db
            .select()
            .from(tables.user)
            .where(eq(tables.user.email, b.email));
          if (!userUnsafe) {
            throw new HttpError("User not registerd", Status._401_Unauthorized);
          }
          const { password, ...user } = userUnsafe as Required<
            InferSelectModel<typeof tables.user>
          >;
          const passwordMatches = verifyPassword(b.password, password);
          if (!passwordMatches) {
            throw new HttpError("Invalid password", Status._401_Unauthorized);
          }
          ctx.session = {
            user,
          } as Session;
          return b;
        },
        injectBody: (body, req, ctx) => {
          const user = ctx.session.user;
          const session = {
            userId: user.id,
            expiresAt: new Date(Date.now() + securityConfig.sessionMaxAge),
            data: {},
          };
          return session;
        },
        afterQuery: (req, ctx) => {
          const user = ctx.session.user;
          ctx.result.sessions.map((session: Session) => {
            session.user = user;
          });
          const session = ctx.result.sessions[0];
          const sessionCookieToken = sessionJwt.signSync({
            sid: session.id,
            role: user.role,
            iat: JWT.now(),
            exp: Math.floor((Date.now() + securityConfig.sessionMaxAge) / 1000),
          });
          ctx.headers.append(
            ...setCookie(securityConfig.sessionCookie, sessionCookieToken, {
              path: "/",
              expires: new Date(Date.now() + securityConfig.sessionMaxAge),
              httpOnly: true,
              // secure: config.isProduction,
            }),
          );
          ctx.result.token = sessionCookieToken;
        },
      },
    },

    DELETE: {
      mine: {
        select: tables.session,
        where: (req, { session }) => eq(tables.session.id, session.id),
        afterQuery: (req, ctx) => {
          ctx.headers.append(
            ...clearCookie(securityConfig.sessionCookie, {
              path: "/",
              httpOnly: true,
              secure: config.isProduction,
            }),
          );
        },
      },
    },
  },
} satisfies QueryAuth<
  typeof tables,
  Transaction,
  { data?: Record<string, unknown> } & CTXSession
>;

export default queryAuth;
