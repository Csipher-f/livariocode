import { CalendarDays, ShieldCheck } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { InquiryButton } from "@/features/properties/components/inquiry-button";
import type { PropertyDetail } from "@/features/properties/types";

const memberSinceFormatter = new Intl.DateTimeFormat("en-NG", {
  month: "long",
  year: "numeric",
});

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function getMemberSince(value: string | null) {
  if (!value) {
    return "Member details available soon";
  }

  return `Member since ${memberSinceFormatter.format(new Date(value))}`;
}

export function LandlordCard({
  isAuthenticated,
  property,
}: {
  isAuthenticated: boolean;
  property: PropertyDetail;
}) {
  const landlordName = property.landlord.fullName ?? "Livario landlord";

  return (
    <aside className="lg:sticky lg:top-24">
      <Card className="overflow-hidden border-border/80 shadow-sm">
        <CardContent className="grid gap-5 p-5">
          <div className="flex items-center gap-4">
            <Avatar className="size-14">
              {property.landlord.avatarUrl ? (
                <AvatarImage alt="" src={property.landlord.avatarUrl} />
              ) : null}
              <AvatarFallback>
                {getInitials(landlordName) || "L"}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <h2 className="truncate text-base font-semibold tracking-tight">
                {landlordName}
              </h2>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                <CalendarDays className="size-4 shrink-0" />
                <span>{getMemberSince(property.landlord.createdAt)}</span>
              </p>
            </div>
          </div>

          <div className="rounded-md bg-secondary/80 p-4">
            <p className="flex items-center gap-2 text-sm font-medium">
              <ShieldCheck className="size-4" />
              Contact through Livario
            </p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Send your interest directly so the conversation starts with this
              listing attached.
            </p>
          </div>

          <InquiryButton
            isAuthenticated={isAuthenticated}
            propertyId={property.id}
            propertyTitle={property.title}
          />
        </CardContent>
      </Card>
    </aside>
  );
}
