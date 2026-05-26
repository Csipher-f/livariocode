"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export type BottomNavigationItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

type MobileBottomNavigationProps = {
  items: BottomNavigationItem[];
  className?: string;
};

function MobileBottomNavigation({
  items,
  className,
}: MobileBottomNavigationProps) {
  const pathname = usePathname();

  return (
    <nav
      data-slot="mobile-bottom-navigation"
      aria-label="Primary mobile"
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-background/95 px-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2 shadow-[0_-8px_24px_rgb(0_0_0_/_0.04)] backdrop-blur md:hidden",
        className
      )}
    >
      <div className="mx-auto grid max-w-md grid-cols-4 gap-1">
        {items.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(`${item.href}/`));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex min-h-12 flex-col items-center justify-center gap-1 rounded-md px-2 text-xs font-medium text-muted-foreground transition-colors",
                "hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/20 focus-visible:outline-none",
                active && "bg-muted text-foreground"
              )}
            >
              <Icon className="size-5" />
              <span className="max-w-full truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export { MobileBottomNavigation };
