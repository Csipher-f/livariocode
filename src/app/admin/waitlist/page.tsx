import type { Metadata } from "next";
import { Users2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getWaitlist } from "@/features/waitlist/actions/get-waitlist";
import { getWaitlistCount } from "@/features/waitlist/actions/get-waitlist-count";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Admin Waitlist",
  description: "Manage Livario waitlist entries.",
  canonical: "/admin/waitlist",
});

const dateFormatter = new Intl.DateTimeFormat("en-NG", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const numberFormatter = new Intl.NumberFormat("en-NG");

async function WaitlistTabContent({
  filter,
  label,
}: {
  filter: "all" | "tenant" | "landlord";
  label: string;
}) {
  const entries = await getWaitlist(filter);

  if (entries.length === 0) {
    return (
      <EmptyState
        icon={Users2}
        title={`No ${label.toLowerCase()} waitlist entries`}
        description={
          filter === "all"
            ? "No one has joined the waitlist yet."
            : `No ${label.toLowerCase()} entries on the waitlist yet.`
        }
      />
    );
  }

  return (
    /* FIXED: Changed overflow-hidden to overflow-x-auto so the table can scroll horizontally on mobile */
    <div className="w-full overflow-x-auto rounded-md border border-border bg-background shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Joined</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell className="font-medium whitespace-nowrap">
                {entry.full_name ?? "—"}
              </TableCell>
              <TableCell className="whitespace-nowrap">{entry.email}</TableCell>
              <TableCell className="whitespace-nowrap">
                {entry.role === "landlord" ? (
                  <Badge className="bg-[#FDE8DF] text-[#C44D28] border-0">
                    Landlord
                  </Badge>
                ) : (
                  <Badge variant="secondary">Tenant</Badge>
                )}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {dateFormatter.format(new Date(entry.created_at))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default async function AdminWaitlistPage() {
  const count = await getWaitlistCount();

  const statCards = [
    { label: "Total Signups", value: count.total },
    { label: "Tenants", value: count.tenants },
    { label: "Landlords", value: count.landlords },
  ];

  return (
    <main className="mx-auto grid w-full max-w-7xl gap-6 overflow-x-hidden px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <p className="text-sm font-medium text-muted-foreground">
          Platform administration
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl text-[#1C1612]">
          Waitlist
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {numberFormatter.format(count.total)} total signups
        </p>
      </div>

      <section className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        {statCards.map((card) => (
          <Card key={card.label}>
            <CardHeader className="flex flex-row items-center justify-between gap-3 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.label}
              </CardTitle>
              <Users2 className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold tracking-tight">
                {numberFormatter.format(card.value)}
              </p>
            </CardContent>
          </Card>
        ))}
      </section>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto sm:w-auto">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="tenants">Tenants</TabsTrigger>
          <TabsTrigger value="landlords">Landlords</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">
          <WaitlistTabContent filter="all" label="All" />
        </TabsContent>
        <TabsContent value="tenants" className="mt-4">
          <WaitlistTabContent filter="tenant" label="Tenants" />
        </TabsContent>
        <TabsContent value="landlords" className="mt-4">
          <WaitlistTabContent filter="landlord" label="Landlords" />
        </TabsContent>
      </Tabs>
    </main>
  );
}
