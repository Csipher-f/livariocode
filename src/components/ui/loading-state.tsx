import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

type LoadingStateProps = React.ComponentProps<"div"> & {
  title?: string;
  description?: string;
};

function LoadingState({
  title = "Loading",
  description,
  className,
  ...props
}: LoadingStateProps) {
  return (
    <div
      data-slot="loading-state"
      role="status"
      aria-live="polite"
      className={cn(
        "flex min-h-40 flex-col items-center justify-center gap-3 rounded-md border border-dashed border-border bg-muted/30 p-6 text-center",
        className
      )}
      {...props}
    >
      <Loader2 className="size-5 animate-spin text-muted-foreground" />
      <div className="grid gap-1">
        <p className="text-sm font-medium">{title}</p>
        {description ? (
          <p className="max-w-sm text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export { LoadingState };
