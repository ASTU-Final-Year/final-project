"use client";

import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
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
import Auth from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import NotificationBell from "@/components/notifications/notification-bell";

export function DashboardContent({
  children,
  role,
  session,
  profileUpdateHash,
}) {
  const router = useRouter();
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

  useEffect(() => {
    if (!_loaded) {
      (async () => {
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
    <SidebarInset>
      <header className="flex h-16 justify-between shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b px-4">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Button variant="default" onClick={() => router.back()}>
            <ArrowLeft /> Back
          </Button>
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href={userDashboardPathname}>
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
        <div className="flex gap-2 items-center">
          <div>
            <NotificationBell />
          </div>
          <div className="flex gap-2 items-center">
            <span>
              {session?.user?.firstname || ""} {session?.user?.lastname || ""}
            </span>
            <Link
              href={
                role === "organization_admin"
                  ? "/dashboard/organization/profile"
                  : role === "employee"
                    ? "/dashboard/employee/profile"
                    : role === "client"
                      ? "/dashboard/client/profile"
                      : "#"
              }
            >
              <Avatar className="w-12 h-12 border-4 rounded-[12px] border-border/40 ring-1 ring-primary/10 shadow-lg">
                <AvatarImage
                  className="rounded"
                  src={`/api/v1/user/profile_picture?${profileUpdateHash}`}
                  alt={`${session?.user?.firstname || ""} ${session?.user?.lastname || ""}`}
                />
                <AvatarFallback className="bg-indigo-500 text-white text-2xl">
                  {session?.user.firstname?.[0] || ""}
                  {session?.user.lastname?.[0] || ""}
                </AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0 bg-accent">
        <main className="py-6 h-full">{children}</main>
      </div>
    </SidebarInset>
  );
}
