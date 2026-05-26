"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CalendarDays,
  Clock,
  CheckCircle,
  Star,
  FileText,
  Download,
  Search,
  Filter,
  ChevronRight,
} from "lucide-react";
import RequestHandler from "@/lib/request-handler";
import Link from "next/link";

export default function ServiceHistoryPage() {
  const [completedServices, setCompletedServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all"); // 'all', 'rated', 'unrated'

  useEffect(() => {
    fetchCompletedServices();
  }, []);

  const fetchCompletedServices = async () => {
    try {
      // Replace with your actual API endpoint that returns completed tasks
      const res = await RequestHandler.Get(
        "/query/v1/task?mine&status=completed&limit=50",
      );
      if (res.ok) {
        const { tasks } = await res.json();
        setCompletedServices(tasks || []);
      } else {
        // Fallback mock data – remove when API ready
        setCompletedServices(mockCompletedServices);
      }
    } catch (error) {
      console.error("Failed to fetch service history:", error);
      setCompletedServices(mockCompletedServices);
    } finally {
      setLoading(false);
    }
  };

  const handleRateService = async (serviceId, rating) => {
    // Call your rating API
    const res = await RequestHandler.Post(`/api/v1/task/${serviceId}/rate`, {
      body: { rating },
    });
    if (res.ok) {
      // Update local state
      setCompletedServices((prev) =>
        prev.map((svc) =>
          svc.id === serviceId ? { ...svc, rating, rated: true } : svc,
        ),
      );
    }
  };

  const handleDownloadReceipt = (serviceId) => {
    // Download receipt logic
    window.open(`/api/v1/task/${serviceId}/receipt`, "_blank");
  };

  const filteredServices = completedServices.filter((service) => {
    const matchesSearch =
      service.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.organization?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
    if (filter === "rated") return matchesSearch && service.rated;
    if (filter === "unrated") return matchesSearch && !service.rated;
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-indigo-950">Service History</h1>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-64 mb-4" />
                <div className="flex gap-4">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-8 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-indigo-950">
            Service History
          </h1>
          <p className="text-indigo-600">
            View all your completed services and receipts
          </p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-400" />
            <Input
              placeholder="Search by service or provider..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-64 border-indigo-200"
            />
          </div>
        </div>
      </div>

      <Tabs defaultValue="all" onValueChange={setFilter} className="space-y-6">
        <TabsList className="bg-indigo-50/50 border-indigo-100">
          <TabsTrigger value="all">All Services</TabsTrigger>
          <TabsTrigger value="rated">Rated</TabsTrigger>
          <TabsTrigger value="unrated">Need Rating</TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="space-y-4">
          {filteredServices.length === 0 ? (
            <Card className="border-indigo-100">
              <CardContent className="p-12 text-center">
                <FileText className="h-12 w-12 text-indigo-300 mx-auto mb-3" />
                <p className="text-indigo-600">No completed services found.</p>
              </CardContent>
            </Card>
          ) : (
            filteredServices.map((service) => (
              <ServiceHistoryCard
                key={service.id}
                service={service}
                onRate={handleRateService}
                onDownloadReceipt={handleDownloadReceipt}
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Individual service card component
function ServiceHistoryCard({ service, onRate, onDownloadReceipt }) {
  const [showRating, setShowRating] = useState(false);
  const [selectedRating, setSelectedRating] = useState(service.rating || 0);

  const completedDate = service.completedAt
    ? new Date(service.completedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Date not available";

  const handleSubmitRating = () => {
    if (selectedRating > 0) {
      onRate(service.id, selectedRating);
      setShowRating(false);
    }
  };

  return (
    <Card className="border-indigo-100 hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-wrap justify-between items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap mb-2">
              <h3 className="text-xl font-semibold text-indigo-950">
                {service.name}
              </h3>
              <Badge className="bg-green-100 text-green-700 border-green-200">
                <CheckCircle className="h-3 w-3 mr-1" />
                Completed
              </Badge>
              {service.rated && (
                <Badge
                  variant="outline"
                  className="border-yellow-400 text-yellow-700"
                >
                  <Star className="h-3 w-3 mr-1 fill-yellow-400" />
                  Rated {service.rating}
                </Badge>
              )}
            </div>
            <p className="text-indigo-600 mb-2">{service.description}</p>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-indigo-500">
              <div className="flex items-center gap-1">
                <CalendarDays className="h-4 w-4" />
                <span>Completed: {completedDate}</span>
              </div>
              {/* <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>Duration: {service.duration || "N/A"}</span>
              </div> */}
            </div>
            <div className="mt-3 text-sm">
              <span className="font-medium text-indigo-800">Provider:</span>{" "}
              <span className="text-indigo-600">
                {service.organization?.name || "ServeSync+"}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2 min-w-[140px]">
            {!service.rated ? (
              <>
                {showRating ? (
                  <div className="space-y-2">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setSelectedRating(star)}
                          className="focus:outline-none"
                        >
                          <Star
                            className={`h-6 w-6 ${
                              star <= selectedRating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-indigo-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={handleSubmitRating}
                        className="bg-indigo-600"
                      >
                        Submit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowRating(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1 border-indigo-200 text-indigo-700"
                    onClick={() => setShowRating(true)}
                  >
                    <Star className="h-4 w-4" />
                    Rate Service
                  </Button>
                )}
              </>
            ) : null}
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-indigo-600"
              onClick={() => onDownloadReceipt(service.id)}
            >
              <Download className="h-4 w-4" />
              Receipt
            </Button>
            <Button
              variant="link"
              size="sm"
              className="gap-1 text-indigo-600"
              asChild
            >
              <Link href={`/dashboard/client/appointments/${service.id}`}>
                View Details <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Mock data – remove when real API is ready
const mockCompletedServices = [
  {
    id: "1",
    name: "Car Engine Diagnostics",
    description: "Full diagnostic check with report",
    organization: { name: "AutoCare Center" },
    completedAt: "2025-04-20T10:30:00Z",
    duration: "45 min",
    rated: false,
    rating: null,
  },
  {
    id: "2",
    name: "Haircut - Modern Fade",
    description: "Trendy fade with beard trim",
    organization: { name: "Nati Barber Shop" },
    completedAt: "2025-04-15T14:00:00Z",
    duration: "30 min",
    rated: true,
    rating: 5,
  },
];
