import { cn } from "@/lib/utils";

type FormMessageProps = {
  message?: string;
  tone?: "error" | "success" | "muted";
};

export function FormMessage({ message, tone = "error" }: FormMessageProps) {
  if (!message) {
    return null;
  }

  return (
    <p
      aria-live="polite"
      className={cn(
        "rounded-md px-3 py-2 text-sm leading-5",
        tone === "error" &&
          "bg-destructive/10 text-destructive dark:bg-destructive/20",
        tone === "success" &&
          "bg-accent text-accent-foreground dark:bg-accent/70",
        tone === "muted" && "bg-muted text-muted-foreground"
      )}
    >
      {message}
    </p>
  );
}
