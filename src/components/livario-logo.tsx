import { cn } from "@/lib/utils";

interface LivarioLogoProps {
  variant?: "default" | "light";
  className?: string;
}

export function LivarioLogo({ variant = "default", className }: LivarioLogoProps) {
  const strokeColor = variant === "light" ? "#F5EDE0" : "#E8623A";
  const textColor = variant === "light" ? "text-[#F5EDE0]" : "text-[var(--brand)]";

  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6 26V13C6 8.029 9.582 4 14 4C18.418 4 22 8.029 22 13V26"
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          x1="4"
          y1="26"
          x2="24"
          y2="26"
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          x1="14"
          y1="4"
          x2="14"
          y2="26"
          stroke={strokeColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.4"
        />
        <line
          x1="6"
          y1="17"
          x2="22"
          y2="17"
          stroke={strokeColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.4"
        />
      </svg>
      <span className={cn("font-serif text-xl font-semibold", textColor)}>
        Livario
      </span>
    </div>
  );
}
