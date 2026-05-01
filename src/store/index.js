import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const usePricingPlanStore = create(
  persist(
    (set) => ({
      pricingPlans: [],
      selectedPlan: null,
      hasHydrated: false,

      setPricingPlans: (pricingPlans) => set({ pricingPlans }),
      setSelectedPlan: (selectedPlan) => {
        return set({ selectedPlan });
      },
      setHasHydrated: (state) => set({ hasHydrated: state }),
    }),
    {
      name: "pricing-plan",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);

export const useSessionStore = create(
  persist(
    (set) => ({
      session: null,
      hasHydrated: false,

      setSession: (session) => set({ session }),
      setHasHydrated: (state) => set({ hasHydrated: state }),
    }),
    {
      name: "session",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);

export const useOrganizationStore = create(
  persist(
    (set) => ({
      organization: null,
      organizationStats: {
        employees: 0,
        services: 0,
        calendars: 0,
      },
      services: null,
      serviceCount: 0,
      employees: null,
      employeeCount: 0,
      calendars: null,
      calendarCount: 0,
      hasHydrated: false,

      setOrganization: (organization) => set({ organization }),
      setOrganizationStats: (organizationStats) => set({ organizationStats }),
      setServices: (services) => set({ services }),
      setServiceCount: (serviceCount) => set({ serviceCount }),
      setEmployees: (employees) => set({ employees }),
      setEmployeeCount: (employeeCount) => set({ employeeCount }),
      setCalendars: (calendars) => set({ calendars }),
      setCalendarCount: (calendarCount) => set({ calendarCount }),
      setHasHydrated: (state) => set({ hasHydrated: state }),
    }),
    {
      name: "organization",
      storage: createJSONStorage(() => sessionStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);

export const resetStores = () => {
  useSessionStore.setState(useSessionStore.getInitialState(), true);
  useOrganizationStore.setState(useOrganizationStore.getInitialState(), true);
}