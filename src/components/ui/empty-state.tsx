import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type EmptyStateProps = React.ComponentProps<"div"> & {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
};

function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  actionLabel,
  onAction,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      data-slot="empty-state"
      className={cn(
        "flex min-h-52 flex-col items-center justify-center gap-4 rounded-md border border-dashed border-border bg-muted/20 p-6 text-center",
        className
      )}
      {...props}
    >
      {Icon ? (
        <div className="flex size-10 items-center justify-center rounded-full bg-background text-muted-foreground shadow-xs">
          <Icon className="size-5" />
        </div>
      ) : null}
      <div className="grid max-w-sm gap-1.5">
        <h3 className="text-base font-semibold tracking-tight">{title}</h3>
        {description ? (
          <p className="text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {actionLabel && onAction ? (
        <Button size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
      {action ? action : null}
    </div>
  );
}

export { EmptyState };
