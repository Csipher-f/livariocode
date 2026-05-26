"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Toast as ToastPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

function ToastProvider({
  ...props
}: React.ComponentProps<typeof ToastPrimitive.Provider>) {
  return <ToastPrimitive.Provider data-slot="toast-provider" {...props} />;
}

function ToastViewport({
  className,
  ...props
}: React.ComponentProps<typeof ToastPrimitive.Viewport>) {
  return (
    <ToastPrimitive.Viewport
      data-slot="toast-viewport"
      className={cn(
        "fixed right-0 bottom-0 z-100 flex max-h-screen w-full flex-col gap-2 p-4 sm:max-w-sm",
        className
      )}
      {...props}
    />
  );
}

function Toast({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<typeof ToastPrimitive.Root> & {
  variant?: "default" | "success" | "destructive";
}) {
  return (
    <ToastPrimitive.Root
      data-slot="toast"
      data-variant={variant}
      className={cn(
        "group pointer-events-auto relative flex w-full items-start gap-3 overflow-hidden rounded-md border bg-background p-4 pr-10 text-foreground shadow-lg transition-all",
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-80 data-[state=open]:slide-in-from-bottom-full data-[state=closed]:slide-out-to-right-full sm:data-[state=open]:slide-in-from-bottom-2",
        variant === "default" && "border-border",
        variant === "success" &&
          "border-emerald-200 bg-emerald-50 text-emerald-950 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-50",
        variant === "destructive" &&
          "border-destructive/30 bg-destructive/10 text-destructive",
        className
      )}
      {...props}
    />
  );
}

function ToastAction({
  className,
  ...props
}: React.ComponentProps<typeof ToastPrimitive.Action>) {
  return (
    <ToastPrimitive.Action
      data-slot="toast-action"
      className={cn(
        "inline-flex h-8 shrink-0 items-center justify-center rounded-md border border-border bg-transparent px-3 text-sm font-medium transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/20 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

function ToastClose({
  className,
  ...props
}: React.ComponentProps<typeof ToastPrimitive.Close>) {
  return (
    <ToastPrimitive.Close
      data-slot="toast-close"
      className={cn(
        "absolute top-3 right-3 rounded-full p-1 text-muted-foreground opacity-80 transition-opacity hover:opacity-100 focus-visible:ring-3 focus-visible:ring-ring/20 focus-visible:outline-none",
        className
      )}
      {...props}
    >
      <X className="size-4" />
    </ToastPrimitive.Close>
  );
}

function ToastTitle({
  className,
  ...props
}: React.ComponentProps<typeof ToastPrimitive.Title>) {
  return (
    <ToastPrimitive.Title
      data-slot="toast-title"
      className={cn("text-sm font-semibold", className)}
      {...props}
    />
  );
}

function ToastDescription({
  className,
  ...props
}: React.ComponentProps<typeof ToastPrimitive.Description>) {
  return (
    <ToastPrimitive.Description
      data-slot="toast-description"
      className={cn("text-sm leading-5 text-muted-foreground", className)}
      {...props}
    />
  );
}

export {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
};
