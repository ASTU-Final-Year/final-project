// ROUTE /api/v1/employee
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

const TEmployeeUpdater = type({
  "calendarId?": "string.uuid|null",
});

type EmployeeUpdater = typeof TEmployeeUpdater.infer;

export default {
  GET: {
    FILTER: [
      parseCookie(),
      authenticate({ parseAuth }),
      authorize({
        allowRole: (role) => role === "employee",
      }),
      parseSession(),
    ],
    HANDLER: [
      async (req, { session }) => {
        const employee = await EmployeeService.getEmployeeById(session.userId);
        return json({ employee });
      },
    ],
  },
  PATCH: {
    FILTER: [
      parseCookie(),
      authenticate({ parseAuth }),
      authorize({
        allowRole: (role) => role === "organization_admin",
      }),
      parseSession(),
      parseBody({
        accept: ["application/x-www-form-urlencoded", "application/json"],
        maxSize: 1024,
        once: true,
      }),
      (req, { body }) => {
        const error = TEmployeeUpdater(body);
        if (error instanceof ArkErrors) {
          return status(Status._400_BadRequest, "Invalid body");
        }
      },
    ],
    HANDLER: [
      async (req, { session, body }) => {
        const userId = session.userId;
        const employeeUpdate = { userId, ...body };
        const employee = await EmployeeService.getEmployeeById(userId);
        if (!employee) {
          return status(Status._403_Forbidden, "employee not found");
        }
        await EmployeeService.updateEmployeeById(employeeUpdate);
        return status(Status._200_OK);
      },
    ],
  },
} satisfies RouterHandlers<
  CTXCookie & CTXAuth & CTXSession,
  {
    GET: { params: { id: string } };
    PATCH: CTXBody & { body: EmployeeUpdater };
  }
>;
