// ROUTE /api/v1/organization/:id/calendars

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

const TPagenater = type({
  "o?": "string",
  "l?": "string",
  "iorganization?": "unknown",
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
        };
      },
    ],
    HANDLER: [
      async (req, { session, q }) => {
        const { offset, limit, iorganization } = q;
        const organization =
          await OrganizationService.getOrganizationByAdminIdPure(
            session.userId,
          );
        if (!organization) {
          return status(Status._404_NotFound, "Organization not found");
        }
        let calendars = [];
        if (iorganization) {
          calendars = await OrganizationService.getAllCalendarsByOrganizationId(
            organization.id,
            {
              offset,
              limit,
            },
          );
        } else {
          calendars =
            await OrganizationService.getAllCalendarsByOrganizationIdPure(
              organization.id,
              {
                offset,
                limit,
              },
            );
        }
        return json({
          count: calendars.length,
          calendars,
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
      };
    };
  }
>;
