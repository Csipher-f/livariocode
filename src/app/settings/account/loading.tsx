import { Skeleton } from "@/components/ui/skeleton";

export default function AccountSettingsLoading() {
  return (
    <div className="space-y-8">
      <section className="rounded-md border border-border bg-card p-6 shadow-sm">
        <div className="grid gap-5">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-10 w-36 rounded-4xl" />
        </div>
      </section>

      <Skeleton className="h-px w-full" />

      <section className="rounded-md border border-border bg-card p-6 shadow-sm">
        <div className="grid gap-5">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-72 max-w-full" />
          <div className="grid gap-3 sm:grid-cols-2">
            <Skeleton className="h-24 rounded-md" />
            <Skeleton className="h-24 rounded-md" />
          </div>
        </div>
      </section>
    </div>
  );
}
