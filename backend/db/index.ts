import { config, dbConfig } from "~/config";
import { drizzle as drizzlePG } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { drizzle as drizzleSQLite } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import pgSchema from "./schema/pg";
import sqliteSchema from "./schema/sqlite";
import PaymentService from "~/services/payment.service";
import defaultPricingPlans from "@/data/default-pricing-plans";

const pool = new Pool({
  connectionString: dbConfig.pgDatabaseURL,
});

const sqlite = new Database(dbConfig.sqliteDatabaseURL);
export const dbPG = drizzlePG({ client: pool, schema: pgSchema });
export const dbSQLite = drizzleSQLite(sqlite, { schema: sqliteSchema });
// export const db = config.isProduction ? dbPG : dbSQLite;
export const db = dbSQLite;

export const checkDBConnection = async () => {
  if (config.isProduction) {
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
  }
};
