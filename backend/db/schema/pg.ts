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
  "organization_branch_admin",
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

export const pgOrganizations = pgTable("organizations", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  name: varchar("name", { length: 54 }).notNull(),
  slug: varchar("slug", { length: 30 }).notNull(),
  description: varchar("description", { length: 200 }).notNull(),
  sector: varchar("sector", { length: 30 }).notNull(),
  isGovernment: boolean("is_government").notNull().default(false),
  address: varchar("address", { length: 50 }).notNull(),
  email: varchar("email", { length: 30 }).notNull(),
  phones: jsonb("phones").notNull(),
  rating: numeric("rating", { mode: "number", precision: 1 }),
  ...basicTimestamps(),
});

export const pgOrganizationAdmins = pgTable(
  "organization_admins",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => pgUsers.id, {
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
  },
  (table) => [primaryKey({ columns: [table.userId, table.organizationId] })],
);

export const pgOrganizationBranches = pgTable("organization_branches", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  name: varchar("name", { length: 54 }).notNull(),
  description: varchar("description", { length: 200 }).notNull(),
  address: varchar("address", { length: 50 }).notNull(),
  email: varchar("email", { length: 30 }).notNull(),
  phones: jsonb("phones").notNull(),
  rating: numeric("rating", { mode: "number", precision: 1 }),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => pgOrganizations.id, {
      onUpdate: "cascade",
      onDelete: "cascade",
    }),
  ...basicTimestamps(),
});

export const pgOrganizationBranchOffices = pgTable(
  "organization_branch_offices",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    name: varchar("name", { length: 54 }).notNull(),
    description: varchar("description", { length: 200 }).notNull(),
    address: varchar("address", { length: 50 }).notNull(),
    organizationBranchId: uuid("organization_branch_id")
      .notNull()
      .references(() => pgOrganizationBranches.id, {
        onUpdate: "cascade",
        onDelete: "cascade",
      }),
    ...basicTimestamps(),
  },
);

export const pgOrganizationBranchCalendars = pgTable(
  "organization_branch_calendars",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    organizationBranchId: uuid("organization_branch_id")
      .notNull()
      .references(() => pgOrganizationBranches.id, {
        onUpdate: "cascade",
        onDelete: "cascade",
      }),
    available: jsonb("available"),
    unavailable: jsonb("unavailable"),
    ...basicTimestamps(),
  },
);

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

export const pgEmployees = pgTable("employees", {
  userId: uuid("user_id").primaryKey().notNull(),
  jobTitle: varchar("job_title", { length: 50 }).notNull(),
  jobDescription: varchar("job_description", { length: 200 }).notNull(),
  calendarId: uuid("calendar_id").references(() => pgEmployeeCalendars.id, {
    onUpdate: "cascade",
    onDelete: "cascade",
  }),
  organizationBranchOfficeId: uuid("organization_branch_office_id")
    .notNull()
    .references(() => pgOrganizationBranchOffices.id, {
      onUpdate: "cascade",
      onDelete: "cascade",
    }),
  ...basicTimestamps(),
});

export const pgOrganizationServices = pgTable("organization_services", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  name: varchar("name", { length: 54 }).notNull(),
  description: varchar("description", { length: 200 }).notNull(),
  calendarId: uuid("calendar_id").references(
    () => pgOrganizationBranchCalendars.id,
    {
      onUpdate: "cascade",
      onDelete: "cascade",
    },
  ),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => pgOrganizations.id, {
      onUpdate: "cascade",
      onDelete: "cascade",
    }),
  ...basicTimestamps(),
});

export const pgOrganizationServiceFirstEmployees = pgTable(
  "organization_service_first_employees",
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
  adminProfiles: many(pgOrganizationAdmins),
  employeeProfile: many(pgEmployees),
  tasksAsClient: many(pgTasks),
  employeeCalendars: many(pgEmployeeCalendars),
}));

export const pgSessionsRelations = relations(pgSessions, ({ one }) => ({
  user: one(pgUsers, { fields: [pgSessions.userId], references: [pgUsers.id] }),
}));

export const pgOrganizationsRelations = relations(
  pgOrganizations,
  ({ many }) => ({
    admins: many(pgOrganizationAdmins),
    branches: many(pgOrganizationBranches),
    services: many(pgOrganizationServices),
  }),
);

