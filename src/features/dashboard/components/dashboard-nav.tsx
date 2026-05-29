"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { Profile } from "@/types/database";

export type DashboardNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function DashboardNav({
  items,
  profile,
  title,
}: {
  items: DashboardNavItem[];
  profile: Profile;
  title: string;
}) {
  const pathname = usePathname();
  const displayName = profile.full_name ?? "Livario user";

  return (
    <>
      <aside className="hidden w-72 shrink-0 border-r border-border bg-background lg:flex lg:min-h-screen lg:flex-col">
        <div className="border-b border-border p-6">
          <Link className="text-lg font-semibold tracking-tight" href="/">
            Livario
          </Link>
          <p className="mt-1 text-sm text-muted-foreground">{title}</p>
        </div>

        <nav className="grid gap-1 p-4" aria-label={`${title} navigation`}>
          {items.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;

            return (
              <Link
                className={cn(
                  "flex min-h-11 items-center gap-3 rounded-md px-3 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground",
                  isActive && "bg-secondary text-foreground"
                )}
                href={item.href}
                key={item.href}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-border p-4">
          <div className="flex items-center gap-3 rounded-md bg-secondary/60 p-3">
            <Avatar>
              {profile.avatar_url ? (
                <AvatarImage alt="" src={profile.avatar_url} />
              ) : null}
              <AvatarFallback>{getInitials(displayName) || "L"}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{displayName}</p>
              <p className="truncate text-xs text-muted-foreground">
                {profile.email ?? "Livario member"}
              </p>
            </div>
          </div>
        </div>
      </aside>

      <nav
        aria-label={`${title} mobile navigation`}
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-2 py-2 backdrop-blur lg:hidden"
      >
        <div className="mx-auto grid max-w-md grid-cols-4 gap-1">
          {items.slice(0, 4).map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;

            return (
              <Link
                className={cn(
                  "flex min-h-12 flex-col items-center justify-center gap-1 rounded-md px-2 text-xs font-medium text-muted-foreground transition",
                  isActive && "bg-secondary text-foreground"
                )}
                href={item.href}
                key={item.href}
              >
                <Icon className="size-4" />
                <span className="max-w-full truncate">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
