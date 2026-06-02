import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileSettingsLoading() {
  return (
    <div className="space-y-8">
      <section className="rounded-md border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Skeleton className="size-24 rounded-full sm:size-28" />
          <div className="grid gap-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-56 max-w-full" />
          </div>
        </div>
      </section>

      <section className="rounded-md border border-border bg-card p-6 shadow-sm">
        <div className="grid gap-5">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-10 w-32 rounded-4xl" />
        </div>
      </section>
    </div>
  );
}
