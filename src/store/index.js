import { unknown } from "arktype/internal/keywords/ts.ts";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const usePricingPlanStore = create(
  persist(
    (set) => ({
      pricingPlans: [],
      selectedPlan: null,

      setPricingPlans: (pricingPlans) => set({ pricingPlans }),
      setSelectedPlan: (selectedPlan) => {
        return set({ selectedPlan });
      },
    }),
    {
      name: "pricing-plan"
    },
  ),
);
