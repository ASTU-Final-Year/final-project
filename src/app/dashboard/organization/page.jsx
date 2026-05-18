"use client";

import { useEffect, useState } from "react";
import RequestHandler from "@/lib/request-handler";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Briefcase,
  Users,
  CalendarDays,
  Activity,
  Building2,
  Loader2,
  Clock,
  DollarSign,
  Tag,
  TrendingUp,
  Eye,
  Edit,
} from "lucide-react";
import { useOrganizationStore } from "@/store";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function DashboardOverview() {
  const organization = useOrganizationStore(({ organization }) => organization);
  const setOrganization = useOrganizationStore(
    ({ setOrganization }) => setOrganization,
  );
  const stats = useOrganizationStore(
    ({ organizationStats }) => organizationStats,
  );
  const setStats = useOrganizationStore(
    ({ setOrganizationStats }) => setOrganizationStats,
  );
  const [isLoading, setIsLoading] = useState(organization == null);
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const orgRes = await RequestHandler.Get("/query/v1/organization");
        if (orgRes.ok) {
          const {
            organizations: [organization],
          } = await orgRes.json();
          setOrganization(organization);

          // Fetch aggregate stats concurrently
          const [empRes, srvRes, acSrvRes, calRes] = await Promise.all([
            RequestHandler.Get(`/query/v1/employee?countOnly`),
            RequestHandler.Get(`/query/v1/organizationService?countOnly`),
            RequestHandler.Get(
              `/query/v1/organizationService?countOnly&~isActive=true`,
            ),
            RequestHandler.Get(`/query/v1/organizationCalendar?countOnly`),
          ]);
          const { count: empCount } = empRes.ok
            ? (await empRes.json()) || 0
            : 0;
          const { count: srvCount } = srvRes.ok
            ? (await srvRes.json()) || 0
            : 0;
          const { count: activeServicesCount } = acSrvRes.ok
            ? (await acSrvRes.json()) || 0
            : 0;
          const { count: calCount } = calRes.ok
            ? (await calRes.json()) || 0
            : 0;
          setStats({
            employees: empCount,
            services: srvCount,
            activeServices: activeServicesCount,
            calendars: calCount,
          });
        }

        // Fetch services for the service cards
        const servicesRes = await RequestHandler.Get(
          '/query/v1/organizationService?select={"":["id","name","description","price","isActive"]}&order=["createdAt.desc"]&limit=8'
        );
        if (servicesRes.ok) {
          const { organizationServices } = await servicesRes.json();
          setServices(organizationServices || []);
        }
      } catch (error) {
        console.error("Failed to load overview data", error);
      } finally {
        setIsLoading(false);
        setLoadingServices(false);
      }
    };
    fetchDashboardData();
  }, [setOrganization, setStats]);

  // Helper function to get random booking capacity (simulated for now)
  const getBookingCapacity = () => {
    const capacities = [85, 42, 68, 0, 30, 95, 25, 55];
    return capacities[Math.floor(Math.random() * capacities.length)];
  };

  // Helper function to get category color
  const getCategoryColor = (category) => {
    const colors = {
      HEALTHCARE: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      MEDICAL: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      DENTAL: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
      VISION: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
      THERAPY: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
      default: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
    };
    return colors[category] || colors.default;
  };

  if (isLoading)
    return (
      <div className="h-48 flex items-center justify-center border rounded bg-card">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  if (!isLoading && !organization) return <div>Organization not found.</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Organization Profile Card */}
      <Card className="border-primary/20 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-2xl bg-gradient-to-r from-card to-accent/5">
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <div className="h-20 w-20 rounded bg-primary/10 flex items-center justify-center border-2 border-primary/20">
              <Building2 className="h-10 w-10 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-3xl font-bold text-primary">{organization.name}</h2>
              </div>
              <p className="text-lg text-black/80 mb-4">
                {organization.address}
              </p>
              <div className="flex gap-6">
                <div>
                  <p className="text-base text-black/80">Email</p>
                  <p className="font-medium text-lg text-black">{organization.email}</p>
                </div>
                <div>
                  <p className="text-base text-black/80">Phone</p>
                  <p className="font-medium text-lg text-black">{organization.phone}</p>
                </div>
                <div>
                  <p className="text-base text-black/80">Founded</p>
                  <p className="font-medium text-lg text-black">
                    {new Date(organization.createdAt).getFullYear()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <StatCard
          title="Total Employees"
          value={stats.employees}
          href={`/dashboard/organization/employees`}
          icon={Users}
        />
        <StatCard
          title="Active Services"
          value={stats.activeServices}
          href={`/dashboard/organization/services`}
          icon={Briefcase}
        />
        <StatCard
          title="Total Services"
          value={stats.services}
          href={`/dashboard/organization/services`}
          icon={Briefcase}
        />
        <StatCard
          title="Calendars"
          value={stats.calendars}
          href={`/dashboard/organization/calendars`}
          icon={CalendarDays}
        />
        <StatCard
          title="Organization Status"
          value={organization.isActive ? "Active" : "Inactive"}
          icon={Activity}
        />
      </div>

      {/* Services Section Header */}
      <div className="flex items-center justify-between mt-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white/80">Active Services</h2>
          <p className="text-white/80 text-lg mt-1">
            Manage and monitor your service offerings
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/dashboard/organization/services">View All Services</Link>
        </Button>
      </div>

      {/* Service Cards Grid - Styled like the uploaded image */}
      {loadingServices ? (
        <div className="h-48 flex items-center justify-center border rounded bg-card">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {services.map((service, index) => {
            const bookingCapacity = getBookingCapacity();
            const category = "HEALTHCARE"; // You can map this based on service name or add a category field
            const categoryColor = getCategoryColor(category);

            return (
              <Card key={service.id} className="overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-2xl group border border-border/50">
                <CardContent className="p-0">
                  {/* Image Placeholder */}
                  <div className="h-32 bg-gradient-to-r from-primary/20 to-primary/10 relative">
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                      <Button size="sm" variant="secondary" asChild>
                        <Link href={`/dashboard/organization/services/${service.id}/edit`}>
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Link>
                      </Button>
                      <Button size="sm" variant="secondary" asChild>
                        <Link href={`/dashboard/organization/services/${service.id}`}>
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Link>
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    {/* Title and Category */}
                    <div>
                      <h3 className="font-semibold text-lg line-clamp-1">
                        {service.name}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {service.description || "Comprehensive service offering with professional care..."}
                      </p>
                    </div>

                    {/* Duration and Price */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>
                          {Math.floor(Math.random() * 60) + 15} min
                        </span>
                      </div>
                      <div className="flex items-center gap-1 font-semibold text-primary">
                        <DollarSign className="h-4 w-4" />
                        <span>{service.price} ETB</span>
                      </div>
                    </div>

                    {/* Category Badge */}
                    <div className="flex items-center justify-between">
                      <Badge className={cn("gap-1", categoryColor)}>
                        <Tag className="h-3 w-3" />
                        {category}
                      </Badge>

                      {/* Status Badge */}
                      {service.isActive ? (
                        <Badge variant="outline" className="gap-1 text-green-600 border-green-600">
                          <Activity className="h-3 w-3" />
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="gap-1 text-red-600 border-red-600">
                          Inactive
                        </Badge>
                      )}
                    </div>

                    {/* Booking Capacity Bar */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Booking Capacity</span>
                        <span className="font-medium">{bookingCapacity}% Full</span>
                      </div>
                      <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all duration-500",
                            bookingCapacity >= 80 ? "bg-red-500" :
                              bookingCapacity >= 50 ? "bg-yellow-500" :
                                "bg-green-500"
                          )}
                          style={{ width: `${bookingCapacity}%` }}
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1" asChild>
                        <Link href={`/dashboard/organization/services/${service.id}/edit`}>
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Link>
                      </Button>
                      <Button size="sm" className="flex-1" asChild>
                        <Link href={`/dashboard/organization/services/${service.id}`}>
                          View Details
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {!loadingServices && services.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Services Yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Get started by creating your first service offering
            </p>
            <Button asChild>
              <Link href="/dashboard/organization/services/new">
                Create Service
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
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
    <Card className="shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-2xl border border-border/50 bg-card hover:bg-accent/5">
      <CardHeader className="pb-2">
        <StatCardTitle href={href}>
          <CardTitle className="text-base font-medium text-black/80">{title}</CardTitle>
          <Icon className="h-5 w-5 text-black/60" />
        </StatCardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-black">{value}</div>
      </CardContent>
    </Card>
  );
}