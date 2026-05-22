"use client";

import PublicOrganization from "@/components/public/organization";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import RequestHandler from "@/lib/request-handler";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function OrganizationOrganizationPublicPage() {
  const { organization_id } = useParams();
  const [organization, setOrganization] = useState(null);
  const [services, setServices] = useState(null);

  const [isLoading, setIsLoading] = useState(organization == null);

  const fetchOrganization = useCallback(async () => {
    // (async () => setIsLoading(true))();

    const [dataRes, servRes] = await Promise.all([
      RequestHandler.Get(`/query/v1/organization?~id=${organization_id}`),
      RequestHandler.Get(
        `/query/v1/organizationService?~organizationId=${organization_id}`,
      ),
    ]);

    if (dataRes.ok) {
      const {
        organizations: [organization],
      } = await dataRes.json();
      setOrganization(organization);
    }
    if (servRes.ok) {
      const { organizationServices } = await servRes.json();
      setServices(organizationServices);
    }
    (async () => setIsLoading(false))();
  }, [setOrganization, setServices, organization_id]);

  useEffect(() => {
    (() => fetchOrganization())();
  }, [fetchOrganization]);

  if (isLoading)
    return (
      <div className="h-[100vh] flex items-center justify-center bg-card">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  if (organization == null) return <h2>Organization Not Found</h2>;

  return (
    <div>
      <SiteHeader />
      <main>
        <PublicOrganization organization={organization} services={services} />
      </main>
      <SiteFooter />
    </div>
  );
}
