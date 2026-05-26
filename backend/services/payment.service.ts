// services/payment.service.ts

import { eq } from "drizzle-orm";
import { type PricingPlan, type PricingPlanInit } from "~/base";
import { db } from "~/db";
import { pricingPlans } from "~/db/schema";
import { chapaConfig } from "~/config";

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

  static async initializePayment(params: {
    amount: number;
    email: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
    tx_ref: string;
  }) {
    const response = await fetch(
      `${chapaConfig.baseUrl}/transaction/initialize`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${chapaConfig.secretKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: params.amount,
          currency: "ETB",
          email: params.email,
          first_name: params.first_name,
          last_name: params.last_name,
          phone_number: params.phone,
          tx_ref: params.tx_ref,
          callback_url: chapaConfig.callbackUrl,
          return_url: chapaConfig.returnUrl,
          customization: {
            title: "ServeSync+",
            description: "Service Payment",
          },
        }),
      },
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Chapa API error: ${error}`);
    }

    return response.json();
  }

  static async verifyPayment(tx_ref: string) {
    const response = await fetch(
      `${chapaConfig.baseUrl}/transaction/verify/${tx_ref}`,
      {
        headers: {
          Authorization: `Bearer ${chapaConfig.secretKey}`,
        },
      },
    );
    return response.json();
  }
}
