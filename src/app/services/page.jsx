// src/app/services/page.jsx
"use client";

import { useState, useEffect } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  MapPin,
  Store,
  Star,
  Filter,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import RequestHandler from "@/lib/request-handler";
import Image from "next/image";
import Link from "next/link";
import ServiceCard from "@/components/public/service-card";

// Sector filter chips
const sectors = [
  { id: "", label: "All Services", icon: Sparkles },
  { id: "healthcare", label: "Healthcare", icon: null },
  { id: "automotive", label: "Automotive", icon: null },
  { id: "beauty", label: "Beauty & Salon", icon: null },
  { id: "government", label: "Government", icon: null },
  { id: "legal", label: "Legal", icon: null },
];

export default function ServicesSearchPage() {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSector, setActiveSector] = useState("");

  // Fetch services (replace with your actual API endpoint)
  useEffect(() => {
    const fetchServices = async () => {
      try {
        // Example using your RequestHandler – adjust endpoint as needed
        // const q = searchQuery;
        // const query = q
        //   ? "&" +
        //     encodeURIComponent(
        //       q
        //         .split(/\s,/g)
        //         .map(
        //           (q) =>
        //             `~name.ilike=%${q}%|~description.ilike=%${q}%|~organization.name.ilike=%${q}%`,
        //         )
        //         .join("|"),
        //     )
        //   : "";
        // const res = await RequestHandler.Get(
        //   `/query/v1/organizationService?guest&limit=20${query}`,
        // );
        const offset = null;
        const limit = 20;
        const query = searchQuery;
        const queryTokens = query.split(/\s|,|:/);
        const searchFilter = queryTokens
          .map((q) => {
            const query = encodeURIComponent(q);
            return `~name.ilike=%25${query}%25|~description.ilike=%25${query}%25|~organization.name.ilike=%25${query}%25|~organization.sector.ilike=%25${query}%25|~organization.description.ilike=%25${query}%25|~organization.address.ilike=%25${query}%25`;
          })
          .join("&");
        const sparams = new URLSearchParams({
          ...(offset ? { offset: offset.toFixed() } : {}),
          ...(limit ? { limit: limit.toFixed() } : {}),
          "~isActive": true,
        });
        const url = searchQuery
          ? `/query/v1/organizationService?guest&${sparams.toString()}${activeSector ? `&~organization.sector.ilike=${activeSector}` : ""}&${searchFilter}`
          : `/query/v1/organizationService?guest&${sparams.toString()}${activeSector ? `&~organization.sector.ilike=${activeSector}` : ""}`;
        const dataRes = await RequestHandler.Get(url);
        if (dataRes.ok) {
          const { organizationServices } = await dataRes.json();
          setServices(organizationServices || []);
          setFilteredServices(organizationServices || []);
        }
        // if (res.ok) {
        //   // const data = await res.json();
        //   // // Assuming data.services is an array; adapt to your actual response
        //   // setServices(data.organizationService || data || []);
        //   // setFilteredServices(data.organizationService || []);
        // } else {
        //   // Fallback mock data for demonstration (remove when real API ready)
        //   // setServices(mockServices);
        // }
      } catch (error) {
        console.error("Failed to fetch services:", error);
        // setServices(mockServices);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [searchQuery, activeSector]);

  // Filter services based on search query and sector
  // useEffect(() => {
  //   let result = services;
  //   // if (searchQuery) {
  //   //   const lowerQuery = searchQuery.toLowerCase();
  //   //   result = result.filter(
  //   //     (service) =>
  //   //       service.name?.toLowerCase().includes(lowerQuery) ||
  //   //       service.description?.toLowerCase().includes(lowerQuery) ||
  //   //       service.organization?.name?.toLowerCase().includes(lowerQuery),
  //   //   );
  //   // }
  //   if (activeSector !== "all") {
  //     result = result.filter((service) => service.sector === activeSector);
  //   }
  //   (async () => setFilteredServices(result))();
  // }, [searchQuery, activeSector, services]);

  return (
    <div className="min-h-screen flex flex-col ">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero Section */}
        {/* <section className="relative text-white overflow-hidden bg-primary"> */}
        <section
          className="relative bg-cover bg-center flex flex-col items-center pt-8 px-6"
          style={{
            backgroundImage:
              'url("/images/pexels-lovetosmile-36200692-blurred.jpg")',
          }}
        >
          {/* Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B132B]/95 via-[#0B132B]/80 to-transparent z-0" />
          <div className="absolute inset-0 bg-gradient-to-tl from-[#0B132B] via-transparent to-transparent z-0 opacity-80" />
          <div className="container mx-auto px-4 py-8 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              {/* <Badge className="mb-4 bg-primary/20 text-foreground border-primary">
                <Sparkles className="h-3.5 w-3.5 mr-1" />
                Discover Excellence
              </Badge> */}
              {/* <h1
                className="text-2xl md:text-2xl font-bold text-white/90 tracking-tight mb-4"
                style={{ letterSpacing: "1px" }}
              >
                Find the services you are looking for
              </h1> */}
              {/* <p className=" text-lg mb-8">
                Perfect Browse hundreds of trusted services across healthcare,
                automotive, beauty, and more.
              </p> */}
              {/* Search Bar */}
              <div className="relative max-w-xl mx-auto text-white rounded-full overflow-hidden">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search by service name, provider, or sector..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="rounded-full pl-12 py-6 text-base bg-white/10 border-primary/30 text-white placeholder:text-muted focus:ring-primary"
                />
              </div>
            </div>
          </div>
          {/* Sector Filters */}
          <div className="flex flex-wrap gap-2 justify-center mb-10 z-10">
            {sectors.map((cat) => {
              const Icon = cat.icon;
              return (
                <Button
                  key={cat.id}
                  variant={activeSector === cat.id ? "default" : "outline"}
                  className={`rounded-full gap-2 ${
                    activeSector === cat.id
                      ? "bg-primary border-white hover:bg-primary text-white"
                      : "border-border text-foreground hover:bg-indigo-50"
                  }`}
                  onClick={() => setActiveSector(cat.id)}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  {cat.label}
                </Button>
              );
            })}
          </div>
        </section>

        {/* Filters & Results */}
        <section className="container mx-auto px-4 py-12">
          {/* Results Count */}
          <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
            <div>
              <h2 className="text-2xl font-bold text-black/80">
                Found {filteredServices.length} services
              </h2>
              {searchQuery && (
                <p className="text-primary text-sm mt-1">
                  Showing results for “{searchQuery}”
                </p>
              )}
            </div>
            {/* <Button variant="outline" size="sm" className="gap-2 border-border">
              <Filter className="h-4 w-4" /> Filter
            </Button> */}
          </div>

          {/* Services Grid */}
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="overflow-hidden border-indigo-100">
                  <Skeleton className="h-48 w-full" />
                  <CardContent className="p-5 space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <div className="flex justify-between pt-2">
                      <Skeleton className="h-8 w-20" />
                      <Skeleton className="h-8 w-24" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-indigo-100">
              <Search className="h-12 w-12 text-indigo-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-primary mb-2">
                No services found
              </h3>
              <p className="text-primary">
                Try adjusting your search or filter criteria.
              </p>
              <Button
                variant="link"
                onClick={() => {
                  setSearchQuery("");
                  setActiveSector("");
                }}
                className="mt-4 text-primary"
              >
                Clear all filters
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          )}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

// Mock data (remove when real API is integrated)
// const mockServices = [
//   {
//     id: "1",
//     name: "Haircut - Classic",
//     description:
//       "Traditional haircut with scissors. Precision cutting tailored to your style.",
//     sector: "beauty",
//     price: 250,
//     rating: 4.9,
//     provider: "Nati Barber Shop",
//     location: "Yeka, Addis Abeba",
//     imageUrl:
//       "https://images.unsplash.com/photo-1585747860714-2ba1b4b3b4f0?w=800&auto=format",
//   },
//   {
//     id: "2",
//     name: "Haircut - Modern Fade",
//     description:
//       "Trendy fade haircut with clippers. Clean, sharp, and stylish.",
//     sector: "beauty",
//     price: 300,
//     rating: 4.8,
//     provider: "Nati Barber Shop",
//     location: "Yeka, Addis Abeba",
//     imageUrl:
//       "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800&auto=format",
//   },
//   {
//     id: "3",
//     name: "Beard Trim & Shape",
//     description: "Professional beard grooming. Shape, trim, and line up.",
//     sector: "beauty",
//     price: 150,
//     rating: 4.7,
//     provider: "Nati Barber Shop",
//     location: "Yeka, Addis Abeba",
//     imageUrl:
//       "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800&auto=format",
//   },
//   {
//     id: "4",
//     name: "Hair Coloring",
//     description:
//       "Full hair coloring treatment with premium products. Vibrant, long-lasting color.",
//     sector: "beauty",
//     price: 800,
//     rating: 4.9,
//     provider: "Nati Barber Shop",
//     location: "Yeka, Addis Abeba",
//     imageUrl:
//       "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&auto=format",
//   },
//   {
//     id: "5",
//     name: "Engine Diagnostics",
//     description:
//       "Complete engine check with advanced tools. Identify issues quickly.",
//     sector: "automotive",
//     price: 500,
//     rating: 4.8,
//     provider: "AutoCare Center",
//     location: "Bole, Addis Abeba",
//     imageUrl:
//       "https://images.unsplash.com/photo-1487754180451-4561e8f3c3f3?w=800&auto=format",
//   },
//   {
//     id: "6",
//     name: "General Checkup",
//     description: "Full physical examination by experienced doctors.",
//     sector: "healthcare",
//     price: 1200,
//     rating: 4.9,
//     provider: "St. Paul Hospital",
//     location: "Gulele, Addis Abeba",
//     imageUrl:
//       "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format",
//   },
// ];
