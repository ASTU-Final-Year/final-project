import { relations } from "drizzle-orm";
import {
  pgTable,
  varchar,
  uuid,
  date,
  boolean,
  numeric,
  jsonb,
  timestamp,
  uniqueIndex,
  integer,
  pgEnum,
  primaryKey,
} from "drizzle-orm/pg-core";

export const genderEnum = pgEnum("gender", ["M", "F", "U"]);

export const roleEnum = pgEnum("role", [
  "super_admin",
  "organization_admin",
  "employee",
  "client",
]);

const basicTimestamps = () => ({
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});

export const pgUsers = pgTable("users", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  firstname: varchar("firstname", { length: 40 }).notNull(),
  lastname: varchar("lastname", { length: 40 }).notNull(),
  gender: genderEnum("gender").notNull().default("U"),
  role: roleEnum("role").notNull().default("client"),
  email: varchar("email", { length: 40 }).notNull().unique(),
  phone: varchar("phone", { length: 16 }).notNull(),
  password: varchar("password", { length: 128 }).notNull(),
  ...basicTimestamps(),
});

export const pgSessions = pgTable("sessions", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => pgUsers.id, {
      onUpdate: "cascade",
      onDelete: "cascade",
    }),
  data: jsonb("data").notNull().default("{}"),
  expiresAt: timestamp("expires_at", { mode: "date" }),
  ...basicTimestamps(),
});

export const pgSessionsBlacklist = pgTable("sessions_blacklist", {
  sessionId: uuid("session_id").primaryKey().notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => pgUsers.id, {
      onUpdate: "cascade",
      onDelete: "cascade",
    }),
  expiresAt: timestamp("expires_at", { mode: "date" }),
  ...basicTimestamps(),
});

export const pgPricingPlans = pgTable("pricing_plans", {
  id: varchar("id", { length: 16 }).primaryKey().notNull(),
  name: varchar("name", { length: 54 }).notNull(),
  price: numeric("price", { mode: "number" }).notNull().default(1.0),
  monthlyDiscount: numeric("monthly_discount", { mode: "number" })
    .notNull()
    .default(1.0),
  annualDiscount: numeric("annual_discount", { mode: "number" })
    .notNull()
    .default(1.0),
  maxServices: integer("max_services").notNull().default(1),
  maxEmployees: integer("max_employees").notNull().default(10),
  features: jsonb("features").notNull(),
  popular: boolean("popular").notNull().default(false),
  ...basicTimestamps(),
});

export const pgOrganizations = pgTable("organizations", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  name: varchar("name", { length: 54 }).notNull(),
  slug: varchar("slug", { length: 30 }).notNull(),
  description: varchar("description", { length: 200 }).notNull(),
  sector: varchar("sector", { length: 30 }).notNull(),
  isGovernment: boolean("is_government").notNull().default(false),
  isActive: boolean("is_active").notNull().default(true),
  address: varchar("address", { length: 50 }).notNull(),
  email: varchar("email", { length: 30 }).unique().notNull(),
  phone: varchar("phone", { length: 16 }),
  rating: numeric("rating", { mode: "number", precision: 1 }),
  adminId: uuid("admin_id")
    .notNull()
    .references(() => pgUsers.id, {
      onUpdate: "cascade",
      onDelete: "cascade",
    }),
  pricingPlanId: uuid("pricing_plan_id")
    .notNull()
    .references(() => pgPricingPlans.id, {
      onUpdate: "cascade",
      onDelete: "cascade",
    }),
  ...basicTimestamps(),
});

export const pgOrganizationCalendars = pgTable("organization_calendars", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => pgOrganizations.id, {
      onUpdate: "cascade",
      onDelete: "cascade",
    }),
  available: jsonb("available"),
  unavailable: jsonb("unavailable"),
  ...basicTimestamps(),
});

export const pgEmployeeCalendars = pgTable("employee_calendars", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  employeeId: uuid("employeeId")
    .notNull()
    .references(() => pgUsers.id, {
      onUpdate: "cascade",
      onDelete: "cascade",
    }),
  available: jsonb("available"),
  unavailable: jsonb("unavailable"),
  ...basicTimestamps(),
});

export const pgEmployees = pgTable(
  "employees",
  {
    organizationId: uuid("organization_office_id")
      .notNull()
      .references(() => pgOrganizations.id, {
        onUpdate: "cascade",
        onDelete: "cascade",
      }),
    userId: uuid("user_id").notNull(),
    jobTitle: varchar("job_title", { length: 50 }).notNull(),
    jobDescription: varchar("job_description", { length: 200 }).notNull(),
    isActive: boolean("is_active").notNull().default(true),
    calendarId: uuid("calendar_id").references(() => pgEmployeeCalendars.id, {
      onUpdate: "cascade",
      onDelete: "cascade",
    }),
    ...basicTimestamps(),
  },
  (table) => [primaryKey({ columns: [table.organizationId, table.userId] })],
);

export const pgOrganizationServices = pgTable("organization_services", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  name: varchar("name", { length: 54 }).notNull(),
  description: varchar("description", { length: 200 }).notNull(),
  isActive: boolean("is_active").notNull().default(true),
  calendarId: uuid("calendar_id").references(() => pgOrganizationCalendars.id, {
    onUpdate: "cascade",
    onDelete: "cascade",
  }),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => pgOrganizations.id, {
      onUpdate: "cascade",
      onDelete: "cascade",
    }),
  ...basicTimestamps(),
});

