// ROUTE: /api/v1/organizations
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
  "o?": "string",
  "l?": "string",
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
          offset: parseInt(q.o || "0"),
          limit: parseInt(q.l || "5"),
          iadmin: q.iadmin !== undefined,
          ipricing_plan: q.ipricing_plan !== undefined,
        };
      },
    ],
    HANDLER: [
      async (req, { auth, q }) => {
        const isOrgAdmin = auth?.role === "organization_admin";
        const { offset, limit, iadmin, ipricing_plan } = q;
        let organizations = [];
        if (iadmin && ipricing_plan) {
          if (!isOrgAdmin) {
            return status(Status._403_Forbidden);
          }
          organizations = await OrganizationService.getAllOrganizations({
            offset,
            limit,
          });
        } else if (iadmin) {
          if (!isOrgAdmin) {
            return status(Status._403_Forbidden);
          }
          organizations =
            await OrganizationService.getAllOrganizationsWithAdmin({
              offset,
              limit,
            });
        } else if (ipricing_plan) {
          if (!isOrgAdmin) {
            return status(Status._403_Forbidden);
          }
          organizations =
            await OrganizationService.getAllOrganizationsWithPricingPlan({
              offset,
              limit,
            });
        } else if (isOrgAdmin) {
          organizations = await OrganizationService.getAllOrganizationsPure({
            offset,
            limit,
          });
        } else {
          organizations =
            await OrganizationService.getAllOrganizationsPublicPure({
              offset,
              limit,
            });
        }
        return json({
          count: organizations.length,
          organizations,
        });
      },
    ],
  },
} satisfies RouterHandlers<
  CTXCookie &
    CTXAuth &
    CTXQuery & {
      params: { id: string };
      query: Query;
      q: {
        offset: number;
        limit: number;
        iadmin: boolean;
        ipricing_plan: boolean;
      };
    }
>;
