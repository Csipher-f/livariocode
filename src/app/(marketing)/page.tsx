import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Bath,
  BedDouble,
  Building2,
  Home,
  KeyRound,
  MapPin,
  MessageCircle,
  Search,
  Sparkles,
  Warehouse,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createPageMetadata } from "@/lib/metadata";
import { getPublishedProperties } from "@/features/properties/actions/get-properties";
import type { PropertyListing } from "@/features/properties/types";

export const revalidate = 300;

export const metadata: Metadata = createPageMetadata({
  title: "Find Your Next Home",
  description:
    "Discover premium apartments, houses, studios, and self-contained homes across Nigeria with Livario.",
});

const categories = [
  { label: "Apartment", icon: Building2 },
  { label: "House", icon: Home },
  { label: "Self-contain", icon: KeyRound },
  { label: "Studio", icon: Sparkles },
  { label: "Duplex", icon: Warehouse },
] as const;

const tenantSteps = [
  {
    title: "Search",
    description: "Explore homes by city, budget, and property type.",
    icon: Search,
  },
  {
    title: "Connect",
    description: "Reach out to verified landlords and property managers.",
    icon: MessageCircle,
  },
  {
    title: "Move in",
    description: "Choose the right home with clearer details from the start.",
    icon: KeyRound,
  },
] as const;

function FeaturedListingCard({
  priority = false,
  listing,
}: {
  priority?: boolean;
  listing: PropertyListing;
}) {
  return (
    <Link href={`/listings/${listing.id}`}>
      <Card className="scroll-fade overflow-hidden border-border/80 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
        <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
          {listing.primaryImageUrl ? (
            <Image
              alt={listing.title}
              className="object-cover"
              fill
              priority={priority}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              src={listing.primaryImageUrl}
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-secondary">
              <Home className="size-10 text-muted-foreground/30" />
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-semibold tracking-tight">{listing.title}</h3>
              {listing.location && (
                <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="size-3.5" />
                  {listing.location.city}, {listing.location.state}
                </p>
              )}
            </div>
            <p className="shrink-0 text-sm font-semibold">
              ₦{listing.price.toLocaleString()}
            </p>
          </div>
          <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
            {listing.bedrooms && (
              <span className="flex items-center gap-1.5">
                <BedDouble className="size-4" />
                {listing.bedrooms} bed{listing.bedrooms !== 1 ? "s" : ""}
              </span>
            )}
            {listing.bathrooms && (
              <span className="flex items-center gap-1.5">
                <Bath className="size-4" />
                {listing.bathrooms} bath{listing.bathrooms !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default async function MarketingHomePage() {
  const result = await getPublishedProperties({ page: 1 });
  const featuredListings = result.properties.slice(0, 6);

  return (
    <main>
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-x-0 top-0 -z-10 h-[34rem] bg-[radial-gradient(circle_at_50%_0%,oklch(0.94_0.02_190),transparent_58%)]" />
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 pb-16 pt-16 sm:px-6 sm:pb-20 sm:pt-20 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <Badge className="mb-5 bg-background/80 text-foreground shadow-sm backdrop-blur">
              Premium housing discovery
            </Badge>
            <h1 className="text-balance text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
              Find a home that feels right from the first look.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
              Livario brings a calmer, clearer way to discover rentals and list
              quality properties across Nigeria.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/listings">
                  Find your home
                  <ArrowRight />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/signup">List your property</Link>
              </Button>
            </div>
          </div>

          <div className="scroll-fade mx-auto grid w-full max-w-5xl gap-4 rounded-3xl border border-border/80 bg-background/80 p-3 shadow-xl shadow-primary/5 backdrop-blur md:grid-cols-3">
            <div className="rounded-2xl bg-secondary/70 p-5">
              <p className="text-3xl font-semibold">6</p>
              <p className="mt-1 text-sm text-muted-foreground">
                launch cities in focus
              </p>
            </div>
            <div className="rounded-2xl bg-secondary/70 p-5">
              <p className="text-3xl font-semibold">5</p>
              <p className="mt-1 text-sm text-muted-foreground">
                property categories
              </p>
            </div>
            <div className="rounded-2xl bg-secondary/70 p-5">
              <p className="text-3xl font-semibold">24/7</p>
              <p className="mt-1 text-sm text-muted-foreground">
                mobile-first discovery
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="search-heading"
        className="px-4 sm:px-6 lg:px-8"
      >
        <div className="scroll-fade mx-auto max-w-4xl rounded-3xl border border-border bg-card p-3 shadow-sm">
          <h2 className="sr-only" id="search-heading">
            Search homes by city
          </h2>
          <form
            action="/listings"
            className="grid gap-3 sm:grid-cols-[1fr_auto]"
            method="get"
          >
            <label className="sr-only" htmlFor="city">
              City or location
            </label>
            <Input
              className="h-13 rounded-2xl border-transparent bg-secondary/70 px-5 shadow-none"
              id="city"
              name="city"
              placeholder="Search by city or location"
              type="search"
            />
            <Button className="h-13 rounded-2xl px-6" type="submit">
              <Search />
              Search
            </Button>
          </form>
        </div>
      </section>

      {featuredListings.length > 0 && (
        <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Featured listings
                </p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                  Featured homes on Livario
                </h2>
              </div>
              <Button asChild variant="outline">
                <Link href="/listings">Browse all</Link>
              </Button>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featuredListings.map((listing, index) => (
                <FeaturedListingCard
                  key={listing.id}
                  listing={listing}
                  priority={index < 3}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-secondary/50 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-muted-foreground">
              Property types
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Search the way renters actually think.
            </h2>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {categories.map((category) => {
              const Icon = category.icon;

              return (
                <div
                  className="scroll-fade rounded-2xl border border-border/80 bg-background p-5 shadow-sm"
                  key={category.label}
                >
                  <Icon className="size-6 text-accent-foreground" />
                  <h3 className="mt-5 font-semibold">{category.label}</h3>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section
        className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
        id="how-it-works"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-medium text-muted-foreground">
              How it works
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Three simple steps for tenants.
            </h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {tenantSteps.map((step, index) => {
              const Icon = step.icon;

              return (
                <div
                  className="scroll-fade rounded-3xl border border-border bg-card p-6 shadow-sm"
                  key={step.title}
                >
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
                    <Icon className="size-5" />
                  </div>
                  <p className="mt-8 text-sm font-medium text-muted-foreground">
                    Step {index + 1}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold">{step.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8">
        <div className="scroll-fade mx-auto max-w-7xl overflow-hidden rounded-3xl bg-primary px-6 py-12 text-primary-foreground sm:px-10 lg:px-14">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-sm font-medium text-primary-foreground/70">
                For landlords
              </p>
              <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
                Put your property in front of renters looking with intent.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-6 text-primary-foreground/75 sm:text-base">
                Start with a clean listing flow built for quality photos, simple
                details, and better tenant conversations.
              </p>
            </div>
            <Button asChild size="lg" variant="secondary">
              <Link href="/signup">
                Start listing
                <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
