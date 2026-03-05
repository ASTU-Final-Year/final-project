import { config, dbConfig } from "~/config";
import { drizzle as drizzlePG } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { drizzle as drizzleSQLite } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import UserService from "~/services/user.service";
import pgSchema from "./schema/pg";
import sqliteSchema from "./schema/sqlite";

const pool = new Pool({
  connectionString: dbConfig.pgDatabaseURL,
});

const sqlite = new Database(dbConfig.sqliteDatabaseURL);
export const dbPG = drizzlePG({ client: pool, schema: pgSchema });
export const dbSQLite = drizzleSQLite(sqlite, { schema: sqliteSchema });
export const db = config.isProduction ? dbPG : dbSQLite;

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
      return false;
    }
  } else {
    try {
      dbSQLite.run("SELECT 1");
      return true;
    } catch (error) {
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
    const superAdminEmail = dbConfig.superAdminEmail;
    await UserService.getUserByEmail(superAdminEmail).then((user) => {
      if (!user) {
        UserService.createAdminUser({
          email: superAdminEmail,
          firstname: dbConfig.superAdminFirstname,
          lastname: dbConfig.superAdminLastname,
          password: dbConfig.superAdminPassword,
          gender: "U",
          phone: "",
          role: "super_admin",
        }).then(() => {
          console.log("✅ Database Populated.");
        });
      }
      // console.log("✅ POPULATE_DB: super-admin already created.");
    });
    // UserService.getUserByEmail(superAdminEmail).then(console.log);
  }
};
