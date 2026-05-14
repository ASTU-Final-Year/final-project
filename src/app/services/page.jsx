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

// Category filter chips
const categories = [
  { id: "all", label: "All Services", icon: Sparkles },
  { id: "healthcare", label: "Healthcare", icon: null },
  { id: "automotive", label: "Automotive", icon: null },
  { id: "beauty", label: "Beauty & Salon", icon: null },
  { id: "government", label: "Government", icon: null },
  { id: "legal", label: "Legal", icon: null },
];

// Fallback image for services
const fallbackImage = "https://images.unsplash.com/photo-1604076850742-4c7221f3101b?w=800&auto=format";

export default function ServicesSearchPage() {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  // Fetch services (replace with your actual API endpoint)
  useEffect(() => {
    const fetchServices = async () => {
      try {
        // Example using your RequestHandler – adjust endpoint as needed
        const res = await RequestHandler.Get("/api/v1/services?limit=20");
        if (res.ok) {
          const data = await res.json();
          // Assuming data.services is an array; adapt to your actual response
          setServices(data.services || data || []);
        } else {
          // Fallback mock data for demonstration (remove when real API ready)
          setServices(mockServices);
        }
      } catch (error) {
        console.error("Failed to fetch services:", error);
        setServices(mockServices);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  // Filter services based on search query and category
  useEffect(() => {
    let result = services;
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(
        (service) =>
          service.name?.toLowerCase().includes(lowerQuery) ||
          service.description?.toLowerCase().includes(lowerQuery) ||
          service.organization?.name?.toLowerCase().includes(lowerQuery)
      );
    }
    if (activeCategory !== "all") {
      result = result.filter((service) => service.category === activeCategory);
    }
    setFilteredServices(result);
  }, [searchQuery, activeCategory, services]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-indigo-900 text-white overflow-hidden">
          <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10" />
          <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <Badge className="mb-4 bg-indigo-500/20 text-indigo-100 border-indigo-400">
                <Sparkles className="h-3.5 w-3.5 mr-1" />
                Discover Excellence
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                Find the Perfect Service
              </h1>
              <p className="text-indigo-200 text-lg mb-8">
                Browse hundreds of trusted services across healthcare,
                automotive, beauty, and more.
              </p>
              {/* Search Bar */}
              <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-400" />
                <Input
                  type="text"
                  placeholder="Search by service name, provider, or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 py-6 text-base bg-white/10 border-indigo-500/30 text-white placeholder:text-indigo-300 focus:ring-indigo-400"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Filters & Results */}
        <section className="container mx-auto px-4 py-12">
          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Button
                  key={cat.id}
                  variant={activeCategory === cat.id ? "default" : "outline"}
                  className={`rounded-full gap-2 ${
                    activeCategory === cat.id
                      ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                      : "border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                  }`}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  {cat.label}
                </Button>
              );
            })}
          </div>

          {/* Results Count */}
          <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
            <div>
              <h2 className="text-2xl font-bold text-indigo-950">
                Found {filteredServices.length} services
              </h2>
              {searchQuery && (
                <p className="text-indigo-500 text-sm mt-1">
                  Showing results for “{searchQuery}”
                </p>
              )}
            </div>
            <Button variant="outline" size="sm" className="gap-2 border-indigo-200">
              <Filter className="h-4 w-4" /> Filter
            </Button>
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
              <h3 className="text-xl font-semibold text-indigo-900 mb-2">No services found</h3>
              <p className="text-indigo-500">Try adjusting your search or filter criteria.</p>
              <Button
                variant="link"
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("all");
                }}
                className="mt-4 text-indigo-600"
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

// Individual Service Card Component
function ServiceCard({ service }) {
  const {
    id,
    name,
    description,
    organization,
    category,
    price,
    rating = 4.8,
    imageUrl,
    location,
  } = service;

  const orgName = organization?.name || service.provider || "Service Provider";
  const orgLocation = location || organization?.address || "Addis Ababa, Ethiopia";

  return (
    <Card className="group overflow-hidden border-indigo-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden bg-indigo-100">
        <img
          src={imageUrl || fallbackImage}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {category && (
          <Badge className="absolute top-3 left-3 bg-white/90 text-indigo-700 border-none">
            {category}
          </Badge>
        )}
        {price && (
          <Badge className="absolute top-3 right-3 bg-indigo-600 text-white">
            From {price} ETB
          </Badge>
        )}
      </div>

      <CardContent className="p-5">
        <h3 className="text-xl font-semibold text-indigo-950 mb-2 line-clamp-1">
          {name}
        </h3>
        <p className="text-indigo-600 text-sm mb-3 line-clamp-2">{description}</p>

        {/* Provider & Location */}
        <div className="flex items-center gap-3 text-sm text-indigo-500 mb-3">
          <div className="flex items-center gap-1">
            <Store className="h-3.5 w-3.5" />
            <span className="truncate">{orgName}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            <span className="truncate">{orgLocation}</span>
          </div>
        </div>

        {/* Rating & Book Button */}
        <div className="flex items-center justify-between pt-2 border-t border-indigo-100">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium text-indigo-900">{rating}</span>
            <span className="text-indigo-400 text-xs">(120+ reviews)</span>
          </div>
          <Link href={`/services/${id}`} passHref>
            <Button
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-700 text-white gap-1 group/btn"
            >
              Book Now
              <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

// Mock data (remove when real API is integrated)
const mockServices = [
  {
    id: "1",
    name: "Haircut - Classic",
    description: "Traditional haircut with scissors. Precision cutting tailored to your style.",
    category: "beauty",
    price: 250,
    rating: 4.9,
    provider: "Nati Barber Shop",
    location: "Yeka, Addis Abeba",
    imageUrl: "https://images.unsplash.com/photo-1585747860714-2ba1b4b3b4f0?w=800&auto=format",
  },
  {
    id: "2",
    name: "Haircut - Modern Fade",
    description: "Trendy fade haircut with clippers. Clean, sharp, and stylish.",
    category: "beauty",
    price: 300,
    rating: 4.8,
    provider: "Nati Barber Shop",
    location: "Yeka, Addis Abeba",
    imageUrl: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800&auto=format",
  },
  {
    id: "3",
    name: "Beard Trim & Shape",
    description: "Professional beard grooming. Shape, trim, and line up.",
    category: "beauty",
    price: 150,
    rating: 4.7,
    provider: "Nati Barber Shop",
    location: "Yeka, Addis Abeba",
    imageUrl: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800&auto=format",
  },
  {
    id: "4",
    name: "Hair Coloring",
    description: "Full hair coloring treatment with premium products. Vibrant, long-lasting color.",
    category: "beauty",
    price: 800,
    rating: 4.9,
    provider: "Nati Barber Shop",
    location: "Yeka, Addis Abeba",
    imageUrl: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&auto=format",
  },
  {
    id: "5",
    name: "Engine Diagnostics",
    description: "Complete engine check with advanced tools. Identify issues quickly.",
    category: "automotive",
    price: 500,
    rating: 4.8,
    provider: "AutoCare Center",
    location: "Bole, Addis Abeba",
    imageUrl: "https://images.unsplash.com/photo-1487754180451-4561e8f3c3f3?w=800&auto=format",
  },
  {
    id: "6",
    name: "General Checkup",
    description: "Full physical examination by experienced doctors.",
    category: "healthcare",
    price: 1200,
    rating: 4.9,
    provider: "St. Paul Hospital",
    location: "Gulele, Addis Abeba",
    imageUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format",
  },
];