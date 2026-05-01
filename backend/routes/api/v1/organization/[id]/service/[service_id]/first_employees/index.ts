// ROUTE /api/v1/organization/:id/service/:service_id/first_employees
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

const TServiceFirstEmployeesUpdate = type({
  employeesId: "string.uuid[]",
});

type ServiceFirstEmployeesUpdate = typeof TServiceFirstEmployeesUpdate.infer;

const TQuery = type({
  "o?": "string",
  "l?": "string",
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
          offset: parseInt(q.o || "0"),
          limit: parseInt(q.l || "5"),
          iservice: q.iservice !== undefined,
          ifirst_employees: q.ifirst_employees !== undefined,
        };
      },
    ],
    HANDLER: [
      async (req, { session, params, q }) => {
        const { offset, limit, iservice, ifirst_employees } = q;
        const { id, service_id } = params;
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
        let firstEmployees;
        if (iservice && ifirst_employees) {
          firstEmployees =
            await OrganizationServicesService.getAllServiceFirstEmployeesByServiceId(
              service_id,
              { offset, limit },
            );
        } else if (iservice) {
          firstEmployees =
            await OrganizationServicesService.getAllServiceFirstEmployeesWithServiceByServiceId(
              service_id,
              { offset, limit },
            );
        } else if (ifirst_employees) {
          firstEmployees =
            await OrganizationServicesService.getAllServiceFirstEmployeesWithFirstEmployeesByServiceId(
              service_id,
              { offset, limit },
            );
        } else {
          firstEmployees =
            await OrganizationServicesService.getAllServiceFirstEmployeesPureByServiceId(
              service_id,
              { offset, limit },
            );
        }
        if (firstEmployees == null) {
          return status(
            Status._404_NotFound,
            "Service First Employees not found",
          );
        }
        return json({
          firstEmployees,
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
        const firstEmployees =
          await OrganizationServicesService.deleteAllServiceFirstEmployeesByServiceId(
            service_id,
          );
        return json({
          success: firstEmployees?.length > 0,
          count: firstEmployees?.length ?? 0,
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
        offset: number;
        limit: number;
        iservice: boolean;
        ifirst_employees: boolean;
      };
    };
  }
>;
