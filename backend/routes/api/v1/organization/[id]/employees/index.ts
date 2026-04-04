// ROUTE /api/v1/organization/:id/employees
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
import OrganizationService from "~/services/organization.service";

const THireOrganizationEmployee = type({
  email: "string.email",
  jobTitle: "string",
  jobDescription: "string",
});

const THireOrganizationEmployees = THireOrganizationEmployee.array();

type HireOrganizationEmployee = typeof THireOrganizationEmployee.infer;
type HireOrganizationEmployees = typeof THireOrganizationEmployees.infer;

const TPagenater = type({
  "o?": "string",
  "l?": "string",
  "iuser?": "unknown",
  "iorganization?": "unknown",
});

type Pagenater = typeof TPagenater.infer;

export default {
  POST: {
    FILTER: [
      parseCookie(),
      authenticate({ parseAuth }),
      authorize({
        allowRole: (role) => role === "organization_admin",
      }),
      parseSession(),
      parseBody({
        accept: ["application/x-www-form-urlencoded", "application/json"],
        maxSize: 5 * 1024 * 1024,
        once: true,
      }),
      (req, ctx) => {
        const employeesForm = THireOrganizationEmployees(ctx.body.values);
        if (employeesForm instanceof ArkErrors) {
          console.error(employeesForm.toString());
          return status(Status._400_BadRequest, "Invalid body");
        }
        ctx.employeesForm = employeesForm;
      },
    ],
    HANDLER: [
      async (req, { session, employeesForm }) => {
        const organization = await OrganizationService.getOrganizationByAdminId(
          session.userId,
        );
        if (organization == null) {
          return status(Status._403_Forbidden, "Organization not found");
        }
        try {
          const results = (
            await Promise.all(
              employeesForm.map(async (employeeForm) => {
                const employee =
                  await EmployeeService.getEmployeeByIdPureByOrganizationId(
                    organization.id,
                    employeeForm.email,
                  );
                if (employee != null) {
                  return {
                    successful: false,
                    error: "Employee already registered",
                  };
                }
                return OrganizationService.sendEmployeeHireLink({
                  email: employeeForm.email,
                  jobTitle: employeeForm.jobTitle,
                  jobDescription: employeeForm.jobDescription,
                  organization,
                });
              }),
            )
          ).map((result, i) => ({
            email: employeesForm[i].email,
            success: result.successful,
            error: (result as { error: string }).error,
          }));
          return json({ results });
        } catch {
          return status(Status._500_InternalServerError);
        }
      },
    ],
  },
  GET: {
    FILTER: [
      parseCookie(),
      authenticate({ parseAuth }),
      authorize({
        allowRole: (role) => role === "organization_admin",
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
          iuser: q.iuser !== undefined,
          iorganization: q.iorganization !== undefined,
        };
      },
    ],
    HANDLER: [
      async (req, { session, q }) => {
        const { offset, limit, iuser, iorganization } = q;
        const organization =
          await OrganizationService.getOrganizationByAdminIdPure(
            session.userId,
          );
        if (!organization) {
          return status(Status._404_NotFound, "Organization not found");
        }
        let employees = [];
        if (iuser && iorganization) {
          employees = await EmployeeService.getAllEmployeesByOrganizationId(
            organization.id,
            {
              offset,
              limit,
            },
          );
        } else if (iuser) {
          employees =
            await EmployeeService.getAllEmployeesWithUserByOrganizationId(
              organization.id,
              {
                offset,
                limit,
              },
            );
        } else if (iorganization) {
          employees =
            await EmployeeService.getAllEmployeesWithOrganizationByOrganizationId(
              organization.id,
              {
                offset,
                limit,
              },
            );
        } else {
          employees = await EmployeeService.getAllEmployeesPureByOrganizationId(
            organization.id,
            {
              offset,
              limit,
            },
          );
        }
        return json({
          count: employees.length,
          employees,
        });
      },
    ],
  },
} satisfies RouterHandlers<
  CTXCookie & CTXAuth & CTXSession,
  {
    POST: CTXBody & {
      body: { values: HireOrganizationEmployees };
      employeesForm: HireOrganizationEmployees;
    };
    GET: CTXQuery & {
      query: Pagenater;
      q: {
        offset: number;
        limit: number;
        iuser: boolean;
        iorganization: boolean;
      };
    };
  }
>;
