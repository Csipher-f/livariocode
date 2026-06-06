import type { Metadata } from "next";
import { Users } from "lucide-react";

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
  getAdminUsers,
  parseAdminPageParam,
  parseAdminSearchParam,
} from "@/features/admin/actions/get-admin-data";
import { AdminSearchFilter } from "@/features/admin/components/admin-filters";
import { AdminPagination } from "@/features/admin/components/admin-pagination";
import { UserAdminActions } from "@/features/admin/components/user-admin-actions";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Admin Users",
  description: "Manage Livario platform users.",
  canonical: "/admin/users",
});

type AdminUsersPageProps = {
  searchParams: Promise<{
    page?: string | string[];
    search?: string | string[];
  }>;
};

const dateFormatter = new Intl.DateTimeFormat("en-NG", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

function toRecord(params: Awaited<AdminUsersPageProps["searchParams"]>) {
  return Object.fromEntries(
    Object.entries(params).flatMap(([key, value]) => {
      const normalized = Array.isArray(value) ? value[0] : value;

      return normalized ? [[key, normalized]] : [];
    })
  );
}

export default async function AdminUsersPage({
  searchParams,
}: AdminUsersPageProps) {
  const resolvedSearchParams = await searchParams;
  const page = parseAdminPageParam(resolvedSearchParams.page);
  const search = parseAdminSearchParam(resolvedSearchParams.search);
  const result = await getAdminUsers({ page, search });
  const currentParams = toRecord(resolvedSearchParams);

  return (
    <main className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <p className="text-sm font-medium text-muted-foreground">
          User management
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl text-[#1C1612]">
          Users
        </h1>
      </div>

      <AdminSearchFilter
        pathname="/admin/users"
        search={search}
        searchParams={currentParams}
      />

      <section className="overflow-hidden rounded-md border border-border bg-background shadow-sm">
        {result.rows.length > 0 ? (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Roles</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.rows.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email ?? "No email"}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {user.isTenant ? (
                          <Badge variant="secondary">Tenant</Badge>
                        ) : null}
                        {user.isLandlord ? (
                          <Badge variant="outline">Landlord</Badge>
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell>
                      {dateFormatter.format(new Date(user.joinedAt))}
                    </TableCell>
                    <TableCell>
                      <UserAdminActions userId={user.id} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <AdminPagination
              page={result.page}
              pathname="/admin/users"
              searchParams={currentParams}
              totalPages={result.totalPages}
            />
          </>
        ) : (
          <EmptyState
            className="m-4 bg-background"
            description="Try searching by another name or email."
            icon={Users}
            title="No users found"
          />
        )}
      </section>
    </main>
  );
}
