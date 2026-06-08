import type { Metadata } from "next";
import { Star } from "lucide-react";

import { EmptyState } from "@/components/ui/empty-state";
import { getAdminReviews } from "@/features/admin/actions/get-admin-reviews";
import { ModerateReviewButtons } from "@/features/admin/components/moderate-review-buttons";
import { ReviewFilterTabs } from "@/features/admin/components/review-filter-tabs";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Reviews Moderation",
  description: "Moderate tenant reviews before they go live.",
  canonical: "/admin/reviews",
});

interface PageProps {
  searchParams: Promise<{
    status?: string;
  }>;
}

const reviewDateFormatter = new Intl.DateTimeFormat("en-NG", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

function getReviewDate(value: string) {
  return reviewDateFormatter.format(new Date(value));
}

export default async function AdminReviewsPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const activeStatus = resolvedSearchParams.status || "pending";
  const allReviews = await getAdminReviews();

  const filteredReviews = allReviews.filter((review) => {
    if (activeStatus === "all") return true;

    return review.status === activeStatus;
  });

  return (
    <main className="mx-auto grid w-full max-w-7xl gap-8 overflow-x-hidden px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <p className="text-sm font-medium text-muted-foreground">
          Platform administration
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl text-[#1C1612]">
          Reviews
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Moderate tenant reviews before they go live.
        </p>
      </div>

      <ReviewFilterTabs reviews={allReviews} />

      {filteredReviews.length > 0 ? (
        <section
          className="grid gap-4 md:grid-cols-2"
          aria-label="Reviews list"
        >
          {filteredReviews.map((review) => (
            <article
              key={review.id}
              className="flex flex-col justify-between bg-[#FFF8F2] border border-[#E8DDD4] rounded-xl p-5"
            >
              <div>
                <div className="flex items-center justify-between gap-4">
                  <span className="font-medium text-[#1C1612]">
                    {review.reviewer_name}
                  </span>
                  {review.status === "pending" && (
                    <span className="inline-flex items-center rounded-full border border-yellow-200 bg-yellow-50 px-2.5 py-0.5 text-xs font-semibold text-yellow-700">
                      Pending
                    </span>
                  )}
                  {review.status === "published" && (
                    <span className="inline-flex items-center rounded-full bg-[#FDE8DF] px-2.5 py-0.5 text-xs font-semibold text-[#C44D28]">
                      Published
                    </span>
                  )}
                  {review.status === "hidden" && (
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-500">
                      Hidden
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-0.5 mt-2">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="fill-[#E8623A] text-[#E8623A] size-4"
                    />
                  ))}
                </div>

                <p className="text-sm text-[#8C7B6B] mt-2">
                  Re: {review.property_title}
                </p>

                {review.title && (
                  <h3 className="font-medium text-[#1C1612] mt-2">
                    {review.title}
                  </h3>
                )}

                {review.body && (
                  <p className="text-sm text-[#8C7B6B] mt-1 line-clamp-3">
                    {review.body}
                  </p>
                )}
              </div>

              <div className="flex items-end justify-between mt-3">
                <span className="text-xs text-[#8C7B6B]">
                  {getReviewDate(review.created_at)}
                </span>
                <ModerateReviewButtons
                  reviewId={review.id}
                  status={review.status}
                />
              </div>
            </article>
          ))}
        </section>
      ) : (
        <EmptyState
          icon={Star}
          title="No reviews"
          description={
            activeStatus === "all"
              ? "There are no reviews on the platform."
              : `There are no ${activeStatus} reviews.`
          }
        />
      )}
    </main>
  );
}
