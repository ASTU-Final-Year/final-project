// ROUTE /api/v1/client/tasks

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
  organizationId: "string>0",
  "progress?": "unknown[]",
});

type Query = typeof TQuery.infer;
type Body = typeof TTaskInit.infer;

export default {
  GET: {
    FILTER: [
      parseCookie(),
      authenticate({ parseAuth: parseAuth, checkOnly: true }),
      parseSession(),
      authorize("client"),
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
      async (req, { auth, q }) => {
        const { offset, limit } = q;
        const clientId = auth!.id; // Authenticated user ID

        const tasks = await TaskService.getAllTasksByClientId(
            clientId,
            { offset, limit }
        );
        const count = await TaskService.getTasksCountByClientId(clientId);

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
        authorize("client"),
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
        async (req, { auth, b }) => {
            const clientId = auth!.id;
            
            const taskInit = {
                ...b,
                clientId,
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
