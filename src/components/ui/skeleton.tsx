import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}

function SkeletonText({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton-text"
      className={cn("space-y-2", className)}
      {...props}
    >
      <Skeleton className="h-3 w-4/5" />
      <Skeleton className="h-3 w-3/5" />
    </div>
  );
}

export { Skeleton, SkeletonText };
