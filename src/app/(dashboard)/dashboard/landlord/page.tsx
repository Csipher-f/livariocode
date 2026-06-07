import type { Metadata } from "next";
import Link from "next/link";
import { Building2, FileText, Home, Inbox, Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import {
  getReceivedInquiries,
  getReceivedInquiryCount,
} from "@/features/inquiries/actions/get-inquiries";
import { InquiryList } from "@/features/inquiries/components/inquiry-list";
import { getLandlordProperties } from "@/features/properties/actions/get-landlord-properties";
import { requireRole } from "@/supabase/auth";

export const metadata: Metadata = {
  title: "Landlord Dashboard",
  description: "Manage Livario listings and inquiries.",
};

function SummaryCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Home;
  label: string;
  value: number;
}) {
  return (
    <Card className="w-full min-w-0 flex-1">
      <CardContent className="flex items-center justify-between gap-2 p-3 sm:p-4">
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs text-muted-foreground sm:text-sm">
            {label}
          </p>
          <p className="mt-1 text-xl font-semibold tracking-tight min-w-0 truncate sm:mt-2 sm:text-2xl md:text-3xl">
            {value}
          </p>
        </div>
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-muted-foreground sm:size-11">
          <Icon className="size-4 sm:size-5" />
        </div>
      </CardContent>
    </Card>
  );
}

export default async function LandlordDashboardPage() {
  const { user } = await requireRole({ allowedRoles: ["landlord"] });
  const [propertyResult, inquiries, inquiryCount] = await Promise.all([
    getLandlordProperties(user.id),
    getReceivedInquiries({ landlordId: user.id, limit: 3 }),
    getReceivedInquiryCount(user.id),
  ]);
  const hasProperties = propertyResult.properties.length > 0;

  return (
    /* FIXED: Changed from grid to flex-col to stop layout restriction glitches */
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 overflow-x-hidden px-4 py-8 box-border sm:px-6 lg:px-8">
      {/* Header section content */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between w-full min-w-0">
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted-foreground">
            Landlord dashboard
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-4xl min-w-0 wrap-break-word">
            Manage your rentals.
          </h1>
        </div>
        <Button asChild className="w-full sm:w-auto shrink-0">
          <Link href="/dashboard/landlord/properties/new">
            <Plus className="size-4" />
            Add New Property
          </Link>
        </Button>
      </div>

      {/* FIXED: Added grid-cols-1 for extra-small mobile viewports */}
      <div className="grid grid-cols-1 gap-3 xs:grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 w-full min-w-0">
        <SummaryCard
          icon={Building2}
          label="Total listings"
          value={propertyResult.stats.totalListings}
        />
        <SummaryCard
          icon={Home}
          label="Published"
          value={propertyResult.stats.publishedListings}
        />
        <SummaryCard
          icon={FileText}
          label="Drafts"
          value={propertyResult.stats.draftListings}
        />
        <SummaryCard icon={Inbox} label="Inquiries" value={inquiryCount} />
      </div>

      {hasProperties ? (
        <div className="grid gap-6 w-full min-w-0 lg:grid-cols-[1fr_380px]">
          {/* Recent properties item section */}
          <Card className="w-full min-w-0">
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <CardTitle className="text-lg sm:text-xl truncate">
                Recent properties
              </CardTitle>
              <Button asChild size="sm" variant="outline" className="shrink-0">
                <Link href="/dashboard/landlord/properties">View all</Link>
              </Button>
            </CardHeader>
            <CardContent className="grid gap-3 w-full min-w-0">
              {propertyResult.properties.slice(0, 5).map((property) => (
                <div
                  className="flex items-center justify-between gap-3 rounded-md border border-border p-3 w-full min-w-0"
                  key={property.id}
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-sm sm:text-base">
                      {property.title}
                    </p>
                    <p className="mt-1 text-xs sm:text-sm text-muted-foreground truncate">
                      {property.location
                        ? `${property.location.city}, ${property.location.state}`
                        : "Location pending"}
                    </p>
                  </div>
                  <Badge
                    className="shrink-0 text-[10px] sm:text-xs capitalize"
                    variant={
                      property.status === "published" ? "success" : "outline"
                    }
                  >
                    {property.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent inquiries card */}
          <Card className="w-full min-w-0">
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <CardTitle className="text-lg sm:text-xl truncate">
                Recent inquiries
              </CardTitle>
              <Button asChild size="sm" variant="outline" className="shrink-0">
                <Link href="/dashboard/landlord/inquiries">View all</Link>
              </Button>
            </CardHeader>
            <CardContent className="w-full min-w-0">
              {inquiries.length > 0 ? (
                <div className="w-full min-w-0 overflow-x-hidden">
                  <InquiryList inquiries={inquiries} />
                </div>
              ) : (
                <EmptyState
                  className="min-h-64 bg-background"
                  description="Tenant messages for your listings will show here."
                  icon={Inbox}
                  title="No inquiries yet"
                />
              )}
            </CardContent>
          </Card>
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
          description="Add your first property to start receiving tenant inquiries."
          icon={Building2}
          title="No properties yet"
        />
      )}
    </main>
  );
}
