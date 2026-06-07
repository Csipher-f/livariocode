import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Building2, ChevronLeft } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { getLandlordProfile } from "@/features/landlords/actions/get-landlord-profile";
import { PropertyCard } from "@/features/properties/components/property-card";
import { createPageMetadata } from "@/lib/metadata";

type LandlordPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const memberSinceFormatter = new Intl.DateTimeFormat("en-NG", {
  month: "long",
  year: "numeric",
});

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export async function generateMetadata({
  params,
}: LandlordPageProps): Promise<Metadata> {
  const { id } = await params;
  const data = await getLandlordProfile(id);

  if (!data) {
    return createPageMetadata({
      title: "Landlord Not Found",
      description: "This landlord profile is no longer available on Livario.",
    });
  }

  const name = data.profile.full_name || "Landlord";
  return createPageMetadata({
    title: `${name} — Landlord on Livario`,
    description: `Browse properties and published listings by ${name} on Livario. Find quality rent opportunities in Nigeria.`,
    image: data.profile.avatar_url || undefined,
  });
}

export default async function LandlordProfilePage({
  params,
}: LandlordPageProps) {
  const { id } = await params;
  const data = await getLandlordProfile(id);

  if (!data) {
    notFound();
  }

  const { profile, properties, totalCount } = data;
  const firstName = profile.full_name ? profile.full_name.split(" ")[0] : "Landlord";
  const memberSince = profile.created_at
    ? `Member since ${memberSinceFormatter.format(new Date(profile.created_at))}`
    : "";

  return (
    <main className="min-h-screen bg-[#FDFAF7]">
      {/* SECTION 1 — Profile header */}
      <section className="bg-[#FFF8F2] border-b border-[#E8DDD4]">
        <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6">
          {/* Breadcrumb / back navigation */}
          <Link
            href="/listings"
            className="flex items-center gap-1 text-sm text-[#8C7B6B] hover:text-[#1C1612] transition-colors mb-6 w-fit"
          >
            <ChevronLeft className="size-4" />
            Back to listings
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-6">
            <Avatar className="size-20">
              {profile.avatar_url ? (
                <AvatarImage alt={profile.full_name ?? ""} src={profile.avatar_url} />
              ) : null}
              <AvatarFallback className="text-xl bg-[#E8DDD4] text-[#1C1612]">
                {getInitials(profile.full_name ?? "") || "L"}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-semibold text-2xl text-[#1C1612]">
                  {profile.full_name ?? "Landlord"}
                </h1>
                <Badge
                  className="bg-[#FDE8DF] text-[#C44D28] border-0 hover:bg-[#FDE8DF] px-2.5 py-0.5 pointer-events-none"
                  variant="outline"
                >
                  {totalCount} listing(s)
                </Badge>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm text-[#8C7B6B]">
                <span>Landlord on Livario</span>
                <span className="hidden sm:inline text-[#E8DDD4]">•</span>
                <span>{memberSince}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 — Listings grid */}
      <section className="max-w-5xl mx-auto px-4 py-8 sm:px-6">
        <h2 className="font-semibold text-xl text-[#1C1612] mb-6">
          Properties by {firstName}
        </h2>

        {properties.length === 0 ? (
          <EmptyState
            icon={Building2}
            title="No listings yet"
            description="This landlord has no published properties at the moment."
          />
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                isAuthenticated={false}
                property={property}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
