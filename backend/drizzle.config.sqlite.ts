// drizzle.config.ts
import type { Config } from "drizzle-kit";
import { config as dotenvConfig } from "dotenv";
dotenvConfig({ path: "../.env" });

export default {
  schema: "./db/schema/sqlite.ts",
  out: "./drizzle/sqlite",
  dialect: "sqlite",
  dbCredentials: {
    url: process.env.SQLITE_DATABASE_URL || ".dev.db",
  },
} satisfies Config;
