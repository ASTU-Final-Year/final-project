// ROUTE /api/v1/organization/:id/tasks/:taskId

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
import OrganizationService from "~/services/organization.service";
import TaskService from "~/services/task.service";

const TTaskUpdate = type({
  "name?": "string>0",
  "isDone?": "boolean",
  "status?": "string>0",
  "serviceId?": "string>0",
  "clientId?": "string>0",
  "progress?": "unknown[]",
});

type Body = typeof TTaskUpdate.infer;

export default {
  GET: {
    FILTER: [
      parseCookie(),
      authenticate({ parseAuth: parseAuth, checkOnly: true }),
    ],
    HANDLER: [
      async (req, { auth, params }) => {
        const { id, taskId } = params;
        
        const organization = await OrganizationService.getOrganizationById(id);
        if (!organization) {
          return status(Status._404_NotFound, "Organization not found");
        }
        
        const isOrgAdmin = auth?.role === "organization_admin" || auth?.role === "super_admin";
        const isEmployee = auth?.role === "employee";
        
        if (!isOrgAdmin && !isEmployee) {
           return status(Status._403_Forbidden, "Forbidden");
        }

        const task = await TaskService.getTaskById(taskId);
        if (!task || task.organizationId !== id) {
            return status(Status._404_NotFound, "Task not found in this organization");
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
        authorize("organization_admin", "employee"),
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
        async (req, { params, b }) => {
            const { id, taskId } = params;
            
            const task = await TaskService.getTaskById(taskId);
            if (!task || task.organizationId !== id) {
                return status(Status._404_NotFound, "Task not found in this organization");
            }
            
            const taskUpdate = {
                ...b,
                id: taskId,
            };
            
            const updatedTask = await TaskService.updateTask(taskUpdate);
            return json(updatedTask);
        }
    ]
  },
  DELETE: {
    FILTER: [
        parseCookie(),
        authenticate({ parseAuth: parseAuth, checkOnly: true }),
        parseSession(),
        authorize("organization_admin", "super_admin"),
    ],
    HANDLER: [
        async (req, { params }) => {
            const { id, taskId } = params;
            
            const task = await TaskService.getTaskById(taskId);
            if (!task || task.organizationId !== id) {
                return status(Status._404_NotFound, "Task not found in this organization");
            }
            
            await TaskService.deleteTaskById(taskId);
            return status(Status._200_OK, "Task deleted");
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
