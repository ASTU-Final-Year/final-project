// ROUTE /api/v1/client/tasks/:taskId

import {
  authenticate,
  authorize,
  CTXAuth,
  CTXBody,
  CTXCookie,
  json,
  parseCookie,
  parseBody,
  RouterHandlers,
  Status,
  status,
} from "@bepalo/router";
import { ArkErrors, type } from "arktype";
import { CTXSession } from "~/base";
import { parseAuth, parseSession } from "~/middleware";
import TaskService from "~/services/task.service";

const TTaskUpdate = type({
  "name?": "string>0",
  "isDone?": "boolean",
  "status?": "string>0",
  "progress?": "unknown[]",
});

type Body = typeof TTaskUpdate.infer;

export default {
  GET: {
    FILTER: [
      parseCookie(),
      authenticate({ parseAuth: parseAuth, checkOnly: true }),
      parseSession(),
      authorize("client"),
    ],
    HANDLER: [
      async (req, { auth, params }) => {
        const { taskId } = params;
        const clientId = auth!.id;
        
        const task = await TaskService.getTaskById(taskId);
        if (!task || task.clientId !== clientId) {
            return status(Status._404_NotFound, "Task not found");
        }

        return json(task);
      },
    ],
  },
  PUT: {
    FILTER: [
        parseCookie(),
        authenticate({ parseAuth: parseAuth, checkOnly: true }),
        parseSession(),
        authorize("client"),
        parseBody(),
        (req, ctx) => {
            const body = TTaskUpdate(ctx.body);
            if (body instanceof ArkErrors) {
                return status(Status._400_BadRequest, body.summary);
            }
            ctx.b = body;
        }
    ],
    HANDLER: [
        async (req, { auth, params, b }) => {
            const { taskId } = params;
            const clientId = auth!.id;
            
            const task = await TaskService.getTaskById(taskId);
            if (!task || task.clientId !== clientId) {
                return status(Status._404_NotFound, "Task not found");
            }
            
            const taskUpdate = {
                ...b,
                id: taskId,
            };
            
            const updatedTask = await TaskService.updateTask(taskUpdate);
            return json(updatedTask);
        }
    ]
  }
} satisfies RouterHandlers<
  CTXCookie & CTXAuth & CTXSession,
  {
    PUT: CTXBody & {
      body: Body;
      b: Body;
    }
  }
>;
