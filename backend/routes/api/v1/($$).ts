// ROUTE: /api/v1/**
import {
  cors,
  CTXAddress,
  json,
  limitRate,
  RouterHandlers,
} from "@bepalo/router";
import { Time } from "@bepalo/time";
import { config } from "~/config";
import { LOGE } from "~/lib";

export default {
  CRUD: {
    FILTER: [
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
        ],
        allowedHeaders: ["Content-Type", "Authorization", "Cache-Control"],
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        credentials: true,
        endHere: true,
      }),
      () => true,
    ],
    CATCHER: [
      (req, { error }) => {
        if (!config.isProduction) {
          console.error(Date.now(), req.url, error);
        } else {
          LOGE(req.url, error);
        }
        return json({ error: error.message, status: 500 }, { status: 500 });
      },
    ],
  },
} satisfies RouterHandlers<CTXAddress>;