export const pgServiceFirstEmployees = pgTable(
  "service_first_employees",
  {
    serviceId: uuid("service_id")
      .notNull()
      .references(() => pgOrganizationServices.id, {
        onUpdate: "cascade",
        onDelete: "cascade",
      }),
    employeeId: uuid("employee_id")
      .notNull()
      .references(() => pgEmployees.userId, {
        onUpdate: "cascade",
        onDelete: "cascade",
      }),
    ...basicTimestamps(),
  },
  (table) => [primaryKey({ columns: [table.serviceId, table.employeeId] })],
);

export const pgTasks = pgTable("tasks", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  isDone: boolean("is_done").default(false).notNull(),
  name: varchar("name", { length: 54 }).notNull(),
  status: varchar("status", { length: 20 }).notNull(),
  progress: jsonb("progress"),
  serviceId: uuid("service_id")
    .references(() => pgOrganizationServices.id, {
      onUpdate: "cascade",
      onDelete: "cascade",
    })
    .notNull(),
  clientId: uuid("client_id")
    .references(() => pgUsers.id, {
      onUpdate: "cascade",
      onDelete: "cascade",
    })
    .notNull(),
  ...basicTimestamps(),
});

//////////////////////////////////////////////////

export const pgUsersRelations = relations(pgUsers, ({ many }) => ({
  sessions: many(pgSessions),
  employeeProfile: many(pgEmployees),
  tasks: many(pgTasks),
  employeeCalendars: many(pgEmployeeCalendars),
}));

export const pgSessionsRelations = relations(pgSessions, ({ one }) => ({
  user: one(pgUsers, { fields: [pgSessions.userId], references: [pgUsers.id] }),
}));

export const pgOrganizationsRelations = relations(
  pgOrganizations,
  ({ many, one }) => ({
    pricingPlans: one(pgPricingPlans),
    services: many(pgOrganizationServices),
  }),
);

export const pgEmployeesRelations = relations(pgEmployees, ({ one, many }) => ({
  user: one(pgUsers, {
    fields: [pgEmployees.userId],
    references: [pgUsers.id],
  }),
  calendar: one(pgEmployeeCalendars, {
    fields: [pgEmployees.calendarId],
    references: [pgEmployeeCalendars.id],
  }),
  firstEmployeeOfServices: many(pgServiceFirstEmployees),
}));

export const pgEmployeeCalendarsRelations = relations(
  pgEmployeeCalendars,
  ({ one }) => ({
    user: one(pgUsers, {
      fields: [pgEmployeeCalendars.employeeId],
      references: [pgUsers.id],
    }),
    employee: one(pgEmployees, {
      fields: [pgEmployeeCalendars.employeeId],
      references: [pgEmployees.userId],
    }),
  }),
);

export const pgOrganizationCalendarsRelations = relations(
  pgOrganizationCalendars,
  ({ one }) => ({
    organization: one(pgOrganizations, {
      fields: [pgOrganizationCalendars.organizationId],
      references: [pgOrganizations.id],
    }),
  }),
);

export const pgOrganizationServicesRelations = relations(
  pgOrganizationServices,
  ({ one, many }) => ({
    organization: one(pgOrganizations, {
      fields: [pgOrganizationServices.organizationId],
      references: [pgOrganizations.id],
    }),
    calendar: one(pgOrganizationCalendars, {
      fields: [pgOrganizationServices.calendarId],
      references: [pgOrganizationCalendars.id],
    }),
    firstEmployees: many(pgServiceFirstEmployees),
    tasks: many(pgTasks),
  }),
);

export const pgServiceFirstEmployeesRelations = relations(
  pgServiceFirstEmployees,
  ({ one }) => ({
    service: one(pgOrganizationServices, {
      fields: [pgServiceFirstEmployees.serviceId],
      references: [pgOrganizationServices.id],
    }),
    employee: one(pgEmployees, {
      fields: [pgServiceFirstEmployees.employeeId],
      references: [pgEmployees.userId],
    }),
  }),
);

export const pgTasksRelations = relations(pgTasks, ({ one }) => ({
  service: one(pgOrganizationServices, {
    fields: [pgTasks.serviceId],
    references: [pgOrganizationServices.id],
  }),
  client: one(pgUsers, {
    fields: [pgTasks.clientId],
    references: [pgUsers.id],
  }),
}));

export const pgSchema = {
  users: pgUsers,
  sessions: pgSessions,
  sessionsBlacklist: pgSessionsBlacklist,
  pricingPlans: pgPricingPlans,
  organizations: pgOrganizations,
  organizationCalendars: pgOrganizationCalendars,
  employeeCalendars: pgEmployeeCalendars,
  employees: pgEmployees,
  organizationServices: pgOrganizationServices,
  serviceFirstEmployees: pgServiceFirstEmployees,
  tasks: pgTasks,

  usersRelations: pgUsersRelations,
  sessionsRelations: pgSessionsRelations,
  organizationsRelations: pgOrganizationsRelations,
  employeesRelations: pgEmployeesRelations,
  employeeCalendarsRelations: pgEmployeeCalendarsRelations,
  organizationCalendarsRelations: pgOrganizationCalendarsRelations,
  organizationServicesRelations: pgOrganizationServicesRelations,
  serviceFirstEmployeesRelations: pgServiceFirstEmployeesRelations,
  tasksRelations: pgTasksRelations,
};

export default pgSchema;
