// ROUTE /api/v1/organization/:id/employee/:employee_id
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
import OrganizationEmployeesService from "~/services/organization.employees.service";
import OrganizationService from "~/services/organization.service";

const TEmployeeUpdate = type({
  "jobTitle?": "string <= 54",
  "jobDescription?": "string <= 200",
  "isActive?": "boolean",
  "calendarId?": "string.uuid|null",
});

type EmployeeUpdate = typeof TEmployeeUpdate.infer;

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
        const { id, employee_id } = params;
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
        const employee =
          await OrganizationEmployeesService.getEmployeeByIdByOrganizationId(
            employee_id,
            organization.id,
          );
        if (employee == null) {
          return status(Status._404_NotFound, "Employee not found");
        }
        return json({
          employee,
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
        const employeeForm = TEmployeeUpdate(ctx.body);
        if (employeeForm instanceof ArkErrors) {
          return status(Status._400_BadRequest, "Invalid body");
        }
        ctx.employeeForm = employeeForm;
      },
    ],
    HANDLER: [
      async (req, { session, params, employeeForm }) => {
        const { id, employee_id } = params;
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
        const hasEmployee =
          await OrganizationService.hasEmployeeByIdByOrganizationId(
            employee_id,
            organization.id,
          );
        if (!hasEmployee) {
          return status(Status._404_NotFound, "Employee not found");
        }
        const employee = await OrganizationEmployeesService.updateEmployeeById({
          userId: employee_id,
          jobTitle: employeeForm.jobTitle,
          jobDescription: employeeForm.jobDescription,
          isActive: employeeForm.isActive,
          calendarId: employeeForm.calendarId,
        });
        if (employee == null) {
          return status(Status._404_NotFound, "Employee not found");
        }
        return json({ employee });
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
        const { id, employee_id } = params;
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
        const employee =
          await OrganizationEmployeesService.getEmployeeByIdByOrganizationId(
            employee_id,
            organization.id,
          );
        if (employee == null) {
          return status(Status._404_NotFound, "Employee not found");
        }
        await OrganizationEmployeesService.deleteEmployeeById(employee_id);
        return json({
          success: true,
        });
      },
    ],
  },
} satisfies RouterHandlers<
  CTXCookie & CTXAuth & CTXSession,
  {
    PATCH: CTXBody & {
      body: EmployeeUpdate;
      employeeForm: EmployeeUpdate;
    };
  }
>;
