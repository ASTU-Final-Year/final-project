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
import Image from "next/image";
// import Head from "next/head";
// import { usePathname } from "next/navigation";

export function SiteHeader() {
  return (
    // backdrop-blur supports-backdrop-filter:bg-slate-900/90public
    <header className="sticky top-0 z-50 w-full border-b border-slate-950 backdrop-blur-sm bg-primary/70 -bg-linear-30 from-slate-900/95 via-slate-900/50 to-slate-900/90 text-white/90 shadow-s">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-ful text-primary">
            {/* <Activity className="h-5 w-5" /> */}
            <Image
              alt="logo"
              src="/images/logo.png"
              width={398 / 9}
              height={395 / 9}
              className="drop-shadow-slate-900/80 drop-shadow-lg"
            />
          </div>
          <Link
            href="/"
            className="font-bold text-xl hidden sm:inline-block tracking-tight"
          >
            ServeSync<span className="text-blue-500">+</span>
          </Link>
        </div>

        {/* Global Navigation */}
        <MainNavigationMenu navlinks={navlinks} />

        {/*  */}
        <div className="space-x-2">
          <Link
            href="/login"
            className="rounded-full bg-primary text-primary-foreground px-6 py-2"
          >
            Login
          </Link>
        </div>
      </div>
    </header>
  );
}
