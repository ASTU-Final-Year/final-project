import fs from "fs";
import { config } from "../config";

export const LOGI = (...args: any[]) => {
  const timestamp = Date.now();
  const infoStr = `${timestamp}:${process.pid} | ${args.map((a) => String(a)).join(" ")}\n`;
  fs.writeSync(config.infoFd, infoStr);
};

export const LOGE = (...args: any[]) => {
  const timestamp = Date.now();
  const infoStr = `${timestamp}:${process.pid} | ${args.map((a) => String(a)).join(" ")}\n`;
  fs.writeSync(config.errorFd, infoStr);
};

export const toMainUrl = (url: URL) => {
  const mainUrl = new URL(url);
  // mainUrl.origin = url.origin.replace(config.port.toFixed(), config.frontendPort.toFixed());
  mainUrl.port = config.frontendPort.toFixed();
  return mainUrl;
};

export const toDriverUUID: { (v: string): string } = (v) => {
  const hex = Buffer.from(v, "base64url").toString("hex");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
};

export const fromDriverUUID: { (v: string): string } = (v) => {
  const hex = `${v[0]}${v[1]}${v[2]}${v[3]}${v[4]}${v[5]}${v[6]}${v[7]}${v[9]}${v[10]}${v[11]}${v[12]}${v[14]}${v[15]}${v[16]}${v[17]}${v[19]}${v[20]}${v[21]}${v[22]}${v[24]}${v[25]}${v[26]}${v[27]}${v[28]}${v[29]}${v[30]}${v[31]}${v[32]}${v[33]}${v[34]}${v[35]}`;
  return Buffer.from(hex, "hex").toString("base64url");
};

export const toCUUIDDriver = (v: string): string => {
  const hex = Buffer.from(v, "base64url").toString("hex");
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20),
  ].join("-");
};

export const randomCUUID = (): string => {
  const v = crypto.randomUUID();
  const hex = `${v[0]}${v[1]}${v[2]}${v[3]}${v[4]}${v[5]}${v[6]}${v[7]}${v[9]}${v[10]}${v[11]}${v[12]}${v[14]}${v[15]}${v[16]}${v[17]}${v[19]}${v[20]}${v[21]}${v[22]}${v[24]}${v[25]}${v[26]}${v[27]}${v[28]}${v[29]}${v[30]}${v[31]}${v[32]}${v[33]}${v[34]}${v[35]}`;
  return Buffer.from(hex, "hex").toString("base64url");
};
// backend/lib/error-summarizer.ts

/**
 * Generic error summarizer for Drizzle (works with SQLite & PostgreSQL)
 */
export function getErrorMessage(error: any): string {
  const code = error?.code ?? error?.cause?.code;

  // Unique constraint violation
  if (
    code === "23505" ||
    code === "SQLITE_CONSTRAINT_UNIQUE" ||
    code?.includes("UNIQUE")
  ) {
    const msg = error?.message?.toLowerCase() || "";
    if (msg.includes("email")) return "Email already registered";
    if (msg.includes("phone")) return "Phone number already registered";
    if (msg.includes("slug")) return "Slug already taken";
    return "Record already exists";
  }

  // Foreign key violation
  if (
    code === "23503" ||
    code === "SQLITE_CONSTRAINT_FOREIGNKEY" ||
    code?.includes("FOREIGN KEY")
  ) {
    return "Referenced record not found";
  }

  // Not null violation
  if (
    code === "23502" ||
    code === "SQLITE_CONSTRAINT_NOTNULL" ||
    code?.includes("NOT NULL")
  ) {
    return "Missing required field";
  }

  // Check constraint / invalid value
  if (
    code === "23514" ||
    code === "22P02" ||
    code === "SQLITE_CONSTRAINT_CHECK"
  ) {
    return "Invalid value provided";
  }

  // Any other constraint
  if (code?.includes("CONSTRAINT")) {
    return "Constraint violation";
  }

  // Default - return original message or fallback
  return "Database error occurred";
}

// Get HTTP status code based on error
export function getErrorStatus(error: any): number {
  const code = error?.code;

  // Conflict (unique violation)
  if (
    code === "23505" ||
    code === "SQLITE_CONSTRAINT_UNIQUE" ||
    code?.includes("UNIQUE")
  ) {
    return 409;
  }

  // Not found (foreign key violation)
  if (code === "23503" || code === "SQLITE_CONSTRAINT_FOREIGNKEY") {
    return 404;
  }

  // Bad request (validation errors)
  return 400;
}

// Combined response helper
export function getErrorResponse(error: any) {
  return {
    error: getErrorMessage(error),
    status: getErrorStatus(error),
  };
}
