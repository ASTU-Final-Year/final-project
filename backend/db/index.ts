import { config, dbConfig } from "~/config";
import { drizzle as drizzlePG } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { drizzle as drizzleSQLite } from "drizzle-orm/libsql";
import pgSchema from "./schema/pg";
import sqliteSchema from "./schema/sqlite";
import PaymentService from "~/services/payment.service";
import defaultPricingPlans from "@/data/default-pricing-plans";
import { createClient } from "@libsql/client";
import SessionService from "~/services/session.service";
import { sampleData } from "../../sample.data";
import { tables } from "./schema";
import { router } from "..";

const prodDatabase = config.prodDatabase as false;

const pool = new Pool({
  connectionString: dbConfig.pgDatabaseURL,
});

const sqlite = createClient({ url: "file:" + dbConfig.sqliteDatabaseURL });
if (!prodDatabase) {
  sqlite.execute("PRAGMA journal_mode = WAL;");
  sqlite.execute("PRAGMA synchronous = NORMAL;");
  sqlite.execute("PRAGMA foreign_keys = ON;");
}
export const dbPG = drizzlePG({ client: pool, schema: pgSchema });
export const dbSQLite = drizzleSQLite(sqlite, { schema: sqliteSchema });
export const db = (prodDatabase ? dbPG : dbSQLite) as typeof dbSQLite;

export const checkDBConnection = async () => {
  if (prodDatabase) {
    try {
      const client = await pool.connect();
      try {
        await client.query("SELECT 1");
        return true;
      } finally {
        client.release();
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  } else {
    try {
      dbSQLite.run("SELECT 1");
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
};

// create super-admin account
export const initDb = async () => {
  if (!(await checkDBConnection())) {
    throw new Error("❌ Database initialization fialed!");
  }
  // populate basic info
  {
    // const superAdminEmail = dbConfig.superAdminEmail;
    // await UserService.getUserByEmail(superAdminEmail).then((user) => {
    //   if (!user) {
    //     UserService.createAdminUser({
    //       email: superAdminEmail,
    //       firstname: dbConfig.superAdminFirstname,
    //       lastname: dbConfig.superAdminLastname,
    //       password: dbConfig.superAdminPassword,
    //       gender: "U",
    //       phone: "",
    //       role: "super_admin",
    //     }).then(() => {
    //       console.log("✅ Admin user created.");
    //     });
    //   }
    //   // console.log("✅ POPULATE_DB: super-admin already created.");
    // });
    // UserService.getUserByEmail(superAdminEmail).then(console.log);
    if (
      !(await PaymentService.getPricingPlansById(defaultPricingPlans[0].id))
    ) {
      for (const [name, pricingPlan] of Object.entries(defaultPricingPlans)) {
        await PaymentService.createPricingPlan(pricingPlan);
      }
    }
    if (!config.isProduction) {
      for (const [name, entries] of Object.entries(sampleData)) {
        // const res = await router.respond(
        //   new Request(`/query/v1/${name}`, {
        //     method: "POST",
        //     body: JSON.stringify(entries),
        //   }),
        // );
        // entries.map(entry)
        for (const entry of entries) {
          try {
            await db.insert(tables[name]).values(entry);
          } catch (error) {
            // console.log(error);
            if (
              !(error.cause && error.cause.toString().includes("duplicate"))
            ) {
              console.log(name, entry);
              console.error(
                error.cause ? error.cause.toString() : error.toString(),
              );
            }
          }
        }
      }
    }
    // delete expired sessions and sessionBlacklists
    {
      await SessionService.deleteExpiredSessions();
      await SessionService.deleteExpiredSessionsBlacklist();
    }
  }
};
