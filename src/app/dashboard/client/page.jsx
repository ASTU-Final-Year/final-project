"use client";

import { useEffect, useState } from "react";
import RequestHandler from "@/lib/request-handler";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Briefcase,
  Users,
  CalendarDays,
  Activity,
  User,
  Loader2,
} from "lucide-react";
import { useSessionStore } from "@/store";

export default function DashboardOverview() {
  const [client, setClient] = useState(null);
  const [appointments, setAppointments] = useState(null);
  // const session = useSessionStore(({ session }) => session);
  const [stats, setStats] = useState({
    appointments: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const orgRes = await RequestHandler.Get("/api/v1/user");
        if (orgRes.ok) {
          const { user } = await orgRes.json();
          setClient(user);

          // Fetch aggregate stats concurrently
          const [countRes] = await Promise.all([
            RequestHandler.Get(`/api/v1/client/${clientId}/tasks/count`),
          ]);

          if (countRes.ok) {
            setStats({
              appointments: countRes.ok
                ? (await countRes.json()).count || 0
                : 0,
            });
          }
        }
      } catch (error) {
        console.error("Failed to load overview data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading)
    return (
      <div className="h-48 flex items-center justify-center border rounded bg-card">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  if (!client) return <div>Client not found.</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Client Profile Card */}
      <Card className="border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
              <User className="h-10 w-10 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold">
                  {client.firstname + " " + client.lastname}
                </h2>
                {/* <Badge className="bg-primary/10 text-primary border-primary/20">
                  Verified
                </Badge> */}
              </div>
              <p className="text-muted-foreground mb-4">
                <b>Client</b>
              </p>
              <div className="flex gap-6">
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{client.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{client.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Joined</p>
                  <p className="font-medium">
                    {new Date(client.createdAt).getFullYear()}
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
          Welcome back, {client.firstname + " " + client.lastname}
        </h2>
        <p className="text-muted-foreground">
          Here is an overview of your workspace today.
        </p>
      </div>

      <div className="grid gap-3 grid-cols-1 md:grid-cols-2">
        <StatCard
          title="Appointments"
          value={stats.appointments}
          href={"/dashboard/client/appointments"}
          icon={CalendarDays}
        />
        <StatCard
          title="Client Status"
          // value={client.isActive ? "Active" : "Inactive"}
          value={"Active"}
          icon={Activity}
        />
      </div>
    </div>
  );
}

const StatCardTitle = ({ href, className, children, ...props }) => {
  return href ? (
    <Link
      href={href}
      className={cn(
        "flex flex-row items-center justify-between space-y-0 hover:underline w-full",
        className,
      )}
      {...props}
    >
      {children}
    </Link>
  ) : (
    <div
      className={cn(
        "flex flex-row items-center justify-between space-y-0 w-full",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

function StatCard({ title, value, icon: Icon, href }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <StatCardTitle href={href}>
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </StatCardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}
