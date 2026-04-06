// ROUTE /api/v1/organization/:id/service

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

const TServiceRegistration = type({
  name: "string <= 54",
  description: "string <= 200",
  isActive: "boolean",
  "calendarId?": "string.uuid|null",
});

type ServiceRegistration = typeof TServiceRegistration.infer;

export default {
  POST: {
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
        const serviceForm = TServiceRegistration(ctx.body);
        if (serviceForm instanceof ArkErrors) {
          return status(Status._400_BadRequest, "Invalid body");
        }
        ctx.serviceForm = serviceForm;
      },
    ],
    HANDLER: [
      async (req, { session, serviceForm }) => {
        const organization =
          await OrganizationService.getOrganizationByAdminIdPure(
            session.userId,
          );
        if (!organization) {
          return status(Status._404_NotFound, "Organization not found");
        }
        const service = await OrganizationServicesService.createService({
          name: serviceForm.name,
          description: serviceForm.description,
          isActive: serviceForm.isActive,
          calendarId: serviceForm.calendarId,
          organizationId: organization.id,
        });
        return json({ service }, { status: Status._201_Created });
      },
    ],
  },
} satisfies RouterHandlers<
  CTXCookie & CTXAuth & CTXSession,
  {
    POST: CTXBody & {
      body: ServiceRegistration;
      serviceForm: ServiceRegistration;
    };
  }
>;
