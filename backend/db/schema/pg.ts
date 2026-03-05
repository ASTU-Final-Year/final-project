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
} from "drizzle-orm/pg-core";

export const pgUsers = pgTable("users", {
  id: uuid().primaryKey().notNull(),
  firstname: varchar({ length: 40 }).notNull(),
  lastname: varchar({ length: 40 }).notNull(),
  email: varchar({ length: 40 }).notNull().unique(),
  phone: varchar({ length: 16 }).notNull(),
  gender: varchar({ length: 12 }).notNull(),
  password: varchar({ length: 128 }).notNull(),
  role: varchar({ length: 16 }).notNull(),
  createdAt: timestamp({ mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp({ mode: "date" }).notNull().defaultNow(),
});

export const pgSessions = pgTable("sessions", {
  id: uuid().primaryKey().notNull(),
  userId: uuid()
    .notNull()
    .references(() => pgUsers.id, {
      onUpdate: "cascade",
      onDelete: "cascade",
    }),
  expiresAt: timestamp({ mode: "date" }).notNull(),
  createdAt: timestamp({ mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp({ mode: "date" }).notNull().defaultNow(),
});

export const pgSchema = {
  users: pgUsers,
  sessions: pgSessions,
};

export default pgSchema;
