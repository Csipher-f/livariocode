import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getPublishedPropertyById } from "@/features/properties/actions/get-property";
import { getPublishedPropertyReviews } from "@/features/properties/actions/get-property-reviews";
import { LandlordCard } from "@/features/properties/components/landlord-card";
import { PropertyInfo } from "@/features/properties/components/property-info";
import { PropertyReviews } from "@/features/properties/components/property-reviews";
import { createPageMetadata } from "@/lib/metadata";
import { getCurrentUser } from "@/supabase/auth";

const PropertyGallery = dynamic(
  () =>
    import("@/features/properties/components/property-gallery").then(
      (module) => module.PropertyGallery
    ),
  {
    loading: () => (
      <div className="grid gap-3">
        <Skeleton className="aspect-[4/3] rounded-md sm:aspect-[16/9]" />
        <div className="flex gap-2 overflow-hidden">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton className="h-20 w-28 shrink-0 rounded-md" key={index} />
          ))}
        </div>
      </div>
    ),
  }
);

type PropertyPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({
  params,
}: PropertyPageProps): Promise<Metadata> {
  const { id } = await params;
  const property = await getPublishedPropertyById(id);

  if (!property) {
    return createPageMetadata({
      title: "Listing not found",
      description: "This Livario listing is no longer available.",
    });
  }

  const description =
    property.description ??
    `${property.propertyType} in ${
      property.location
        ? `${property.location.city}, ${property.location.state}`
        : "Nigeria"
    } available on Livario.`;

  return createPageMetadata({
    title: property.title,
    description,
    image: property.images[0]?.imageUrl,
    type: "article",
  });
}

export default async function PropertyDetailPage({
  params,
}: PropertyPageProps) {
  const { id } = await params;
  const [property, reviewsSummary, user] = await Promise.all([
    getPublishedPropertyById(id),
    getPublishedPropertyReviews(id),
    getCurrentUser(),
  ]);

  if (!property) {
    notFound();
  }

  return (
    <main className="bg-secondary/30">
      <section className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div>
          <Button asChild size="sm" variant="ghost">
            <Link href="/listings">
              <ArrowLeft className="size-4" />
              Back to listings
            </Link>
          </Button>
        </div>

        <PropertyGallery images={property.images} title={property.title} />

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          <div className="grid gap-8">
            <PropertyInfo property={property} />
            <PropertyReviews reviewsSummary={reviewsSummary} />
          </div>
          <LandlordCard isAuthenticated={Boolean(user)} property={property} />
        </div>
      </section>
    </main>
  );
}
