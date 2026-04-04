// ROUTE /api/v1/employee/:id
import {
  authenticate,
  authorize,
  CTXAuth,
  CTXBody,
  CTXCookie,
  json,
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

const TEmployeeUpdater = type({
  "jobTitle?": "string",
  "jobDescription?": "string",
  "calendarId?": "string.uuid|null",
});

type EmployeeUpdater = typeof TEmployeeUpdater.infer;

export default {
  GET: {
    FILTER: [
      parseCookie(),
      authenticate({ parseAuth }),
      authorize({
        allowRole: (role) => role === "organization_admin",
      }),
      parseSession(),
    ],
    HANDLER: [
      async (req, { session, params }) => {
        const userId = params.id;
        const adminId = session.userId;
        const employee = await EmployeeService.getEmployeeById(userId);
        if (!(await EmployeeService.hasEmployeeById(userId))) {
          return status(Status._404_NotFound, "Employee not found");
        }
        if (
          !(await OrganizationService.hasEmployeeByAdminId(adminId, userId))
        ) {
          return status(Status._403_Forbidden, "Not own employee");
        }
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
      (req, { body }) => {
        const error = TEmployeeUpdater(body);
        if (error instanceof ArkErrors) {
          return status(Status._400_BadRequest, "Invalid body");
        }
      },
    ],
    HANDLER: [
      async (req, { session, body, params }) => {
        const userId = params.id;
        const adminId = session.userId;
        const employeeUpdateInit = { userId, body };
        if (!(await EmployeeService.hasEmployeeById(userId))) {
          return status(Status._404_NotFound, "Employee not found");
        }
        if (
          !(await OrganizationService.hasEmployeeByAdminId(adminId, userId))
        ) {
          return status(Status._403_Forbidden, "Not own employee");
        }
        await EmployeeService.updateEmployeeById(employeeUpdateInit);
        return status(Status._200_OK);
      },
    ],
  },
  DELETE: {
    FILTER: [
      parseCookie(),
      authenticate({ parseAuth }),
      authorize({
        allowRole: (role) => role === "organization_admin",
      }),
      parseSession(),
    ],
    HANDLER: [
      async (req, { session, params }) => {
        const userId = params.id;
        const adminId = session.userId;
        if (!(await EmployeeService.hasEmployeeById(userId))) {
          return status(Status._404_NotFound, "Employee not found");
        }
        if (
          !(await OrganizationService.hasEmployeeByAdminId(adminId, userId))
        ) {
          return status(Status._403_Forbidden, "Not own employee");
        }
        await EmployeeService.deleteEmployeeById(userId);
        return status(Status._200_OK);
      },
    ],
  },
} satisfies RouterHandlers<
  CTXCookie & CTXAuth & CTXSession & { params: { id: string } },
  {
    PATCH: CTXBody & { body: EmployeeUpdater };
    DELETE: CTXBody;
  }
>;
