"use client";

import * as React from "react";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  CalendarDays,
  Settings,
  ChevronRight,
  LogOut,
  Building2,
  PieChart,
  UserPlus,
  Plus,
  Activity,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useSessionStore } from "@/store";
import Auth from "@/lib/auth";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

const navData = [
  {
    title: "Overview",
    url: "/dashboard/organization",
    icon: LayoutDashboard,
  },
  {
    title: "Services",
    url: "/dashboard/organization/services",
    icon: Briefcase,
  },
  {
    title: "Employees",
    url: "/dashboard/organization/employees",
    icon: Users,
  },
  {
    title: "Calendars",
    url: "/dashboard/organization/calendars",
    icon: CalendarDays,
  },
  // {
  //   title: "Analytics",
  //   url: "/dashboard/organization/analytics",
  //   icon: PieChart,
  // },
];

export function AppSidebarOrganization() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="h-16 border-b flex justify-center">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="hover:bg-transparent">
              <div className="flex aspect-square size-9 items-center justify-center rounded border border-primary/15 bg-primary/15 text-primary shadow-md shadow-primary/10">
                <Activity className="size-5" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight ml-1">
                <span className="truncate font-bold text-slate-800 text-base">
                  ServeSync+
                </span>
                <span className="truncate text-[10px] uppercase tracking-wider font-bold text-primary">
                  Organization
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="py-4">
        <SidebarMenu>
          {navData.map((item) => (
            <SidebarItem key={item.title} item={item} pathname={pathname} />
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t border-slate-100 p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => {
                Auth.logout();
                router.push("/login");
              }}
              className="text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="size-4" />
              <span className="font-semibold">Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

function SidebarItem({ item, pathname }) {
  const hasSub = !!item.items;
  const isActive =
    pathname === item.url || item.items?.some((s) => pathname === s.url);

  return (
    <Collapsible asChild defaultOpen={isActive} className="group/collapsible">
      <SidebarMenuItem>
        {hasSub ? (
          <>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton tooltip={item.title} isActive={isActive}>
                <item.icon className="size-4" />
                <span className="font-semibold">{item.title}</span>
                <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub className="border-l-2 border-slate-100 ml-4">
                {item.items.map((sub) => (
                  <SidebarMenuSubItem key={sub.title}>
                    <SidebarMenuSubButton
                      asChild
                      isActive={pathname === sub.url}
                    >
                      <Link href={sub.url} className="font-medium">
                        {sub.title}
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </>
        ) : (
          <SidebarMenuButton
            asChild
            tooltip={item.title}
            isActive={pathname === item.url}
          >
            <Link href={item.url}>
              <item.icon className="size-4" />
              <span className="font-semibold">{item.title}</span>
            </Link>
          </SidebarMenuButton>
        )}
      </SidebarMenuItem>
    </Collapsible>
  );
}
