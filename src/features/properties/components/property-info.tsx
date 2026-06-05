import { Bath, BedDouble, CalendarDays, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { PropertyDetail } from "@/features/properties/types";
import { formatPrice } from "@/lib/format-price";

const postedDateFormatter = new Intl.DateTimeFormat("en-NG", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

function getPostedDate(value: string) {
  return postedDateFormatter.format(new Date(value));
}

export function PropertyInfo({ property }: { property: PropertyDetail }) {
  const locationLabel = property.location
    ? `${property.location.city}, ${property.location.state}`
    : "Location available soon";

  return (
    <article className="grid gap-8">
      <header className="grid gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="outline">{property.propertyType}</Badge>
          <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
            <CalendarDays className="size-4" />
            Posted {getPostedDate(property.createdAt)}
          </span>
        </div>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {property.title}
          </h1>
          <p className="mt-3 flex items-center gap-2 text-base text-muted-foreground">
            <MapPin className="size-4 shrink-0" />
            <span>{locationLabel}</span>
          </p>
        </div>
        <div className="flex flex-col gap-4 border-y border-border py-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-2xl font-semibold tracking-tight">
            {formatPrice(property.price, property.rentPeriod)}
          </p>
          <div className="flex items-center gap-5 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <BedDouble className="size-4" />
              {property.bedrooms ? `${property.bedrooms} bedrooms` : "Studio"}
            </span>
            <span className="inline-flex items-center gap-2">
              <Bath className="size-4" />
              {property.bathrooms
                ? `${property.bathrooms} bathrooms`
                : "Bathrooms listed soon"}
            </span>
          </div>
        </div>
      </header>

      <section className="grid gap-3">
        <h2 className="text-xl font-semibold tracking-tight">
          About this home
        </h2>
        {property.description ? (
          <p className="whitespace-pre-line leading-8 text-muted-foreground">
            {property.description}
          </p>
        ) : (
          <p className="leading-8 text-muted-foreground">
            The landlord has not added a full description yet.
          </p>
        )}
      </section>

      {property.amenities.length > 0 ? (
        <section className="grid gap-3">
          <h2 className="text-xl font-semibold tracking-tight">Amenities</h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {property.amenities.map((amenity) => (
              <li
                className="rounded-md border border-border bg-card px-4 py-3 text-sm"
                key={amenity}
              >
                {amenity}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  );
}
