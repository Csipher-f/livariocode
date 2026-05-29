import { Skeleton } from "@/components/ui/skeleton";

function SavedListingCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-md border border-border bg-card shadow-sm">
      <Skeleton className="aspect-[4/3] rounded-none" />
      <div className="grid gap-4 p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="grid flex-1 gap-2">
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-3 w-3/5" />
          </div>
          <Skeleton className="h-8 w-20" />
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>
    </div>
  );
}

export default function SavedListingsLoading() {
  return (
    <main className="bg-secondary/30">
      <section className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Skeleton className="h-4 w-32" />
            <Skeleton className="mt-3 h-10 w-60 max-w-full" />
            <Skeleton className="mt-3 h-4 w-24" />
          </div>
          <Skeleton className="h-9 w-36 rounded-4xl" />
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <SavedListingCardSkeleton key={index} />
          ))}
        </div>
      </section>
    </main>
  );
}
