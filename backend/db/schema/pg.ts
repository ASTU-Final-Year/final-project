import { relations } from "drizzle-orm";
import {
  customType,
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
  index,
} from "drizzle-orm/pg-core";
import { randomCUUID } from "~/lib";

// export const cpuuid = uuid;

export const cpuuid = customType<{ data: string; driverData: string }>({
  dataType() {
    return "uuid";
  },
  toDriver(v: string): string {
    const hex = Buffer.from(v, "base64url").toString("hex");
    return [
      hex.slice(0, 8),
      hex.slice(8, 12),
      hex.slice(12, 16),
      hex.slice(16, 20),
      hex.slice(20),
    ].join("-");
  },
  fromDriver(v: string): string {
    const hex = `${v[0]}${v[1]}${v[2]}${v[3]}${v[4]}${v[5]}${v[6]}${v[7]}${v[9]}${v[10]}${v[11]}${v[12]}${v[14]}${v[15]}${v[16]}${v[17]}${v[19]}${v[20]}${v[21]}${v[22]}${v[24]}${v[25]}${v[26]}${v[27]}${v[28]}${v[29]}${v[30]}${v[31]}${v[32]}${v[33]}${v[34]}${v[35]}`;
    return Buffer.from(hex, "hex").toString("base64url");
  },
});

export const genderEnum = pgEnum("gender", ["M", "F", "U"]);

export const appointmentStatusEnum = pgEnum("appointment_status", [
  "scheduled",
  "in-progress",
  "completed",
  "canceled",
  "archived",
  "confirmed",
]);

export const billingPeriodEnum = pgEnum("billing_period", [
  "monthly",
  "yearly",
]);

export const roleEnum = pgEnum("role", [
  "super_admin",
  "organization_admin",
  "employee",
  "client",
]);
// backend/db/schema/pg.ts - Update the notification type enum

export const notificationTypeEnum = pgEnum("notification_type", [
  // Appointment related
  "appointment_created",
  "appointment_updated",
  "appointment_cancelled",
  "appointment_reminder",

  // Task related
  "task_assigned",
  "task_completed",
  "task_requires_action",
  "task_submission_received",

  // Payment related
  "payment_received",
  "payment_failed",

  // Service related
  "service_rated",

  // Organization related
  "organization_created",
  "organization_updated",
  "employee_hired",
  "employee_removed",

  // Account related
  "account_created", // Add this for user registration
  "profile_updated", // Add this for profile updates

  // General
  "system_alert",
]);

export const notificationPriorityEnum = pgEnum("notification_priority", [
  "low",
  "medium",
  "high",
  "urgent",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "completed",
  "failed",
  "refunded",
]);

export const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
  // deletedAt: timestamp("deleted_at", { withTimezone: true }),
};

export const pgUsers = pgTable("users", {
  id: cpuuid("id").primaryKey().notNull().$defaultFn(randomCUUID),
  firstname: varchar("firstname", { length: 40 }).notNull(),
  lastname: varchar("lastname", { length: 40 }).notNull(),
  gender: genderEnum("gender").notNull().default("U"),
  role: roleEnum("role").notNull().default("client"),
  email: varchar("email", { length: 40 }).notNull().unique(),
  phone: varchar("phone", { length: 16 }).notNull(),
  password: varchar("password", { length: 128 }).notNull(),
  profile: jsonb("profile").notNull().default({ picture: null }),
  preferences: jsonb("preferences")
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
});

export const pgSessions = pgTable("sessions", {
  id: cpuuid("id").primaryKey().notNull().$defaultFn(randomCUUID),
  userId: cpuuid("user_id")
    .notNull()
    .references(() => pgUsers.id, {
      onUpdate: "cascade",
      onDelete: "cascade",
    }),
  data: jsonb("data").notNull().default("{}"),
  expiresAt: timestamp("expires_at", { mode: "date" }),
  ...timestamps,
});

