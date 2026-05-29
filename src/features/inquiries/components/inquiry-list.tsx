"use client";

import { useState, useTransition } from "react";
import { ChevronDown, Loader2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import {
  markInquiryAsRead,
  type LandlordInquiry,
} from "@/features/inquiries/actions/get-inquiries";
import { cn } from "@/lib/utils";

const dateFormatter = new Intl.DateTimeFormat("en-NG", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export function InquiryList({ inquiries }: { inquiries: LandlordInquiry[] }) {
  const [expandedInquiryId, setExpandedInquiryId] = useState<string | null>(
    inquiries[0]?.id ?? null
  );
  const [pendingInquiryId, setPendingInquiryId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleMarkAsRead(inquiryId: string) {
    setPendingInquiryId(inquiryId);
    startTransition(async () => {
      const result = await markInquiryAsRead({ inquiryId });

      toast({
        title: result.success ? "Inquiry updated" : "Inquiry not updated",
        description: result.message,
        intent: result.success ? "success" : "destructive",
      });
      setPendingInquiryId(null);
    });
  }

  return (
    <div className="grid gap-3">
      {inquiries.map((inquiry) => {
        const isExpanded = expandedInquiryId === inquiry.id;

        return (
          <article
            className="rounded-md border border-border bg-card p-4 shadow-sm"
            key={inquiry.id}
          >
            <button
              className="flex w-full items-start justify-between gap-4 text-left"
              onClick={() =>
                setExpandedInquiryId(isExpanded ? null : inquiry.id)
              }
              type="button"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-semibold tracking-tight">
                    {inquiry.senderName}
                  </h2>
                  <Badge
                    variant={
                      inquiry.status === "pending" ? "warning" : "outline"
                    }
                  >
                    {inquiry.status}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {inquiry.propertyTitle}
                </p>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                  {inquiry.message}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2 text-sm text-muted-foreground">
                <span>{dateFormatter.format(new Date(inquiry.createdAt))}</span>
                <ChevronDown
                  className={cn(
                    "size-4 transition-transform",
                    isExpanded && "rotate-180"
                  )}
                />
              </div>
            </button>

            {isExpanded ? (
              <div className="mt-4 border-t border-border pt-4">
                <p className="whitespace-pre-line text-sm leading-7">
                  {inquiry.message}
                </p>
                {inquiry.senderEmail ? (
                  <p className="mt-3 text-sm text-muted-foreground">
                    Reply contact: {inquiry.senderEmail}
                  </p>
                ) : null}
                {inquiry.status === "pending" ? (
                  <Button
                    className="mt-4"
                    disabled={isPending && pendingInquiryId === inquiry.id}
                    onClick={() => handleMarkAsRead(inquiry.id)}
                    size="sm"
                    type="button"
                    variant="outline"
                  >
                    {isPending && pendingInquiryId === inquiry.id ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : null}
                    Mark as read
                  </Button>
                ) : null}
              </div>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
