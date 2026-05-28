import type { ComponentProps, ReactNode } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type AuthFieldProps = ComponentProps<typeof Input> & {
  label: string;
  error?: string;
  labelAction?: ReactNode;
};

export function AuthField({
  id,
  name,
  label,
  error,
  labelAction,
  className,
  ...props
}: AuthFieldProps) {
  const fieldId = id ?? name;
  const errorId = error && fieldId ? `${fieldId}-error` : undefined;

  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between gap-3">
        {fieldId ? <Label htmlFor={fieldId}>{label}</Label> : null}
        {labelAction}
      </div>
      <Input
        id={fieldId}
        name={name}
        aria-invalid={Boolean(error)}
        aria-describedby={errorId}
        className={cn("bg-background", className)}
        {...props}
      />
      {error ? (
        <p id={errorId} className="text-sm leading-5 text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
