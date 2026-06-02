import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ListingsFilters } from "@/features/properties/components/listings-filters";
import { PropertyGrid } from "@/features/properties/components/property-grid";
import { SearchBar } from "@/features/properties/components/search-bar";
import {
  getPublishedProperties,
  parsePropertyFilters,
} from "@/features/properties/actions/get-properties";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Browse Listings",
  description:
    "Browse published Livario property listings by city, property type, bedrooms, and price.",
  canonical: "/listings",
});

type ListingsPageProps = {
  searchParams: Promise<{
    city?: string | string[];
    type?: string | string[];
    min_price?: string | string[];
    max_price?: string | string[];
    bedrooms?: string | string[];
    page?: string | string[];
  }>;
};

function buildPageHref(
  searchParams: Awaited<ListingsPageProps["searchParams"]>,
  page: number
) {
  const params = new URLSearchParams();

  Object.entries(searchParams).forEach(([key, value]) => {
    const normalizedValue = Array.isArray(value) ? value[0] : value;

    if (normalizedValue && key !== "page") {
      params.set(key, normalizedValue);
    }
  });

  if (page > 1) {
    params.set("page", String(page));
  }

  const queryString = params.toString();

  return queryString ? `/listings?${queryString}` : "/listings";
}

export default async function ListingsPage({
  searchParams,
}: ListingsPageProps) {
  const resolvedSearchParams = await searchParams;
  const filters = parsePropertyFilters(resolvedSearchParams);
  const result = await getPublishedProperties(filters);
  const hasPreviousPage = result.page > 1;
  const hasNextPage = result.page < result.totalPages;
  const resultLabel =
    result.totalCount === 1 ? "1 home found" : `${result.totalCount} homes found`;
  const filterKey = JSON.stringify(filters);

  return (
    <main className="bg-secondary/30">
      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="mx-auto max-w-3xl text-center lg:mx-0 lg:text-left">
          <p className="text-sm font-medium text-muted-foreground">
            Property discovery
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
            Browse homes on Livario.
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Search published listings by city, property type, bedroom count, and
            monthly budget.
          </p>
        </div>

        <div className="mt-8 grid gap-5 lg:hidden">
          <SearchBar defaultCity={filters.city} />
          <ListingsFilters filters={filters} key={`mobile-${filterKey}`} />
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[280px_1fr]">
          <div className="hidden lg:block">
            <ListingsFilters filters={filters} key={`desktop-${filterKey}`} />
          </div>
          <div className="grid gap-6">
            <div className="hidden lg:block">
              <SearchBar defaultCity={filters.city} />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold tracking-tight">
                  Available homes
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {resultLabel}
                </p>
              </div>
            </div>

            <PropertyGrid
              isAuthenticated={result.isAuthenticated}
              properties={result.properties}
            />

            {result.totalPages > 1 ? (
              <nav
                aria-label="Listings pagination"
                className="flex items-center justify-between gap-3 pt-2"
              >
                {hasPreviousPage ? (
                  <Button asChild variant="outline">
                    <Link
                      href={buildPageHref(
                        resolvedSearchParams,
                        result.page - 1
                      )}
                    >
                      <ArrowLeft />
                      Previous
                    </Link>
                  </Button>
                ) : (
                  <Button disabled variant="outline">
                    <ArrowLeft />
                    Previous
                  </Button>
                )}
                <p className="text-sm text-muted-foreground">
                  Page {result.page} of {result.totalPages}
                </p>
                {hasNextPage ? (
                  <Button asChild variant="outline">
                    <Link
                      href={buildPageHref(
                        resolvedSearchParams,
                        result.page + 1
                      )}
                    >
                      Next
                      <ArrowRight />
                    </Link>
                  </Button>
                ) : (
                  <Button disabled variant="outline">
                    Next
                    <ArrowRight />
                  </Button>
                )}
              </nav>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}
