"use client";

import PublicOrganization from "@/components/public/organization";
import { SiteFooter } from "@/components/site-footer";
import RequestHandler from "@/lib/request-handler";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Home } from "lucide-react";

export default function OrganizationPublicPage() {
  const { organization_id } = useParams();
  const [organization, setOrganization] = useState(null);
  const [services, setServices] = useState(null);
  const [serviceCount, setServiceCount] = useState(0);
  const [loaded, setIsLoaded] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    (() => setIsLoaded(true))();
  }, [setIsLoaded]);

  // --- Data Fetching ---
  useEffect(() => {
    if (organization == null) {
      (async () => setIsLoading(true))();
      RequestHandler.Get(`/api/v1/organization/${organization_id}`).then(
        async (res) => {
          if (res.ok) {
            const { organization } = await res.json();
            setOrganization(organization);
          } else {
            (async () => setIsLoading(false))();
          }
        },
      );
    }
  }, [organization, organization_id, setOrganization]);

  const organizationId = organization?.id;

  const fetchServices = useCallback(async () => {
    if (!organizationId) return;
    if (!services) {
      (async () => setIsLoading(true))();
      // (async () => setIsLoading(true))();

      const offset = (page - 1) * limit;
      const params = new URLSearchParams({
        o: offset.toString(),
        l: limit.toString(),
        iorganization: 1,
        icalendar: 1,
      });

      const [countRes, dataRes] = await Promise.all([
        RequestHandler.Get(
          `/api/v1/organization/${organizationId}/services/count`,
        ),
        RequestHandler.Get(
          `/api/v1/organization/${organizationId}/services?${params.toString()}`,
        ),
      ]);

      if (countRes.ok) {
        const { count } = await countRes.json();
        (async () => setServiceCount(count))();
      }

      if (dataRes.ok) {
        const data = await dataRes.json();
        let results = data.services || [];

        if (statusFilter !== "all") {
          results = results.filter(
            (s) => s.isActive === (statusFilter === "active"),
          );
        }
        if (searchQuery) {
          results = results.filter(
            (s) =>
              s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              s.description.toLowerCase().includes(searchQuery.toLowerCase()),
          );
        }
        setServices(results);
        // (async () => setServices(results))();
      }
      (async () => setIsLoading(false))();
    }
  }, [
    setServiceCount,
    setServices,
    services,
    organizationId,
    page,
    limit,
    statusFilter,
    searchQuery,
  ]);

  useEffect(() => {
    (() => fetchServices())();
  }, [fetchServices]);

  if (!loaded || isLoading)
    return (
      <div className="h-[100vh] flex items-center justify-center bg-card">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  // if (organization == null) return <h2>Organization Not Found</h2>;
  if (organization == null) {
    return <OrganizationNotFound />;
  }

  return (
    <div>
      <main>
        <PublicOrganization
          organization={organization}
          services={services ?? []}
        />
      </main>
      <SiteFooter />
    </div>
  );
}

function OrganizationNotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50/30 flex flex-col py-12 px-4">
      <div className="container mx-auto max-w-[500px]">
        <Card className="border-2 shadow-xl shadow-slate-200/50 overflow-hidden text-center">
          <CardHeader className="pb-6 pt-10 border-b border-slate-100 bg-white">
            <div className="text-6xl font-black text-primary mb-2 tracking-tighter">
              404
            </div>

            <CardTitle className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Organization Not Found
            </CardTitle>

            <CardDescription className="text-base mt-2 mx-auto max-w-[300px]">
              We couldn&apos;t find the organization you&apos;re looking for. It
              might have been deleted or not registered.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-8 sm:p-10 bg-white space-y-4">
            <Button
              onClick={() => router.push("/")}
              className="w-full h-12 text-base font-bold shadow-md hover:shadow-lg transition-all"
            >
              <Home className="mr-2 h-4 w-4" />
              Go to Home
            </Button>

            <Button
              variant="outline"
              onClick={() => router.back()}
              className="w-full h-12 text-base font-bold border-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </CardContent>

          <CardFooter className="flex justify-center border-t border-slate-100 p-6 bg-slate-50/50">
            <p className="text-[11px] uppercase tracking-widest text-slate-400 font-bold">
              ServeSync+ • Error 404
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
