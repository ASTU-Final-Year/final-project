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

const TQuery = type({
  "o?": "string",
  "l?": "string",
  "iorganization?": "unknown",
  "icalendar?": "unknown",
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
          iorganization: q.iorganization !== undefined,
          icalendar: q.icalendar !== undefined,
        };
      },
    ],
    HANDLER: [
      async (req, { auth, params, q }) => {
        const isOrgAdmin = auth?.role === "organization_admin";
        const { id } = params;
        const { offset, limit, iorganization, icalendar } = q;
        const organization = await OrganizationService.getOrganizationById(id);
        if (!organization) {
          return status(Status._404_NotFound, "Organization not found");
        }
        let services = [];
        if (iorganization && icalendar) {
          services = isOrgAdmin
            ? await OrganizationServicesService.getAllServicesByOrganizationId(
                organization.id,
                {
                  offset,
                  limit,
                },
              )
            : await OrganizationServicesService.getAllServicesByOrganizationIdPublic(
                organization.id,
                {
                  offset,
                  limit,
                },
              );
        } else if (iorganization) {
          services = isOrgAdmin
            ? await OrganizationServicesService.getAllServicesWithOrganizationByOrganizationid(
                organization.id,
                {
                  offset,
                  limit,
                },
              )
            : await OrganizationServicesService.getAllServicesWithOrganizationByOrganizationidPublic(
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
            await OrganizationServicesService.getAllServicesByOrganizationIdPure(
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
      query: Query;
      q: {
        offset: number;
        limit: number;
        iorganization: boolean;
        icalendar: boolean;
      };
    };
  }
>;
