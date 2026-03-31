import { relations, sql } from "drizzle-orm";
import {
  sqliteTable,
  text,
  integer,
  numeric,
  uniqueIndex,
  real,
  primaryKey,
} from "drizzle-orm/sqlite-core";

export const genderEnum = ["M", "F", "U"] as const;

export const rolesEnum = [
  "super_admin",
  "organization_admin",
  "organization_branch_admin",
  "employee",
  "client",
] as const;

const basicTimestamps = () => ({
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const sqUsers = sqliteTable("users", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => crypto.randomUUID()),
  firstname: text("firstname", { length: 40 }).notNull(),
  lastname: text("lastname", { length: 40 }).notNull(),
  gender: text("gender", { enum: genderEnum }).notNull().default("U"),
  role: text("role", { enum: rolesEnum }).notNull().default("client"),
  email: text("email", { length: 40 }).notNull().unique(),
  phone: text("phone", { length: 16 }).notNull(),
  password: text("password", { length: 128 }).notNull(),
  ...basicTimestamps(),
});

export const sqSessions = sqliteTable("sessions", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => sqUsers.id, {
      onUpdate: "cascade",
      onDelete: "cascade",
    }),
  data: text("data", { mode: "json" }).notNull().default("{}"),
  expiresAt: integer("expires_at", { mode: "timestamp" }),
  ...basicTimestamps(),
});

export const sqPricingPlans = sqliteTable("pricing_plans", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name", { length: 54 }).notNull(),
  price: numeric("price", { mode: "number" }).notNull().default(1.0),
  monthlyDiscount: numeric("monthly_discount", { mode: "number" })
    .notNull()
    .default(1.0),
  annualDiscount: numeric("annual_discount", { mode: "number" })
    .notNull()
    .default(1.0),
  maxServices: integer("max_services").notNull().default(1),
  maxEmployees: integer("max_employees").notNull().default(10),
  features: text("features", { mode: "json" }).notNull(),
  popular: integer("popular", { mode: "boolean" }).notNull().default(false),
  ...basicTimestamps(),
});

export const sqOrganizations = sqliteTable("organizations", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name", { length: 54 }).notNull(),
  slug: text("slug", { length: 30 }).notNull(),
  description: text("description", { length: 200 }).notNull(),
  sector: text("sector", { length: 30 }).notNull(),
  isGovernment: integer("is_government", { mode: "boolean" })
    .notNull()
    .default(false),
  address: text("address", { length: 50 }).notNull(),
  email: text("email", { length: 30 }).notNull(),
  phones: text("phones", { mode: "json" }).notNull(),
  rating: real("rating"),
  pricingPlansId: text("pricing_plans_id")
    .notNull()
    .references(() => sqPricingPlans.id, {
      onUpdate: "cascade",
      onDelete: "cascade",
    }),
  ...basicTimestamps(),
});

export const sqOrganizationAdmins = sqliteTable(
  "organization_admins",
  {
    userId: text("user_id")
      .notNull()
      .references(() => sqUsers.id, {
        onUpdate: "cascade",
        onDelete: "cascade",
      }),
    organizationId: text("organization_id")
      .notNull()
      .references(() => sqOrganizations.id, {
        onUpdate: "cascade",
        onDelete: "cascade",
      }),
    ...basicTimestamps(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.organizationId] })],
);

export const sqOrganizationBranches = sqliteTable("organization_branches", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name", { length: 54 }).notNull(),
  description: text("description", { length: 200 }).notNull(),
  address: text("address", { length: 50 }).notNull(),
  email: text("email", { length: 30 }).notNull(),
  phones: text("phones", { mode: "json" }).notNull(),
  rating: real("rating"),
  organizationId: text("organization_id")
    .notNull()
    .references(() => sqOrganizations.id, {
      onUpdate: "cascade",
      onDelete: "cascade",
    }),
  ...basicTimestamps(),
});

export const sqOrganizationBranchOffices = sqliteTable(
  "organization_branch_offices",
  {
    id: text("id")
      .primaryKey()
      .notNull()
      .$defaultFn(() => crypto.randomUUID()),
    name: text("name", { length: 54 }).notNull(),
    description: text("description", { length: 200 }).notNull(),
    address: text("address", { length: 50 }).notNull(),
    email: text("email", { length: 30 }).notNull(),
    phones: text("phones", { mode: "json" }).notNull(),
    organizationBranchId: text("organization_branch_id")
      .notNull()
      .references(() => sqOrganizationBranches.id, {
        onUpdate: "cascade",
        onDelete: "cascade",
      }),
    ...basicTimestamps(),
  },
);

