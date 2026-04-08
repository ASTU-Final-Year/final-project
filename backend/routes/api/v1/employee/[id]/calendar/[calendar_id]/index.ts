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

const TWeekDay = type("number.integer");

const TYearly = type("Date");

const TCalendarDateRange = type({
  from: "Date",
  to: "Date",
});

const TCalendarOptions = type({
  "ranges?": TCalendarDateRange.array(),
  "weekly?": TWeekDay.array(),
  "yearly?": TYearly.array(),
});

const TCalendarUpdate = type({
  "available?": TCalendarOptions,
  "unavailable?": TCalendarOptions,
});

type CalendarUpdate = typeof TCalendarUpdate.infer;

export default {
  GET: {
    FILTER: [
      parseCookie(),
      authenticate({ parseAuth: parseAuth }),
      authorize({
        allowRole: (role) => role === "employee",
      }),
      parseSession(),
    ],
    HANDLER: [
      async (req, { session, params }) => {
        const { id, calendar_id } = params;
        const employee = await EmployeeService.getEmployeeById(session.userId);
        if (employee == null) {
          return status(Status._404_NotFound, "Employee not found");
        }
        if (employee.userId !== id) {
          return status(Status._403_Forbidden);
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
          available: calendarForm.available,
          unavailable: calendarForm.unavailable,
        });
        if (calendar == null) {
          return status(Status._404_NotFound, "Calendar not found");
        }
        return json({ calendar }, { status: Status._201_Created });
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
