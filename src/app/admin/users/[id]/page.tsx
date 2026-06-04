import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Mail, Shield, User } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminUser } from "@/features/admin/actions/get-admin-data";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Admin User Profile",
  description: "Review a Livario user profile.",
});

type AdminUserProfilePageProps = {
  params: Promise<{
    id: string;
  }>;
};

const dateFormatter = new Intl.DateTimeFormat("en-NG", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export default async function AdminUserProfilePage({
  params,
}: AdminUserProfilePageProps) {
  const { id } = await params;
  const user = await getAdminUser(id);

  if (!user) {
    notFound();
  }

  return (
    <main className="mx-auto grid w-full max-w-4xl gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <Button asChild className="w-fit" variant="outline">
        <Link href="/admin/users">
          <ArrowLeft className="size-4" />
          Users
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                User profile
              </p>
              <CardTitle className="mt-2 text-3xl tracking-tight">
                {user.name}
              </CardTitle>
            </div>
            <div className="flex flex-wrap gap-2">
              {user.isTenant ? <Badge variant="secondary">Tenant</Badge> : null}
              {user.isLandlord ? (
                <Badge variant="outline">Landlord</Badge>
              ) : null}
              {user.isAdmin ? (
                <Badge variant="default">
                  <Shield className="size-3" />
                  Admin
                </Badge>
              ) : null}
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-md border border-border p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="size-4" />
              Email
            </div>
            <p className="mt-2 font-medium">{user.email ?? "No email"}</p>
          </div>
          <div className="rounded-md border border-border p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="size-4" />
              Active role
            </div>
            <p className="mt-2 font-medium capitalize">{user.activeRole}</p>
          </div>
          <div className="rounded-md border border-border p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarDays className="size-4" />
              Joined
            </div>
            <p className="mt-2 font-medium">
              {dateFormatter.format(new Date(user.joinedAt))}
            </p>
          </div>
          <div className="rounded-md border border-border p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarDays className="size-4" />
              Last updated
            </div>
            <p className="mt-2 font-medium">
              {dateFormatter.format(new Date(user.updatedAt))}
            </p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
