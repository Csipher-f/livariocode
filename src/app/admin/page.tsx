import type { Metadata } from "next";
import { Building2, Inbox, Star, UserPlus, Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminOverviewStats } from "@/features/admin/actions/get-admin-data";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Admin Overview",
  description: "Livario platform administration overview.",
  canonical: "/admin",
});

const numberFormatter = new Intl.NumberFormat("en-NG");

export default async function AdminOverviewPage() {
  const stats = await getAdminOverviewStats();
  const cards = [
    {
      label: "Published properties",
      value: stats.totalPublishedProperties,
      icon: Building2,
    },
    {
      label: "Total users",
      value: stats.totalUsers,
      icon: Users,
    },
    {
      label: "Total inquiries",
      value: stats.totalInquiries,
      icon: Inbox,
    },
    {
      label: "New users this week",
      value: stats.newUsersThisWeek,
      icon: UserPlus,
    },
    {
      label: "Pending reviews",
      value: stats.pendingReviews,
      icon: Star,
    },
  ];

  return (
    <main className="mx-auto grid w-full max-w-7xl gap-8 overflow-x-hidden px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <p className="text-sm font-medium text-muted-foreground">
          Platform administration
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl text-[#1C1612]">
          Overview
        </h1>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <Card key={card.label}>
              <CardHeader className="flex flex-row items-center justify-between gap-3 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.label}
                </CardTitle>
                <Icon className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-semibold tracking-tight">
                  {numberFormatter.format(card.value)}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </section>
    </main>
  );
}
