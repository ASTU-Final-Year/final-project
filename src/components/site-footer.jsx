import React from "react";
import Link from "next/link";
import { Activity, Shield, Command, Map, HelpCircle, PhoneCall, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SiteFooter() {
  return (
    <footer className="border-t bg-muted/40 pb-12 pt-16 mt-auto">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid md:grid-cols-4 lg:grid-cols-5 gap-10">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <div className="bg-orange-600 p-2 rounded-xl text-white shadow-sm">
                <Activity className="h-5 w-5" />
              </div>
              <span className="font-bold text-xl tracking-tight text-foreground">
                ServeSync<span className="text-orange-600">+</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              An intelligent, multi-sector service scheduling and progress tracking platform.
              Empowering dynamically linked workflows where every step connects seamlessly to the next.
            </p>
            <div className="flex flex-col gap-2 pt-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Command className="h-4 w-4" /> v2.4.0 (Enterprise)
              </div>
              <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                <span className="h-2 w-2 rounded-full bg-green-600 inline-block animate-pulse" /> All Systems Operational
              </div>
            </div>
          </div>

          {/* Links Col 1 - Platform */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground flex items-center gap-2">
              <Map className="h-4 w-4 text-muted-foreground" /> Platform
            </h4>
            <ul className="space-y-3">
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-orange-600 transition-colors">Workflow Visualizer</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-orange-600 transition-colors">Sector Analytics</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-orange-600 transition-colors">Employee Directory</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-orange-600 transition-colors">Audit Logs</Link></li>
            </ul>
          </div>

          {/* Links Col 2 - Support */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-muted-foreground" /> Support
            </h4>
            <ul className="space-y-3">
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-orange-600 transition-colors">Documentation</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-orange-600 transition-colors">API Reference</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-orange-600 transition-colors">Knowledge Base</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-orange-600 transition-colors">System Status</Link></li>
            </ul>
          </div>

          {/* Links Col 3 - Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground flex items-center gap-2">
              <Shield className="h-4 w-4 text-muted-foreground" /> Legal & Contact
            </h4>
            <ul className="space-y-3">
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-orange-600 transition-colors flex items-center gap-2"><PhoneCall className="h-3 w-3" /> Support Hotline</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-orange-600 transition-colors flex items-center gap-2"><Mail className="h-3 w-3" /> IT Admin Desk</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-orange-600 transition-colors mt-2 block">Privacy Policy</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-orange-600 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

        </div>

        <div className="mt-16 pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground text-center md:text-left">
            &copy; {new Date().getFullYear()} ServeSync Technologies. All rights reserved. 
            Designed for multi-sector enterprise operations.
          </p>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">Internal Portal</Button>
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">Partner Login</Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
