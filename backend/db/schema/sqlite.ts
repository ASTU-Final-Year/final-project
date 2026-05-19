// backend/db/schema/sqlite.ts

import { relations, sql } from "drizzle-orm";
import {
  customType,
  sqliteTable,
  text,
  integer,
  numeric,
  uniqueIndex,
  real,
  primaryKey,
  index,
  foreignKey,
} from "drizzle-orm/sqlite-core";

export const cpuuid = customType<{ data: string; driverData: string }>({
  dataType() {
    return "text";
  },
  toDriver(v: string): string {
    const hex = Buffer.from(v, "base64url").toString("hex");
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  },
  fromDriver(v: string): string {
    const hex = `${v[0]}${v[1]}${v[2]}${v[3]}${v[4]}${v[5]}${v[6]}${v[7]}${v[9]}${v[10]}${v[11]}${v[12]}${v[14]}${v[15]}${v[16]}${v[17]}${v[19]}${v[20]}${v[21]}${v[22]}${v[24]}${v[25]}${v[26]}${v[27]}${v[28]}${v[29]}${v[30]}${v[31]}${v[32]}${v[33]}${v[34]}${v[35]}`;
    return Buffer.from(hex, "hex").toString("base64url");
  },
});

const randomCUUID = (): string => {
  const v = crypto.randomUUID();
  const hex = `${v[0]}${v[1]}${v[2]}${v[3]}${v[4]}${v[5]}${v[6]}${v[7]}${v[9]}${v[10]}${v[11]}${v[12]}${v[14]}${v[15]}${v[16]}${v[17]}${v[19]}${v[20]}${v[21]}${v[22]}${v[24]}${v[25]}${v[26]}${v[27]}${v[28]}${v[29]}${v[30]}${v[31]}${v[32]}${v[33]}${v[34]}${v[35]}`;
  return Buffer.from(hex, "hex").toString("base64url");
};

export const genderEnum = ["M", "F", "U"] as const;
export const appointmentStatusEnum = [
  "scheduled",
  "assigned",
  "in-progress",
  "completed",
  "canceled",
  "archived",
] as const;

export const billingPeriodEnum = ["monthly", "yearly"] as const;

export const rolesEnum = [
  "super_admin",
  "organization_admin",
  "employee",
  "client",
] as const;

const timestamps = {
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$onUpdate(
    () => new Date(),
  ),
  // deletedAt: int("deleted_at", { mode: "timestamp" }),
};

export const sqUsers = sqliteTable(
  "users",
  {
    id: cpuuid("id").primaryKey().notNull().$defaultFn(randomCUUID),
    firstname: text("firstname", { length: 40 }).notNull(),
    lastname: text("lastname", { length: 40 }).notNull(),
    gender: text("gender", { enum: genderEnum }).notNull().default("U"),
    role: text("role", { enum: rolesEnum }).notNull().default("client"),
    email: text("email", { length: 40 }).notNull().unique(),
    phone: text("phone", { length: 16 }).notNull(),
    password: text("password", { length: 128 }).notNull(),
    profile: text("profile", { mode: "json" })
      .notNull()
      .default({ picture: null }),
    preferences: text("preferences", { mode: "json" })
      .notNull()
      .default({
        notifications: {
          emailNotifications: false,
          smsAlerts: true,
          appointmentReminders: true,
          promotionalOffers: false,
        },
      }),
    ...timestamps,
  },
  (table: any) => [
    index("user_email_idx").on(table.email), // Manual index
  ],
);

export const sqSessions = sqliteTable("sessions", {
  id: cpuuid("id").primaryKey().notNull().$defaultFn(randomCUUID),
  userId: cpuuid("user_id")
    .notNull()
    .references(() => sqUsers.id, {
      onUpdate: "cascade",
      onDelete: "cascade",
    }),
  data: text("data", { mode: "json" }).notNull().default("{}"),
  expiresAt: integer("expires_at", { mode: "timestamp" }),
  ...timestamps,
});