export const pgOrganizationAdminsRelations = relations(
  pgOrganizationAdmins,
  ({ one }) => ({
    user: one(pgUsers, {
      fields: [pgOrganizationAdmins.userId],
      references: [pgUsers.id],
    }),
    organization: one(pgOrganizations, {
      fields: [pgOrganizationAdmins.organizationId],
      references: [pgOrganizations.id],
    }),
  }),
);

export const pgOrganizationBranchesRelations = relations(
  pgOrganizationBranches,
  ({ one, many }) => ({
    organization: one(pgOrganizations, {
      fields: [pgOrganizationBranches.organizationId],
      references: [pgOrganizations.id],
    }),
    offices: many(pgOrganizationBranchOffices),
    calendars: many(pgOrganizationBranchCalendars),
  }),
);

export const pgOrganizationBranchOfficesRelations = relations(
  pgOrganizationBranchOffices,
  ({ one, many }) => ({
    branch: one(pgOrganizationBranches, {
      fields: [pgOrganizationBranchOffices.organizationBranchId],
      references: [pgOrganizationBranches.id],
    }),
    employees: many(pgEmployees),
  }),
);

export const pgEmployeesRelations = relations(pgEmployees, ({ one, many }) => ({
  user: one(pgUsers, {
    fields: [pgEmployees.userId],
    references: [pgUsers.id],
  }),
  office: one(pgOrganizationBranchOffices, {
    fields: [pgEmployees.organizationBranchOfficeId],
    references: [pgOrganizationBranchOffices.id],
  }),
  calendar: one(pgEmployeeCalendars, {
    fields: [pgEmployees.calendarId],
    references: [pgEmployeeCalendars.id],
  }),
  serviceAssignments: many(pgOrganizationServiceFirstEmployees),
}));

export const pgEmployeeCalendarsRelations = relations(
  pgEmployeeCalendars,
  ({ one }) => ({
    user: one(pgUsers, {
      fields: [pgEmployeeCalendars.employeeId],
      references: [pgUsers.id],
    }),
  }),
);

export const pgOrganizationBranchCalendarsRelations = relations(
  pgOrganizationBranchCalendars,
  ({ one }) => ({
    branch: one(pgOrganizationBranches, {
      fields: [pgOrganizationBranchCalendars.organizationBranchId],
      references: [pgOrganizationBranches.id],
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
    calendar: one(pgOrganizationBranchCalendars, {
      fields: [pgOrganizationServices.calendarId],
      references: [pgOrganizationBranchCalendars.id],
    }),
    firstEmployees: many(pgOrganizationServiceFirstEmployees),
    tasks: many(pgTasks),
  }),
);

export const pgOrganizationServiceFirstEmployeesRelations = relations(
  pgOrganizationServiceFirstEmployees,
  ({ one }) => ({
    service: one(pgOrganizationServices, {
      fields: [pgOrganizationServiceFirstEmployees.serviceId],
      references: [pgOrganizationServices.id],
    }),
    employee: one(pgEmployees, {
      fields: [pgOrganizationServiceFirstEmployees.employeeId],
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
  organizations: pgOrganizations,
  organizationAdmins: pgOrganizationAdmins,
  organizationBranches: pgOrganizationBranches,
  organizationBranchOffices: pgOrganizationBranchOffices,
  organizationBranchCalendars: pgOrganizationBranchCalendars,
  employeeCalendars: pgEmployeeCalendars,
  employees: pgEmployees,
  organizationServices: pgOrganizationServices,
  organizationServiceFirstEmployees: pgOrganizationServiceFirstEmployees,
  tasks: pgTasks,

  usersRelations: pgUsersRelations,
  sessionsRelations: pgSessionsRelations,
  organizationsRelations: pgOrganizationsRelations,
  organizationAdminsRelations: pgOrganizationAdminsRelations,
  organizationBranchesRelations: pgOrganizationBranchesRelations,
  organizationBranchOfficesRelations: pgOrganizationBranchOfficesRelations,
  employeesRelations: pgEmployeesRelations,
  employeeCalendarsRelations: pgEmployeeCalendarsRelations,
  organizationBranchCalendarsRelations: pgOrganizationBranchCalendarsRelations,
  organizationServicesRelations: pgOrganizationServicesRelations,
  organizationServiceFirstEmployeesRelations:
    pgOrganizationServiceFirstEmployeesRelations,
  tasksRelations: pgTasksRelations,
};

export default pgSchema;
