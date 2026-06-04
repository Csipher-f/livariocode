import type { Metadata } from "next";
import { Inbox } from "lucide-react";

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
  getAdminInquiries,
  parseAdminPageParam,
  type AdminInquiryStatusFilter,
} from "@/features/admin/actions/get-admin-data";
import { AdminSelectFilter } from "@/features/admin/components/admin-filters";
import { AdminPagination } from "@/features/admin/components/admin-pagination";
import { createPageMetadata } from "@/lib/metadata";
import type { InquiryStatus } from "@/types/database";

export const metadata: Metadata = createPageMetadata({
  title: "Admin Inquiries",
  description: "Review Livario inquiries across the platform.",
  canonical: "/admin/inquiries",
});

type AdminInquiriesPageProps = {
  searchParams: Promise<{
    page?: string | string[];
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
  { label: "Pending", value: "pending" },
  { label: "Read", value: "read" },
  { label: "Responded", value: "responded" },
  { label: "Closed", value: "closed" },
];

function normalizeStatus(status?: string | string[]): AdminInquiryStatusFilter {
  const value = Array.isArray(status) ? status[0] : status;
  const allowed = ["pending", "read", "responded", "closed"];

  return allowed.includes(value ?? "") ? (value as InquiryStatus) : "all";
}

function getBadgeVariant(status: InquiryStatus) {
  if (status === "responded") return "success";
  if (status === "pending") return "warning";
  if (status === "closed") return "outline";
  return "secondary";
}

function toRecord(params: Awaited<AdminInquiriesPageProps["searchParams"]>) {
  return Object.fromEntries(
    Object.entries(params).flatMap(([key, value]) => {
      const normalized = Array.isArray(value) ? value[0] : value;

      return normalized ? [[key, normalized]] : [];
    })
  );
}

export default async function AdminInquiriesPage({
  searchParams,
}: AdminInquiriesPageProps) {
  const resolvedSearchParams = await searchParams;
  const page = parseAdminPageParam(resolvedSearchParams.page);
  const status = normalizeStatus(resolvedSearchParams.status);
  const result = await getAdminInquiries({ page, status });
  const currentParams = toRecord(resolvedSearchParams);

  return (
    <main className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <p className="text-sm font-medium text-muted-foreground">
          Inquiry overview
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Inquiries
        </h1>
      </div>

      <div className="flex justify-start sm:justify-end">
        <AdminSelectFilter
          options={statusOptions}
          pathname="/admin/inquiries"
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
                  <TableHead>Property</TableHead>
                  <TableHead>Sender</TableHead>
                  <TableHead>Recipient</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.rows.map((inquiry) => (
                  <TableRow key={inquiry.id}>
                    <TableCell className="min-w-56 font-medium">
                      {inquiry.propertyTitle}
                    </TableCell>
                    <TableCell>{inquiry.senderName}</TableCell>
                    <TableCell>{inquiry.recipientName}</TableCell>
                    <TableCell>
                      <Badge variant={getBadgeVariant(inquiry.status)}>
                        {inquiry.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {dateFormatter.format(new Date(inquiry.createdAt))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <AdminPagination
              page={result.page}
              pathname="/admin/inquiries"
              searchParams={currentParams}
              totalPages={result.totalPages}
            />
          </>
        ) : (
          <EmptyState
            className="m-4 bg-background"
            description="Try another inquiry status filter."
            icon={Inbox}
            title="No inquiries found"
          />
        )}
      </section>
    </main>
  );
}
