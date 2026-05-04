// ROUTE /api/v1/organization/:id/tasks

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
  parseBody,
  RouterHandlers,
  Status,
  status,
} from "@bepalo/router";
import { ArkErrors, type } from "arktype";
import { CTXSession } from "~/base";
import { parseAuth, parseSession } from "~/middleware";
import OrganizationService from "~/services/organization.service";
import TaskService from "~/services/task.service";

const TQuery = type({
  "o?": "string",
  "l?": "string",
});

const TTaskInit = type({
  name: "string>0",
  "isDone?": "boolean",
  status: "string>0",
  serviceId: "string>0",
  clientId: "string>0",
  "progress?": "unknown[]",
});

type Query = typeof TQuery.infer;
type Body = typeof TTaskInit.infer;

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
        };
      },
    ],
    HANDLER: [
      async (req, { auth, params, q }) => {
        const { id } = params;
        const { offset, limit } = q;
        
        const organization = await OrganizationService.getOrganizationById(id);
        if (!organization) {
          return status(Status._404_NotFound, "Organization not found");
        }
        
        const isOrgAdmin = auth?.role === "organization_admin" || auth?.role === "super_admin";
        const isEmployee = auth?.role === "employee";
        
        if (!isOrgAdmin && !isEmployee) {
           return status(Status._403_Forbidden, "Forbidden");
        }

        const tasks = await TaskService.getAllTasksByOrganizationId(
            organization.id,
            { offset, limit }
        );
        const count = await TaskService.getTasksCountByOrganizationId(organization.id);

        return json({
          count,
          tasks,
        });
      },
    ],
  },
  POST: {
    FILTER: [
        parseCookie(),
        authenticate({ parseAuth: parseAuth, checkOnly: true }),
        parseSession(),
        authorize("organization_admin"),
        parseBody(),
        (req, ctx) => {
            const body = TTaskInit(ctx.body);
            if (body instanceof ArkErrors) {
                return status(Status._400_BadRequest, body.summary);
            }
            ctx.b = body;
        }
    ],
    HANDLER: [
        async (req, { params, b }) => {
            const { id } = params;
            
            const organization = await OrganizationService.getOrganizationById(id);
            if (!organization) {
                return status(Status._404_NotFound, "Organization not found");
            }
            
            const taskInit = {
                ...b,
                organizationId: organization.id,
                isDone: b.isDone ?? false,
                progress: b.progress ?? [],
            };
            
            const task = await TaskService.createTask(taskInit);
            return status(Status._201_Created, "Task created", task);
        }
    ]
  }
} satisfies RouterHandlers<
  CTXCookie & CTXAuth & CTXSession,
  {
    GET: CTXQuery & {
      query: Query;
      q: {
        offset: number;
        limit: number;
      };
    };
    POST: CTXBody & {
      body: Body;
      b: Body;
    }
  }
>;
