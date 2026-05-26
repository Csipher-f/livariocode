import { AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ErrorStateProps = React.ComponentProps<"div"> & {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
};

function ErrorState({
  title = "Something went wrong",
  description = "Please try again in a moment.",
  actionLabel,
  onAction,
  className,
  ...props
}: ErrorStateProps) {
  return (
    <div
      data-slot="error-state"
      role="alert"
      className={cn(
        "flex min-h-44 flex-col items-center justify-center gap-4 rounded-md border border-destructive/20 bg-destructive/5 p-6 text-center",
        className
      )}
      {...props}
    >
      <div className="flex size-10 items-center justify-center rounded-full bg-background text-destructive shadow-xs">
        <AlertCircle className="size-5" />
      </div>
      <div className="grid max-w-sm gap-1.5">
        <h3 className="text-base font-semibold tracking-tight text-foreground">
          {title}
        </h3>
        <p className="text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
      {actionLabel && onAction ? (
        <Button variant="outline" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}

export { ErrorState };
