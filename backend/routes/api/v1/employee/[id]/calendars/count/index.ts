// ROUTE /api/v1/organization/:id/services/count

import {
  authenticate,
  authorize,
  CTXAuth,
  CTXCookie,
  json,
  parseCookie,
  RouterHandlers,
  Status,
  status,
} from "@bepalo/router";
import { CTXSession } from "~/base";
import { parseAuth, parseSession } from "~/middleware";
import EmployeeService from "~/services/organization.employees.service";

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
      async (req, { session }) => {
        const employee = await EmployeeService.getEmployeeById(session.userId);
        if (!employee) {
          return status(Status._404_NotFound, "Employee not found");
        }
        const count = await EmployeeService.getCalendarCountByEmployeeId(
          employee.userId,
        );
        return json({ count });
      },
    ],
  },
} satisfies RouterHandlers<CTXCookie & CTXAuth & CTXSession>;
