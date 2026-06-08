"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { hideReview, publishReview } from "../actions/moderate-review";

interface ModerateReviewButtonsProps {
  reviewId: string;
  status: "pending" | "published" | "hidden";
}

export function ModerateReviewButtons({
  reviewId,
  status,
}: ModerateReviewButtonsProps) {
  const [isPending, startTransition] = useTransition();
  const [activeAction, setActiveAction] = useState<"publish" | "hide" | null>(
    null
  );

  const handlePublish = () => {
    setActiveAction("publish");
    startTransition(async () => {
      try {
        const result = await publishReview(reviewId);
        toast({
          title: result.success ? "Review published" : "Failed to publish",
          description: result.message,
          intent: result.success ? "success" : "destructive",
        });
      } finally {
        setActiveAction(null);
      }
    });
  };

  const handleHide = () => {
    setActiveAction("hide");
    startTransition(async () => {
      try {
        const result = await hideReview(reviewId);
        toast({
          title: result.success ? "Review hidden" : "Failed to hide",
          description: result.message,
          intent: result.success ? "success" : "destructive",
        });
      } finally {
        setActiveAction(null);
      }
    });
  };

  const showPublish = status === "pending" || status === "hidden";
  const showHide = status === "pending" || status === "published";

  return (
    <div className="flex items-center gap-2">
      {showPublish && (
        <Button
          disabled={isPending}
          onClick={handlePublish}
          size="sm"
          type="button"
        >
          {isPending && activeAction === "publish" ? (
            <>
              <Loader2 className="mr-2 size-3.5 animate-spin" />
              Saving...
            </>
          ) : (
            "Publish"
          )}
        </Button>
      )}
      {showHide && (
        <Button
          disabled={isPending}
          onClick={handleHide}
          size="sm"
          type="button"
          variant="outline"
        >
          {isPending && activeAction === "hide" ? (
            <>
              <Loader2 className="mr-2 size-3.5 animate-spin" />
              Saving...
            </>
          ) : (
            "Hide"
          )}
        </Button>
      )}
    </div>
  );
}
