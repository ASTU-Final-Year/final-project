// drizzle.config.ts
import type { Config } from "drizzle-kit";
import { config } from "dotenv";
config();

export default {
  schema: "./backend/db/schema/pg.ts",
  out: "./drizzle/pg",
  dialect: "postgresql",
  dbCredentials: {
    url:
      process.env.PG_DATABASE_URL ||
      "postgresql://postgres:postgres@localhost:5432/servesyncplus",
  },
} satisfies Config;
