"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
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
  const [open, setOpen] = useState(false);

  function closeMenu() {
    setOpen(false);
  }

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <Button
        aria-controls="mobile-navigation-drawer"
        aria-expanded={open}
        aria-label="Open navigation menu"
        className="md:hidden"
        onClick={() => setOpen(true)}
        size="icon"
        type="button"
        variant="ghost"
      >
        <Menu />
      </Button>
      <SheetContent
        className="w-[88vw] max-w-sm p-6"
        id="mobile-navigation-drawer"
        side="right"
      >
        <SheetHeader>
          <SheetTitle className="text-left text-xl">Livario</SheetTitle>
        </SheetHeader>
        <nav aria-label="Mobile navigation" className="mt-4 grid gap-2">
          {links.map((link) => (
            <Link
              className="rounded-md px-1 py-3 text-base font-medium transition-colors hover:text-muted-foreground"
              href={link.href}
              key={link.href}
              onClick={closeMenu}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <SheetFooter>
          {isAuthenticated ? (
            <>
              <Button asChild className="w-full" size="lg">
                <Link href={dashboardHref} onClick={closeMenu}>
                  Dashboard
                </Link>
              </Button>
              <Button asChild className="w-full" size="lg" variant="outline">
                <Link href="/settings" onClick={closeMenu}>
                  {profileLabel}
                </Link>
              </Button>
            </>
          ) : (
            <>
              <Button asChild className="w-full" size="lg">
                <Link href="/signup" onClick={closeMenu}>
                  Get Started
                </Link>
              </Button>
              <Button asChild className="w-full" size="lg" variant="outline">
                <Link href="/login" onClick={closeMenu}>
                  Log in
                </Link>
              </Button>
            </>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