export const sqOrganizationBranchCalendars = sqliteTable(
  "organization_branch_calendars",
  {
    id: text("id")
      .primaryKey()
      .notNull()
      .$defaultFn(() => crypto.randomUUID()),
    organizationBranchId: text("organization_branch_id")
      .notNull()
      .references(() => sqOrganizations.id, {
        onUpdate: "cascade",
        onDelete: "cascade",
      }),
    available: text("available", { mode: "json" }),
    unavailable: text("unavailable", { mode: "json" }),
    ...basicTimestamps(),
  },
);

export const sqEmployeeCalendars = sqliteTable("employee_calendars", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => crypto.randomUUID()),
  employeeId: text("employee_id")
    .notNull()
    .references(() => sqUsers.id, {
      onUpdate: "cascade",
      onDelete: "cascade",
    }),
  available: text("available", { mode: "json" }),
  unavailable: text("unavailable", { mode: "json" }),
  ...basicTimestamps(),
});

export const sqEmployees = sqliteTable("employees", {
  userId: text("user_id").primaryKey().notNull(),
  jobTitle: text("job_title", { length: 50 }).notNull(),
  jobDescription: text("job_description", { length: 200 }).notNull(),
  calendarId: text("calendar_id").references(() => sqEmployeeCalendars.id, {
    onUpdate: "cascade",
    onDelete: "cascade",
  }),
  organizationBranchOfficeId: text("organization_branch_office_id")
    .notNull()
    .references(() => sqOrganizationBranchOffices.id, {
      onUpdate: "cascade",
      onDelete: "cascade",
    }),
  ...basicTimestamps(),
});

export const sqOrganizationServices = sqliteTable("organization_services", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name", { length: 54 }).notNull(),
  description: text("description", { length: 200 }).notNull(),
  calendarId: text("calendar_id").references(
    () => sqOrganizationBranchCalendars.id,
    {
      onUpdate: "cascade",
      onDelete: "cascade",
    },
  ),
  organizationId: text("organization_id")
    .notNull()
    .references(() => sqOrganizations.id, {
      onUpdate: "cascade",
      onDelete: "cascade",
    }),
  ...basicTimestamps(),
});

export const sqOrganizationServiceFirstEmployees = sqliteTable(
  "organization_service_first_employees",
  {
    serviceId: text("service_id")
      .notNull()
      .references(() => sqOrganizationServices.id, {
        onUpdate: "cascade",
        onDelete: "cascade",
      }),
    employeeId: text("employee_id")
      .notNull()
      .references(() => sqEmployees.userId, {
        onUpdate: "cascade",
        onDelete: "cascade",
      }),
    ...basicTimestamps(),
  },
  (table) => [primaryKey({ columns: [table.serviceId, table.employeeId] })],
);

export const sqTasks = sqliteTable("tasks", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => crypto.randomUUID()),
  isDone: integer("is_done", { mode: "boolean" }).default(false).notNull(),
  name: text("name", { length: 54 }).notNull(),
  status: text("status", { length: 20 }).notNull(),
  progress: text("progress", { mode: "json" }),
  serviceId: text("service_id")
    .references(() => sqOrganizationServices.id, {
      onUpdate: "cascade",
      onDelete: "cascade",
    })
    .notNull(),
  clientId: text("client_id")
    .references(() => sqUsers.id, {
      onUpdate: "cascade",
      onDelete: "cascade",
    })
    .notNull(),
  ...basicTimestamps(),
});

////////////////////////////////////////////////

// 1. User & Session Relations
export const sqUsersRelations = relations(sqUsers, ({ many }) => ({
  sessions: many(sqSessions),
  adminProfiles: many(sqOrganizationAdmins),
  employeeProfile: many(sqEmployees), // Using 'many' even if logical 1:1 to handle potential schema evolution
  tasks: many(sqTasks),
  employeeCalendars: many(sqEmployeeCalendars),
}));

export const sqSessionsRelations = relations(sqSessions, ({ one }) => ({
  user: one(sqUsers, { fields: [sqSessions.userId], references: [sqUsers.id] }),
}));

export const sqOrganizationsRelations = relations(
  sqOrganizations,
  ({ many, one }) => ({
    pricingPlans: one(sqPricingPlans),
    admins: many(sqOrganizationAdmins),
    branches: many(sqOrganizationBranches),
    services: many(sqOrganizationServices),
  }),
);

export const sqOrganizationAdminsRelations = relations(
  sqOrganizationAdmins,
  ({ one }) => ({
    user: one(sqUsers, {
      fields: [sqOrganizationAdmins.userId],
      references: [sqUsers.id],
    }),
    organization: one(sqOrganizations, {
      fields: [sqOrganizationAdmins.organizationId],
      references: [sqOrganizations.id],
    }),
  }),
);

