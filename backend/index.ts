import { RouterFramework, status, type SocketAddress } from "@bepalo/router";
import type { CTXMain } from "./base";
import { config } from "./config";
import { initDb } from "./db";
import fs from "fs";
import path from "path";
import { LOGE, LOGI } from "./lib";

console.log("-".repeat(80));
console.log(`💫 Launching...`);
const router = new RouterFramework<CTXMain>({
  rootPath: "./routes",
  defaultHeaders: [["x-powered-by", "@bepalo/router"]],
  defaultCatcher: config.isProduction
    ? undefined
    : (req, { error }) => {
        if (!config.isProduction) {
          console.error(Date.now(), req.url, error);
        } else {
          LOGE(req.url, error);
        }
        return status(500);
      },
  enable: {
    hooks: false,
    afters: false,
    filters: true,
    fallbacks: true,
    catchers: true,
  },
});

await (async () => {
  if (!fs.existsSync(config.localPath)) {
    fs.mkdirSync(config.localPath);
  }
  if (!fs.existsSync(config.logsPath)) {
    fs.mkdirSync(config.logsPath);
  }
  config.errorFd = fs.openSync(path.join(config.logsPath, "error.log"), "a+");
  config.infoFd = fs.openSync(path.join(config.logsPath, "info.log"), "a+");
})()
  .then(() => console.log("✅ Folders created"))
  .catch((error) => {
    console.error("❌ Failed to create folders", error);
  });

await router
  .load()
  .then(() => console.log("✅ Routes loaded"))
  .catch((error) => {
    console.error("❌ Failed to load routes", error);
  });

await initDb()
  .then(() => console.log("✅ Database initialized"))
  .catch((error) => {
    console.error("❌ Failed to initialize database", error);
  });

const server = Bun.serve({
  port: config.port,
  development: !config.isProduction,
  reusePort: true,
  fetch: async (req, server) => {
    const address = server.requestIP(req) as SocketAddress | null;
    if (!address) throw new Error("null client address");
    const resp = await router.respond(req, { address });
    console.log(`${req.method} ${req.url} ${resp.status} ${resp.statusText}`);
    return resp;
  },
});

console.log(`🟢 Backend server listening on ${config.url}:${config.port}`);
console.log(`🚀 Lift off`);
console.log("-".repeat(80));
LOGI("BACKEND-SERVER STARTED");

const cleanup = () => {
  console.log("🧹 Cleaning up...");
  try {
    LOGI("BACKEND-SERVER STOPPED");
  } catch {}
  if (config.errorFd) fs.closeSync(config.errorFd);
  if (config.infoFd) fs.closeSync(config.infoFd);
  console.log("🧹 Cleaning done");
};

process.on("exit", (code) => {
  console.log(`🔴 Process exiting with code: ${code}`);
  cleanup();
});

// Ctrl+C
process.on("SIGINT", () => {
  console.log("\n 🔴 Received SIGINT (Ctrl+C)");
  cleanup();
  process.exit(0);
});

// Termination signal
process.on("SIGTERM", () => {
  console.log("🔴 Received SIGTERM");
  cleanup();
  process.exit(0);
});

// Uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("💥 Uncaught Exception:", error);
  cleanup();
  process.exit(1);
});

// Unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("💥 Unhandled Rejection at:", promise, "reason:", reason);
  cleanup();
  process.exit(1);
});
