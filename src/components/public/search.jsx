// src/app/services/page.jsx
"use client";

import { useState, useCallback, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, ArrowRight, MapPin, Building2, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import RequestHandler from "@/lib/request-handler";
import { cn } from "@/lib/utils";
import { config } from "@/lib/config";

export default function SearchComponent({
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
  // const pathname = usePathname();
  const searchParams = useSearchParams();
  const qSearch = searchParams.get("search");
  const router = useRouter();
  const [query, setQuery] = useState(qSearch || "");
  const [prevQuery, setPrevQuery] = useState("");
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const searchServices = useCallback(async (searchQuery) => {
    if (!searchQuery.trim()) {
      setServices([]);
      setHasSearched(false);
      return;
    }
    // const params = new URLSearchParams(searchParams);
    // params.set("search", searchQuery);
    // router.(`${pathname}?${params.toString()}`);

    // setIsLoading(true);
    setHasSearched(true);

    try {
      const query = searchQuery;
      const ilike = config.prodDatabase ? "ilike" : "like";
      const queryTokens = query.split(/\s|,|:/);
      const searchFilter = queryTokens
        .map((q) => {
          const query = encodeURIComponent(q);
          return `~name.${ilike}=%25${query}%25|~description.${ilike}=%25${query}%25|~organization.sector.${ilike}=%25${query}%25|~organization.name.${ilike}=%25${query}%25|~organization.description.${ilike}=%25${query}%25|~organization.address.${ilike}=%25${query}%25`;
        })
        .join("|");
      const dataRes = await RequestHandler.Get(
        searchQuery
          ? `/query/v1/organizationService?guest&limit=10&~isActive=true&${searchFilter}`
          : `/query/v1/organizationService?guest&limit=10`,
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
  }, []);

  useEffect(() => {
    if (prevQuery != query) {
      (async () => {
        searchServices(query);
        setPrevQuery(query);
      })();
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
          "text-foreground/90 dark:text-white/90",
          saerchBarClassName,
        )}
      >
        <div className="container mx-auto px-4 pb-4">
          <div className="max-w-3xl mx-auto text-center">
            {!searchBarOnly && (
              <>
                <h1 className="text-3xl font-bold tracking-tight md:text-4xl mb-4 text-foreground/90 dark:text-white/90">
                  Find the services you are looking for
                </h1>
                <p className="text-lg text-foreground/90 darK:text-white/70 mb-4">
                  Search by name, description, sector, and location
                </p>
              </>
            )}

            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-" />
                <Input
                  type="text"
                  placeholder='Try "barber", "hospital", "permit"...'
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  style={{ fontSize: "1em" }}
                  className="rounded-full pl-10 h-12 text-lg bg-background/90 dark:bg-slate-900/70 border-slate-300 placeholder:text-foreground/60 dark:placeholder:text-white/60 focus-visible:ring-primary"
                />
              </div>
              {/* <Button
                type="submit"
                size="lg"
                className="bg-primary hover:bg-primary/90 text-lg h-12 px-8"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "Search"
                )}
              </Button> */}
            </form>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section
        className={cn(
          floatServiceList && "absolute top-12 left-[50%] -translate-x-[50%]",
          "container mx-auto p-4 text-foreground/90 dark:text-white/90",
          serviceListClassName,
        )}
      >
        {isLoading && (
          <div
            className={cn(
              "flex items-center justify-center py-20",
              dark && "dark",
              "text-foreground/90 dark:text-white/90",
            )}
          >
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3">Searching services...</span>
          </div>
        )}

        {!isLoading && hasSearched && (
          <>
            <div
              className={cn(
                "mb-6",
                dark && "dark",
                "text-foreground/90 dark:text-white/90",
              )}
            >
              <p className="">
                {services.length === 0
                  ? "No services found"
                  : `Found ${services.length} service${services.length !== 1 ? "s" : ""}`}
              </p>
            </div>

            <div
              className={cn(
                "grid gap-4 overflow-y-auto max-h-200",
                resultsClassName,
              )}
            >
              {services.map((service) => (
                <Card
                  key={service.id}
                  className={cn(
                    "hover:shadow-md transition-shadow duration-200 border-slate-200 cursor-pointer",
                    resultClassName,
                  )}
                  onClick={() => router.push(`/service/${service.id}`)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-slate-900 truncate">
                            {service.name}
                          </h3>
                          {service.organization.sector && (
                            <Badge
                              variant="outline"
                              className="shrink-0 border-primary text-primary rounded-full"
                            >
                              {service.organization.sector}
                            </Badge>
                          )}
                        </div>

                        {service.description && (
                          <p className="text-slate-600 text-sm line-clamp-2 mb-3">
                            {service.description}
                          </p>
                        )}

                        <div className="flex items-center gap-4 text-sm text-slate-500">
                          {service.organization?.name && (
                            <div className="flex items-center gap-1">
                              <Building2 className="h-4 w-4" />
                              <span>{service.organization.name}</span>
                            </div>
                          )}
                          {service.organization?.address && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              <span>{service.organization.address}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* <Button
                        variant="link"
                        size="sm"
                        className="shrink-0 hover:bg-primary/5"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/service/${service.id}`);
                        }}
                      >
                        View
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button> */}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {services.length === 0 && !isLoading && (
              <div
                className={cn(
                  "text-center py-16",
                  dark && "dark",
                  "text-foreground/90 dark:text-white/90",
                )}
              >
                <Search className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No services found
                </h3>
                <p className="">
                  Try adjusting your search terms or browse different categories
                </p>
              </div>
            )}
          </>
        )}

        {/* {!hasSearched && (
          <div className="text-center py-16">
            <Search className="h-16 w-16 text-slate-200 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-700 mb-2">
              Search for Services
            </h2>
            <p className="text-slate-500 max-w-md mx-auto">
              Enter a service name, description, or sector above to find what
              you need
            </p>
          </div>
        )} */}
      </section>
    </div>
  );
}
