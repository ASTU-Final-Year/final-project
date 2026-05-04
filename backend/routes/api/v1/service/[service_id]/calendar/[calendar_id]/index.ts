// ROUTE /api/v1/service/:id/calendar/:calendar_id
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
import ServiceService from "~/services/organization.services.service";
import OrganizationService from "~/services/organization.service";

const TWeekDay = type("number.integer");

const TYearly = type("Date");

const TCalendarDateRange = type({
  from: "string.date",
  to: "string.date",
});

const TCalendarOptions = type({
  "ranges?": TCalendarDateRange.array(),
  "weekly?": TWeekDay.array(),
  "monthly?": "number[]",
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
      async (req, { auth, session, params }) => {
        const { service_id, calendar_id } = params;
        const organization = await OrganizationService.getOrganizationByAdminId(
          session.userId,
        );
        if (organization == null) {
          return status(Status._404_NotFound, "Organization not found");
        }
        const service = await ServiceService.getServiceByIdByOrganizationId(
          service_id,
          organization.id,
        );
        if (service == null) {
          return status(Status._404_NotFound, "Service not found");
        }
        const calendar = service.calendar;
        if (calendar == null || calendar.id !== calendar_id) {
          return status(Status._404_NotFound, "Calendar not found");
        }
        return json({
          calendar,
        });
      },
    ],
  },
  // PATCH: {
  //   FILTER: [
  //     parseCookie(),
  //     authenticate({ parseAuth: parseAuth }),
  //     authorize({
  //       allowRole: (role) => role === "service",
  //     }),
  //     parseSession(),
  //     parseBody({
  //       accept: ["application/x-www-form-urlencoded", "application/json"],
  //       maxSize: 2 * 1024,
  //       once: true,
  //     }),
  //     (req, ctx) => {
  //       const calendarForm = TCalendarUpdate(ctx.body);
  //       if (calendarForm instanceof ArkErrors) {
  //         return status(Status._400_BadRequest, "Invalid body");
  //       }
  //       ctx.calendarForm = calendarForm;
  //     },
  //   ],
  //   HANDLER: [
  //     async (req, { session, params, calendarForm }) => {
  //       const { id, calendar_id } = params;
  //       const service = await ServiceService.getServiceById(session.userId);
  //       if (service == null) {
  //         return status(Status._404_NotFound, "Service not found");
  //       }
  //       if (service.userId !== id) {
  //         return status(Status._403_Forbidden);
  //       }
  //       const calendar = await ServiceService.updateCalendar({
  //         id: calendar_id,
  //         serviceId: service.userId,
  //         name: calendarForm.name,
  //         description: calendarForm.description,
  //         available: calendarForm.available,
  //         unavailable: calendarForm.unavailable,
  //       });
  //       if (calendar == null) {
  //         return status(Status._404_NotFound, "Calendar not found");
  //       }
  //       return json({ calendar });
  //     },
  //   ],
  // },
} satisfies RouterHandlers<
  CTXCookie & CTXAuth & CTXSession,
  {
    // PATCH: CTXBody & {
    //   body: CalendarUpdate;
    //   calendarForm: CalendarUpdate;
    // };
  }
>;
