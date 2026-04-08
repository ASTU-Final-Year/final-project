"use client";

import { useEffect, useState } from "react";
import RequestHandler from "@/lib/request-handler";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Briefcase,
  Users,
  CalendarDays,
  Activity,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function DashboardOverview() {
  const [organization, setOrganization] = useState(null);
  const [stats, setStats] = useState({
    employees: 0,
    services: 0,
    calendars: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const orgRes = await RequestHandler.Get("/api/v1/organization");
        if (orgRes.ok) {
          const { organization } = await orgRes.json();
          setOrganization(organization);

          // Fetch aggregate stats concurrently
          const [empRes, srvRes, calRes] = await Promise.all([
            RequestHandler.Get(
              `/api/v1/organization/${organization.id}/employees`,
            ),
            RequestHandler.Get(
              `/api/v1/organization/${organization.id}/services`,
            ),
            RequestHandler.Get(
              `/api/v1/organization/${organization.id}/calendars`,
            ),
          ]);

          setStats({
            employees: empRes.ok
              ? (await empRes.json()).employees?.length || 0
              : 0,
            services: srvRes.ok
              ? (await srvRes.json()).services?.length || 0
              : 0,
            calendars: calRes.ok
              ? (await calRes.json()).calendars?.length || 0
              : 0,
          });
        }
      } catch (error) {
        console.error("Failed to load overview data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) return <div>Loading overview...</div>;
  if (!organization) return <div>Organization not found.</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Organization Profile Card */}
      <Card className="border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <div className="h-20 w-20 rounded bg-primary/10 flex items-center justify-center border-2 border-primary/20">
              <Building2 className="h-10 w-10 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold">{organization.name}</h2>
                {/* <Badge className="bg-primary/10 text-primary border-primary/20">
                  Verified
                </Badge> */}
              </div>
              <p className="text-muted-foreground mb-4">
                {organization.address}
              </p>
              <div className="flex gap-6">
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{organization.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{organization.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Founded</p>
                  <p className="font-medium">
                    {new Date(organization.createdAt).getFullYear()}
                  </p>
                </div>
              </div>
            </div>
            {/* <Button variant="outline" size="sm">
              Edit Profile
            </Button> */}
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Welcome back,{" "}
          {organization.admin.firstname + " " + organization.admin.lastname}
        </h2>
        <p className="text-muted-foreground">
          Here is an overview of your workspace today.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Employees"
          value={stats.employees}
          icon={Users}
        />
        <StatCard
          title="Active Services"
          value={stats.services}
          icon={Briefcase}
        />
        <StatCard
          title="Calendars"
          value={stats.calendars}
          icon={CalendarDays}
        />
        <StatCard
          title="Organization Status"
          value={organization.isActive ? "Active" : "Inactive"}
          icon={Activity}
        />
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}