export const sqSessionsBlacklist = sqliteTable("sessions_blacklist", {
  sessionId: cpuuid("session_id").primaryKey().notNull(),
  userId: cpuuid("user_id")
    .notNull()
    .references(() => sqUsers.id, {
      onUpdate: "cascade",
      onDelete: "cascade",
    }),
  expiresAt: integer("expires_at", { mode: "timestamp" }),
  ...timestamps,
});

export const sqPricingPlans = sqliteTable("pricing_plans", {
  id: text("id", { length: 16 }).primaryKey().notNull(),
  name: text("name", { length: 54 }).notNull(),
  price: numeric("price", { mode: "number" }).notNull().default(0.0),
  monthlyDiscount: numeric("monthly_discount", { mode: "number" })
    .notNull()
    .default(1.0),
  yearlyDiscount: numeric("yearly_discount", { mode: "number" })
    .notNull()
    .default(1.0),
  maxServices: integer("max_services").notNull().default(1),
  maxEmployees: integer("max_employees").notNull().default(10),
  features: text("features", { mode: "json" }).notNull(),
  popular: integer("popular", { mode: "boolean" }).notNull().default(false),
  ...timestamps,
});

export const sqOrganizations = sqliteTable(
  "organizations",
  {
    id: cpuuid("id").primaryKey().notNull().$defaultFn(randomCUUID),
    name: text("name", { length: 54 }).notNull(),
    slug: text("slug", { length: 30 }).notNull(),
    description: text("description", { length: 200 }).notNull().default(""),
    sector: text("sector", { length: 30 }).notNull(),
    isGovernment: integer("is_government", { mode: "boolean" })
      .notNull()
      .default(false),
    isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
    address: text("address", { length: 50 }).notNull(),
    email: text("email", { length: 30 }).unique().notNull(),
    phone: text("phone", { length: 16 }),
    rating: real("rating"),
    adminId: cpuuid("admin_id")
      .notNull()
      .references(() => sqUsers.id, {
        onUpdate: "cascade",
        onDelete: "cascade",
      }),
    pricingPlanId: text("pricing_plan_id", { length: 16 })
      .notNull()
      .references(() => sqPricingPlans.id, {
        onUpdate: "cascade",
        onDelete: "cascade",
      }),
    billingPeriod: text("billing_period", { enum: billingPeriodEnum }),
    billingStart: integer("billing_start", { mode: "timestamp" }).$defaultFn(
      () => new Date(),
    ),
    billingEnd: integer("billing_end", { mode: "timestamp" }),
    ...timestamps,
  },
  (table: any) => [
    index("organization_email_idx").on(table.email), // Manual index
  ],
);

export const sqOrganizationCalendars = sqliteTable("organization_calendars", {
  id: cpuuid("id").primaryKey().notNull().$defaultFn(randomCUUID),
  organizationId: cpuuid("organization_id")
    .notNull()
    .references(() => sqOrganizations.id, {
      onUpdate: "cascade",
      onDelete: "cascade",
    }),
  name: text("name", { length: 54 }).notNull(),
  description: text("description", { length: 200 }).notNull().default(""),
  available: text("available", { mode: "json" }),
  unavailable: text("unavailable", { mode: "json" }),
  ...timestamps,
});

export const sqEmployees = sqliteTable(
  "employees",
  {
    id: cpuuid("id").primaryKey().notNull().$defaultFn(randomCUUID),
    organizationId: cpuuid("organization_id")
      .notNull()
      .references(() => sqOrganizations.id, {
        onUpdate: "cascade",
        onDelete: "cascade",
      }),
    userId: cpuuid("user_id").notNull(),
    jobTitle: text("job_title", { length: 50 }).notNull(),
    jobDescription: text("job_description", { length: 200 })
      .notNull()
      .default(""),
    isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
    calendarId: cpuuid("calendar_id").references(
      () => sqOrganizationCalendars.id,
      {
        onUpdate: "set null",
        onDelete: "set null",
      },
    ),
    ...timestamps,
  },
  (table: any) => [
    uniqueIndex("service_first_employees_uk").on(
      table.organizationId,
      table.userId,
    ),
  ],
);

