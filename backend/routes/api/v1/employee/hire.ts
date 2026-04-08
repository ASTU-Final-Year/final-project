// ROUTE /api/v1/employee/hire
import {
  authenticate,
  authorize,
  CTXAuth,
  CTXBody,
  CTXCookie,
  CTXQuery,
  parseBody,
  parseCookie,
  parseQuery,
  redirect,
  RouterHandlers,
  Status,
  status,
} from "@bepalo/router";
import { CTXSession } from "~/base";
import { employeeHireJwt, EmployeeHirePayload } from "~/config";
import { toMainUrl } from "~/lib";
import { parseAuth, parseSession } from "~/middleware";
import EmployeeService from "~/services/organization.employees.service";
import OrganizationService from "~/services/organization.service";

export default {
  GET: {
    FILTER: [
      parseCookie(),
      authenticate({ parseAuth, checkOnly: true }),
      (req, { url, auth }) => {
        console.log(toMainUrl(url));
        if (auth == null) {
          return redirect(
            "/login?r=" + encodeURIComponent(toMainUrl(url).toString()),
          );
        }
      },
      authorize({
        allowRole: (role) => role === "employee",
      }),
      parseSession(),
      // parseQuery(),
      async (req, ctx) => {
        const token = ctx.url.searchParams.get("t") || "";
        if (!token) {
          return status(Status._400_BadRequest);
        }
        const { payload, valid, error } = employeeHireJwt.verifySync(token);
        if (!valid || !payload || payload.sub != "hire-request") {
          return status(Status._400_BadRequest, error?.message || undefined);
        }
        if (ctx.session.user.email !== payload.to) {
          return status(Status._403_Forbidden, "Someone else's invitation");
        }
        ctx.invite = payload;
      },
      async (req, { session, invite }) => {
        const { organizationId, jobTitle, jobDescription } = invite;
        const organization =
          await OrganizationService.getOrganizationById(organizationId);
        if (organization == null) {
          return status(Status._403_Forbidden, "Organization not found");
        }
        const existingEmployee =
          await EmployeeService.getEmployeeByIdByOrganizationIdPure(
            organizationId,
            session.user.id,
          );
        if (!existingEmployee) {
          await EmployeeService.createEmployee({
            userId: session.userId,
            organizationId: organizationId,
            jobTitle,
            jobDescription,
            isActive: true,
          });
        }
        const welcomeInfo = btoa(
          JSON.stringify({
            firstname: session.user.firstname,
            lastname: session.user.lastname,
            organization: organization.name,
            jobTitle,
            jobDescription,
          }),
        );
        console.log("/welcome/employee?i=" + welcomeInfo);
        return redirect("/welcome/employee?i=" + welcomeInfo);
      },
    ],
  },
  POST: {
    FILTER: [
      parseCookie(),
      authenticate({ parseAuth }),
      authorize({
        allowRole: (role) => role === "employee",
      }),
      parseSession(),
      parseBody({
        accept: ["text/plain"],
        maxSize: 2 * 1024,
        once: true,
      }),
      async (req, ctx) => {
        const token = ctx.body.text || "";
        if (!token) {
          return status(Status._400_BadRequest);
        }
        const { payload, valid, error } = employeeHireJwt.verifySync(token);
        if (!valid || !payload) {
          // || payload.sub != "hire-request") {
          return status(Status._400_BadRequest, error?.message || undefined);
        }
        if (ctx.session.user.email !== payload.to) {
          return status(Status._403_Forbidden, "Someone else's invitation");
        }
        ctx.invite = payload;
      },
    ],
    HANDLER: [
      async (req, { invite, session }) => {
        console.log("...");
        const { organizationId, jobTitle, jobDescription } = invite;
        const organization =
          await OrganizationService.getOrganizationById(organizationId);
        if (organization == null) {
          return status(Status._403_Forbidden, "Organization not found");
        }
        await EmployeeService.createEmployee({
          userId: session.userId,
          organizationId: organizationId,
          jobTitle,
          jobDescription,
          isActive: true,
        });
        return status(201);
      },
    ],
  },
} satisfies RouterHandlers<
  CTXQuery & CTXCookie & CTXAuth & CTXSession,
  {
    GET: { invite: EmployeeHirePayload };
    POST: CTXBody & { body: { text: string }; invite: EmployeeHirePayload };
  }
>;
