"use client";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { redirect, RedirectType, usePathname } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { useSessionStore } from "@/store";
import { AppSidebarEmployee } from "@/components/app-sidebar-employee";
import { AppSidebarOrganization } from "@/components/app-sidebar-organization";
import { AppSidebarClient } from "@/components/app-sidebar-client";
import { AppSidebarPlaceholder } from "@/components/app-sidebar-placeholder";

export default function OrganizationDashboardLayout({ children }) {
  const session = useSessionStore(({ session }) => session);
  const hasHydrated = useSessionStore((s) => s.hasHydrated);
  const role = session?.user?.role;
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean).slice(2); // Skip 'dashboard' and 'organization'

  const [_loaded, _setLoaded] = useState(false);

  useEffect(() => {
    if (!_loaded) (async () => _setLoaded(true))();
    if (_loaded && session?.user == null) {
      return redirect("/login", RedirectType.push);
    }
  }, [_loaded, session?.user]);

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
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard/organization">
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {pathSegments.map((segment, index) => (
                  <React.Fragment key={segment}>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage className="capitalize">
                        {segment}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0 bg-accent">
          <main className="py-6 h-full">{children}</main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