export const sqOrganizationServices = sqliteTable("organization_services", {
  id: cpuuid("id").primaryKey().notNull().$defaultFn(randomCUUID),
  name: text("name", { length: 54 }).notNull(),
  description: text("description", { length: 200 }).notNull().default(""),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  price: numeric("price", { mode: "number" }).notNull().default(0.0),
  calendarId: cpuuid("calendar_id").references(
    () => sqOrganizationCalendars.id,
    {
      onUpdate: "set null",
      onDelete: "set null",
    },
  ),
  organizationId: cpuuid("organization_id")
    .notNull()
    .references(() => sqOrganizations.id, {
      onUpdate: "cascade",
      onDelete: "cascade",
    }),
  ...timestamps,
});

export const sqServiceFirstEmployees = sqliteTable(
  "service_first_employees",
  {
    serviceId: cpuuid("service_id")
      .notNull()
      .references(() => sqOrganizationServices.id, {
        onUpdate: "cascade",
        onDelete: "cascade",
      }),
    employeeId: cpuuid("employee_id")
      .notNull()
      .references(() => sqEmployees.id, {
        onUpdate: "cascade",
        onDelete: "cascade",
      }),
    ...timestamps,
  },
  (table) => [primaryKey({ columns: [table.serviceId, table.employeeId] })],
);

export const sqAppointments = sqliteTable("appointments", {
  id: cpuuid("id").primaryKey().notNull().$defaultFn(randomCUUID),
  organizationId: cpuuid("organization_id")
    .notNull()
    .references(() => sqOrganizations.id, {
      onUpdate: "cascade",
      onDelete: "cascade",
    }),
  serviceId: cpuuid("service_id")
    .notNull()
    .references(() => sqOrganizationServices.id, {
      onUpdate: "cascade",
      onDelete: "no action",
    }),
  clientId: cpuuid("client_id")
    .notNull()
    .references(() => sqUsers.id, {
      onUpdate: "cascade",
      onDelete: "no action",
    }),
  // employeeId: cpuuid("employee_id").references(() => sqliteEmployees.id, {
  //   onDelete: "set null",
  // }),
  startTime: integer("start_time", { mode: "timestamp" }).notNull(),
  endTime: integer("end_time", { mode: "timestamp" }).notNull(),
  status: text("status", {
    enum: appointmentStatusEnum,
  })
    .notNull()
    .default("scheduled"),
  notes: text("notes", { length: 255 }),
  metadata: text("metadata", { mode: "json" }).default("{}"),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  ...timestamps,
});

export const sqTasks = sqliteTable("tasks", {
  id: cpuuid("id").primaryKey().notNull().$defaultFn(randomCUUID),
  isDone: integer("is_done", { mode: "boolean" }).notNull().default(false),
  name: text("name", { length: 54 }).notNull(),
  startTime: integer("start_time", { mode: "timestamp" }).notNull(),
  endTime: integer("end_time", { mode: "timestamp" }).notNull(),
  status: text("status", { length: 20 }).notNull(),
  requirements: text("requirements", { mode: "json" }),
  submissions: text("submissions", { mode: "json" }),
  forwards: text("forwards", { mode: "json" }),
  appointmentId: cpuuid("appointment_id")
    .references(() => sqAppointments.id, {
      onUpdate: "cascade",
      onDelete: "no action",
    })
    .notNull(),
  employeeId: cpuuid("employee_id")
    .references(() => sqEmployees.id, {
      onUpdate: "cascade",
      onDelete: "no action",
    })
    .notNull(),
  previousTaskId: cpuuid("previous_task_id").references(() => sqTasks.id, {
    onUpdate: "no action",
    onDelete: "no action",
  }),
  nextTaskId: cpuuid("next_task_id").references(() => sqTasks.id, {
    onUpdate: "no action",
    onDelete: "no action",
  }),
  ...timestamps,
});

////////////////////////////////////////////////

