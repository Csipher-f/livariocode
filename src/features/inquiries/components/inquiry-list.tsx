"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { LandlordInquiry } from "@/features/inquiries/actions/get-inquiries";

const dateFormatter = new Intl.DateTimeFormat("en-NG", {
  hour: "2-digit",
  minute: "2-digit",
  day: "numeric",
  month: "short",
});

function getStatusVariant(status: string) {
  switch (status) {
    case "pending":
      return "warning";
    case "responded":
      return "success";
    case "closed":
      return "secondary";
    default:
      return "outline";
  }
}

export function InquiryList({ inquiries }: { inquiries: LandlordInquiry[] }) {
  return (
    <div className="grid gap-3">
      {inquiries.map((inquiry) => {
        const hasNew = inquiry.hasNewReplies;

        return (
          <Link
            href={`/dashboard/landlord/inquiries/${inquiry.id}`}
            className="group block rounded-md border border-border bg-card p-4 shadow-xs transition-all hover:border-foreground/15 hover:shadow-sm"
            key={inquiry.id}
          >
            <div className="min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors">
                      {inquiry.senderName}
                    </h2>
                    {hasNew && (
                      <span className="size-2 rounded-full bg-primary shrink-0 animate-pulse" title="New replies" />
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Property: {inquiry.propertyTitle}
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

              <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground group-hover:text-muted-foreground/80 transition-colors">
                {inquiry.lastMessageContent}
              </p>

              <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-2 text-[10px] text-muted-foreground">
                <span>Active: {dateFormatter.format(new Date(inquiry.lastActivityAt))}</span>
                <span className="text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Open chat &rarr;
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
