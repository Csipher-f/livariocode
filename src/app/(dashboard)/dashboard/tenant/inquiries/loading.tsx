import { Skeleton } from "@/components/ui/skeleton";

export default function TenantInquiriesLoading() {
  return (
    <main className="mx-auto grid w-full max-w-5xl gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Skeleton className="h-4 w-32" />
          <Skeleton className="mt-3 h-10 w-52 max-w-full" />
        </div>
        <Skeleton className="h-10 w-36 rounded-4xl" />
      </div>

      <div className="grid gap-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            className="grid gap-4 rounded-md border border-border bg-card p-4 shadow-sm sm:grid-cols-[88px_1fr]"
            key={index}
          >
            <Skeleton className="aspect-[4/3] rounded-md" />
            <div className="grid gap-3">
              <div className="flex items-start justify-between gap-4">
                <div className="grid flex-1 gap-2">
                  <Skeleton className="h-5 w-3/5" />
                  <Skeleton className="h-4 w-28" />
                </div>
                <Skeleton className="h-7 w-20 rounded-4xl" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