export const pgSessionsBlacklist = pgTable("sessions_blacklist", {
  sessionId: cpuuid("session_id").primaryKey().notNull(),
  userId: cpuuid("user_id")
    .notNull()
    .references(() => pgUsers.id, {
      onUpdate: "cascade",
      onDelete: "cascade",
    }),
  expiresAt: timestamp("expires_at", { mode: "date" }),
  ...timestamps,
});

export const pgPricingPlans = pgTable("pricing_plans", {
  id: varchar("id", { length: 16 }).primaryKey().notNull(),
  name: varchar("name", { length: 54 }).notNull(),
  price: numeric("price", { mode: "number" }).notNull().default(0.0),
  monthlyDiscount: numeric("monthly_discount", { mode: "number" })
    .notNull()
    .default(1.0),
  yearlyDiscount: numeric("yearly_discount", { mode: "number" })
    .notNull()
    .default(1.0),
  maxServices: integer("max_services").notNull().default(1),
  maxEmployees: integer("max_employees").notNull().default(10),
  features: jsonb("features").notNull(),
  popular: boolean("popular").notNull().default(false),
  ...timestamps,
});

export const pgOrganizations = pgTable("organizations", {
  id: cpuuid("id").primaryKey().notNull().$defaultFn(randomCUUID),
  name: varchar("name", { length: 54 }).notNull(),
  slug: varchar("slug", { length: 30 }).notNull(),
  description: varchar("description", { length: 200 }).notNull().default(""),
  sector: varchar("sector", { length: 30 }).notNull(),
  isGovernment: boolean("is_government").notNull().default(false),
  isActive: boolean("is_active").notNull().default(true),
  address: varchar("address", { length: 50 }).notNull(),
  email: varchar("email", { length: 30 }).unique().notNull(),
  phone: varchar("phone", { length: 16 }),
  rating: numeric("rating", { mode: "number", precision: 1 }),
  total_ratings: integer("total_ratings").notNull().default(0),
  adminId: cpuuid("admin_id")
    .notNull()
    .references(() => pgUsers.id, {
      onUpdate: "cascade",
      onDelete: "cascade",
    }),
  pricingPlanId: varchar("pricing_plan_id", { length: 16 })
    .notNull()
    .references(() => pgPricingPlans.id, {
      onUpdate: "cascade",
      onDelete: "cascade",
    }),
  billingPeriod: billingPeriodEnum("billing_period"),
  billingStart: timestamp("billing_start", { mode: "date" }).defaultNow(),
  billingEnd: timestamp("billing_end", { mode: "date" }),
  ...timestamps,
});

export const pgOrganizationCalendars = pgTable("organization_calendars", {
  id: cpuuid("id").primaryKey().notNull().$defaultFn(randomCUUID),
  organizationId: cpuuid("organization_id")
    .notNull()
    .references(() => pgOrganizations.id, {
      onUpdate: "cascade",
      onDelete: "cascade",
    }),
  name: varchar("name", { length: 54 }).notNull(),
  description: varchar("description", { length: 200 }).notNull().default(""),
  available: jsonb("available"),
  unavailable: jsonb("unavailable"),
  ...timestamps,
});

