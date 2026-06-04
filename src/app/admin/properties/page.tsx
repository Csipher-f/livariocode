import type { Metadata } from "next";
import Link from "next/link";
import { Building2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getAdminProperties,
  parseAdminPageParam,
  parseAdminSearchParam,
  type AdminPropertyStatusFilter,
} from "@/features/admin/actions/get-admin-data";
import {
  AdminSearchFilter,
  AdminSelectFilter,
} from "@/features/admin/components/admin-filters";
import { AdminPagination } from "@/features/admin/components/admin-pagination";
import { PropertyAdminActions } from "@/features/admin/components/property-admin-actions";
import { createPageMetadata } from "@/lib/metadata";
import type { PropertyStatus } from "@/types/database";

export const metadata: Metadata = createPageMetadata({
  title: "Admin Properties",
  description: "Moderate Livario property listings.",
  canonical: "/admin/properties",
});

type AdminPropertiesPageProps = {
  searchParams: Promise<{
    page?: string | string[];
    search?: string | string[];
    status?: string | string[];
  }>;
};

const dateFormatter = new Intl.DateTimeFormat("en-NG", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const statusOptions = [
  { label: "All statuses", value: "all" },
  { label: "Published", value: "published" },
  { label: "Draft", value: "draft" },
  { label: "Archived", value: "archived" },
];

function normalizeStatus(
  status?: string | string[]
): AdminPropertyStatusFilter {
  const value = Array.isArray(status) ? status[0] : status;
  const allowed = ["published", "draft", "archived", "rented"];

  return allowed.includes(value ?? "") ? (value as PropertyStatus) : "all";
}

function getBadgeVariant(status: PropertyStatus) {
  if (status === "published") return "success";
  if (status === "draft") return "warning";
  if (status === "archived") return "outline";
  return "secondary";
}

function toRecord(params: Awaited<AdminPropertiesPageProps["searchParams"]>) {
  return Object.fromEntries(
    Object.entries(params).flatMap(([key, value]) => {
      const normalized = Array.isArray(value) ? value[0] : value;

      return normalized ? [[key, normalized]] : [];
    })
  );
}

export default async function AdminPropertiesPage({
  searchParams,
}: AdminPropertiesPageProps) {
  const resolvedSearchParams = await searchParams;
  const page = parseAdminPageParam(resolvedSearchParams.page);
  const search = parseAdminSearchParam(resolvedSearchParams.search);
  const status = normalizeStatus(resolvedSearchParams.status);
  const result = await getAdminProperties({ page, search, status });
  const currentParams = toRecord(resolvedSearchParams);

  return (
    <main className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <p className="text-sm font-medium text-muted-foreground">
          Property moderation
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Properties
        </h1>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <AdminSearchFilter
          pathname="/admin/properties"
          search={search}
          searchParams={currentParams}
        />
        <AdminSelectFilter
          options={statusOptions}
          pathname="/admin/properties"
          searchParams={currentParams}
          value={status}
        />
      </div>

      <section className="overflow-hidden rounded-md border border-border bg-background shadow-sm">
        {result.rows.length > 0 ? (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.rows.map((property) => (
                  <TableRow key={property.id}>
                    <TableCell className="min-w-56 font-medium">
                      <Link
                        className="hover:underline"
                        href={`/listings/${property.id}`}
                      >
                        {property.title}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{property.ownerName}</p>
                        <p className="text-xs text-muted-foreground">
                          {property.ownerEmail ?? "No email"}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getBadgeVariant(property.status)}>
                        {property.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{property.propertyType}</TableCell>
                    <TableCell>{property.city}</TableCell>
                    <TableCell>
                      {dateFormatter.format(new Date(property.createdAt))}
                    </TableCell>
                    <TableCell>
                      <PropertyAdminActions
                        propertyId={property.id}
                        title={property.title}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <AdminPagination
              page={result.page}
              pathname="/admin/properties"
              searchParams={currentParams}
              totalPages={result.totalPages}
            />
          </>
        ) : (
          <EmptyState
            className="m-4 bg-background"
            description="Try a different search or status filter."
            icon={Building2}
            title="No properties found"
          />
        )}
      </section>
    </main>
  );
}
