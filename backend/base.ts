import { JWT, type JwtSymmetricAlgorithm } from "@bepalo/jwt";
import type { CTXAddress, RouterContext } from "@bepalo/router";
import { securityConfig } from "./config";

export const jwts = {
  auth: JWT.createSymmetric(
    securityConfig.authJwtKey,
    securityConfig.authJwtAlg,
  ),
};

export type Role = "super_admin" | "organization_admin" | "employee" | "client";

export const ROLES: Role[] = [
  "super_admin",
  "organization_admin",
  "employee",
  "client",
];

export type PermissionType = "create" | "view" | "update" | "delete" | "make";

export type PermissionTarget =
  | "self"
  | "organization"
  | "employee"
  | "client"
  | "service"
  | "calendar"
  | "appointment"
  | "progress"
  | "payment_gateway"
  | "payment";

export type Permission = Partial<
  Record<PermissionType, Partial<Record<PermissionTarget, boolean>>>
>;

export type Permissions = Record<Role, Permission>;

export const PERMISSIONS: Permissions = {
  super_admin: {
    create: {
      self: true,
      organization: true,
      employee: true,
      client: true,
      service: true,
      calendar: true,
      appointment: true,
      progress: true,
      payment_gateway: true,
      payment: true,
    },
    view: {
      self: true,
      organization: true,
      employee: true,
      client: true,
      service: true,
      calendar: true,
      appointment: true,
      progress: true,
      payment_gateway: true,
      payment: true,
    },
    update: {
      self: true,
      organization: true,
      employee: true,
      client: true,
      service: true,
      calendar: true,
      appointment: true,
      progress: true,
      payment_gateway: true,
      payment: true,
    },
    delete: {
      self: true,
      organization: true,
      employee: true,
      client: true,
      service: true,
      calendar: true,
      appointment: true,
      progress: true,
      payment_gateway: true,
      payment: true,
    },
    make: {
      appointment: true,
      payment: true,
    },
  },
  organization_admin: {
    create: {
      self: true,
      organization: true,
      employee: true,
      client: true,
      service: true,
      calendar: true,
      appointment: true,
      progress: true,
      payment: true,
    },
    view: {
      self: true,
      organization: true,
      employee: true,
      service: true,
      calendar: true,
      appointment: true,
      progress: true,
      payment_gateway: true,
      payment: true,
    },
    update: {
      self: true,
      organization: true,
      employee: true,
      service: true,
      calendar: true,
      appointment: true,
      progress: true,
      payment: true,
    },
    delete: {
      self: true,
      organization: true,
      employee: true,
      service: true,
      calendar: true,
      appointment: true,
      progress: true,
      payment: true,
    },
    make: {
      appointment: true,
      payment: true,
    },
  },
  employee: {
    create: {
      self: true,
      calendar: true,
      progress: true,
    },
    view: {
      self: true,
      organization: true,
      employee: true,
      client: true,
      service: true,
      calendar: true,
      appointment: true,
      progress: true,
      payment_gateway: true,
      payment: true,
    },
    update: {
      self: true,
      calendar: true,
      appointment: true,
      progress: true,
    },
    delete: {
      self: true,
      calendar: true,
      payment: true,
    },
    make: {
      appointment: true,
      payment: true,
    },
  },
  client: {
    create: {
      self: true,
      calendar: true,
    },
    view: {
      self: true,
      organization: true,
      service: true,
      calendar: true,
      appointment: true,
      progress: true,
      payment_gateway: true,
      payment: true,
    },
    update: {
      self: true,
      appointment: true,
      progress: true,
    },
    delete: {
      self: true,
      appointment: true,
      payment: true,
    },
    make: {
      appointment: true,
      payment: true,
    },
  },
};

export interface UserSec {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  gender: string;
  password: string;
  role: Role | string;
  createdAt: Date;
  updatedAt: Date;
}

export type UserSecInit = Omit<UserSec, "id" | "createdAt" | "updatedAt"> &
  Partial<Pick<UserSec, "id" | "createdAt" | "updatedAt">>;

export type User = Omit<UserSec, "password">;

export interface Organization {
  id: string;
  name: string;
  uniqueName: string;
  sector: string;
  isGovernment: boolean;
  address: string;
  email: string;
  phone: string;
}

export interface OrganizationAdmin {
  id: string;
  organizationId: string;
  organization?: Organization;
}

export interface Employee {
  id: string;
  organizationId: string;
  organization?: Organization;
}

export interface Service {
  id: string;
  organizationId: string;
  organization?: Organization;
}

export interface Calendar {
  id: string;
  serviceId: string;
  service?: Service;
  employeeId: string;
  employee?: Service;
}

export interface Session {
  id: string;
  userId: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
}

export interface CTXSession {
  user: User;
  session: Session;
}

export type CTXMain = RouterContext & CTXAddress & CTXSession;
