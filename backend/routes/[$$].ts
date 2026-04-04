// ROUTE: /.**
import { CTXAddress, limitRate, RouterHandlers } from "@bepalo/router";

export default {
  // ALL: {
  //   FILTER: [
  //     limitRate({
  //       key: (_req, ctx) => ctx.address.address,
  //       maxTokens: 30,
  //       refillRate: 3,
  //       setXRateLimitHeaders: true,
  //     }),
  //   ],
  // },
} satisfies RouterHandlers<CTXAddress>;
