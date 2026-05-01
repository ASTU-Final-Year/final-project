// ROUTE: /api/v1/organization/:id
import {
  authenticate,
  CTXAuth,
  CTXCookie,
  CTXQuery,
  json,
  parseCookie,
  parseQuery,
  RouterHandlers,
  status,
  Status,
} from "@bepalo/router";
import { ArkErrors, type } from "arktype";
import { parseAuth } from "~/middleware";
import OrganizationService from "~/services/organization.service";

const TQuery = type({
  "iadmin?": "unknown",
  "ipricing_plan?": "unknown",
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
          iadmin: q.iadmin !== undefined,
          ipricing_plan: q.ipricing_plan !== undefined,
        };
      },
    ],
    HANDLER: [
      async (req, { auth, params, q }) => {
        const isOrgAdmin = auth?.role === "organization_admin";
        const { iadmin, ipricing_plan } = q;
        const organizationId = params.id;
        let organization;
        if (iadmin && ipricing_plan) {
          if (!isOrgAdmin) {
            return status(Status._403_Forbidden);
          }
          organization =
            await OrganizationService.getOrganizationById(organizationId);
        } else if (iadmin) {
          if (!isOrgAdmin) {
            return status(Status._403_Forbidden);
          }
          organization =
            await OrganizationService.getOrganizationByIdWithAdmin(
              organizationId,
            );
        } else if (ipricing_plan) {
          if (!isOrgAdmin) {
            return status(Status._403_Forbidden);
          }
          organization =
            await OrganizationService.getOrganizationByIdWithPricingPlan(
              organizationId,
            );
        } else if (isOrgAdmin) {
          organization =
            await OrganizationService.getOrganizationByIdPure(organizationId);
        } else {
          organization =
            await OrganizationService.getOrganizationByIdPurePublic(
              organizationId,
            );
        }
        if (organization == null) {
          return status(Status._404_NotFound, "Organization not found");
        }
        return json({
          organization,
        });
      },
    ],
  },
} satisfies RouterHandlers<
  {},
  {
    GET: CTXCookie &
      CTXAuth &
      CTXQuery & { params: { id: string } } & { query: Query; q: Query };
  }
>;
