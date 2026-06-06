import Image from "next/image";
import Link from "next/link";
import { Bath, BedDouble, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { FavoriteButton } from "@/features/favorites/components/favorite-button";
import type { PropertyListing } from "@/features/properties/types";
import { formatPrice } from "@/lib/format-price";

const fallbackImage = "/images/listings/listing-1.svg";
const propertyBlurDataUrl =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNCIgaGVpZ2h0PSIzIiB2aWV3Qm94PSIwIDAgNCAzIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjMiIGZpbGw9IiNlNWU3ZWIiLz48L3N2Zz4=";

function getImageSource(imageUrl: string | null) {
  return imageUrl || fallbackImage;
}

export function PropertyCard({
  isAuthenticated,
  priority = false,
  property,
}: {
  isAuthenticated: boolean;
  priority?: boolean;
  property: PropertyListing;
}) {
  const imageSource = getImageSource(property.primaryImageUrl);
  const locationLabel = property.location
    ? `${property.location.city}, ${property.location.state}`
    : "Location pending";

  return (
    <Card className="group isolate overflow-hidden border border-border bg-card shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="relative">
        <Link
          aria-label={`View ${property.title}`}
          className="block"
          href={`/listings/${property.id}`}
        >
          <div className="relative aspect-4/3 overflow-hidden bg-secondary">
            <Image
              alt=""
              className="object-cover transition-transform duration-500 sm:group-hover:scale-[1.03]"
              fill
              placeholder="blur"
              blurDataURL={propertyBlurDataUrl}
              priority={priority}
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              src={imageSource}
            />
          </div>
        </Link>
        <Badge
          className="absolute left-2.5 top-2.5 text-[10px] sm:text-xs bg-[#FDE8DF] text-[#C44D28] border-0 hover:bg-[#FDE8DF] shadow-sm"
          variant="outline"
        >
          {property.propertyType}
        </Badge>
        <FavoriteButton
          className="absolute right-2.5 top-2.5 size-7 sm:size-8 rounded-full bg-background shadow-sm hover:bg-background"
          initialIsFavorited={Boolean(property.isFavorited)}
          isAuthenticated={isAuthenticated}
          propertyId={property.id}
        />
      </div>
      <CardContent className="p-3 sm:p-4">
        <Link className="block" href={`/listings/${property.id}`}>
          <div className="grid gap-1 min-w-0">
            <h2 className="truncate font-medium tracking-tight text-sm sm:text-base text-foreground">
              {property.title}
            </h2>
            <p className="flex items-center gap-1 text-sm text-foreground-muted">
              <MapPin className="size-3 sm:size-3.5 shrink-0 text-foreground-muted/70" />
              <span className="truncate">{locationLabel}</span>
            </p>
            <p className="mt-1 text-sm sm:text-base font-semibold text-[#E8623A]">
              {formatPrice(property.price, property.rentPeriod)}
            </p>
          </div>
          <div className="mt-3 flex items-center gap-3 text-sm text-foreground-muted border-t border-border/50 pt-2.5">
            <span className="flex items-center gap-1">
              <BedDouble className="size-3.5 text-foreground-muted/70" />
              {property.bedrooms ? `${property.bedrooms} beds` : "Studio"}
            </span>
            <span className="flex items-center gap-1">
              <Bath className="size-3.5 text-foreground-muted/70" />
              {property.bathrooms ? `${property.bathrooms} baths` : "Baths"}
            </span>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}
