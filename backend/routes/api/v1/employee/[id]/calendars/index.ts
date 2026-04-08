// ROUTE /api/v1/organization/:id/calendars

import {
  authenticate,
  authorize,
  CTXAuth,
  CTXBody,
  CTXCookie,
  CTXQuery,
  json,
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

const TPagenater = type({
  "o?": "string",
  "l?": "string",
  "iemployee?": "unknown",
});

type Pagenater = typeof TPagenater.infer;

export default {
  GET: {
    FILTER: [
      parseCookie(),
      authenticate({ parseAuth: parseAuth }),
      authorize({
        allowRole: (role) => role === "employee",
      }),
      parseSession(),
      parseQuery(),
      (req, ctx) => {
        const q = TPagenater(ctx.query);
        if (q instanceof ArkErrors) {
          return status(Status._400_BadRequest, "Invalid query");
        }
        ctx.q = {
          offset: parseInt(q.o || "0"),
          limit: parseInt(q.l || "5"),
          iemployee: q.iemployee !== undefined,
        };
      },
    ],
    HANDLER: [
      async (req, { session, q }) => {
        const { offset, limit, iemployee } = q;
        const employee = await EmployeeService.getEmployeeById(session.userId);
        if (!employee) {
          return status(Status._404_NotFound, "Employee not found");
        }
        let calendars = [];
        if (iemployee) {
          calendars = await EmployeeService.getAllCalendarsByEmployeeId(
            employee.userId,
            {
              offset,
              limit,
            },
          );
        } else {
          calendars = await EmployeeService.getAllCalendarsByEmployeeIdPure(
            employee.userId,
            {
              offset,
              limit,
            },
          );
        }
        return json({
          count: calendars.length,
          calendars,
        });
      },
    ],
  },
} satisfies RouterHandlers<
  CTXCookie & CTXAuth & CTXSession,
  {
    GET: CTXQuery & {
      query: Pagenater;
      q: {
        offset: number;
        limit: number;
        iemployee: boolean;
      };
    };
  }
>;
