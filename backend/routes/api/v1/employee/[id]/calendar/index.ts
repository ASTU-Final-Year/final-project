// ROUTE /api/v1/employee/:id/calendar

import {
  authenticate,
  authorize,
  CTXAuth,
  CTXBody,
  CTXCookie,
  CTXQuery,
  json,
  parseBody,
  parseCookie,
  parseQuery,
  RouterHandlers,
  Status,
  status,
} from "@bepalo/router";
import { ArkErrors, type } from "arktype";
import { CTXSession } from "~/base";
import { parseAuth, parseSession } from "~/middleware";
import EmployeeService from "~/services/organization.employees.service";

const TWeekDay = type("number.integer");

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

const TCalendarRegistration = type({
  name: "3 < string <= 54",
  description: "string <= 200",
  "available?": TCalendarOptions.or("null"),
  "unavailable?": TCalendarOptions.or("null"),
});

type CalendarRegistration = typeof TCalendarRegistration.infer;

export default {
  POST: {
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
        const calendarForm = TCalendarRegistration(ctx.body);
        if (calendarForm instanceof ArkErrors) {
          return status(Status._400_BadRequest, "Invalid body");
        }
        ctx.calendarForm = calendarForm;
      },
    ],
    HANDLER: [
      async (req, { session, calendarForm }) => {
        const employee = await EmployeeService.getEmployeeById(session.userId);
        if (!employee) {
          return status(Status._404_NotFound, "Employee not found");
        }
        const calendar = await EmployeeService.createCalendar({
          employeeId: employee.userId,
          name: calendarForm.name,
          description: calendarForm.description,
          available: calendarForm.available,
          unavailable: calendarForm.unavailable,
        });
        return json({ calendar }, { status: Status._201_Created });
      },
    ],
  },
} satisfies RouterHandlers<
  CTXCookie & CTXAuth & CTXSession,
  {
    POST: CTXBody & {
      body: CalendarRegistration;
      calendarForm: CalendarRegistration;
    };
  }
>;
