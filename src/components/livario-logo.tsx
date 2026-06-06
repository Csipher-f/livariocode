import { cn } from "@/lib/utils";

export function LivarioLogo({
  className,
  variant = "default",
  showWordmark = true,
}: {
  className?: string;
  variant?: "default" | "light";
  showWordmark?: boolean;
}) {
  const color = variant === "light" ? "#F5EDE0" : "#E8623A";

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <svg
        width="36"
        height="36"
        viewBox="0 0 100 110"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer arch */}
        <path
          d="M15 95 L15 48 Q15 10 50 10 Q85 10 85 48 L85 95"
          stroke={color}
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Inner arch */}
        <path
          d="M26 95 L26 50 Q26 22 50 22 Q74 22 74 50 L74 95"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
        {/* Bottom base line */}
        <line
          x1="12"
          y1="95"
          x2="88"
          y2="95"
          stroke={color}
          strokeWidth="4.5"
          strokeLinecap="round"
        />
        {/* Sun circle */}
        <circle cx="50" cy="52" r="8" fill={color} />
        {/* Landscape curve 1 */}
        <path
          d="M26 75 Q38 65 50 70 Q62 75 74 68"
          stroke={color}
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Landscape curve 2 */}
        <path
          d="M26 84 Q40 76 53 80 Q64 84 74 78"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
      </svg>

      {showWordmark && (
        <span
          className={cn(
            "font-serif text-xl font-semibold tracking-widest uppercase",
            variant === "light" ? "text-[#F5EDE0]" : "text-[#E8623A]"
          )}
        >
          Livario
        </span>
      )}
    </div>
  );
}
