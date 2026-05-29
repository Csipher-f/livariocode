import { Skeleton } from "@/components/ui/skeleton";

export default function PropertyDetailLoading() {
  return (
    <main className="bg-secondary/30">
      <section className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <Skeleton className="h-8 w-36" />
        <div className="grid gap-3">
          <Skeleton className="aspect-[4/3] rounded-md sm:aspect-[16/9]" />
          <div className="flex gap-2 overflow-hidden">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton className="h-20 w-28 shrink-0 rounded-md" key={index} />
            ))}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          <div className="grid gap-8">
            <div className="grid gap-4">
              <Skeleton className="h-6 w-28" />
              <Skeleton className="h-10 w-4/5" />
              <Skeleton className="h-5 w-64 max-w-full" />
              <div className="flex flex-col gap-4 border-y border-border py-5 sm:flex-row sm:justify-between">
                <Skeleton className="h-8 w-44" />
                <div className="flex gap-5">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </div>
            </div>
            <div className="grid gap-3">
              <Skeleton className="h-7 w-44" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-11/12" />
              <Skeleton className="h-5 w-3/4" />
            </div>
          </div>

          <div className="rounded-md border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-4">
              <Skeleton className="size-14 rounded-full" />
              <div className="grid flex-1 gap-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-44" />
              </div>
            </div>
            <Skeleton className="mt-5 h-24 w-full rounded-md" />
            <Skeleton className="mt-5 h-10 w-full rounded-4xl" />
          </div>
        </div>
      </section>
    </main>
  );
}
