// ROUTE /api/v1/organization/:id/service/:service_id/first_employee/:employee_id
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
import OrganizationService from "~/services/organization.service";
import OrganizationServicesService from "~/services/organization.services.service";

const TQuery = type({
  "iservice?": "unknown",
  "ifirst_employees?": "unknown",
});

type Query = typeof TQuery.infer;

export default {
  GET: {
    FILTER: [
      parseCookie(),
      authenticate({ parseAuth: parseAuth }),
      authorize({
        allowRole: (role) => role === "organization_admin",
      }),
      parseSession(),
      parseQuery(),
      (req, ctx) => {
        const q = TQuery(ctx.query);
        if (q instanceof ArkErrors) {
          return status(Status._400_BadRequest, "Invalid query");
        }
        ctx.q = {
          iservice: q.iservice !== undefined,
          ifirst_employees: q.ifirst_employees !== undefined,
        };
      },
    ],
    HANDLER: [
      async (req, { session, params, q }) => {
        const { iservice, ifirst_employees } = q;
        const { id, service_id, employee_id } = params;
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
        let firtEmployees;
        if (iservice && ifirst_employees) {
          firtEmployees =
            await OrganizationServicesService.getServiceFirstEmployeesByServiceId(
              service_id,
              employee_id,
            );
        } else if (iservice) {
          firtEmployees =
            await OrganizationServicesService.getServiceFirstEmployeesWithServiceByServiceId(
              service_id,
              employee_id,
            );
        } else if (ifirst_employees) {
          firtEmployees =
            await OrganizationServicesService.getServiceFirstEmployeesWithFirstEmployeesByServiceId(
              service_id,
              employee_id,
            );
        } else {
          firtEmployees =
            await OrganizationServicesService.getServiceFirstEmployeesPureByServiceId(
              service_id,
              employee_id,
            );
        }
        if (firtEmployees == null) {
          return status(
            Status._404_NotFound,
            "Service First Employees not found",
          );
        }
        return json({
          firtEmployees,
        });
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
        const { id, service_id, employee_id } = params;
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
        const service =
          await OrganizationServicesService.getServiceByIdByOrganizationId(
            service_id,
            organization.id,
          );
        if (service == null) {
          return status(Status._404_NotFound, "Service not found");
        }
        const firtEmployee =
          await OrganizationServicesService.deleteServiceFirstEmployeesByIds(
            service_id,
            employee_id,
          );
        return json({
          success: firtEmployee != null,
        });
      },
    ],
  },
} satisfies RouterHandlers<
  CTXCookie & CTXAuth & CTXSession,
  {
    GET: CTXQuery & {
      query: Query;
      q: {
        iservice: boolean;
        ifirst_employees: boolean;
      };
    };
  }
>;
