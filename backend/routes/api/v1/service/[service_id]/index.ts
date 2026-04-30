// ROUTE /api/v1/service/:service_id
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
  "iorganization?": "unknown",
  "icalendar?": "unknown",
});

type Query = typeof TQuery.infer;

export default {
  GET: {
    FILTER: [
      parseCookie(),
      authenticate({ parseAuth: parseAuth, checkOnly: true }),
      parseQuery(),
      (req, ctx) => {
        const q = TQuery(ctx.query);
        if (q instanceof ArkErrors) {
          return status(Status._400_BadRequest, "Invalid query");
        }
        ctx.q = {
          iorganization: q.iorganization !== undefined,
          icalendar: q.icalendar !== undefined,
        };
      },
    ],
    HANDLER: [
      async (req, { auth, params, q }) => {
        const isOrgAdmin = auth?.role === "organization_admin";
        const { id, service_id } = params;
        const { iorganization, icalendar } = q;
        let service;
        if (iorganization && icalendar) {
          service = isOrgAdmin
            ? await OrganizationServicesService.getServiceById(service_id)
            : await OrganizationServicesService.getServiceByIdPublic(
                service_id,
              );
        } else if (iorganization) {
          service = isOrgAdmin
            ? await OrganizationServicesService.getServiceByIdWithOrganization(
                service_id,
              )
            : await OrganizationServicesService.getServiceByIdWithOrganizationPublic(
                service_id,
              );
        } else if (icalendar) {
          service =
            await OrganizationServicesService.getServiceByIdWithCalendar(
              service_id,
            );
        } else {
          service =
            await OrganizationServicesService.getServiceByIdPure(service_id);
        }
        if (service == null) {
          return status(Status._404_NotFound, "Service not found");
        }
        return json({
          service,
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
        const service =
          await OrganizationServicesService.getServiceByIdByOrganizationId(
            service_id,
            organization.id,
          );
        if (service == null) {
          return status(Status._404_NotFound, "Service not found");
        }
        await OrganizationServicesService.deleteServiceById(service_id);
        return json({
          success: true,
        });
      },
    ],
  },
} satisfies RouterHandlers<
  CTXCookie & CTXAuth,
  {
    GET: CTXQuery & {
      query: Query;
      q: {
        iorganization: boolean;
        icalendar: boolean;
      };
    };
    DELETE: CTXSession;
  }
>;
