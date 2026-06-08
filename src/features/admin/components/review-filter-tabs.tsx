"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";
import type { AdminReview } from "../actions/get-admin-reviews";

interface ReviewFilterTabsProps {
  reviews: AdminReview[];
}

export function ReviewFilterTabs({ reviews }: ReviewFilterTabsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeStatus = searchParams.get("status") || "pending";

  const countAll = reviews.length;
  const countPending = reviews.filter((r) => r.status === "pending").length;
  const countPublished = reviews.filter((r) => r.status === "published").length;
  const countHidden = reviews.filter((r) => r.status === "hidden").length;

  const tabs = [
    { value: "all", label: "All", count: countAll },
    { value: "pending", label: "Pending", count: countPending },
    { value: "published", label: "Published", count: countPublished },
    { value: "hidden", label: "Hidden", count: countHidden },
  ];

  const handleTabClick = (status: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("status", status);
    params.delete("page"); // Reset page if applicable
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-2 border-b border-[#E8DDD4] pb-4">
      {tabs.map((tab) => {
        const isActive = activeStatus === tab.value;

        return (
          <button
            key={tab.value}
            onClick={() => handleTabClick(tab.value)}
            className={cn(
              "flex items-center gap-2 transition-colors cursor-pointer",
              isActive
                ? "bg-[#FDE8DF] text-[#E8623A] font-medium rounded-lg px-4 py-2 text-sm"
                : "text-[#8C7B6B] hover:bg-[#F5EFE8] hover:text-[#1C1612] rounded-lg px-4 py-2 text-sm"
            )}
            type="button"
          >
            <span>{tab.label}</span>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-xs font-semibold",
                isActive
                  ? "bg-[#E8623A]/10 text-[#E8623A]"
                  : "bg-[#1C1612]/5 text-[#8C7B6B]"
              )}
            >
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
