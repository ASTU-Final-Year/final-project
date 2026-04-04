// ROUTE: /api/v1/organizations
import {
  CTXQuery,
  json,
  parseQuery,
  RouterHandlers,
  status,
  Status,
} from "@bepalo/router";
import { ArkErrors, type } from "arktype";
import OrganizationService from "~/services/organization.service";

const TPagenater = type({
  "o?": "string",
  "l?": "string",
  "iadmin?": "unknown",
  "ipricing_plan?": "unknown",
});

type Pagenater = typeof TPagenater.infer;

export default {
  GET: {
    FILTER: [
      parseQuery(),
      (req, ctx) => {
        const q = TPagenater(ctx.query);
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
      async (req, { q }) => {
        const { offset, limit, iadmin, ipricing_plan } = q;
        let organizations = [];
        if (iadmin && ipricing_plan) {
          organizations = await OrganizationService.getAllOrganizations({
            offset,
            limit,
          });
        } else if (iadmin) {
          organizations =
            await OrganizationService.getAllOrganizationsWithAdmin({
              offset,
              limit,
            });
        } else if (ipricing_plan) {
          organizations =
            await OrganizationService.getAllOrganizationsWithPricingPlan({
              offset,
              limit,
            });
        } else {
          organizations = await OrganizationService.getAllOrganizationsPure({
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
  CTXQuery & {
    params: { id: string };
    query: Pagenater;
    q: {
      offset: number;
      limit: number;
      iadmin: boolean;
      ipricing_plan: boolean;
    };
  }
>;
