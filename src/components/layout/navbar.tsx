import Link from "next/link";

import { MobileMenu } from "@/components/layout/mobile-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LivarioLogo } from "@/components/livario-logo";
import { getDashboardPathForRole } from "@/features/auth/utils/redirects";
import { getAuthenticatedUser } from "@/supabase/auth";

const publicLinks = [
  { href: "/listings", label: "Browse" },
  { href: "/#how-it-works", label: "How it works" },
] as const;

function getInitials(name?: string | null, email?: string | null) {
  const value = name ?? email ?? "Livario user";
  const parts = value.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return "LU";
  }

  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export async function Navbar() {
  const authenticatedUser = await getAuthenticatedUser();
  const profile = authenticatedUser?.profile;
  const dashboardHref = profile
    ? getDashboardPathForRole(profile.active_role)
    : "/onboarding";
  const displayName =
    profile?.full_name ?? authenticatedUser?.user.email ?? "Your profile";
  const isAuthenticated = Boolean(authenticatedUser);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/82 backdrop-blur-xl supports-[backdrop-filter]:bg-background/72">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          aria-label="Livario home"
          href="/"
        >
          <LivarioLogo />
        </Link>

        <nav
          aria-label="Public navigation"
          className="hidden items-center gap-7 md:flex"
        >
          {publicLinks.map((link) => (
            <Link
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              href={link.href}
              key={link.href}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {isAuthenticated ? (
            <>
              <Button asChild variant="ghost">
                <Link href={dashboardHref}>Dashboard</Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    aria-label="Open profile menu"
                    className="rounded-full p-0"
                    size="icon"
                    variant="ghost"
                  >
                    <Avatar className="size-9">
                      {profile?.avatar_url ? (
                        <AvatarImage alt="" src={profile.avatar_url} />
                      ) : null}
                      <AvatarFallback>
                        {getInitials(profile?.full_name, profile?.email)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="truncate">
                    {displayName}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={dashboardHref}>Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">Profile settings</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button asChild variant="ghost">
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Get Started</Link>
              </Button>
            </>
          )}
        </div>

        <MobileMenu
          dashboardHref={dashboardHref}
          isAuthenticated={isAuthenticated}
          links={[...publicLinks]}
          profileLabel={displayName}
        />
      </div>
    </header>
  );
}
