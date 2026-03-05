import { json, RouterHandlers, status } from "@bepalo/router";
import { checkDBConnection } from "~/db";

export default {
  GET: {
    HANDLER: async () => {
      const dbActive = await checkDBConnection();
      return json(
        {
          status: dbActive,
          timestamp: new Date().toISOString(),
          checks: {
            server: true,
            database: dbActive,
          },
        },
        {
          status: !dbActive ? 500 : 200,
        },
      );
    },
  },
} satisfies RouterHandlers;