export const sqOrganizationBranchesRelations = relations(
  sqOrganizationBranches,
  ({ one, many }) => ({
    organization: one(sqOrganizations, {
      fields: [sqOrganizationBranches.organizationId],
      references: [sqOrganizations.id],
    }),
    offices: many(sqOrganizationBranchOffices),
    calendars: many(sqOrganizationBranchCalendars),
  }),
);

export const sqOrganizationBranchOfficesRelations = relations(
  sqOrganizationBranchOffices,
  ({ one, many }) => ({
    branch: one(sqOrganizationBranches, {
      fields: [sqOrganizationBranchOffices.organizationBranchId],
      references: [sqOrganizationBranches.id],
    }),
    employees: many(sqEmployees),
  }),
);

export const sqEmployeesRelations = relations(sqEmployees, ({ one, many }) => ({
  user: one(sqUsers, {
    fields: [sqEmployees.userId],
    references: [sqUsers.id],
  }),
  office: one(sqOrganizationBranchOffices, {
    fields: [sqEmployees.organizationBranchOfficeId],
    references: [sqOrganizationBranchOffices.id],
  }),
  calendar: one(sqEmployeeCalendars, {
    fields: [sqEmployees.calendarId],
    references: [sqEmployeeCalendars.id],
  }),
  firstEmployeeOfServices: many(sqOrganizationServiceFirstEmployees),
}));

export const sqEmployeeCalendarsRelations = relations(
  sqEmployeeCalendars,
  ({ one }) => ({
    employee: one(sqUsers, {
      fields: [sqEmployeeCalendars.employeeId],
      references: [sqUsers.id],
    }),
  }),
);

export const sqOrganizationBranchCalendarsRelations = relations(
  sqOrganizationBranchCalendars,
  ({ one }) => ({
    branch: one(sqOrganizationBranches, {
      fields: [sqOrganizationBranchCalendars.organizationBranchId],
      references: [sqOrganizationBranches.id],
    }),
  }),
);

export const sqOrganizationServicesRelations = relations(
  sqOrganizationServices,
  ({ one, many }) => ({
    organization: one(sqOrganizations, {
      fields: [sqOrganizationServices.organizationId],
      references: [sqOrganizations.id],
    }),
    calendar: one(sqOrganizationBranchCalendars, {
      fields: [sqOrganizationServices.calendarId],
      references: [sqOrganizationBranchCalendars.id],
    }),
    assignedEmployees: many(sqOrganizationServiceFirstEmployees),
    tasks: many(sqTasks),
  }),
);

export const sqOrganizationServiceFirstEmployeesRelations = relations(
  sqOrganizationServiceFirstEmployees,
  ({ one }) => ({
    service: one(sqOrganizationServices, {
      fields: [sqOrganizationServiceFirstEmployees.serviceId],
      references: [sqOrganizationServices.id],
    }),
    employee: one(sqEmployees, {
      fields: [sqOrganizationServiceFirstEmployees.employeeId],
      references: [sqEmployees.userId],
    }),
  }),
);

export const sqTasksRelations = relations(sqTasks, ({ one }) => ({
  service: one(sqOrganizationServices, {
    fields: [sqTasks.serviceId],
    references: [sqOrganizationServices.id],
  }),
  client: one(sqUsers, {
    fields: [sqTasks.clientId],
    references: [sqUsers.id],
  }),
}));

export const sqliteSchema = {
  users: sqUsers,
  sessions: sqSessions,
  pricingPlans: sqPricingPlans,
  organizations: sqOrganizations,
  organizationAdmins: sqOrganizationAdmins,
  organizationBranches: sqOrganizationBranches,
  organizationBranchOffices: sqOrganizationBranchOffices,
  organizationBranchCalendars: sqOrganizationBranchCalendars,
  employeeCalendars: sqEmployeeCalendars,
  employees: sqEmployees,
  organizationServices: sqOrganizationServices,
  organizationServiceFirstEmployees: sqOrganizationServiceFirstEmployees,
  tasks: sqTasks,

  usersRelations: sqUsersRelations,
  sessionsRelations: sqSessionsRelations,
  organizationsRelations: sqOrganizationsRelations,
  organizationAdminsRelations: sqOrganizationAdminsRelations,
  organizationBranchesRelations: sqOrganizationBranchesRelations,
  organizationBranchOfficesRelations: sqOrganizationBranchOfficesRelations,
  employeesRelations: sqEmployeesRelations,
  employeeCalendarsRelations: sqEmployeeCalendarsRelations,
  organizationBranchCalendarsRelations: sqOrganizationBranchCalendarsRelations,
  organizationServicesRelations: sqOrganizationServicesRelations,
  organizationServiceFirstEmployeesRelations:
    sqOrganizationServiceFirstEmployeesRelations,
  tasksRelations: sqTasksRelations,
};

export default sqliteSchema;
