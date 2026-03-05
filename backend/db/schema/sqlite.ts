import {
  sqliteTable,
  text,
  integer,
  numeric,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const sqUsers = sqliteTable("users", {
  id: text("id").primaryKey().notNull(), // SQLite uses TEXT for UUIDs
  firstname: text("firstname", { length: 40 }).notNull(),
  lastname: text("lastname", { length: 40 }).notNull(),
  email: text("email", { length: 40 }).notNull().unique(),
  phone: text("phone", { length: 16 }).notNull(),
  gender: text("gender", { length: 12 }).notNull(),
  password: text("password", { length: 128 }).notNull(),
  role: text("role", { length: 16 }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const sqSessions = sqliteTable("sessions", {
  id: text("id").primaryKey().notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => sqUsers.id, {
      onUpdate: "cascade",
      onDelete: "cascade",
    }),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const sqliteSchema = {
  users: sqUsers,
  sessions: sqSessions,
};

export default sqliteSchema;
