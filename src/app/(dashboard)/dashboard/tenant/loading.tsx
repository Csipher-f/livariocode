import { Skeleton } from "@/components/ui/skeleton";

function PropertyCardSkeleton() {
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

export default function TenantDashboardLoading() {
  return (
    <main className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Skeleton className="h-4 w-32" />
          <Skeleton className="mt-3 h-10 w-72 max-w-full" />
          <Skeleton className="mt-3 h-4 w-56 max-w-full" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 w-36 rounded-4xl" />
          <Skeleton className="h-10 w-32 rounded-4xl" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <Skeleton className="h-28 rounded-md" key={index} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <PropertyCardSkeleton key={index} />
          ))}
        </div>
        <Skeleton className="h-96 rounded-md" />
      </div>
    </main>
  );
}
