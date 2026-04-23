// ROUTE /api/v1/organization/:id/calendar/:service_id
import {
  authenticate,
  authorize,
  CTXAuth,
  CTXBody,
  CTXCookie,
  json,
  parseBody,
  parseCookie,
  RouterHandlers,
  Status,
  status,
} from "@bepalo/router";
import { ArkErrors, type } from "arktype";
import { CTXSession } from "~/base";
import { parseAuth, parseSession } from "~/middleware";
import OrganizationService from "~/services/organization.service";

const TWeekDay = type("number.integer");

const TCalendarDateRange = type({
  from: "string.date",
  to: "string.date",
});

const TCalendarOptions = type({
  "ranges?": TCalendarDateRange.array().or("null"),
  "weekly?": TWeekDay.array().or("null"),
  "monthly?": "number[]|null",
  "exactly?": "string.date[]|null",
});

const TCalendarUpdate = type({
  "name?": "3 < string <= 54",
  "description?": "string <= 200",
  "available?": TCalendarOptions.or("null"),
  "unavailable?": TCalendarOptions.or("null"),
});

type CalendarUpdate = typeof TCalendarUpdate.infer;

export default {
  GET: {
    FILTER: [
      parseCookie(),
      authenticate({ parseAuth: parseAuth }),
      authorize({
        allowRole: (role) => role === "organization_admin",
      }),
      parseSession(),
    ],
    HANDLER: [
      async (req, { session, params }) => {
        const { id, calendar_id } = params;
        const organization =
          await OrganizationService.getOrganizationByAdminIdPure(
            session.userId,
          );
        if (organization == null) {
          return status(Status._404_NotFound, "Organization not found");
        }
        if (organization.id !== id) {
          return status(Status._403_Forbidden);
        }
        const calendar =
          await OrganizationService.getCalendarByIdByOrganizationId(
            calendar_id,
            organization.id,
          );
        if (calendar == null) {
          return status(Status._404_NotFound, "Calendar not found");
        }
        return json({
          calendar,
        });
      },
    ],
  },
  PATCH: {
    FILTER: [
      parseCookie(),
      authenticate({ parseAuth: parseAuth }),
      authorize({
        allowRole: (role) => role === "organization_admin",
      }),
      parseSession(),
      parseBody({
        accept: ["application/x-www-form-urlencoded", "application/json"],
        maxSize: 2 * 1024,
        once: true,
      }),
      (req, ctx) => {
        const calendarForm = TCalendarUpdate(ctx.body);
        console.log(calendarForm.toString());
        if (calendarForm instanceof ArkErrors) {
          return status(Status._400_BadRequest, "Invalid body");
        }
        ctx.calendarForm = calendarForm;
      },
    ],
    HANDLER: [
      async (req, { session, params, calendarForm }) => {
        const { id, calendar_id } = params;
        const organization =
          await OrganizationService.getOrganizationByAdminIdPure(
            session.userId,
          );
        if (organization == null) {
          return status(Status._404_NotFound, "Organization not found");
        }
        if (organization.id !== id) {
          return status(Status._403_Forbidden);
        }
        const calendar = await OrganizationService.updateCalendar({
          id: calendar_id,
          organizationId: organization.id,
          name: calendarForm.name,
          description: calendarForm.description,
          available: calendarForm.available,
          unavailable: calendarForm.unavailable,
        });
        if (calendar == null) {
          return status(Status._404_NotFound, "Calendar not found");
        }
        return json({ calendar });
      },
    ],
  },
  DELETE: {
    FILTER: [
      parseCookie(),
      authenticate({ parseAuth: parseAuth }),
      authorize({
        allowRole: (role) => role === "organization_admin",
      }),
      parseSession(),
    ],
    HANDLER: [
      async (req, { session, params }) => {
        const { id, calendar_id } = params;
        const organization =
          await OrganizationService.getOrganizationByAdminIdPure(
            session.userId,
          );
        if (organization == null) {
          return status(Status._404_NotFound, "Organization not found");
        }
        if (organization.id !== id) {
          return status(Status._403_Forbidden);
        }
        const calendar =
          await OrganizationService.deleteCalendarById(calendar_id);
        if (calendar == null) {
          return status(Status._404_NotFound, "Calendar not found");
        }
        return json({ success: true });
      },
    ],
  },
} satisfies RouterHandlers<
  CTXCookie & CTXAuth & CTXSession,
  {
    PATCH: CTXBody & {
      body: CalendarUpdate;
      calendarForm: CalendarUpdate;
    };
  }
>;
