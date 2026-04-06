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

export const useSessionStore = create(
  persist(
    (set) => ({
      session: null,

      setSession: (session) => set({ session }),
    }),
    {
      name: "session"
    },
  ),
);
