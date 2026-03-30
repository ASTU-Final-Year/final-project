"use client";
import React from "react";
import Link from "next/link";
import {
  Globe,
  User,
  BellRing,
  Settings,
  LogOut,
  LayoutDashboard,
  CalendarDays,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import navlinks from "@/data/navlinks";
import MainNavigationMenu from "./main-navigation";
// import Head from "next/head";
// import { usePathname } from "next/navigation";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/90 shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-xl text-primary border border-primary/20">
            <Activity className="h-5 w-5" />
          </div>
          <Link
            href="/"
            className="font-bold hidden sm:inline-block tracking-tight text-foreground"
          >
            ServeSync<span className="text-primary">+</span>
          </Link>
        </div>

        {/* Global Navigation */}
        <MainNavigationMenu navlinks={navlinks} />

        {/*  */}
        <div>
          <Link
            href="/login"
            className="rounded text-primary border border-primary px-4 pt-1 pb-2"
          >
            login
          </Link>
        </div>
      </div>
    </header>
  );
}
