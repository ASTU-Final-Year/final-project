// ROUTE /api/v1/employee/:id/calendar/:service_id
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
import EmployeeService from "~/services/organization.employees.service";
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
        allowRole: (role) =>
          role === "employee" || role === "organization_admin",
      }),
      parseSession(),
    ],
    HANDLER: [
      async (req, { auth, session, params }) => {
        const { id, calendar_id } = params;
        let employee;
        if (auth.role === "organization_admin") {
          const organization =
            await OrganizationService.getOrganizationByAdminId(session.userId);
          if (organization == null) {
            return status(Status._404_NotFound, "Organization not found");
          }
          employee = await EmployeeService.getEmployeeByIdByOrganizationIdPure(
            organization.id,
            id,
          );
          if (employee == null) {
            return status(Status._404_NotFound, "Employee not found");
          }
        } else {
          employee = await EmployeeService.getEmployeeById(session.userId);
          if (employee == null) {
            return status(Status._404_NotFound, "Employee not found");
          }
          if (employee.userId !== id) {
            return status(Status._403_Forbidden);
          }
        }
        const calendar = await EmployeeService.getCalendarByIdByEmployeeId(
          calendar_id,
          employee.userId,
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
        allowRole: (role) => role === "employee",
      }),
      parseSession(),
      parseBody({
        accept: ["application/x-www-form-urlencoded", "application/json"],
        maxSize: 2 * 1024,
        once: true,
      }),
      (req, ctx) => {
        const calendarForm = TCalendarUpdate(ctx.body);
        if (calendarForm instanceof ArkErrors) {
          return status(Status._400_BadRequest, "Invalid body");
        }
        ctx.calendarForm = calendarForm;
      },
    ],
    HANDLER: [
      async (req, { session, params, calendarForm }) => {
        const { id, calendar_id } = params;
        const employee = await EmployeeService.getEmployeeById(session.userId);
        if (employee == null) {
          return status(Status._404_NotFound, "Employee not found");
        }
        if (employee.userId !== id) {
          return status(Status._403_Forbidden);
        }
        const calendar = await EmployeeService.updateCalendar({
          id: calendar_id,
          employeeId: employee.userId,
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
} satisfies RouterHandlers<
  CTXCookie & CTXAuth & CTXSession,
  {
    PATCH: CTXBody & {
      body: CalendarUpdate;
      calendarForm: CalendarUpdate;
    };
  }
>;
