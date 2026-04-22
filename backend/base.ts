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
export type Role = "super_admin" | "organization_admin" | "employee" | "client";
export interface CTXSession {
  session: Session;
}

export const ROLES: Role[] = [
  "super_admin",
  "organization_admin",
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
  name: string;
  description: string;
  available?: {
    ranges?: DateRange[] | null;
    weekly?: WeekDay[] | null;
    monthly?: number[] | null;
    exactly?: Date[] | null;
  } | null;
  unavailable?: {
    ranges?: DateRange[] | null;
    weekly?: WeekDay[] | null;
    monthly?: number[] | null;
    exactly?: Date[] | null;
  } | null;
}

export type PermissionType = "create" | "view" | "update" | "delete" | "make";

export type PermissionTarget =
  | "self"
  | "organization"
  | "organization_own"
  | "organization_admin"
  | "organization_admin_own"
  | "organization_service"
  | "organization_service_own"
  | "organization_calendar"
  | "organization_calendar_own"
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
      organization_admin: true,
      organization_calendar: true,
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
      organization_admin: true,
      organization_calendar: true,
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
      organization_admin: true,
      organization_calendar: true,
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
      organization_admin: true,
      organization_calendar: true,
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
      organization_admin_own: true,
      organization_calendar_own: true,
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
      organization_admin_own: true,
      organization_calendar_own: true,
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
      organization_admin_own: true,
      organization_calendar_own: true,
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
      organization_admin_own: true,
      organization_calendar_own: true,
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
      organization_calendar: true,
    },
    view: {
      self: true,
      organization: true,
      organization_service: true,
      organization_calendar: true,
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
  data: object;
  expiresAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  user: User;
}

export type SessionInit = Omit<
  Session,
  "id" | "createdAt" | "updatedAt" | "user"
> &
  Partial<Pick<Session, "id" | "createdAt" | "updatedAt" | "user">>;

export interface SessionBlacklist {
  sessionId: string;
  userId: string;
  expiresAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
}

export type SessionBlacklistInit = Omit<
  SessionBlacklist,
  "sessionId" | "createdAt" | "updatedAt" | "user"
> &
  Partial<
    Pick<SessionBlacklist, "sessionId" | "createdAt" | "updatedAt" | "user">
  >;

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  monthlyDiscount: number;
  annualDiscount: number;
  maxServices: number;
  maxEmployees: number;
  features: string[];
  popular: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type PricingPlanInit = Omit<PricingPlan, "createdAt" | "updatedAt"> &
  Partial<Pick<PricingPlan, "createdAt" | "updatedAt">>;

export type OrganizationBillingPeriod = "monthly" | "annually";

