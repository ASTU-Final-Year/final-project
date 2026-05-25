import { ChevronRight, MapPin, Star, Store } from "lucide-react";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import Link from "next/link";
import { fallbackServiceImage } from "@/lib/constants";

// Fallback image for services
const fallbackImage = fallbackServiceImage;

// Individual Service Card Component
export default function ServiceCard({ service }) {
  const {
    id,
    name,
    description,
    organization,
    price,
    rating = 1,
    imageUrl,
    location,
  } = service;

  const sector = organization.sector;

  const orgName = organization?.name || service.provider || "Service Provider";
  const orgLocation =
    location || organization?.address || "Addis Ababa, Ethiopia";
  return (
    <Card className="pt-0 group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ring-1 ring-primary/10 border-7 border-border/60">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden bg-indigo-100">
        <img
          src={imageUrl || fallbackImage}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <CardContent className="px-5 pb-4">
        <div className="flex gap-2 justify-between">
          {sector && <Badge variant="outline">{sector}</Badge>}
          {price && (
            <Badge className="p-2 py-3 bg-transparent shadow-none text-primary text-lg">
              {price === 0 ? "Free" : `${price} Birr`}
            </Badge>
          )}
        </div>
        <h3 className="text-xl font-semibold mb-2 line-clamp-1">{name}</h3>
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
          {description}
        </p>

        {/* Provider & Location */}
        <div className="flex items-center gap-3 text-sm  mb-3">
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
            <span className="font-medium ">{rating}</span>
            {/* <span className=" text-xs">(120+ reviews)</span> */}
          </div>
          <Button
            size="sm"
            className="bg-primary hover:bg-primary text-white gap-1 group/btn"
            asChild
          >
            <Link href={`/service/${id}`}>
              Book Now
              <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
