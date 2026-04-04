import { Time } from "@bepalo/time";
import path from "path";
import { JWT, JwtPayload, type JwtSymmetricAlgorithm } from "@bepalo/jwt";
import { config as dotenvConfig } from "dotenv";
dotenvConfig({ path: "../.env" });

export const config = {
  port: parseInt(process.env.BACKEND_PORT || "") || 4000,
  frontendPort: parseInt(process.env.PORT || "") || 3000,
  url: process.env.URL || "http://localhost",
  isProduction: process.env.BUN_ENV === "production",
  emailDomain: process.env.EMAIL_DOMAIN || "servesyncplus.et",
  errorFd: 0,
  infoFd: 0,
  localPath: path.join(process.cwd(), "../.local"),
  logsPath: path.join(process.cwd(), "../.logs"),
};

export const cacheConfig = {
  authTokenMaxAge: Time.for(1).Minutes,
  user: {
    maxAge: Time.for(60).Seconds,
    lruMaxSize: 4000,
    cleanupInterval: Time.every(30).Minutes,
    expiryBucketSize: 30,
  },
  session: {
    maxAge: Time.for(1).Day,
    lruMaxSize: 4000,
    cleanupInterval: Time.every(30).Minutes,
    expiryBucketSize: 30,
  },
  sessionBlacklist: {
    maxAge: Time.for(1).Day,
    lruMaxSize: 4000,
    cleanupInterval: Time.every(30).Minutes,
    expiryBucketSize: 30,
  },
};

if (!process.env.JWT_AUTH_KEY) throw new Error("null env JWT_AUTH_KEY");

export const securityConfig = {
  saltRounds: parseInt(process.env.SALT_ROUNDS || "") || 0,
  sessionCookie: "session",
  sessionMaxAge: Time.for(1).day._ms,
  smtpEmail: process.env.SMTP_EMAIL || "your-email@gmail.com",
  smtpPassword: process.env.SMTP_PASSWORD || "your-app-password",
  authJwtKey: process.env.JWT_AUTH_KEY,
  authJwtAlg: (process.env.JWT_AUTH_ALG as JwtSymmetricAlgorithm) || "HS256",
  employeeHireKey: process.env.JWT_EMPLOYEE_HIRE_KEY,
  employeeHireAlg:
    (process.env.JWT_EMPLOYEE_HIRE_ALG as JwtSymmetricAlgorithm) || "HS256",
  employeeHireMaxAge: Time.for(1).day._ms,
};

export const dbConfig = {
  pgDatabaseURL:
    process.env.PG_DATABASE_URL ||
    "postgresql://postgres:postgres@localhost:5432/servesyncplus",
  sqliteDatabaseURL: path.join(
    "../",
    process.env.SQLITE_DATABASE_URL || ".local/.dev.db",
  ),
  superAdminEmail:
    process.env.SUPER_ADMIN_EMAIL || "super.admin@" + config.emailDomain,
  superAdminFirstname: process.env.SUPER_ADMIN_FIRSTNAME || "Super",
  superAdminLastname: process.env.SUPER_ADMIN_LASTNAME || "Admin",
  superAdminPassword: process.env.SUPER_ADMIN_PASSWORD || "SuperAdmin@12345",
};

export type EmployeeHirePayload = Required<
  Pick<JwtPayload<{}>, "iat" | "sub" | "exp"> & {
    from: string;
    to: string;
    jobTitle: string;
    jobDescription: string;
    organizationId: string;
  }
>;
export const employeeHireJwt = JWT.createSymmetric<EmployeeHirePayload>(
  securityConfig.employeeHireKey,
  securityConfig.authJwtAlg,
);
