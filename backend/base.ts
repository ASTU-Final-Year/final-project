import { JWT, type JwtSymmetricAlgorithm } from "@bepalo/jwt";
import type { CTXAddress, RouterContext } from "@bepalo/router";
import { securityConfig } from "./config";

export const jwts = {
  auth: JWT.createSymmetric(
    securityConfig.authJwtKey,
    securityConfig.authJwtAlg,
  ),
};

export interface CTXSession {
  session: Session;
}

export type Gender = "M" | "F" | "U";
export type Role =
  | "super_admin"
  | "organization_admin"
  | "organization_branch_admin"
  | "employee"
  | "client";

export const ROLES: Role[] = [
  "super_admin",
  "organization_admin",
  "organization_branch_admin",
  "employee",
  "client",
];

export enum WeekDay {
  Sunday = 0,
  Monday = 1,
  Tuesday = 2,
  Wednsday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6,
}

export interface DateRange {
  from: Date;
  to: Date;
}

export interface CalendarBase {
  available?: {
    ranges?: DateRange[];
    weekly?: WeekDay[];
    yearly?: Date[];
  };
  unavailable?: {
    ranges?: DateRange[];
    weekly?: WeekDay[];
    yearly?: Date[];
  };
}

export type PermissionType = "create" | "view" | "update" | "delete" | "make";

