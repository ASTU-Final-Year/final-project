// ROUTE: /api/v1/organization/:id
import { json, RouterHandlers, status, Status } from "@bepalo/router";
import OrganizationService from "~/services/organization.service";

export default {
  GET: {
    HANDLER: [
      async (req, { params }) => {
        const organizationId = params.id;
        const organization =
          OrganizationService.getOrganizationById(organizationId);
        if (organization == null) {
          return status(Status._404_NotFound, "Organization not found");
        }
        return json({
          organization,
        });
      },
    ],
  },
} satisfies RouterHandlers<{ GET: { params: { id: string } } }>;
