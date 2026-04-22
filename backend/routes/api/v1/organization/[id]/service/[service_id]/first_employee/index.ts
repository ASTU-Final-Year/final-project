// ROUTE /api/v1/organization/:id/service/:service_id/first_employee
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
import { CTXSession, OrganizationServiceFirstEmployeeInit } from "~/base";
import { parseAuth, parseSession } from "~/middleware";
import OrganizationService from "~/services/organization.service";
import OrganizationServicesService from "~/services/organization.services.service";

const TAddFirstEmployee = type({
  // serviceId: "string.uuid",
  employeeId: "string.uuid",
});

type AddFirstEmployee = typeof TAddFirstEmployee.infer;

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
        maxSize: 5 * 1024 * 1024,
        once: true,
      }),
      (req, ctx) => {
        const { service_id } = ctx.params;
        const b = TAddFirstEmployee(ctx.body);
        if (b instanceof ArkErrors) {
          return status(Status._400_BadRequest, "Invalid body");
        }
        ctx.firstEmployeeForm = {
          serviceId: service_id,
          employeeId: b.employeeId,
        };
      },
    ],
    HANDLER: [
      async (req, { session, params, firstEmployeeForm }) => {
        const { id, service_id } = params;
        const organization = await OrganizationService.getOrganizationById(id);
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
          await OrganizationServicesService.addServiceFirstEmployee(
            firstEmployeeForm,
          );
        return json({
          firtEmployee,
        });
      },
    ],
  },
} satisfies RouterHandlers<
  CTXCookie & CTXAuth & CTXSession,
  {
    POST: CTXBody & {
      body: AddFirstEmployee;
      firstEmployeeForm: OrganizationServiceFirstEmployeeInit;
    };
  }
>;
