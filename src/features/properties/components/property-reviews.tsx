import { LockKeyhole, MessageSquareText, ShieldCheck, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { PropertyReviewsSummary } from "@/features/properties/actions/get-property-reviews";

const reviewDateFormatter = new Intl.DateTimeFormat("en-NG", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

function getReviewDate(value: string) {
  return reviewDateFormatter.format(new Date(value));
}

function getReviewLabel(reviewCount: number) {
  return reviewCount === 1 ? "1 review" : `${reviewCount} reviews`;
}

function RatingStars({ rating }: { rating: number }) {
  return (
    <span aria-label={`${rating} out of 5 stars`} className="flex items-center">
      {Array.from({ length: 5 }).map((_, index) => {
        const isFilled = index < rating;

        return (
          <Star
            aria-hidden="true"
            className={
              isFilled
                ? "size-4 fill-[#E8623A] text-[#E8623A]"
                : "size-4 text-muted-foreground/35"
            }
            key={index}
          />
        );
      })}
    </span>
  );
}

export function PropertyReviews({
  reviewsSummary,
}: {
  reviewsSummary: PropertyReviewsSummary;
}) {
  const { averageRating, reviewCount, reviews } = reviewsSummary;

  return (
    <section className="grid gap-4" aria-labelledby="property-reviews-heading">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2
            className="text-xl font-semibold tracking-tight"
            id="property-reviews-heading"
          >
            Reviews
          </h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Reviews available after a confirmed tenancy.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline">
            <Star className="size-3.5 fill-[#E8623A] text-[#E8623A]" />
            {averageRating ? averageRating.toFixed(1) : "New"}
          </Badge>
          <Badge variant="secondary">{getReviewLabel(reviewCount)}</Badge>
        </div>
      </div>

      <Card className="border-border/80 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LockKeyhole className="size-4 text-[#E8623A]" />
            Confirmed tenancy required
          </CardTitle>
          <CardDescription>
            The review form unlocks only for tenants with a verified Livario
            tenancy on this property.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="rounded-md border border-dashed border-border bg-background/70 p-4">
            <p className="flex items-center gap-2 text-sm font-medium">
              <ShieldCheck className="size-4 text-[#C44D28]" />
              Reviews available after a confirmed tenancy
            </p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              This keeps property feedback tied to real rental experiences.
            </p>
          </div>

          {reviews.length > 0 ? (
            <div className="grid gap-3">
              {reviews.map((review) => (
                <article
                  className="grid gap-3 rounded-md border border-border bg-card p-4"
                  key={review.id}
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <RatingStars rating={review.rating} />
                    <span className="text-sm text-muted-foreground">
                      {getReviewDate(review.createdAt)}
                    </span>
                  </div>
                  {review.title ? (
                    <h3 className="text-base font-semibold tracking-tight">
                      {review.title}
                    </h3>
                  ) : null}
                  {review.body ? (
                    <p className="leading-7 text-muted-foreground">
                      {review.body}
                    </p>
                  ) : null}
                </article>
              ))}
            </div>
          ) : (
            <div className="flex items-start gap-3 rounded-md bg-secondary/70 p-4">
              <MessageSquareText className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <p className="text-sm leading-6 text-muted-foreground">
                No verified tenant reviews have been published yet.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
