"use client";

import Link from "next/link";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type MobileMenuLink = {
  href: string;
  label: string;
};

type MobileMenuProps = {
  links: MobileMenuLink[];
  isAuthenticated: boolean;
  dashboardHref: string;
  profileLabel: string;
};

export function MobileMenu({
  links,
  isAuthenticated,
  dashboardHref,
  profileLabel,
}: MobileMenuProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          aria-label="Open navigation menu"
          className="md:hidden"
          size="icon"
          variant="ghost"
        >
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[88vw] max-w-sm p-6" side="right">
        <SheetHeader>
          <SheetTitle className="text-left text-xl">Livario</SheetTitle>
        </SheetHeader>
        <nav aria-label="Mobile navigation" className="mt-4 grid gap-2">
          {links.map((link) => (
            <SheetClose asChild key={link.href}>
              <Link
                className="rounded-md px-1 py-3 text-base font-medium transition-colors hover:text-muted-foreground"
                href={link.href}
              >
                {link.label}
              </Link>
            </SheetClose>
          ))}
        </nav>
        <SheetFooter>
          {isAuthenticated ? (
            <>
              <SheetClose asChild>
                <Button asChild className="w-full" size="lg">
                  <Link href={dashboardHref}>Dashboard</Link>
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button asChild className="w-full" size="lg" variant="outline">
                  <Link href="/settings">{profileLabel}</Link>
                </Button>
              </SheetClose>
            </>
          ) : (
            <>
              <SheetClose asChild>
                <Button asChild className="w-full" size="lg">
                  <Link href="/signup">Get Started</Link>
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button asChild className="w-full" size="lg" variant="outline">
                  <Link href="/login">Log in</Link>
                </Button>
              </SheetClose>
            </>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
