"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export type NavigationItem = {
  label: string;
  href: string;
};

type ResponsiveNavbarProps = {
  brand?: string;
  items?: NavigationItem[];
  actions?: React.ReactNode;
  className?: string;
};

function isActivePath(pathname: string, href: string) {
  return pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
}

function ResponsiveNavbar({
  brand = "Livario",
  items = [],
  actions,
  className,
}: ResponsiveNavbarProps) {
  const pathname = usePathname();

  return (
    <header
      data-slot="responsive-navbar"
      className={cn(
        "sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75",
        className
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold tracking-tight"
        >
          <span className="flex size-8 items-center justify-center rounded-md bg-primary text-sm text-primary-foreground">
            L
          </span>
          <span>{brand}</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {items.map((item) => {
            const active = isActivePath(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                  active && "bg-muted text-foreground"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 md:flex">{actions}</div>

        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Open navigation"
            >
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[min(22rem,86vw)]">
            <SheetHeader>
              <SheetTitle>{brand}</SheetTitle>
            </SheetHeader>
            <nav className="grid gap-1" aria-label="Mobile primary">
              {items.map((item) => {
                const active = isActivePath(pathname, item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "rounded-md px-3 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                      active && "bg-muted text-foreground"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            {actions ? (
              <div className="mt-auto grid gap-2">{actions}</div>
            ) : null}
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

export { ResponsiveNavbar };
