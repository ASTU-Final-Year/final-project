import {
  cors,
  json,
  limitRate,
  RouterFramework,
  type CTXAddress,
  type SocketAddress,
} from "@bepalo/router";
import type { CTXMain } from "./base";
import { config } from "./config";
import { db, initDb, type Transaction } from "~/db";
import fs from "fs";
import path, { resolve } from "path";
import { LOGE, LOGI } from "./lib";
import { join } from "path";
import { getBepaloQueryRouter } from "./lib/bepalo-query";
import queryAuth from "~/acl/v1";
import { tables } from "./db/schema";
import type { CTXSession } from "./middleware";
import { Time } from "@bepalo/time";

console.log("-".repeat(80));
console.log(`💫 Launching...`);
export const router = new RouterFramework<CTXMain>({
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
        return json(
          {
            error: error.message || "Internal server error",
          },
          {
            status: error.status || 500,
          },
        );
      },
  enable: {
    hooks: false,
    afters: false,
    filters: true,
    fallbacks: true,
    catchers: true,
  },
});

router.append(
  "/query/v1/*",
  getBepaloQueryRouter<
    typeof tables,
    typeof db,
    Transaction,
    CTXAddress & { data?: Record<string, unknown> }
  >(db, {
    tables,
    queryAuth,
    pathPrefix: "/query/v1/",
    isProduction: config.isProduction,
    routeFilters: [
      limitRate({
        key: (_req, ctx) => ctx.address.address,
        maxTokens: 200,
        refillInterval: Time.every(60).seconds._ms,
        refillRate: 100,
        setXRateLimitHeaders: true,
      }),
      cors({
        origins: [
          `${config.url}:${config.port}`,
          `${config.url}:${config.frontendPort}`,
          `${config.url}:8081`, // expo url
        ],
        allowedHeaders: ["Content-Type", "Authorization", "Cache-Control"],
        methods: ["HEAD", "GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        credentials: true,
      }),
    ],
  }),
);

await (async () => {
  config.errorFd = fs.openSync(path.join(config.logsPath, "error.log"), "a+");
  config.infoFd = fs.openSync(path.join(config.logsPath, "info.log"), "a+");
})()
  .then(() => console.log("✅ Logs files opened"))
  .catch((error) => {
    console.error("❌ Failed to open log files", error);
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
    const start = performance.now();
    const address = server.requestIP(req) as SocketAddress | null;
    if (!address) throw new Error("null client address");
    const resp = await router.respond(req, { address });
    const elapsed = performance.now() - start;
    const urlLog = `${req.method} ${elapsed.toFixed(2).padStart(6)}ms | ${resp.status} ${resp.statusText} | ${req.url.substring(0, 180)}`;
    // if (config.isProduction) {
    // LOGI(urlLog);
    // } else {
    console.log(urlLog);
    // }
    return resp;
  },
});

console.log(`🟢 Backend server listening on ${server.url.toString()}`);
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

setInterval(async () => {
  const res = await router.respond(
    new Request(`${config.url}:${config.port}/api/v1/cron/process-tasks`, {
      headers: [["Authorization", `Bearer ${process.env.CRON_SECRET}`]],
    }),
    {
      address: {
        family: "AFINET",
        address: "127.0.0.1",
        port: 23243,
      },
    },
  );
  // console.log("-- running cron " + res.status);
}, 60_000);