export type PermissionTarget =
  | "self"
  | "organization"
  | "organization_own"
  | "organization_service"
  | "organization_service_own"
  | "organization_branch"
  | "organization_branch_own"
  | "organization_branch_calendar"
  | "organization_branch_calendar_own"
  | "organization_branch_admin"
  | "organization_branch_admin_own"
  | "employee"
  | "employee_self"
  | "employee_own"
  | "employee_calendar"
  | "employee_calendar_own"
  | "client"
  | "appointment"
  | "task"
  | "task_own"
  | "task_progress"
  | "task_progress_own"
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
      organization_branch: true,
      organization_branch_admin: true,
      organization_branch_calendar: true,
      employee: true,
      employee_calendar: true,
      client: true,
      organization_service: true,
      appointment: true,
      task: true,
      task_progress: true,
      payment_gateway: true,
      payment: true,
    },
    view: {
      self: true,
      organization: true,
      organization_branch: true,
      organization_branch_admin: true,
      organization_branch_calendar: true,
      employee: true,
      employee_calendar: true,
      client: true,
      organization_service: true,
      appointment: true,
      task: true,
      task_progress: true,
      payment_gateway: true,
      payment: true,
    },
    update: {
      self: true,
      organization: true,
      organization_branch: true,
      organization_branch_admin: true,
      organization_branch_calendar: true,
      employee: true,
      employee_calendar: true,
      client: true,
      organization_service: true,
      appointment: true,
      task: true,
      task_progress: true,
      payment_gateway: true,
      payment: true,
    },
    delete: {
      self: true,
      organization: true,
      organization_branch: true,
      organization_branch_admin: true,
      organization_branch_calendar: true,
      employee: true,
      employee_calendar: true,
      client: true,
      organization_service: true,
      appointment: true,
      task: true,
      task_progress: true,
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
      organization_own: true,
      organization_branch_own: true,
      organization_branch_admin_own: true,
      organization_branch_calendar_own: true,
      employee_own: true,
      client: true,
      organization_service_own: true,
      appointment: true,
      task: true,
      task_progress: true,
      payment: true,
    },
    view: {
      self: true,
      organization: true,
      organization_own: true,
      organization_branch_own: true,
      organization_branch_admin_own: true,
      organization_branch_calendar_own: true,
      employee_own: true,
      employee_calendar_own: true,
      organization_service: true,
      organization_service_own: true,
      appointment: true,
      task: true,
      task_progress: true,
      payment_gateway: true,
      payment: true,
    },
    update: {
      self: true,
      organization_own: true,
      organization_branch_own: true,
      organization_branch_admin_own: true,
      organization_branch_calendar_own: true,
      employee_own: true,
      organization_service_own: true,
      appointment: true,
      task: true,
      task_progress: true,
      payment: true,
    },
    delete: {
      self: true,
      organization_own: true,
      organization_branch_own: true,
      organization_branch_admin_own: true,
      organization_branch_calendar_own: true,
      employee_own: true,
      organization_service_own: true,
      appointment: true,
      task: true,
      task_progress: true,
      payment: true,
    },
    make: {
      appointment: true,
      payment: true,
    },
  },
  organization_branch_admin: {
    create: {
      self: true,
      organization_branch_admin_own: true,
      organization_branch_calendar: true,
      employee_own: true,
      client: true,
      appointment: true,
      task: true,
      task_progress: true,
      payment: true,
    },
    view: {
      self: true,
      organization: true,
      organization_branch_own: true,
      organization_branch_admin_own: true,
      organization_branch_calendar_own: true,
      employee_own: true,
      employee_calendar_own: true,
      organization_service: true,
      organization_service_own: true,
      appointment: true,
      task: true,
      task_progress: true,
      payment_gateway: true,
      payment: true,
    },
    update: {
      self: true,
      organization: true,
      organization_branch_own: true,
      organization_branch_admin_own: true,
      organization_branch_calendar_own: true,
      employee_own: true,
      appointment: true,
      task: true,
      task_progress: true,
      payment: true,
    },
    delete: {
      self: true,
      organization_branch_admin_own: true,
      organization_branch_calendar_own: true,
      employee_own: true,
      appointment: true,
      task: true,
      task_progress: true,
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
      employee_calendar_own: true,
      task_progress_own: true,
    },
    view: {
      self: true,
      organization_own: true,
      employee_self: true,
      client: true,
      organization_service: true,
      organization_service_own: true,
      employee_calendar_own: true,
      appointment: true,
      task_own: true,
      task_progress_own: true,
      payment_gateway: true,
      payment: true,
    },
    update: {
      self: true,
      employee_calendar_own: true,
      appointment: true,
      task_own: true,
      task_progress_own: true,
    },
    delete: {
      self: true,
      employee_calendar_own: true,
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
      organization_branch_calendar: true,
    },
    view: {
      self: true,
      organization: true,
      organization_service: true,
      organization_branch_calendar: true,
      appointment: true,
      task_own: true,
      task_progress_own: true,
      payment_gateway: true,
      payment: true,
    },
    update: {
      self: true,
      appointment: true,
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
} as const;

export interface UserSec {
  id: string;
  firstname: string;
  lastname: string;
  gender: Gender;
  role: Role;
  email: string;
  phone: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export type UserSecInit = Omit<UserSec, "id" | "createdAt" | "updatedAt"> &
  Partial<Pick<UserSec, "id" | "createdAt" | "updatedAt">>;

export type User = Omit<UserSec, "password">;

export interface Session {
  id: string;
  userId: string;
  data: Object;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
  user: User;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  description: string;
  sector: string;
  isGovernment: boolean;
  address: string;
  email: string;
  phones: string[];
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrganizationAdmin extends User {
  id: string;
  organizationId: string;
  organization?: Organization;
}

export interface OrganizationBranch {
  id: string;
  name: string;
  description: string;
  address: string;
  email: string;
  phones: string[];
  organizationId: string;
  organization?: Organization;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrganizationBranchOffice {
  id: string;
  name: string;
  description: string;
  address: string;
  organizationBranchId: string;
  organizationBranch?: OrganizationBranch;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrganizationBranchCalendar extends CalendarBase {
  id: string;
  organizationBranchId: string;
  organizationBranch?: OrganizationBranch;
  organizationId?: string;
  organization?: Organization;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrganizationBranchAdmin extends User {
  id: string;
  organizationBranchId: string;
  organizationBranch?: OrganizationBranch;
}

export interface Employee extends User {
  id: string;
  jobTitle: string;
  jobDescription: string;
  calendarId?: string;
  calendar?: EmployeeCalendar;
  organizationBranchOfficeId: string;
  organizationBranchOffice?: OrganizationBranchOffice;
  organizationId?: string;
  organization?: Organization;
  organizationBranchId?: string;
  organizationBranch?: OrganizationBranch;
}

export interface EmployeeCalendar extends CalendarBase {
  id: string;
  employeeId: string;
  employee?: Employee;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrganizationService {
  id: string;
  name: string;
  description: string;
  organizationId: string;
  organization?: Organization;
  calendarId?: string;
  calendar?: OrganizationBranchCalendar;
  firstEmployeesId: string[];
  firstEmployees?: Employee[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskProgress {
  index: number;
  state: string;
  title: string;
  notes: string;
  attachments: Blob[];
  employeeId: string;
  employee?: Employee;
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: string;
  isDone: boolean;
  status: string;
  serviceId: string;
  service?: OrganizationService;
  organizationBranchId: string;
  organizationBranch?: OrganizationBranch;
  clientId: string;
  client?: User;
  progress: TaskProgress[];
  createdAt: Date;
  updatedAt: Date;
}

export type CTXMain = RouterContext & CTXAddress & CTXSession;
