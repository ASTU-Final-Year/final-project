// ROUTE: /api/v1/pricing
import { json, RouterHandlers } from "@bepalo/router";
import PaymentService from "~/services/payment.service";

export default {
  GET: {
    HANDLER: [
      async (req) => {
        const pricingPlans = await PaymentService.getPricingPlans();
        return json({
          pricingPlans,
        });
      },
    ],
  },
} satisfies RouterHandlers;
