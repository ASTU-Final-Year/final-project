"use client";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, LogOut } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { useSessionStore } from "@/store";
import { AppSidebarEmployee } from "@/components/app-sidebar-employee";
import { AppSidebarOrganization } from "@/components/app-sidebar-organization";
import { AppSidebarClient } from "@/components/app-sidebar-client";
import { AppSidebarPlaceholder } from "@/components/app-sidebar-placeholder";
import Auth from "@/lib/auth";
import RequestHandler from "@/lib/request-handler";

export default function OrganizationDashboardLayout({ children }) {
  const router = useRouter();
  const session = useSessionStore(({ session }) => session);
  const setSession = useSessionStore(({ setSession }) => setSession);
  const hasHydrated = useSessionStore((s) => s.hasHydrated);
  const role = session?.user?.role;
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pathSegments = pathname.split("/").filter(Boolean).slice(2); // Skip 'dashboard' and 'organization'
  const userDashboardPathname = (() => {
    switch (role) {
      case "organization_admin":
        return "/dashboard/organization";
      case "employee":
        return "/dashboard/employee";
      case "client":
        return "/dashboard/client";
      case undefined:
      case null:
        return "/dashboard";
    }
  })();

  const [_loaded, _setLoaded] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(session != null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await Auth.logout();
    } finally {
      router.push("/login");
    }
  };

  useEffect(() => {
    if (!_loaded) {
      (async () => {
        // if (_loaded && session?.user == null) {
        //   return router.push("/login");
        // }
        Auth.isLoggedIn().then(async (isLoggedIn) => {
          setIsLoggedIn(isLoggedIn);
          if (!isLoggedIn) {
            const redirectQuery = `?r=${encodeURIComponent(`${pathname}?${searchParams.toString()}`)}`;
            router.push(`/login${redirectQuery}`);
          }
        });
        _setLoaded(true);
      })();
    }
  }, [router, _loaded, session?.user, pathname, searchParams]);

  if (!isLoggedIn) return null;

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "11rem",
      }}
    >
      {pathname.startsWith("/dashboard/organization") ? (
        <AppSidebarOrganization />
      ) : pathname.startsWith("/dashboard/employee") ? (
        <AppSidebarEmployee />
      ) : pathname.startsWith("/dashboard/client") ? (
        <AppSidebarClient />
      ) : (
        <AppSidebarPlaceholder />
      )}
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b px-4 bg-white/95 backdrop-blur-sm">
          <div className="flex flex-1 items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <button
              onClick={() => router.back()}
              className="flex items-center gap-1.5 text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors mr-2 px-4 py-1.5 rounded-full shadow-md"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <Separator orientation="vertical" className="mr-2 h-4 hidden md:block" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href={userDashboardPathname} className="text-base font-medium">
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {pathSegments.map((segment, index) => (
                  <React.Fragment key={segment}>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage className="capitalize text-base font-medium">
                        {segment}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="ml-auto flex items-center gap-2 text-base font-semibold text-white bg-red-600 hover:bg-red-700 disabled:opacity-70 transition-colors px-4 py-1.5 rounded-full shadow-md"
          >
            <LogOut className="h-4 w-4" />
            {isLoggingOut ? "Logging out…" : "Logout"}
          </button>
        </header>

        {/* Main Content Area */}
        <div
          className="flex flex-1 flex-col gap-4 p-4 pt-0 bg-cover bg-center bg-fixed relative"
          style={{ backgroundImage: 'url("/images/ethiopian-service-bg.png")' }}
        >
          <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-[2px] pointer-events-none z-0" />
          <main className="py-6 h-full relative z-10">{children}</main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
