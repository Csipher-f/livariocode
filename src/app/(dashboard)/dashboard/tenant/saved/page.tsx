import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Heart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { getFavoriteProperties } from "@/features/favorites/actions/get-favorites";
import { PropertyGrid } from "@/features/properties/components/property-grid";
import { requireUser } from "@/supabase/auth";

export const metadata: Metadata = {
  title: "Saved Listings",
  description: "View property listings you have saved on Livario.",
};

type SavedListingsPageProps = {
  searchParams: Promise<{
    page?: string | string[];
  }>;
};

function getPageParam(value: string | string[] | undefined) {
  const rawValue = Array.isArray(value) ? value[0] : value;
  const parsedValue = Number(rawValue);

  return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : 1;
}

function buildPageHref(page: number) {
  return page > 1
    ? `/dashboard/tenant/saved?page=${page}`
    : "/dashboard/tenant/saved";
}

export default async function SavedListingsPage({
  searchParams,
}: SavedListingsPageProps) {
  const user = await requireUser();
  const resolvedSearchParams = await searchParams;
  const page = getPageParam(resolvedSearchParams.page);
  const result = await getFavoriteProperties({
    page,
    userId: user.id,
  });
  const hasPreviousPage = result.page > 1;
  const hasNextPage = result.page < result.totalPages;

  return (
    <main className="bg-secondary/30">
      <section className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Tenant dashboard
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Saved Listings
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              {result.totalCount === 1
                ? "1 saved home"
                : `${result.totalCount} saved homes`}
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/listings">
              <ArrowLeft className="size-4" />
              Browse listings
            </Link>
          </Button>
        </div>

        {result.properties.length > 0 ? (
          <>
            <PropertyGrid isAuthenticated properties={result.properties} />

            {result.totalPages > 1 ? (
              <nav
                aria-label="Saved listings pagination"
                className="flex items-center justify-between gap-3"
              >
                {hasPreviousPage ? (
                  <Button asChild variant="outline">
                    <Link href={buildPageHref(result.page - 1)}>
                      <ArrowLeft className="size-4" />
                      Previous
                    </Link>
                  </Button>
                ) : (
                  <Button disabled variant="outline">
                    <ArrowLeft className="size-4" />
                    Previous
                  </Button>
                )}
                <p className="text-sm text-muted-foreground">
                  Page {result.page} of {result.totalPages}
                </p>
                {hasNextPage ? (
                  <Button asChild variant="outline">
                    <Link href={buildPageHref(result.page + 1)}>
                      Next
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                ) : (
                  <Button disabled variant="outline">
                    Next
                    <ArrowRight className="size-4" />
                  </Button>
                )}
              </nav>
            ) : null}
          </>
        ) : (
          <EmptyState
            action={
              <Button asChild>
                <Link href="/listings">Browse listings</Link>
              </Button>
            }
            className="min-h-96 rounded-3xl bg-background"
            description="Save homes as you browse and they will appear here for quick access."
            icon={Heart}
            title="No saved listings yet"
          />
        )}
      </section>
    </main>
  );
}
