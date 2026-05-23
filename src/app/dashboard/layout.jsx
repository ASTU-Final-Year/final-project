"use client";

import {
  SidebarProvider,
} from "@/components/ui/sidebar";
import React, { Suspense } from "react";
import { useSessionStore } from "@/store";
import { AppSidebarEmployee } from "@/components/app-sidebar-employee";
import { AppSidebarOrganization } from "@/components/app-sidebar-organization";
import { AppSidebarClient } from "@/components/app-sidebar-client";
import { AppSidebarPlaceholder } from "@/components/app-sidebar-placeholder";
import { DashboardContent } from "./dashboard-content";

export default function OrganizationDashboardLayout({ children }) {
  const session = useSessionStore(({ session }) => session);
  const profileUpdateHash = useSessionStore((s) => s.profileUpdateHash);
  const role = session?.user?.role;

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "11rem",
      }}
    >
      {role === "organization_admin" ? (
        <AppSidebarOrganization />
      ) : role === "employee" ? (
        <AppSidebarEmployee />
      ) : role === "client" ? (
        <AppSidebarClient />
      ) : (
        <AppSidebarPlaceholder />
      )}
      <Suspense fallback={<div>Loading...</div>}>
        <DashboardContent role={role} session={session} profileUpdateHash={profileUpdateHash}>
          {children}
        </DashboardContent>
      </Suspense>
    </SidebarProvider>
  );
}