export const pgEmployees = pgTable(
  "employees",
  {
    id: cpuuid("id").primaryKey().notNull().$defaultFn(randomCUUID),
    organizationId: cpuuid("organization_id")
      .notNull()
      .references(() => pgOrganizations.id, {
        onUpdate: "cascade",
        onDelete: "cascade",
      }),
    userId: cpuuid("user_id")
      .notNull()
      .references(() => pgUsers.id, {
        onUpdate: "cascade",
        onDelete: "cascade",
      }),
    jobTitle: varchar("job_title", { length: 50 }).notNull(),
    jobDescription: varchar("job_description", { length: 200 })
      .notNull()
      .default(""),
    isActive: boolean("is_active").notNull().default(true),
    calendarId: cpuuid("calendar_id").references(
      () => pgOrganizationCalendars.id,
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

export const pgOrganizationServices = pgTable("organization_services", {
  id: cpuuid("id").primaryKey().notNull().$defaultFn(randomCUUID),
  name: varchar("name", { length: 54 }).notNull(),
  description: varchar("description", { length: 200 }).notNull().default(""),
  isActive: boolean("is_active").notNull().default(true),
  maxClientsPerSlot: integer("max_clients_per_slot").default(10).notNull(),
  slotDuration: integer("slot_duration").default(60).notNull(), // in minutes
  price: numeric("price", { mode: "number" }).notNull().default(0.0),
  rating: numeric("rating", { mode: "number" }).notNull().default(0.0),
  total_ratings: integer("total_ratings").notNull().default(0),
  imageUrl: varchar("image_url", { length: 256 }),
  calendarId: cpuuid("calendar_id").references(
    () => pgOrganizationCalendars.id,
    {
      onUpdate: "set null",
      onDelete: "set null",
    },
  ),
  organizationId: cpuuid("organization_id")
    .notNull()
    .references(() => pgOrganizations.id, {
      onUpdate: "cascade",
      onDelete: "cascade",
    }),
  ...timestamps,
});

export const pgServiceFirstEmployees = pgTable(
  "service_first_employees",
  {
    serviceId: cpuuid("service_id")
      .notNull()
      .references(() => pgOrganizationServices.id, {
        onUpdate: "cascade",
        onDelete: "cascade",
      }),
    employeeId: cpuuid("employee_id")
      .notNull()
      .references(() => pgEmployees.id, {
        onUpdate: "cascade",
        onDelete: "cascade",
      }),
    ...timestamps,
  },
  (table) => [primaryKey({ columns: [table.serviceId, table.employeeId] })],
);

export const pgAppointments = pgTable("appointments", {
  id: cpuuid("id").primaryKey().notNull().$defaultFn(randomCUUID),
  organizationId: cpuuid("organization_id")
    .notNull()
    .references(() => pgOrganizations.id, {
      onUpdate: "cascade",
      onDelete: "cascade",
    }),
  serviceId: cpuuid("service_id")
    .notNull()
    .references(() => pgOrganizationServices.id, {
      onUpdate: "cascade",
      onDelete: "set null",
    }),
  clientId: cpuuid("client_id")
    .notNull()
    .references(() => pgUsers.id, {
      onUpdate: "cascade",
      onDelete: "set null",
    }),
  startTime: timestamp("start_time", { withTimezone: true }).notNull(),
  endTime: timestamp("end_time", { withTimezone: true }).notNull(),
  status: appointmentStatusEnum("status").notNull().default("scheduled"),
  notes: varchar("notes", { length: 255 }),
  metadata: jsonb("metadata").default("{}"),
  isActive: boolean("is_active").notNull().default(true),
  ...timestamps,
});

export const pgTasks = pgTable("tasks", {
  id: cpuuid("id").primaryKey().notNull().$defaultFn(randomCUUID),
  isDone: boolean("is_done").default(false).notNull(),
  name: varchar("name", { length: 54 }).notNull(),
  description: varchar("description", { length: 200 }).notNull().default(""),
  startTime: timestamp("start_time", { withTimezone: true }).notNull(),
  endTime: timestamp("end_time", { withTimezone: true }).notNull(),
  status: varchar("status", { length: 20 }).notNull(),
  requirements: jsonb("requirements").default({}),
  submissions: jsonb("submissions").default({}),
  forwards: jsonb("forwards").default({}),
  appointmentId: cpuuid("appointment_id")
    .references(() => pgAppointments.id, {
      onUpdate: "cascade",
      onDelete: "set null",
    })
    .notNull(),
  employeeId: cpuuid("employee_id")
    .references(() => pgEmployees.id, {
      onUpdate: "cascade",
      onDelete: "set null",
    })
    .notNull(),
  previousTaskId: cpuuid("previous_task_id").references(() => pgTasks.id, {
    onUpdate: "cascade",
    onDelete: "set null",
  }),
  nextTaskId: cpuuid("next_task_id").references(() => pgTasks.id, {
    onUpdate: "cascade",
    onDelete: "set null",
  }),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  ...timestamps,
});

export const pgNotifications = pgTable(
  "notifications",
  {
    id: cpuuid("id").primaryKey().notNull().$defaultFn(randomCUUID),
    userId: cpuuid("user_id")
      .notNull()
      .references(() => pgUsers.id, {
        onUpdate: "cascade",
        onDelete: "cascade",
      }),
    type: notificationTypeEnum("type").notNull(),
    title: varchar("title", { length: 30 }).notNull(),
    message: varchar("message", { length: 200 }).notNull(),
    priority: notificationPriorityEnum("priority").notNull().default("medium"),
    metadata: jsonb("metadata").default("{}"),
    isRead: boolean("is_read").notNull().default(false),
    isArchived: boolean("is_archived").notNull().default(false),
    actionUrl: varchar("action_url", { length: 100 }),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    readAt: timestamp("read_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("idx_notifications_user_id").on(table.userId),
    index("idx_notifications_user_unread").on(table.userId, table.isRead),
    index("idx_notifications_user_type").on(table.userId, table.type),
    index("idx_notifications_created_at").on(table.createdAt),
    index("idx_notifications_expires_at").on(table.expiresAt),
    index("idx_notifications_user_archived").on(table.userId, table.isArchived),
  ],
);

export const pgPayments = pgTable(
  "payments",
  {
    id: cpuuid("id").primaryKey().notNull().$defaultFn(randomCUUID),
    userId: cpuuid("user_id")
      .notNull()
      .references(() => pgUsers.id, {
        onUpdate: "cascade",
        onDelete: "set null",
      }),
    taskId: cpuuid("task_id").references(() => pgTasks.id, {
      onUpdate: "cascade",
      onDelete: "set null",
    }),
    appointmentId: cpuuid("appointment_id").references(
      () => pgAppointments.id,
      {
        onUpdate: "cascade",
        onDelete: "set null",
      },
    ),
    tx_ref: varchar("tx_ref", { length: 256 }).unique(), // Add this field
    transactionId: varchar("transaction_id", { length: 256 }).unique(),
    amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
    status: paymentStatusEnum("status").notNull().default("pending"),
    checkoutUrl: varchar("checkout_url", { length: 256 }),
    metadata: jsonb("metadata").default({}), // Add for additional data
    ...timestamps,
  },
  (table) => [
    index("idx_payments_tx_ref").on(table.tx_ref),
    index("idx_payments_transaction_id").on(table.transactionId),
  ],
);

//////////////////////////////////////////////////

export const pgUsersRelations = relations(pgUsers, ({ many }) => ({
  sessions: many(pgSessions),
  employeeProfile: many(pgEmployees),
  tasks: many(pgTasks),
}));

export const pgSessionsRelations = relations(pgSessions, ({ one }) => ({
  user: one(pgUsers, { fields: [pgSessions.userId], references: [pgUsers.id] }),
}));

export const pgOrganizationsRelations = relations(
  pgOrganizations,
  ({ many, one }) => ({
    pricingPlans: one(pgPricingPlans, {
      fields: [pgOrganizations.pricingPlanId],
      references: [pgPricingPlans.id],
    }),
    services: many(pgOrganizationServices),
  }),
);

export const pgEmployeesRelations = relations(pgEmployees, ({ one, many }) => ({
  user: one(pgUsers, {
    fields: [pgEmployees.userId],
    references: [pgUsers.id],
  }),
  calendar: one(pgOrganizationCalendars, {
    fields: [pgEmployees.calendarId],
    references: [pgOrganizationCalendars.id],
  }),
  firstEmployeeOfServices: many(pgServiceFirstEmployees),
}));

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
      references: [pgEmployees.id],
    }),
  }),
);

