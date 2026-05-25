"use client";

import { useState, useCallback, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  ArrowRight,
  MapPin,
  Building2,
  Loader2,
  ChevronRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import RequestHandler from "@/lib/request-handler";
import { cn } from "@/lib/utils";
import { config } from "@/lib/config";

export default function SearchComponent({
  offset,
  limit,
  searchBarOnly,
  floatServiceList,
  saerchBarClassName,
  serviceListClassName,
  resultsClassName,
  resultClassName,
  dark,
  className,
  ...props
}) {
  const searchParams = useSearchParams();
  const qSearch = searchParams.get("search");
  const router = useRouter();
  const [query, setQuery] = useState(qSearch || "");
  const [prevQuery, setPrevQuery] = useState("");
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const searchServices = useCallback(
    async (searchQuery) => {
      if (!searchQuery.trim()) {
        setServices([]);
        setHasSearched(false);
        return;
      }

      setHasSearched(true);
      setIsLoading(true); // Added this back in so your loader shows while typing/fetching

      try {
        const query = searchQuery;
        const ilike = config.prodDatabase ? "ilike" : "like";
        const queryTokens = query.split(/\s|,|:/);
        const searchFilter = queryTokens
          .map((q) => {
            const query = encodeURIComponent(q);
            return `~name.${ilike}=%25${query}%25|~description.${ilike}=%25${query}%25|~organization.sector.${ilike}=%25${query}%25|~organization.name.${ilike}=%25${query}%25|~organization.description.${ilike}=%25${query}%25|~organization.address.${ilike}=%25${query}%25`;
          })
          .join("&");
        const sparams = new URLSearchParams({
          ...(offset ? { offset: offset.toFixed() } : {}),
          ...(limit ? { limit: limit.toFixed() } : {}),
          "~isActive": true,
        });

        const dataRes = await RequestHandler.Get(
          searchQuery
            ? `/query/v1/organizationService?guest&${sparams.toString()}&${searchFilter}`
            : `/query/v1/organizationService?guest&${sparams.toString()}`,
        );

        if (dataRes.ok) {
          const { organizationServices } = await dataRes.json();
          setServices(organizationServices || []);
        }
      } catch (error) {
        console.error("Search failed:", error);
        setServices([]);
      } finally {
        setIsLoading(false);
      }
    },
    [offset, limit],
  ); // Added missing dependencies

  useEffect(() => {
    if (prevQuery !== query) {
      const timeoutId = setTimeout(() => {
        searchServices(query);
        setPrevQuery(query);
      }, 300); // Added a slight debounce to prevent spamming requests while typing
      return () => clearTimeout(timeoutId);
    }
  }, [prevQuery, query, searchServices]);

  const handleSearch = (e) => {
    e.preventDefault();
    searchServices(query);
  };

  return (
    <div className={cn("flex flex-col gap-2 relative", className)} {...props}>
      {/* Hero Search Section */}
      <section
        className={cn(
          "bg-background/0 rounded",
          dark && "dark",
          "text-foreground/90",
          saerchBarClassName,
        )}
      >
        <div className="container mx-auto px-4 pb-4">
          <div className="max-w-3xl mx-auto text-center">
            {!searchBarOnly && (
              <>
                <h1 className="text-3xl font-bold tracking-tight md:text-4xl mb-4 text-foreground">
                  Find the services you are looking for
                </h1>
                <p className="text-lg text-muted-foreground mb-4">
                  Search by name, description, sector, and location
                </p>
              </>
            )}

            <form
              onSubmit={handleSearch}
              className="flex gap-2 shadow-sm rounded-full"
            >
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground rounded-full backdrop-blur-sm" />
                <Input
                  type="text"
                  placeholder='Try "barber", "hospital", "permit"...'
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="rounded-full pl-12 h-14 text-lg border-border hover:border-primary/50 focus-visible:border-primary focus-visible:ring-primary/20 transition-colors shadow-sm"
                />
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section
        className={cn(
          floatServiceList &&
            "absolute top-12 left-[50%] -translate-x-[50%] w-full max-w-4xl",
          "container mx-auto p-4",
          serviceListClassName,
        )}
      >
        {isLoading && (
          <div className="flex items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3 font-medium">Searching services...</span>
          </div>
        )}

        {!isLoading && hasSearched && (
          <div className="max-w-4xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                {services.length === 0
                  ? "No services found"
                  : `Showing ${services.length} result${services.length !== 1 ? "s" : ""}`}
              </p>
            </div>

            <div
              className={cn(
                "grid gap-4 max-h-[100vh] overflow-y-auto",
                resultsClassName,
              )}
            >
              {services.map((service) => (
                <Card
                  key={service.id}
                  onClick={() => router.push(`/service/${service.id}`)}
                  className={cn(
                    "group relative overflow-hidden transition-all duration-300",
                    "bg-card/50 dark:bg-slate-900/50 border-3 dark:-bg-linear-60 dark:from-slate-700/50 dark:to-slate-950/40 border-slate-300/30 text-card-foreground backdrop-blur-lg",
                    "hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 cursor-pointer",
                    dark && "dark",
                    resultClassName,
                  )}
                >
                  <CardContent className="p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-6">
                      {/* Main Card Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold tracking-tight text-foreground truncate">
                            {service.name}
                          </h3>
                          {service.organization.sector && (
                            <Badge
                              variant="secondary"
                              className="shrink-0 bg-primary/10 text-primary hover:bg-primary/20 border-transparent font-medium"
                            >
                              {service.organization.sector}
                            </Badge>
                          )}
                        </div>

                        {service.description && (
                          <p className="text-muted-foreground text-sm line-clamp-2 mb-4 leading-relaxed pr-8">
                            {service.description}
                          </p>
                        )}

                        {/* Metadata Row */}
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground font-medium">
                          {service.organization?.name && (
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-primary/60" />
                              <span className="truncate max-w-[200px]">
                                {service.organization.name}
                              </span>
                            </div>
                          )}
                          {service.organization?.address && (
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-primary/60" />
                              <span className="truncate max-w-[200px]">
                                {service.organization.address}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Animated Arrow Indicator */}
                      <div className="hidden sm:flex items-center justify-center pt-2 self-center">
                        <div className="h-10 w-10 rounded-full flex items-center justify-center bg-transparent group-hover:bg-primary/10 transition-colors duration-300">
                          <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {services.length === 0 && !isLoading && (
              <div className="text-center py-20 border-2 border-dashed border-border rounded-xl bg-card/50">
                <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-semibold mb-2 text-foreground">
                  No services found
                </h3>
                <p className="text-muted-foreground max-w-sm mx-auto">
                  We couldn't find anything matching "{query}". Try adjusting
                  your search terms.
                </p>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
