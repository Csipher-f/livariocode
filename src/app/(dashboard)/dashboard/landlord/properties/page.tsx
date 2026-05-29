import type { Metadata } from "next";
import Link from "next/link";
import { Building2, Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { getLandlordProperties } from "@/features/properties/actions/get-landlord-properties";
import { PropertyManagementActions } from "@/features/properties/components/property-management-actions";
import { formatPrice } from "@/features/properties/utils/format-price";
import { requireRole } from "@/supabase/auth";

export const metadata: Metadata = {
  title: "My Properties",
  description: "Manage your Livario property listings.",
};

const dateFormatter = new Intl.DateTimeFormat("en-NG", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export default async function LandlordPropertiesPage() {
  const { user } = await requireRole({ allowedRoles: ["landlord"] });
  const result = await getLandlordProperties(user.id);

  return (
    <main className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Property management
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            My Properties
          </h1>
        </div>
        <Button asChild>
          <Link href="/dashboard/landlord/properties/new">
            <Plus className="size-4" />
            Add property
          </Link>
        </Button>
      </div>

      {result.properties.length > 0 ? (
        <div className="grid gap-4">
          {result.properties.map((property) => (
            <article
              className="grid gap-4 rounded-md border border-border bg-card p-4 shadow-sm lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center"
              key={property.id}
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="truncate text-lg font-semibold tracking-tight">
                    {property.title}
                  </h2>
                  <Badge
                    variant={
                      property.status === "published"
                        ? "success"
                        : property.status === "draft"
                          ? "warning"
                          : "outline"
                    }
                  >
                    {property.status}
                  </Badge>
                </div>
                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
                  <span>{formatPrice(property.price)} / month</span>
                  <span>
                    Created {dateFormatter.format(new Date(property.createdAt))}
                  </span>
                  <span>
                    {property.location
                      ? `${property.location.city}, ${property.location.state}`
                      : "Location pending"}
                  </span>
                </div>
              </div>
              <PropertyManagementActions property={property} />
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          action={
            <Button asChild>
              <Link href="/dashboard/landlord/properties/new">
                Create first listing
              </Link>
            </Button>
          }
          className="min-h-96 bg-background"
          description="Create a property listing and publish it when it is ready."
          icon={Building2}
          title="No properties yet"
        />
      )}
    </main>
  );
}
