// src/app/service/[service_id]/page.jsx
"use client";

import PublicOrganizationService from "@/components/public/service";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import RequestHandler from "@/lib/request-handler";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function OrganizationServicePublicPage() {
  const { service_id } = useParams();
  const [service, setService] = useState(null);

  const [isLoading, setIsLoading] = useState(service == null);

  const fetchService = useCallback(async () => {
    // (async () => setIsLoading(true))();

    const dataRes = await RequestHandler.Get(
      `/query/v1/organizationService?guest&~id='${service_id}'`,
    );

    if (dataRes.ok) {
      const {
        organizationServices: [organizationService],
      } = await dataRes.json();
      setService(organizationService);
    }
    (async () => setIsLoading(false))();
  }, [setService, service_id]);

  useEffect(() => {
    (() => fetchService())();
  }, [fetchService]);

  if (isLoading) {
    return (
      <div className="h-[100vh] flex items-center justify-center bg-card">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (service == null) return <h2>Service Not Found</h2>;

  return (
    <div>
      <SiteHeader />
      <main>
        <PublicOrganizationService service={service} />
      </main>
      <SiteFooter />
    </div>
  );
}
