import { Building2 } from "lucide-react";

import { EmptyState } from "@/components/ui/empty-state";
import { PropertyCard } from "@/features/properties/components/property-card";
import type { PropertyListing } from "@/features/properties/types";

export function PropertyGrid({
  properties,
}: {
  properties: PropertyListing[];
}) {
  if (properties.length === 0) {
    return (
      <EmptyState
        className="min-h-80 rounded-3xl bg-background"
        description="Try a different city, property type, price range, or bedroom count."
        icon={Building2}
        title="No listings match these filters yet"
      />
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}
