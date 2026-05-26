import { Time } from "@bepalo/time";
import path from "path";
import { JWT, type JwtPayload, type JwtSymmetricAlgorithm } from "@bepalo/jwt";
import { config as dotenvConfig } from "dotenv";
dotenvConfig({ path: "../.env" });

export const config = {
  port: parseInt(process.env.BACKEND_PORT || "") || 4000,
  frontendPort: parseInt(process.env.PORT || "") || 3000,
  url: process.env.URL || "http://localhost",
  publicUrl: process.env.PUBLIC_URL || "http://localhost:3000",
  isProduction: process.env.NODE_ENV === "production",
  prodDatabase: !!process.env.PROD_DATABASE,
  loadSamples: !!process.env.LOAD_SAMPLES,
  emailDomain: process.env.EMAIL_DOMAIN || "servesyncplus.et",
  errorFd: 0,
  infoFd: 0,
  localPath: path.join(process.cwd(), ".local"),
  logsPath: path.join(process.cwd(), ".logs"),
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
  sqliteDatabaseURL: process.env.SQLITE_DATABASE_URL || ".local/.dev.db",
  superAdminEmail:
    process.env.SUPER_ADMIN_EMAIL || "super.admin@" + config.emailDomain,
  superAdminFirstname: process.env.SUPER_ADMIN_FIRSTNAME || "Super",
  superAdminLastname: process.env.SUPER_ADMIN_LASTNAME || "Admin",
  superAdminPassword: process.env.SUPER_ADMIN_PASSWORD || "SuperAdmin@12345",
};

export const chapaConfig = {
  baseUrl: process.env.CHAPA_BASE_URL || "https://api.chapa.co/v1",
  secretKey: process.env.CHAPA_SECRET_KEY,
  webhookSecret: process.env.CHAPA_WEBHOOK_SECRET,
  returnUrl:
    process.env.CHAPA_RETURN_URL || "http://localhost:3000/payment/return",
  callbackUrl:
    process.env.CHAPA_CALLBACK_URL ||
    "http://localhost:3000/api/v1/payment/chapa/webhook",
  logo: "http://localhost:3000/images/logo.png",
  color: "#4f46e5",
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
