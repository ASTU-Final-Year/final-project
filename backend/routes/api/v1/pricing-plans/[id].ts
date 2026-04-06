// ROUTE: /api/v1/pricing/[id]
import { json, RouterHandlers } from "@bepalo/router";
import PaymentService from "~/services/payment.service";

export default {
  GET: {
    HANDLER: [
      async (req, { params }) => {
        const pricingPlan = await PaymentService.getPricingPlansById(params.id);
        return json({
          pricingPlan,
        });
      },
    ],
  },
} satisfies RouterHandlers<{
  params: { id: string };
}>;
