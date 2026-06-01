"use client";

import { useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Menu, ShieldCheck, type LucideIcon } from "lucide-react";

import { logout } from "@/actions/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import type { Profile } from "@/types/database";

export type DashboardNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export type DashboardComingSoonItem = {
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

function getAccountLabel(profile: Profile) {
  return profile.active_role === "landlord"
    ? "Landlord Account"
    : "Tenant Account";
}

function getActiveHref(items: DashboardNavItem[], pathname: string) {
  return items
    .filter((item) => isRouteActive(pathname, item.href))
    .sort((current, next) => next.href.length - current.href.length)[0]?.href;
}

function isRouteActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function showComingSoonToast() {
  toast({
    title: "Coming Soon",
    description: "This feature is on the way",
  });
}

function AccountIndicator({ profile }: { profile: Profile }) {
  return (
    <div className="flex items-center gap-3 rounded-md border border-border/70 bg-secondary/60 p-3">
      <div className="flex size-10 items-center justify-center rounded-full bg-background text-foreground">
        <ShieldCheck className="size-4" />
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">
          {getAccountLabel(profile)}
        </p>
        <p className="truncate text-xs capitalize text-muted-foreground">
          active role: {profile.active_role}
        </p>
      </div>
    </div>
  );
}

function UserSummary({ profile }: { profile: Profile }) {
  const displayName = profile.full_name ?? "Livario user";

  return (
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
  );
}

function ComingSoonButton({
  className,
  item,
}: {
  className?: string;
  item: DashboardComingSoonItem;
}) {
  const Icon = item.icon;

  return (
    <button
      className={cn(
        "flex min-h-11 w-full items-center gap-3 rounded-md px-3 text-left text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/20 focus-visible:outline-none",
        className
      )}
      onClick={showComingSoonToast}
      type="button"
    >
      <Icon className="size-4" />
      {item.label}
    </button>
  );
}

function DesktopLink({
  activeHref,
  item,
}: {
  activeHref?: string;
  item: DashboardNavItem;
}) {
  const Icon = item.icon;
  const isActive = activeHref === item.href;

  return (
    <Link
      className={cn(
        "flex min-h-11 items-center gap-3 rounded-md px-3 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground",
        isActive && "bg-secondary text-foreground"
      )}
      href={item.href}
    >
      <Icon className="size-4" />
      {item.label}
    </Link>
  );
}

function DrawerLink({
  activeHref,
  item,
}: {
  activeHref?: string;
  item: DashboardNavItem;
}) {
  const Icon = item.icon;
  const isActive = activeHref === item.href;

  return (
    <Link
      className={cn(
        "flex min-h-12 items-center gap-3 rounded-md px-3 text-sm font-medium text-zinc-300 transition hover:bg-white/10 hover:text-white",
        isActive && "bg-white text-zinc-950 hover:bg-white hover:text-zinc-950"
      )}
      href={item.href}
    >
      <Icon className="size-4" />
      {item.label}
    </Link>
  );
}

function BottomLink({
  activeHref,
  item,
}: {
  activeHref?: string;
  item: DashboardNavItem;
}) {
  const Icon = item.icon;
  const isActive = activeHref === item.href;

  return (
    <Link
      className={cn(
        "flex min-h-12 flex-col items-center justify-center gap-1 rounded-md px-1 text-xs font-medium text-muted-foreground transition",
        isActive && "bg-secondary text-foreground"
      )}
      href={item.href}
    >
      <Icon className="size-4" />
      <span className="max-w-full truncate">{item.label}</span>
    </Link>
  );
}

export function DashboardNav({
  activeItems,
  bottomItems,
  comingSoonItems,
  profile,
  title,
}: {
  activeItems: DashboardNavItem[];
  bottomItems: DashboardNavItem[];
  comingSoonItems: DashboardComingSoonItem[];
  profile: Profile;
  title: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const activeSidebarHref = getActiveHref(activeItems, pathname);
  const activeBottomHref = getActiveHref(bottomItems, pathname);
  const [isSigningOut, startSignOutTransition] = useTransition();

  function handleSignOut() {
    startSignOutTransition(async () => {
      const result = await logout();

      if (!result.success) {
        toast({
          title: "Could not sign out",
          description: result.message,
          intent: "destructive",
        });
        return;
      }

      router.push("/login");
      router.refresh();
    });
  }

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
          {activeItems.map((item) => (
            <DesktopLink
              activeHref={activeSidebarHref}
              item={item}
              key={item.href}
            />
          ))}

          <div className="my-2 h-px bg-border" />

          {comingSoonItems.map((item) => (
            <ComingSoonButton item={item} key={item.label} />
          ))}

          <button
            className="flex min-h-11 items-center gap-3 rounded-md px-3 text-left text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/20 focus-visible:outline-none"
            disabled={isSigningOut}
            onClick={handleSignOut}
            type="button"
          >
            <LogOut className="size-4" />
            Sign Out
          </button>
        </nav>

        <div className="mt-auto grid gap-3 border-t border-border p-4">
          <AccountIndicator profile={profile} />
          <UserSummary profile={profile} />
        </div>
      </aside>

      <header className="sticky top-0 z-40 border-b border-border bg-background/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-md items-center justify-between gap-3">
          <Link className="text-lg font-semibold tracking-tight" href="/">
            Livario
          </Link>

          <Sheet>
            <SheetTrigger asChild>
              <Button
                aria-label="Open dashboard menu"
                size="icon"
                variant="outline"
              >
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent
              className="w-[min(22rem,88vw)] gap-4 border-zinc-800 bg-zinc-950 p-4 text-white sm:p-5 [&_[data-slot=sheet-overlay]]:bg-black/70"
              side="left"
            >
              <SheetHeader className="border-b border-white/10 pb-4">
                <SheetTitle className="text-left text-xl text-white">
                  Livario
                </SheetTitle>
              </SheetHeader>

              <nav
                aria-label={`${title} menu`}
                className="grid gap-1 overflow-y-auto pr-1"
              >
                {activeItems.map((item) => (
                  <DrawerLink
                    activeHref={activeSidebarHref}
                    item={item}
                    key={item.href}
                  />
                ))}

                <div className="my-2 h-px bg-white/10" />

                {comingSoonItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <button
                      className="flex min-h-12 items-center gap-3 rounded-md px-3 text-left text-sm font-medium text-zinc-300 transition hover:bg-white/10 hover:text-white focus-visible:ring-3 focus-visible:ring-white/20 focus-visible:outline-none"
                      key={item.label}
                      onClick={showComingSoonToast}
                      type="button"
                    >
                      <Icon className="size-4" />
                      {item.label}
                    </button>
                  );
                })}

                <button
                  className="flex min-h-12 items-center gap-3 rounded-md px-3 text-left text-sm font-medium text-zinc-300 transition hover:bg-white/10 hover:text-white focus-visible:ring-3 focus-visible:ring-white/20 focus-visible:outline-none"
                  disabled={isSigningOut}
                  onClick={handleSignOut}
                  type="button"
                >
                  <LogOut className="size-4" />
                  Sign Out
                </button>
              </nav>

              <div className="mt-auto rounded-md border border-white/10 bg-white/5 p-3">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-white text-zinc-950">
                    <ShieldCheck className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {getAccountLabel(profile)}
                    </p>
                    <p className="truncate text-xs capitalize text-zinc-400">
                      active role: {profile.active_role}
                    </p>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <nav
        aria-label={`${title} mobile navigation`}
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-2 py-2 backdrop-blur lg:hidden"
      >
        <div className="mx-auto grid max-w-md grid-cols-4 gap-1">
          {bottomItems.map((item) => (
            <BottomLink
              activeHref={activeBottomHref}
              item={item}
              key={item.href}
            />
          ))}
        </div>
      </nav>
    </>
  );
}
