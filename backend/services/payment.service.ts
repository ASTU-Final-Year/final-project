// services/payment.service.ts

import { eq } from "drizzle-orm";
import { PricingPlan, PricingPlanInit } from "~/base";
import { db } from "~/db";
import { pricingPlans } from "~/db/schema";

export default class PaymentService {
  static async createPricingPlan(
    pricingPlanInit: PricingPlanInit,
  ): Promise<PricingPlan | undefined> {
    const [pricingPlan] = (await db
      .insert(pricingPlans)
      .values(pricingPlanInit)
      .returning()) as PricingPlan[];
    return pricingPlan;
  }

  static async getPricingPlans(): Promise<PricingPlan[]> {
    const allPricingPlans = (await db
      .select()
      .from(pricingPlans)) as PricingPlan[];
    return allPricingPlans;
  }

  static async getPricingPlansById(
    planId: string,
  ): Promise<PricingPlan | undefined> {
    const [pricingPlan] = (await db
      .select()
      .from(pricingPlans)
      .where(eq(pricingPlans.id, planId))) as PricingPlan[];
    return pricingPlan;
  }

  static async deletePricingPlan(planId: string): Promise<void> {
    await db.delete(pricingPlans).where(eq(pricingPlans.id, planId));
  }
}
