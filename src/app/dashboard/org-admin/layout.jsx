"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Settings,
  LogOut,
  ChevronUp,
  Building2,
} from "lucide-react";

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard/org-admin",
    icon: LayoutDashboard,
  },
  {
    title: "Employees",
    href: "/dashboard/org-admin/employees",
    icon: Users,
  },
  {
    title: "Services",
    href: "/dashboard/org-admin/services",
    icon: Briefcase,
  },
];

export default function OrgAdminLayout({ children }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar variant="inset">
        <SidebarHeader className="border-b border-sidebar-border">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="flex size-8 items-center justify-center rounded bg-primary text-primary-foreground">
              <Building2 className="size-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">Organization Admin</span>
              <span className="text-xs text-muted-foreground">Management Portal</span>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.href}
                      tooltip={item.title}
                    >
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="border-t border-sidebar-border">
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton size="lg">
                    <Avatar size="sm">
                      <AvatarImage src="/avatars/admin.jpg" alt="Admin" />
                      <AvatarFallback>AD</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-1 flex-col text-left text-xs">
                      <span className="font-medium">Admin User</span>
                      <span className="text-muted-foreground">admin@org.com</span>
                    </div>
                    <ChevronUp className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  align="start"
                  className="w-56"
                >
                  <DropdownMenuItem>
                    <Settings className="mr-2 size-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive">
                    <LogOut className="mr-2 size-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <SidebarTrigger />
          <div className="flex-1" />
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