export const pgAppointmentsRelations = relations(pgAppointments, ({ one }) => ({
  organization: one(pgOrganizations, {
    fields: [pgAppointments.organizationId],
    references: [pgOrganizations.id],
  }),
  service: one(pgOrganizationServices, {
    fields: [pgAppointments.serviceId],
    references: [pgOrganizationServices.id],
  }),
  client: one(pgUsers, {
    fields: [pgAppointments.clientId],
    references: [pgUsers.id],
  }),
  // employee: one(pgEmployees, {
  //   fields: [pgAppointments.employeeId],
  //   references: [pgEmployees.id],
  // }),
}));

// Relations
export const pgNotificationsRelations = relations(
  pgNotifications,
  ({ one }) => ({
    user: one(pgUsers, {
      fields: [pgNotifications.userId],
      references: [pgUsers.id],
    }),
  }),
);

export const pgPaymentRelations = relations(pgPayments, ({ one }) => ({
  user: one(pgUsers, {
    fields: [pgPayments.userId],
    references: [pgUsers.id],
  }),
  task: one(pgTasks, {
    fields: [pgPayments.taskId],
    references: [pgTasks.id],
  }),
  appointment: one(pgAppointments, {
    fields: [pgPayments.appointmentId],
    references: [pgAppointments.id],
  }),
}));

