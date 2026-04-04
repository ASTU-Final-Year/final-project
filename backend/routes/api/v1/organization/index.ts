// ROUTE: /api/v1/organization
import {
  authenticate,
  authorize,
  CTXAuth,
  CTXBody,
  CTXCookie,
  json,
  parseBody,
  parseCookie,
  RouterHandlers,
  status,
  Status,
} from "@bepalo/router";
import { ArkErrors, type } from "arktype";
import { CTXSession, OrganizationInit, Role, UserSecInit } from "~/base";
import { parseAuth, parseSession } from "~/middleware";
import OrganizationService from "~/services/organization.service";
import UserService from "~/services/user.service";

const TOrganizationRegistration = type({
  admin: {
    firstname: "3 <= string <= 40",
    lastname: "3 <= string <= 40",
    gender: "'M'|'F'|'U'",
    email: "string.email <= 40",
    phone: /^\+\d{2,3}\s?\d{9,10}$/,
    password: "8 <= string <= 30",
  },
  name: "3 <= string <= 54",
  slug: "3 <= string <= 30",
  description: "string <= 200",
  sector: "3 <= string <= 30",
  isGovernment: "boolean",
  address: "4 <= string <= 50",
  email: "string.email <= 30",
  phone: /^\+\d{2,3}\s?\d{9,10}$/,
  "rating?": "number|null",
  pricingPlanId: "string",
});

const TOrganizationUpdate = type({
  id: "10 <= string <= 40",
  "name?": "3 <= string <= 54",
  "slug?": "3 <= string <= 30",
  "description?": "string <= 200",
  "sector?": "3 <= string <= 30",
  "isGovernment?": "boolean",
  "isActive?": "boolean",
  "address?": "4 <= string <= 50",
  "email?": "string.email <= 30",
  "phone?": /^\+\d{2,3}\s?\d{9,10}$/,
  "rating?": "number|null",
  "pricingPlanId?": "string",
});

type OrganizationRegistration = typeof TOrganizationRegistration.infer;
type OrganizationUpdate = typeof TOrganizationUpdate.infer;

export default {
  POST: {
    FILTER: [
      parseBody({
        accept: ["application/x-www-form-urlencoded", "application/json"],
        maxSize: 1024,
        once: true,
      }),
      (req, { body }) => {
        const error = TOrganizationRegistration(body);
        if (error instanceof ArkErrors) {
          return status(Status._400_BadRequest, "Invalid body");
        }
      },
    ],
    HANDLER: [
      async (req, { body }) => {
        // Check if exists
        const existingUser = await UserService.getUserByEmail(body.admin.email);
        if (existingUser) {
          return status(
            Status._403_Forbidden,
            "User with the same email already exists",
          );
        }
        const existingOrganization =
          await OrganizationService.getOrganizationByEmail(body.email);
        if (existingOrganization) {
          return status(
            Status._403_Forbidden,
            "Organization with the same email already exists",
          );
        }
        // Register
        const admin = await UserService.createAdminUser({
          firstname: body.admin.firstname,
          lastname: body.admin.lastname,
          gender: body.admin.gender,
          email: body.admin.email,
          phone: body.admin.phone,
          password: body.admin.password,
        });
        const organization = await OrganizationService.createOrganization({
          name: body.name,
          slug: body.slug,
          description: body.description,
          sector: body.sector,
          isGovernment: body.isGovernment,
          isActive: true,
          address: body.address,
          email: body.email,
          phone: body.phone,
          rating: body.rating,
          adminId: admin.id,
          pricingPlanId: body.pricingPlanId,
        });
        return json(
          {
            organization,
            admin,
          },
          { status: Status._201_Created },
        );
      },
    ],
  },
  GET: {
    FILTER: [
      parseCookie(),
      authenticate({ parseAuth }),
      authorize({
        allowRole: (role: string) => role === "organization_admin",
      }),
      parseSession(),
    ],
    HANDLER: [
      async (req, { session }) => {
        const organization = await OrganizationService.getOrganizationByAdminId(
          session.userId,
        );
        if (!organization) {
          return status(Status._404_NotFound, "Organization not found");
        }
        return json({
          organization,
        });
      },
    ],
  },
  PATCH: {
    FILTER: [
      parseBody({
        accept: ["application/x-www-form-urlencoded", "application/json"],
        maxSize: 1024,
        once: true,
      }),
      (req, { body }) => {
        const error = TOrganizationRegistration(body);
        if (error instanceof ArkErrors) {
          return status(Status._400_BadRequest, "Invalid body");
        }
      },
    ],
    HANDLER: [
      async (req, { body }) => {
        const organization = await OrganizationService.updateOrganization(body);
        return json({
          organization,
        });
      },
    ],
  },
  DELETE: {
    FILTER: [parseCookie(), authenticate({ parseAuth }), parseSession()],
    HANDLER: [
      async (req, { session }) => {
        await OrganizationService.deleteOrganizationByAdminId(session.userId);
        return status(Status._200_OK);
      },
    ],
  },
} satisfies RouterHandlers<
  {},
  {
    POST: CTXBody & { body: OrganizationRegistration };
    GET: CTXSession & CTXAuth & CTXCookie;
    PATCH: CTXBody & { body: OrganizationUpdate };
    DELETE: CTXSession & CTXAuth & CTXCookie;
  }
>;
