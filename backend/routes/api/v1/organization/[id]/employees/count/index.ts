// ROUTE /api/v1/organization/:id/employees/count

import {
  authenticate,
  authorize,
  CTXAuth,
  CTXCookie,
  json,
  parseCookie,
  RouterHandlers,
  Status,
  status,
} from "@bepalo/router";
import { CTXSession } from "~/base";
import { parseAuth, parseSession } from "~/middleware";
import OrganizationEmployeesService from "~/services/organization.employees.service";
import OrganizationService from "~/services/organization.service";

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
      async (req, { session }) => {
        const organization =
          await OrganizationService.getOrganizationByAdminIdPure(
            session.userId,
          );
        if (!organization) {
          return status(Status._404_NotFound, "Organization not found");
        }
        const count =
          await OrganizationEmployeesService.getEmployeeCountByOrganizationId(
            organization.id,
          );
        return json({ count });
      },
    ],
  },
} satisfies RouterHandlers<CTXCookie & CTXAuth & CTXSession>;
