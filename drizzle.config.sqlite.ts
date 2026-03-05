// drizzle.config.ts
import type { Config } from "drizzle-kit";
import { config } from "dotenv";
config();

export default {
  schema: "./backend/db/schema/sqlite.ts",
  out: "./drizzle/sqlite",
  dialect: "sqlite",
  dbCredentials: {
    url: process.env.SQLITE_DATABASE_URL || ".dev.db",
  },
} satisfies Config;
