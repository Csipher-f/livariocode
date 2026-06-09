import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, Heart, Inbox, Search } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { getFavoriteProperties } from "@/features/favorites/actions/get-favorites";
import {
  getTenantInquiries,
  getTenantInquiryCount,
  type TenantInquiry,
} from "@/features/inquiries/actions/get-tenant-inquiries";
import { PropertyCard } from "@/features/properties/components/property-card";
import { getCurrentProfile, requireUser } from "@/supabase/auth";
import type { InquiryStatus } from "@/types/database";

export const metadata: Metadata = {
  title: "Tenant Dashboard",
  description: "Review your saved listings and sent inquiries on Livario.",
};

const dateFormatter = new Intl.DateTimeFormat("en-NG", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

function getFirstName(fullName: string | null) {
  return fullName?.trim().split(/\s+/)[0] ?? "there";
}

function getStatusVariant(status: InquiryStatus) {
  if (status === "pending") return "warning";
  if (status === "responded") return "success";
  if (status === "closed") return "secondary";
  return "outline";
}

function SummaryCard({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
}) {
  return (
    <Card className="w-full min-w-0 flex-1">
      <CardContent className="flex items-center justify-between gap-2 p-4">
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs text-muted-foreground sm:text-sm">
            {label}
          </p>
          <p className="mt-1 text-2xl font-semibold tracking-tight sm:mt-2 sm:text-3xl truncate">
            {value}
          </p>
        </div>
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-muted-foreground sm:size-11">
          <Icon className="size-4 sm:size-5" />
        </div>
      </CardContent>
    </Card>
  );
}

function RecentInquiryList({ inquiries }: { inquiries: TenantInquiry[] }) {
  if (inquiries.length === 0) {
    return (
      <EmptyState
        className="min-h-64 bg-background"
        description="Messages you send to landlords will show here."
        icon={Inbox}
        title="No inquiries sent"
      />
    );
  }

  return (
    <div className="grid gap-3 w-full min-w-0">
      {inquiries.map((inquiry) => (
        <Link
          className="block rounded-md border border-border p-3 transition hover:bg-muted/50 w-full min-w-0"
          href={`/listings/${inquiry.propertyId}`}
          key={inquiry.id}
        >
          {/* FIXED: Added min-w-0 to anchor layout calculation limits for Chrome */}
          <div className="flex items-start justify-between gap-3 w-full min-w-0">
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-sm sm:text-base">
                {inquiry.propertyTitle}
              </p>
              <p className="mt-1 line-clamp-2 text-xs sm:text-sm text-muted-foreground break-words">
                {inquiry.message}
              </p>
            </div>
            <Badge
              variant={getStatusVariant(inquiry.status)}
              className="shrink-0 capitalize"
            >
              {inquiry.status}
            </Badge>
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            {dateFormatter.format(new Date(inquiry.createdAt))}
          </p>
        </Link>
      ))}
    </div>
  );
}

export default async function TenantDashboardPage() {
  const user = await requireUser();
  const profile = await getCurrentProfile();

  if (!profile) redirect("/onboarding");
  if (profile.active_role !== "tenant") redirect("/dashboard");

  const [savedResult, recentInquiries, inquiryCount] = await Promise.all([
    getFavoriteProperties({ page: 1, userId: user.id }),
    getTenantInquiries({ tenantId: user.id, limit: 3 }),
    getTenantInquiryCount(user.id),
  ]);
  const recentSavedListings = savedResult.properties.slice(0, 3);
  const hasActivity = savedResult.totalCount > 0 || inquiryCount > 0;

  return (
    /* FIXED: Main frame structural change to flex column layout */
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 overflow-x-hidden px-4 py-8 box-border sm:px-6 lg:px-8">
      {/* Dynamic Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between w-full min-w-0">
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted-foreground">
            Tenant dashboard
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-4xl truncate">
            Welcome back, {getFirstName(profile.full_name)}.
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-muted-foreground break-words">
            Keep track of homes you like and conversations you have started.
          </p>
        </div>
        <div className="flex flex-col gap-3 xs:flex-row sm:flex-row shrink-0">
          <Button asChild className="w-full xs:w-auto">
            <Link href="/listings">
              <Search className="size-4" />
              Browse Listings
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full xs:w-auto">
            <Link href="/dashboard/tenant/saved">View Saved</Link>
          </Button>
        </div>
      </div>

      {/* Metric Stat Blocks */}
      <div className="grid grid-cols-2 gap-3 w-full min-w-0">
        <SummaryCard
          icon={Heart}
          label="Saved Listings"
          value={savedResult.totalCount}
        />
        <SummaryCard icon={Inbox} label="Inquiries Sent" value={inquiryCount} />
      </div>

      {hasActivity ? (
        /* Structural columns configuration block */
        <div className="grid gap-6 w-full min-w-0 lg:grid-cols-[1fr_380px]">
          {/* Recent Saved Properties block */}
          <Card className="w-full min-w-0">
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <CardTitle className="text-lg sm:text-xl truncate">
                Recent saved listings
              </CardTitle>
              <Button asChild size="sm" variant="outline" className="shrink-0">
                <Link href="/dashboard/tenant/saved">
                  View all
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="w-full min-w-0">
              {recentSavedListings.length > 0 ? (
                <div className="grid gap-5 grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 w-full min-w-0">
                  {recentSavedListings.map((property, index) => (
                    <div key={property.id} className="w-full min-w-0">
                      <PropertyCard
                        isAuthenticated
                        priority={index === 0}
                        property={property}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  className="min-h-64 bg-background"
                  description="Save homes while browsing to compare them here."
                  icon={Heart}
                  title="No saved listings yet"
                />
              )}
            </CardContent>
          </Card>

          {/* Recent Tenant Outgoing Inquiries block */}
          <Card className="w-full min-w-0">
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <CardTitle className="text-lg sm:text-xl truncate">
                Recent inquiries
              </CardTitle>
              <Button asChild size="sm" variant="outline" className="shrink-0">
                <Link href="/dashboard/tenant/inquiries">
                  View all
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="w-full min-w-0">
              <RecentInquiryList inquiries={recentInquiries} />
            </CardContent>
          </Card>
        </div>
      ) : (
        <EmptyState
          action={
            <Button asChild>
              <Link href="/listings">Browse listings</Link>
            </Button>
          }
          className="min-h-96 bg-background"
          description="Start by browsing homes. Saved listings and inquiry updates will appear here."
          icon={Search}
          title="No activity yet"
        />
      )}
    </main>
  );
}
