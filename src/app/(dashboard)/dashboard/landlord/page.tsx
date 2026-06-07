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
    <Card className="w-full min-w-0">
      <CardContent className="flex items-center justify-between gap-2 p-4">
        <div className="min-w-0">
          <p className="truncate text-xs text-muted-foreground sm:text-sm">
            {label}
          </p>
          <p className="mt-1 text-2xl font-semibold tracking-tight sm:mt-2 sm:text-3xl">
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

export default async function LandlordDashboardPage() {
  const { user } = await requireRole({ allowedRoles: ["landlord"] });
  const [propertyResult, inquiries, inquiryCount] = await Promise.all([
    getLandlordProperties(user.id),
    getReceivedInquiries({ landlordId: user.id, limit: 3 }),
    getReceivedInquiryCount(user.id),
  ]);
  const hasProperties = propertyResult.properties.length > 0;

  return (
    <main className="mx-auto grid w-full max-w-7xl gap-8 overflow-x-hidden px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Landlord dashboard
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Manage your rentals.
          </h1>
        </div>
        <Button asChild className="w-full sm:w-auto">
          <Link href="/dashboard/landlord/properties/new">
            <Plus className="size-4" />
            Add New Property
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
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
        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <CardTitle>Recent properties</CardTitle>
              <Button asChild size="sm" variant="outline">
                <Link href="/dashboard/landlord/properties">View all</Link>
              </Button>
            </CardHeader>
            <CardContent className="grid gap-3">
              {propertyResult.properties.slice(0, 5).map((property) => (
                <div
                  className="flex items-center justify-between gap-4 rounded-md border border-border p-3"
                  key={property.id}
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">{property.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {property.location
                        ? `${property.location.city}, ${property.location.state}`
                        : "Location pending"}
                    </p>
                  </div>
                  <Badge
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

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <CardTitle>Recent inquiries</CardTitle>
              <Button asChild size="sm" variant="outline">
                <Link href="/dashboard/landlord/inquiries">View all</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {inquiries.length > 0 ? (
                <InquiryList inquiries={inquiries} />
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
