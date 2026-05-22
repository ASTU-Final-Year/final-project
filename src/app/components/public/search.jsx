// src/components/public/search.jsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, MapPin, Store, Search, Sparkles } from "lucide-react";
import RequestHandler from "@/lib/request-handler";
import Link from "next/link";

// Fallback image (you can replace with a local placeholder)
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1604076850742-4c7221f3101b?w=600&auto=format";

export default function SearchComponent({ dark = false, className = "", resultsClassName = "" }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      // Adjust the endpoint to match your actual API.
      // Example using the query system from your screenshots:
      let url = "/query/v1/organizationService?guest&select={\"\":true,\"organization\":[\"name\",\"address\",\"sector\",\"isGovernment\"]}";
      if (searchQuery.trim()) {
        // Simple text search across name, description, organization name
        url += `&~name='${encodeURIComponent(searchQuery)}'|~description='${encodeURIComponent(searchQuery)}'|~organization.name='${encodeURIComponent(searchQuery)}'`;
      }
      const res = await RequestHandler.Get(url);
      if (res.ok) {
        const data = await res.json();
        setServices(data.organizationServices || []);
      } else {
        console.error("Failed to fetch services");
        setServices([]);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      setServices([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchServices();
  };

  // Helper: rating (replace with actual data when available)
  const renderRating = (rating = 4.8) => (
    <div className="flex items-center gap-1">
      <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
      <span className="text-sm font-medium text-indigo-700">{rating.toFixed(1)}</span>
      <span className="text-xs text-indigo-400">(120+ reviews)</span>
    </div>
  );

  return (
    <div className={`w-full max-w-6xl mx-auto px-4 ${className}`}>
      {/* Hero section */}
      <div className="text-center mb-12">
        <Badge variant="outline" className="border-indigo-200 text-indigo-700 bg-indigo-50/50 px-4 py-1.5 mb-4">
          <Sparkles className="h-3.5 w-3.5 mr-1" />
          Discover Excellence
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold text-indigo-950 mb-4">
          Find the services you are looking for
        </h1>
        <p className="text-indigo-600 mb-8 max-w-2xl mx-auto">
          Search by name, description, sector, and location
        </p>
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-400" />
            <Input
              type="text"
              placeholder='Try "barber", "hospital", "permit"...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 py-6 text-base border-indigo-200 focus:ring-indigo-400 bg-white shadow-sm"
            />
            <Button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 bg-indigo-600 hover:bg-indigo-700"
            >
              Search
            </Button>
          </div>
        </form>
      </div>

      {/* Results count */}
      {!loading && (
        <div className="mb-6">
          <p className="text-indigo-600">
            Found <span className="font-semibold text-indigo-900">{services.length}</span> services
          </p>
        </div>
      )}

      {/* Results grid */}
      <div className={`space-y-6 ${resultsClassName}`}>
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
        ) : services.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-indigo-100">
            <Search className="h-12 w-12 text-indigo-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-indigo-900 mb-2">No services found</h3>
            <p className="text-indigo-500">Try adjusting your search or browse all services.</p>
            <Button
              variant="link"
              onClick={() => setSearchQuery("")}
              className="mt-4 text-indigo-600"
            >
              Clear search
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Individual service card component
function ServiceCard({ service }) {
  const {
    id,
    name,
    description,
    organization,
  } = service;

  const orgName = organization?.name || "Service Provider";
  const orgAddress = organization?.address || "Location not specified";
  const sector = organization?.sector || "General";
  const isGov = organization?.isGovernment;

  return (
    <Link href={`/service/${id}`}>
      <Card className="group overflow-hidden border-indigo-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
        <div className="relative h-48 overflow-hidden bg-indigo-100">
          <img
            src={FALLBACK_IMAGE}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge className="bg-white/90 text-indigo-700 border-none text-xs">
              {sector}
            </Badge>
            {isGov && (
              <Badge variant="secondary" className="bg-amber-100 text-amber-700">
                Government
              </Badge>
            )}
          </div>
        </div>
        <CardContent className="p-5">
          <h3 className="text-xl font-semibold text-indigo-950 mb-2 line-clamp-1">
            {name}
          </h3>
          <p className="text-indigo-600 text-sm mb-3 line-clamp-2">
            {description || "No description provided"}
          </p>
          <div className="flex items-center gap-3 text-sm text-indigo-500 mb-3">
            <div className="flex items-center gap-1">
              <Store className="h-3.5 w-3.5" />
              <span className="truncate">{orgName}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              <span className="truncate">{orgAddress}</span>
            </div>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-indigo-100">
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium text-indigo-700">4.8</span>
              <span className="text-xs text-indigo-400">(120+ reviews)</span>
            </div>
            <Button
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-700 text-white gap-1"
              onClick={(e) => {
                e.preventDefault();
                window.location.href = `/service/${id}`;
              }}
            >
              View Details
              <Sparkles className="h-3.5 w-3.5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}