export const pgTasksRelations = relations(pgTasks, ({ one }) => ({
  // appointment: one(pgAppointments, {
  //   fields: [pgTasks.appointmentId],
  //   references: [pgAppointments.id],
  // }),
  // employee: one(pgEmployees, {
  //   fields: [pgTasks.employeeId],
  //   references: [pgEmployees.id],
  // }),
  // previous_task: one(pgTasks, {
  //   fields: [pgTasks.previousTaskId],
  //   references: [pgTasks.id],
  // }),
  // next_task: one(pgTasks, {
  //   fields: [pgTasks.nextTaskId],
  //   references: [pgTasks.id],
  // }),
  // service: one(pgOrganizationServices, {
  //   fields: [pgTasks.serviceId],
  //   references: [pgOrganizationServices.id],
  // }),
  // organization: one(pgOrganizations, {
  //   fields: [pgTasks.organizationId],
  //   references: [pgOrganizations.id],
  // }),
  // client: one(pgUsers, {
  //   fields: [pgTasks.clientId],
  //   references: [pgUsers.id],
  // }),
}));

export const pgTables = {
  user: pgUsers,
  session: pgSessions,
  sessionBlacklist: pgSessionsBlacklist,
  pricingPlan: pgPricingPlans,
  organization: pgOrganizations,
  organizationCalendar: pgOrganizationCalendars,
  employee: pgEmployees,
  organizationService: pgOrganizationServices,
  serviceFirstEmployee: pgServiceFirstEmployees,
  task: pgTasks,
  appointment: pgAppointments,
  notification: pgNotifications,
  payment: pgPayments,
};

export const pgRelations = {
  usersRelations: pgUsersRelations,
  sessionsRelations: pgSessionsRelations,
  organizationsRelations: pgOrganizationsRelations,
  employeesRelations: pgEmployeesRelations,
  organizationCalendarsRelations: pgOrganizationCalendarsRelations,
  organizationServicesRelations: pgOrganizationServicesRelations,
  serviceFirstEmployeesRelations: pgServiceFirstEmployeesRelations,
  tasksRelations: pgTasksRelations,
  appointmentRelations: pgAppointmentsRelations,
  notificationsRelations: pgNotificationsRelations,
  paymentRelations: pgPaymentRelations,
};

export const pgSchema = {
  ...pgTables,
  ...pgRelations,
};

export default pgSchema;
