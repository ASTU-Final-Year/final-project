// ROUTE /api/v1/organization/:id/services

import {
  authenticate,
  authorize,
  CTXAuth,
  CTXBody,
  CTXCookie,
  CTXQuery,
  json,
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
      parseCookie(),
      authenticate({ parseAuth: parseAuth }),
      authorize({
        allowRole: (role) => role === "organization_admin",
      }),
      parseSession(),
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
        const organization =
          await OrganizationService.getOrganizationByAdminIdPure(
            session.userId,
          );
        if (!organization) {
          return status(Status._404_NotFound, "Organization not found");
        }
        let services = [];
        if (iorganization && icalendar) {
          services =
            await OrganizationServicesService.getAllServicesByOrganizationid(
              organization.id,
              {
                offset,
                limit,
              },
            );
        } else if (iorganization) {
          services =
            await OrganizationServicesService.getAllServicesWithOrganizationByOrganizationid(
              organization.id,
              {
                offset,
                limit,
              },
            );
        } else if (icalendar) {
          services =
            await OrganizationServicesService.getAllServicesWithCalendarByOrganizationid(
              organization.id,
              {
                offset,
                limit,
              },
            );
        } else {
          services =
            await OrganizationServicesService.getAllServicesByOrganizationidPure(
              organization.id,
              {
                offset,
                limit,
              },
            );
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
