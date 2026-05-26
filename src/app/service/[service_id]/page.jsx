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
      // Fetch service with complete data including calendar availability
      const dataRes = await RequestHandler.Get(
        `/query/v1/organizationService?guest&~id='${service_id}'&select={"":["id","name","description","price","isActive","imageUrl","rating","organizationId"],"organization":["id","name","address","email","phone","sector","isGovernment","rating"],"calendar":["available","unavailable"]}`,
      );

      if (dataRes.ok) {
        const {
          organizationServices: [organizationService],
        } = await dataRes.json();

        // Process calendar data
        if (organizationService.calendar) {
          // Parse available hours
          if (organizationService.calendar.available?.hours) {
            organizationService.calendar.available.hours =
              organizationService.calendar.available.hours.map(([from, to]) => [
                from,
                to,
              ]);
          }
          // Parse unavailable dates - ensure they're Date objects
          if (organizationService.calendar.unavailable?.ranges) {
            organizationService.calendar.unavailable.ranges =
              organizationService.calendar.unavailable.ranges.map(
                ({ from, to }) => ({
                  from: new Date(from),
                  to: new Date(to),
                }),
              );
          }
          // Parse specific unavailable dates
          if (organizationService.calendar.unavailable?.exactly) {
            organizationService.calendar.unavailable.exactly =
              organizationService.calendar.unavailable.exactly.map(
                (date) => new Date(date),
              );
          }
          // Parse specific available dates
          if (organizationService.calendar.available?.exactly) {
            organizationService.calendar.available.exactly =
              organizationService.calendar.available.exactly.map(
                (date) => new Date(date),
              );
          }
        }

        // Set default duration if not provided
        // if (!organizationService.duration) {
        //   organizationService.duration = 60; // 60 minutes default
        // }

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
