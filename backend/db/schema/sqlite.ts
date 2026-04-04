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

export const sqSessionsBlacklist = sqliteTable("sessions_blacklist", {
  sessionId: text("session_id").primaryKey().notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => sqUsers.id, {
      onUpdate: "cascade",
      onDelete: "cascade",
    }),
  expiresAt: integer("expires_at", { mode: "timestamp" }),
  ...basicTimestamps(),
});

export const sqPricingPlans = sqliteTable("pricing_plans", {
  id: text("id", { length: 16 }).primaryKey().notNull(),
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
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  address: text("address", { length: 50 }).notNull(),
  email: text("email", { length: 30 }).unique().notNull(),
  phone: text("phone", { length: 16 }),
  rating: real("rating"),
  adminId: text("admin_id")
    .notNull()
    .references(() => sqUsers.id, {
      onUpdate: "cascade",
      onDelete: "cascade",
    }),
  pricingPlanId: text("pricing_plan_id")
    .notNull()
    .references(() => sqPricingPlans.id, {
      onUpdate: "cascade",
      onDelete: "cascade",
    }),
  ...basicTimestamps(),
});

export const sqOrganizationCalendars = sqliteTable("organization_calendars", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => crypto.randomUUID()),
  organizationId: text("organization_id")
    .notNull()
    .references(() => sqOrganizations.id, {
      onUpdate: "cascade",
      onDelete: "cascade",
    }),
  available: text("available", { mode: "json" }),
  unavailable: text("unavailable", { mode: "json" }),
  ...basicTimestamps(),
});

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

export const sqEmployees = sqliteTable(
  "employees",
  {
    organizationId: text("organization_id")
      .notNull()
      .references(() => sqOrganizations.id, {
        onUpdate: "cascade",
        onDelete: "cascade",
      }),
    userId: text("user_id").notNull(),
    jobTitle: text("job_title", { length: 50 }).notNull(),
    jobDescription: text("job_description", { length: 200 }).notNull(),
    isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
    calendarId: text("calendar_id").references(() => sqEmployeeCalendars.id, {
      onUpdate: "cascade",
      onDelete: "cascade",
    }),
    ...basicTimestamps(),
  },
  (table) => [primaryKey({ columns: [table.organizationId, table.userId] })],
);

export const sqOrganizationServices = sqliteTable("organization_services", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name", { length: 54 }).notNull(),
  description: text("description", { length: 200 }).notNull(),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  calendarId: text("calendar_id").references(() => sqOrganizationCalendars.id, {
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
});

export const sqServiceFirstEmployees = sqliteTable(
  "service_first_employees",
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
  employeeProfile: many(sqEmployees),
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
    services: many(sqOrganizationServices),
  }),
);

export const sqEmployeesRelations = relations(sqEmployees, ({ one, many }) => ({
  user: one(sqUsers, {
    fields: [sqEmployees.userId],
    references: [sqUsers.id],
  }),
  calendar: one(sqEmployeeCalendars, {
    fields: [sqEmployees.calendarId],
    references: [sqEmployeeCalendars.id],
  }),
  firstEmployeeOfServices: many(sqServiceFirstEmployees),
}));

export const sqEmployeeCalendarsRelations = relations(
  sqEmployeeCalendars,
  ({ one }) => ({
    user: one(sqUsers, {
      fields: [sqEmployeeCalendars.employeeId],
      references: [sqUsers.id],
    }),
    employee: one(sqEmployees, {
      fields: [sqEmployeeCalendars.employeeId],
      references: [sqEmployees.userId],
    }),
  }),
);

export const sqOrganizationCalendarsRelations = relations(
  sqOrganizationCalendars,
  ({ one }) => ({
    organization: one(sqOrganizations, {
      fields: [sqOrganizationCalendars.organizationId],
      references: [sqOrganizations.id],
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
    calendar: one(sqOrganizationCalendars, {
      fields: [sqOrganizationServices.calendarId],
      references: [sqOrganizationCalendars.id],
    }),
    firstEmployees: many(sqServiceFirstEmployees),
    tasks: many(sqTasks),
  }),
);

export const sqServiceFirstEmployeesRelations = relations(
  sqServiceFirstEmployees,
  ({ one }) => ({
    service: one(sqOrganizationServices, {
      fields: [sqServiceFirstEmployees.serviceId],
      references: [sqOrganizationServices.id],
    }),
    employee: one(sqEmployees, {
      fields: [sqServiceFirstEmployees.employeeId],
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
  sessionsBlacklist: sqSessionsBlacklist,
  pricingPlans: sqPricingPlans,
  organizations: sqOrganizations,
  organizationCalendars: sqOrganizationCalendars,
  employeeCalendars: sqEmployeeCalendars,
  employees: sqEmployees,
  organizationServices: sqOrganizationServices,
  serviceFirstEmployees: sqServiceFirstEmployees,
  tasks: sqTasks,

  usersRelations: sqUsersRelations,
  sessionsRelations: sqSessionsRelations,
  organizationsRelations: sqOrganizationsRelations,
  employeesRelations: sqEmployeesRelations,
  employeeCalendarsRelations: sqEmployeeCalendarsRelations,
  organizationCalendarsRelations: sqOrganizationCalendarsRelations,
  organizationServicesRelations: sqOrganizationServicesRelations,
  serviceFirstEmployeesRelations: sqServiceFirstEmployeesRelations,
  tasksRelations: sqTasksRelations,
};

export default sqliteSchema;