export interface Organization {
  id: string;
  name: string;
  slug: string;
  description: string;
  sector: string;
  isGovernment: boolean;
  address: string;
  email: string;
  phone?: string | null;
  rating?: number | null;
  isActive: boolean;
  adminId: string;
  admin: User;
  pricingPlanId: string;
  pricingPlan: PricingPlan;
  billingPeriod?: OrganizationBillingPeriod | null;
  billingStart?: Date | null;
  billingEnd?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export type OrganizationInit = Omit<
  Organization,
  "id" | "createdAt" | "updatedAt" | "admin" | "pricingPlan"
> &
  Partial<
    Pick<
      Organization,
      "id" | "createdAt" | "updatedAt" | "admin" | "pricingPlan"
    >
  >;

export type OrganizationUpdate = Partial<OrganizationInit> &
  Pick<Organization, "id">;

export type OrganizationPure = Partial<
  Omit<Organization, "admin" | "pricingPlan">
>;

export type OrganizationWithAdmin = Partial<Omit<Organization, "pricingPlan">>;

export type OrganizationWithPricingPlan = Partial<Omit<Organization, "admin">>;

export type CTXOrganization = {
  organization: Organization;
};

export interface OrganizationCalendar extends CalendarBase {
  id: string;
  organizationId: string;
  organization: Organization;
  createdAt: Date;
  updatedAt: Date;
}

export type OrganizationCalendarPure = Omit<
  OrganizationCalendar,
  "organization"
>;

export type OrganizationCalendarInit = Omit<
  OrganizationCalendar,
  "id" | "createdAt" | "updatedAt" | "organization"
> &
  Partial<Pick<OrganizationCalendar, "id" | "createdAt" | "updatedAt">>;

export type OrganizationCalendarUpdate = Partial<
  Omit<OrganizationCalendar, "organization" | "createdAt" | "updatedAt">
> &
  Pick<OrganizationCalendar, "id" | "organizationId">;

export interface Employee {
  jobTitle: string;
  jobDescription: string;
  isActive: boolean;
  calendarId?: string | null;
  calendar?: EmployeeCalendar;
  userId: string;
  user: User;
  organizationId: string;
  organization: Organization;
  createdAt: Date;
  updatedAt: Date;
}

export type EmployeeInit = Omit<
  Employee,
  "createdAt" | "updatedAt" | "user" | "organization"
> &
  Partial<
    Pick<
      Employee,
      "createdAt" | "updatedAt" | "user" | "organization" | "calendar"
    >
  >;

export type EmployeeUpdate = Partial<
  Omit<
    EmployeeInit,
    "calendar" | "userId" | "user" | "organizationId" | "organization"
  >
> &
  Pick<Employee, "userId">;

export type EmployeePure = Omit<Employee, "organization" | "user" | "calendar">;

export type EmployeeWithCalendar = Omit<Employee, "organization" | "user">;

export type EmployeeWithOrganization = Omit<Employee, "calendar" | "user">;

export type EmployeeWithUser = Omit<Employee, "calendar" | "organization">;

export type CTXEmployee = {
  employee: Employee;
};

export interface EmployeeCalendar extends CalendarBase {
  id: string;
  employeeId: string;
  employee: Employee;
  createdAt: Date;
  updatedAt: Date;
}

export type EmployeeCalendarPure = Omit<EmployeeCalendar, "employee">;

export type EmployeeCalendarInit = Omit<
  EmployeeCalendar,
  "id" | "createdAt" | "updatedAt" | "employee"
> &
  Partial<Pick<EmployeeCalendar, "id" | "createdAt" | "updatedAt">>;

export type EmployeeCalendarUpdate = Partial<
  Omit<EmployeeCalendar, "id" | "employee" | "createdAt" | "updatedAt">
> &
  Pick<EmployeeCalendar, "id" | "employeeId">;

export interface OrganizationService {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  organizationId: string;
  organization: Organization;
  calendarId?: string | null;
  calendar?: OrganizationCalendar | null;
  // firstEmployeesId?: string[];
  // firstEmployees?: Employee[];
  createdAt: Date;
  updatedAt: Date;
}

export type OrganizationServiceInit = Omit<
  OrganizationService,
  "id" | "createdAt" | "updatedAt" | "organization"
> &
  Partial<Pick<OrganizationService, "id" | "createdAt" | "updatedAt">>;

export type OrganizationServiceUpdate = Partial<
  Omit<OrganizationServiceInit, "organization" | "calendar">
> &
  Pick<OrganizationService, "id">;

export type OrganizationServiceWithOrganization = Omit<
  OrganizationService,
  "calendar" | "organization"
> & { organization: OrganizationPure };

export type OrganizationServiceWithCalendar = Omit<
  OrganizationService,
  "organization"
>;

export type OrganizationServicePure = Omit<
  OrganizationService,
  "organization" | "calendar"
>;

export interface OrganizationServiceFirstEmployee {
  serviceId: string;
  service: OrganizationService;
  employeeId: string;
  employee: Employee;
  createdAt: Date;
  updatedAt: Date;
}

export type OrganizationServiceFirstEmployeeInit = Omit<
  OrganizationServiceFirstEmployee,
  "service" | "employee" | "createdAt" | "updatedAt"
> &
  Partial<
    Pick<
      OrganizationServiceFirstEmployee,
      "service" | "employee" | "createdAt" | "updatedAt"
    >
  >;

export type OrganizationServiceFirstEmployeePure = Omit<
  OrganizationServiceFirstEmployee,
  "service" | "employee"
>;

export type OrganizationServiceFirstEmployeeWithService = Omit<
  OrganizationServiceFirstEmployee,
  "employee"
>;

export type OrganizationServiceFirstEmployeeWithEmployee = Omit<
  OrganizationServiceFirstEmployee,
  "service"
>;

export type OrganizationServiceFirstEmployeeUpdate = Partial<
  Omit<
    OrganizationServiceFirstEmployeeInit,
    "serviceId" | "createdAt" | "service" | "employee"
  >
> &
  Pick<OrganizationServiceFirstEmployee, "serviceId">;

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

export type TaskProgressInit = Omit<TaskProgress, "createdAt" | "updatedAt"> &
  Partial<Pick<TaskProgress, "createdAt" | "updatedAt">>;

export interface Task {
  id: string;
  isDone: boolean;
  status: string;
  serviceId: string;
  service?: OrganizationService;
  organizationId: string;
  organization?: Organization;
  clientId: string;
  client?: User;
  progress: TaskProgress[];
  createdAt: Date;
  updatedAt: Date;
}

export type TaskInit = Omit<Task, "id" | "createdAt" | "updatedAt"> &
  Partial<Pick<Task, "id" | "createdAt" | "updatedAt">>;

export type CTXMain = RouterContext & CTXAddress & CTXSession;
