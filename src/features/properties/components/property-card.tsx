import Image from "next/image";
import Link from "next/link";
import { Bath, BedDouble, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { FavoriteButton } from "@/features/favorites/components/favorite-button";
import type { PropertyListing } from "@/features/properties/types";
import { formatPrice } from "@/features/properties/utils/format-price";
import { getCurrentUser } from "@/supabase/auth";

const fallbackImage = "/images/listings/listing-1.svg";

function getImageSource(imageUrl: string | null) {
  return imageUrl || fallbackImage;
}

function isRemoteImage(imageUrl: string) {
  return imageUrl.startsWith("http://") || imageUrl.startsWith("https://");
}

export async function PropertyCard({
  property,
}: {
  property: PropertyListing;
}) {
  const user = await getCurrentUser();
  const imageSource = getImageSource(property.primaryImageUrl);
  const locationLabel = property.location
    ? `${property.location.city}, ${property.location.state}`
    : "Location available soon";

  return (
    <Card className="group overflow-hidden border-border/80 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      <div className="relative">
        <Link
          aria-label={`View ${property.title}`}
          className="block"
          href={`/listings/${property.id}`}
        >
          <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
            <Image
              alt=""
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              fill
              priority={false}
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              src={imageSource}
              unoptimized={isRemoteImage(imageSource)}
            />
          </div>
        </Link>
        <Badge
          className="absolute left-3 top-3 bg-background/90 text-foreground shadow-sm backdrop-blur"
          variant="outline"
        >
          {property.propertyType}
        </Badge>
        <FavoriteButton
          className="absolute right-3 top-3 rounded-full bg-background/90 shadow-sm backdrop-blur hover:bg-background"
          initialIsFavorited={Boolean(property.isFavorited)}
          isAuthenticated={Boolean(user)}
          propertyId={property.id}
        />
      </div>
      <CardContent className="p-4">
        <Link className="block" href={`/listings/${property.id}`}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="truncate font-semibold tracking-tight">
                {property.title}
              </h2>
              <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="size-3.5 shrink-0" />
                <span className="truncate">{locationLabel}</span>
              </p>
            </div>
            <p className="shrink-0 text-right text-sm font-semibold">
              {formatPrice(property.price)}
              <span className="block text-xs font-normal text-muted-foreground">
                / month
              </span>
            </p>
          </div>
          <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex min-h-8 items-center gap-1.5">
              <BedDouble className="size-4" />
              {property.bedrooms ? `${property.bedrooms} beds` : "Studio"}
            </span>
            <span className="flex min-h-8 items-center gap-1.5">
              <Bath className="size-4" />
              {property.bathrooms
                ? `${property.bathrooms} baths`
                : "Baths listed soon"}
            </span>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}