// 1. User & Session Relations
export const sqUsersRelations = relations(sqUsers, ({ many }) => ({
  sessions: many(sqSessions),
  employeeProfile: many(sqEmployees),
  tasks: many(sqTasks),
}));

export const sqSessionsRelations = relations(sqSessions, ({ one }) => ({
  user: one(sqUsers, { fields: [sqSessions.userId], references: [sqUsers.id] }),
}));

export const sqOrganizationsRelations = relations(
  sqOrganizations,
  ({ many, one }) => ({
    pricingPlans: one(sqPricingPlans, {
      fields: [sqOrganizations.pricingPlanId],
      references: [sqPricingPlans.id],
    }),
    services: many(sqOrganizationServices),
  }),
);

export const sqEmployeesRelations = relations(sqEmployees, ({ one, many }) => ({
  user: one(sqUsers, {
    fields: [sqEmployees.userId],
    references: [sqUsers.id],
  }),
  calendar: one(sqOrganizationCalendars, {
    fields: [sqEmployees.calendarId],
    references: [sqOrganizationCalendars.id],
  }),
  firstEmployeeOfServices: many(sqServiceFirstEmployees),
}));

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
      references: [sqEmployees.id],
    }),
  }),
);

export const sqAppointmentsRelations = relations(sqAppointments, ({ one }) => ({
  organization: one(sqOrganizations, {
    fields: [sqAppointments.organizationId],
    references: [sqOrganizations.id],
  }),
  service: one(sqOrganizationServices, {
    fields: [sqAppointments.serviceId],
    references: [sqOrganizationServices.id],
  }),
  client: one(sqUsers, {
    fields: [sqAppointments.clientId],
    references: [sqUsers.id],
  }),
  // employee: one(sqEmployees, {
  //   fields: [sqAppointments.employeeId],
  //   references: [sqEmployees.id],
  // }),
}));

export const sqTasksRelations = relations(sqTasks, ({ one }) => ({
  // appointment: one(sqAppointments, {
  //   fields: [sqTasks.appointmentId],
  //   references: [sqAppointments.id],
  // }),
  // employee: one(sqEmployees, {
  //   fields: [sqTasks.employeeId],
  //   references: [sqEmployees.id],
  // }),
  // previous_task: one(sqTasks, {
  //   fields: [sqTasks.previousTaskId],
  //   references: [sqTasks.id],
  // }),
  // next_task: one(sqTasks, {
  //   fields: [sqTasks.nextTaskId],
  //   references: [sqTasks.id],
  // }),
  // service: one(sqOrganizationServices, {
  //   fields: [sqTasks.serviceId],
  //   references: [sqOrganizationServices.id],
  // }),
  // organization: one(sqOrganizations, {
  //   fields: [sqTasks.organizationId],
  //   references: [sqOrganizations.id],
  // }),
  // client: one(sqUsers, {
  //   fields: [sqTasks.clientId],
  //   references: [sqUsers.id],
  // }),
}));

export const sqTables = {
  user: sqUsers,
  session: sqSessions,
  sessionBlacklist: sqSessionsBlacklist,
  pricingPlan: sqPricingPlans,
  organization: sqOrganizations,
  organizationCalendar: sqOrganizationCalendars,
  employee: sqEmployees,
  organizationService: sqOrganizationServices,
  serviceFirstEmployee: sqServiceFirstEmployees,
  task: sqTasks,
  appointment: sqAppointments,
};

export const sqRelations = {
  usersRelations: sqUsersRelations,
  sessionsRelations: sqSessionsRelations,
  organizationsRelations: sqOrganizationsRelations,
  employeesRelations: sqEmployeesRelations,
  organizationCalendarsRelations: sqOrganizationCalendarsRelations,
  organizationServicesRelations: sqOrganizationServicesRelations,
  serviceFirstEmployeesRelations: sqServiceFirstEmployeesRelations,
  tasksRelations: sqTasksRelations,
  appointmentRelations: sqAppointmentsRelations,
};

export const sqSchema = {
  ...sqTables,
  ...sqRelations,
};

export default sqSchema;
