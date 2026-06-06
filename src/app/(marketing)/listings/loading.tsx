import { Skeleton } from "@/components/ui/skeleton";

function PropertyCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-md border border-border bg-card shadow-sm">
      <Skeleton className="aspect-4/3 rounded-none" />
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

export default function ListingsLoading() {
  return (
    <main className="bg-secondary/30">
      <section className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 sm:px-6 sm:py-12 lg:grid-cols-[280px_1fr] lg:px-8">
        <div className="hidden lg:block">
          <div className="sticky top-24 rounded-3xl border border-border bg-card p-5 shadow-sm">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="mt-3 h-4 w-full" />
            <div className="mt-8 grid gap-5">
              <Skeleton className="h-11 w-full" />
              <Skeleton className="h-11 w-full" />
              <Skeleton className="h-11 w-full" />
              <Skeleton className="h-11 w-full" />
            </div>
          </div>
        </div>
        <div className="grid gap-6">
          <div>
            <Skeleton className="h-10 w-64 max-w-full" />
            <Skeleton className="mt-3 h-5 w-80 max-w-full" />
          </div>
          <Skeleton className="h-20 w-full rounded-3xl" />
          <div className="grid grid-cols-2 gap-3 md:gap-5 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <PropertyCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
