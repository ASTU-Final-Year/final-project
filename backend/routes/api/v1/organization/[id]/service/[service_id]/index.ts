// ROUTE /api/v1/organization/:id/service/:serviceId
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
import OrganizationService from "~/services/organization.service";
import OrganizationServicesService from "~/services/organization.services.service";

const TServiceUpdate = type({
  "name?": "string <= 54",
  "description?": "string <= 200",
  "isActive?": "boolean",
  "calendarId?": "string.uuid|null",
});

type ServiceUpdate = typeof TServiceUpdate.infer;

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
        return json({
          service,
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
        const serviceForm = TServiceUpdate(ctx.body);
        if (serviceForm instanceof ArkErrors) {
          return status(Status._400_BadRequest, "Invalid body");
        }
        ctx.serviceForm = serviceForm;
      },
    ],
    HANDLER: [
      async (req, { session, params, serviceForm }) => {
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
        const service = await OrganizationServicesService.updateService({
          id: service_id,
          name: serviceForm.name,
          description: serviceForm.description,
          isActive: serviceForm.isActive,
          calendarId: serviceForm.calendarId,
          organizationId: organization.id,
        });
        if (service == null) {
          return status(Status._404_NotFound, "Service not found");
        }
        return json({ service }, { status: Status._201_Created });
      },
    ],
  },
} satisfies RouterHandlers<
  CTXCookie & CTXAuth & CTXSession,
  {
    PATCH: CTXBody & {
      body: ServiceUpdate;
      serviceForm: ServiceUpdate;
    };
  }
>;
