// ROUTE /api/v1/services
import {
  CTXAuth,
  CTXCookie,
  CTXQuery,
  json,
  parseQuery,
  RouterHandlers,
  Status,
  status,
} from "@bepalo/router";
import { ArkErrors, type } from "arktype";
import { CTXSession } from "~/base";
import OrganizationService from "~/services/organization.service";
import OrganizationServicesService from "~/services/organization.services.service";

const TPagenater = type({
  "o?": "string",
  "l?": "string",
  "iorganization?": "unknown",
  "icalendar?": "unknown",
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
          iorganization: q.iorganization !== undefined,
          icalendar: q.icalendar !== undefined,
        };
      },
    ],
    HANDLER: [
      async (req, { session, q }) => {
        const { offset, limit, iorganization, icalendar } = q;
        let services = [];
        if (iorganization && icalendar) {
          services = await OrganizationServicesService.getAllServices({
            offset,
            limit,
          });
        } else if (iorganization) {
          services =
            await OrganizationServicesService.getAllServicesWithOrganization({
              offset,
              limit,
            });
        } else if (icalendar) {
          services =
            await OrganizationServicesService.getAllServicesWithCalendar({
              offset,
              limit,
            });
        } else {
          services = await OrganizationServicesService.getAllServicesPure({
            offset,
            limit,
          });
        }
        return json({
          count: services.length,
          services,
        });
      },
    ],
  },
} satisfies RouterHandlers<
  CTXCookie & CTXAuth & CTXSession,
  {
    GET: CTXQuery & {
      query: Pagenater;
      q: {
        offset: number;
        limit: number;
        iorganization: boolean;
        icalendar: boolean;
      };
    };
  }
>;
