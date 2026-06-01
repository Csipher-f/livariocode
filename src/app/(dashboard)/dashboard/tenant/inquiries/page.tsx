import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Inbox, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { getTenantInquiries } from "@/features/inquiries/actions/get-tenant-inquiries";
import { getCurrentProfile, requireUser } from "@/supabase/auth";
import type { InquiryStatus } from "@/types/database";

export const metadata: Metadata = {
  title: "Tenant Inquiries",
  description: "Review inquiries you have sent to landlords on Livario.",
};

const fallbackImage = "/images/listings/listing-1.svg";

const dateFormatter = new Intl.DateTimeFormat("en-NG", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

function getImageSource(imageUrl: string | null) {
  return imageUrl || fallbackImage;
}

function isRemoteImage(imageUrl: string) {
  return imageUrl.startsWith("http://") || imageUrl.startsWith("https://");
}

function getStatusVariant(status: InquiryStatus) {
  if (status === "pending") {
    return "warning";
  }

  if (status === "responded") {
    return "success";
  }

  if (status === "closed") {
    return "secondary";
  }

  return "outline";
}

export default async function TenantInquiriesPage() {
  const user = await requireUser();
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/onboarding");
  }

  if (profile.active_role !== "tenant") {
    redirect("/dashboard");
  }

  const inquiries = await getTenantInquiries({ tenantId: user.id });

  return (
    <main className="mx-auto grid w-full max-w-5xl gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Tenant dashboard
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Inquiries
          </h1>
        </div>
        <Button asChild variant="outline">
          <Link href="/listings">
            <Search className="size-4" />
            Browse listings
          </Link>
        </Button>
      </div>

      {inquiries.length > 0 ? (
        <div className="grid gap-3">
          {inquiries.map((inquiry) => {
            const imageSource = getImageSource(inquiry.propertyThumbnailUrl);
            const hasNew = inquiry.hasNewReplies;

            return (
              <Link
                href={`/dashboard/tenant/inquiries/${inquiry.id}`}
                className="group block rounded-md border border-border bg-card p-4 shadow-xs transition-all hover:border-foreground/15 hover:shadow-sm"
                key={inquiry.id}
              >
                <div className="grid gap-4 sm:grid-cols-[88px_1fr]">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-secondary shrink-0">
                    <Image
                      alt=""
                      className="object-cover transition-transform group-hover:scale-105"
                      fill
                      sizes="88px"
                      src={imageSource}
                      unoptimized={isRemoteImage(imageSource)}
                    />
                  </div>

                  <div className="min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h2 className="truncate font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors">
                              {inquiry.propertyTitle}
                            </h2>
                            {hasNew && (
                              <span className="size-2 rounded-full bg-primary shrink-0 animate-pulse" title="New replies" />
                            )}
                          </div>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            Active: {dateFormatter.format(new Date(inquiry.lastActivityAt))}
                          </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          <Badge variant={getStatusVariant(inquiry.status)}>
                            {inquiry.status}
                          </Badge>
                          {hasNew && (
                            <Badge variant="default" className="text-[10px] h-5 px-1.5 bg-primary/10 text-primary hover:bg-primary/15 border-transparent">
                              New
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="mt-2.5 line-clamp-2 text-sm leading-6 text-muted-foreground group-hover:text-muted-foreground/80 transition-colors">
                        {inquiry.lastMessageContent}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <EmptyState
          action={
            <Button asChild>
              <Link href="/listings">Browse listings</Link>
            </Button>
          }
          className="min-h-96 bg-background"
          description="When you contact a landlord about a property, your sent message will appear here."
          icon={Inbox}
          title="No inquiries sent yet"
        />
      )}
    </main>
  );
}
