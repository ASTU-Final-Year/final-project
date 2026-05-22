// src/app/service/[service_id]/page.jsx
"use client";

import PublicOrganizationServiceDisplay from "@/components/public/service-display";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import RequestHandler from "@/lib/request-handler";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function OrganizationServicePublicPage() {
  const { service_id } = useParams();
  const [service, setService] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchService = useCallback(async () => {
    try {
      // Fetch service with organization and calendar data
      const dataRes = await RequestHandler.Get(
        `/query/v1/organizationService?guest&~id='${service_id}'&select={"":true,"organization":["id","name","address","email","phone","sector","isGovernment"],"calendar":["available"]}`,
      );

      if (dataRes.ok) {
        const {
          organizationServices: [organizationService],
        } = await dataRes.json();
        setService(organizationService);
      }
    } catch (error) {
      console.error("Failed to fetch service:", error);
    } finally {
      setIsLoading(false);
    }
  }, [service_id]);

  useEffect(() => {
    (async () => fetchService())();
  }, [fetchService]);

  if (isLoading) {
    return (
      <div className="h-[100vh] flex items-center justify-center bg-card">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (service == null) {
    return (
      <div>
        <SiteHeader />
        <main className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold mb-2">Service Not Found</h2>
          <p className="text-muted-foreground">
            The service you're looking for doesn't exist or has been removed.
          </p>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div>
      <SiteHeader />
      <main>
        <PublicOrganizationServiceDisplay service={service} />
      </main>
      <SiteFooter />
    </div>
  );
}
