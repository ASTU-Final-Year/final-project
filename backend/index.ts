import {
  blob,
  RouterFramework,
  status,
  type SocketAddress,
} from "@bepalo/router";
import type { CTXMain } from "./base";
import { config } from "./config";
import { initDb } from "./db";
import fs from "fs";
import path, { resolve } from "path";
import { LOGE, LOGI } from "./lib";
import { join } from "path";

console.log("-".repeat(80));
console.log(`💫 Launching...`);
const router = new RouterFramework<CTXMain>({
  rootPath: "./routes",
  normalizeTrailingSlash: true,
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

const swaggerUICSS = Bun.file(
  join(import.meta.dir, "../node_modules/swagger-ui-dist/swagger-ui.css"),
);
const swaggerUIBundle = Bun.file(
  join(import.meta.dir, "../node_modules/swagger-ui-dist/swagger-ui-bundle.js"),
);

const server = Bun.serve({
  port: config.port,
  development: !config.isProduction,
  reusePort: true,
  routes: {
    "/api/swagger-ui.css": swaggerUICSS,
    "/api/swagger-ui-bundle.js": swaggerUIBundle,
  },
  fetch: async (req, server) => {
    const address = server.requestIP(req) as SocketAddress | null;
    if (!address) throw new Error("null client address");
    const resp = await router.respond(req, { address });
    const urlLog = `${req.method} ${req.url.substring(0, 180)} ${resp.status} ${resp.statusText}`;
    // if (config.isProduction) {
    //   LOGI(urlLog);
    // } else {
    console.log(urlLog);
    // }
    return resp;
  },
});

console.log(`🟢 Backend server listening on ${config.url}`);
console.log(`🚀 Lift off`);
console.log("-".repeat(80));
LOGI("BACKEND-SERVER STARTED");

const cleanup = () => {
  console.log("🧹 Cleaning up...");
  try {
    LOGI("BACKEND-SERVER STOPPED");
  } catch {}
  try {
    if (config.errorFd) fs.closeSync(config.errorFd);
    if (config.infoFd) fs.closeSync(config.infoFd);
  } catch {}
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
