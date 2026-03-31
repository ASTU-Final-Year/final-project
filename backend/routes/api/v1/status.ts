// ROUTE: /api/status
import { json, RouterHandlers, status } from "@bepalo/router";
import SystemService from "~/services/system.service";

export default {
  GET: {
    HANDLER: async () => {
      const systemStatus = await SystemService.getSystemStatus();
      return json(
        {
          ...systemStatus,
          timestamp: new Date().toISOString(),
        },
        {
          status: !systemStatus.systemActive ? 500 : 200,
        },
      );
    },
  },
} satisfies RouterHandlers;
