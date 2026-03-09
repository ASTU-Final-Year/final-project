import React from "react";
import Link from "next/link";
import { Globe, User, BellRing, Settings, LogOut, LayoutDashboard, CalendarDays, Activity } from "lucide-react";
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

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
        
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <div className="bg-orange-600/10 p-2 rounded-xl text-orange-600 border border-orange-600/20">
            <Activity className="h-5 w-5" />
          </div>
          <Link href="/" className="font-bold text-xl hidden sm:inline-block tracking-tight text-foreground">
            ServeSync<span className="text-orange-600">+</span>
          </Link>
        </div>

        {/* Global Navigation */}
        <nav className="hidden md:flex gap-1 items-center font-medium bg-muted/30 p-1 rounded-full border">
          <Link href="/" className="px-4 py-2 text-sm rounded-full transition-colors text-foreground/70 hover:text-foreground hover:bg-muted font-medium">
            Dashboard
          </Link>
          <Link href="/components" className="px-4 py-2 text-sm rounded-full transition-colors bg-background shadow-sm text-foreground font-semibold">
            Workflows
          </Link>
          <Link href="/calendar" className="px-4 py-2 text-sm rounded-full transition-colors text-foreground/70 hover:text-foreground hover:bg-muted font-medium">
            <span className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              Schedule
            </span>
          </Link>
        </nav>

        {/* User Actions & Settings */}
        <div className="flex items-center gap-3">
          
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative rounded-full text-foreground/70 hover:text-foreground hidden sm:flex">
            <BellRing className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-orange-600 border-2 border-background" />
          </Button>

          {/* Settings Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full text-foreground/70 hover:text-foreground hidden sm:flex">
                <Settings className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>System Preferences</DialogTitle>
                <DialogDescription>
                  Manage global scheduling rules and workflow defaults.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="default-handoff" className="font-medium">Default Handoff Timeline</Label>
                  <Input id="default-handoff" defaultValue="24 hours" />
                </div>
                <div className="grid gap-2 mt-2">
                  <Label htmlFor="escalation" className="font-medium">Escalation Manager Email</Label>
                  <Input id="escalation" defaultValue="admin@servesync.com" type="email" />
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="rounded-full pl-2 pr-4 py-1.5 h-auto flex items-center gap-2 border-border/60 hover:bg-muted/50">
                <div className="bg-primary/10 text-primary p-1 rounded-full">
                  <User className="h-4 w-4" />
                </div>
                <div className="flex-col items-start hidden sm:flex">
                  <span className="text-xs font-semibold leading-none">Natnael D.</span>
                  <span className="text-[10px] text-muted-foreground leading-none mt-1">Dispatcher</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 mt-1 shadow-lg">
              <div className="px-2 py-2.5">
                <p className="text-sm font-medium leading-none">Natnael D.</p>
                <p className="text-xs text-muted-foreground mt-1">natnael@servesync.com</p>
                <div className="flex gap-2 mt-3">
                  <Badge variant="secondary" className="text-xs font-normal">Active</Badge>
                  <Badge variant="outline" className="text-xs font-normal bg-orange-500/10 text-orange-600 border-orange-500/20">Sector A</Badge>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>My Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  <span>My Active Workflows</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive focus:text-destructive cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

        </div>
      </div>
    </header>
  );
}
