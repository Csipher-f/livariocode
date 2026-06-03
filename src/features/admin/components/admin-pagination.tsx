import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

function buildPageHref(
  pathname: string,
  currentParams: Record<string, string>,
  page: number
) {
  const params = new URLSearchParams(currentParams);

  if (page <= 1) {
    params.delete("page");
  } else {
    params.set("page", String(page));
  }

  const query = params.toString();

  return query ? `${pathname}?${query}` : pathname;
}

export function AdminPagination({
  page,
  pathname,
  searchParams,
  totalPages,
}: {
  page: number;
  pathname: string;
  searchParams: Record<string, string>;
  totalPages: number;
}) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3 border-t border-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        Page {page} of {totalPages}
      </p>
      <div className="flex gap-2">
        <Button asChild={page > 1} disabled={page <= 1} size="sm" variant="outline">
          {page > 1 ? (
            <Link href={buildPageHref(pathname, searchParams, page - 1)}>
              <ChevronLeft className="size-4" />
              Previous
            </Link>
          ) : (
            <span>
              <ChevronLeft className="size-4" />
              Previous
            </span>
          )}
        </Button>
        <Button
          asChild={page < totalPages}
          disabled={page >= totalPages}
          size="sm"
          variant="outline"
        >
          {page < totalPages ? (
            <Link href={buildPageHref(pathname, searchParams, page + 1)}>
              Next
              <ChevronRight className="size-4" />
            </Link>
          ) : (
            <span>
              Next
              <ChevronRight className="size-4" />
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}
