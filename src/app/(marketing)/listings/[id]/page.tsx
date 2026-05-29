import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getPublishedPropertyById } from "@/features/properties/actions/get-property";
import { LandlordCard } from "@/features/properties/components/landlord-card";
import { PropertyGallery } from "@/features/properties/components/property-gallery";
import { PropertyInfo } from "@/features/properties/components/property-info";
import { getCurrentUser } from "@/supabase/auth";

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
    return {
      title: "Listing not found",
      description: "This Livario listing is no longer available.",
    };
  }

  const description =
    property.description ??
    `${property.propertyType} in ${
      property.location
        ? `${property.location.city}, ${property.location.state}`
        : "Nigeria"
    } available on Livario.`;

  return {
    title: property.title,
    description,
    openGraph: {
      title: property.title,
      description,
      images: property.images[0]?.imageUrl
        ? [{ url: property.images[0].imageUrl }]
        : undefined,
      type: "article",
    },
  };
}

export default async function PropertyDetailPage({
  params,
}: PropertyPageProps) {
  const { id } = await params;
  const [property, user] = await Promise.all([
    getPublishedPropertyById(id),
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
          <PropertyInfo property={property} />
          <LandlordCard isAuthenticated={Boolean(user)} property={property} />
        </div>
      </section>
    </main>
  );
}
