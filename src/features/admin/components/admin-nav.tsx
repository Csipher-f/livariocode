"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Building2,
  ExternalLink,
  FileWarning,
  Home,
  Inbox,
  Menu,
  Shield,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
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

const adminItems = [
  { href: "/admin", label: "Overview", icon: BarChart3 },
  { href: "/admin/properties", label: "Properties", icon: Building2 },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/inquiries", label: "Inquiries", icon: Inbox },
];

function isActive(pathname: string, href: string) {
  return pathname === href || (href !== "/admin" && pathname.startsWith(`${href}/`));
}

function showComingSoonToast() {
  toast({
    title: "Coming Soon",
    description: "Reports will be available in a future admin phase.",
  });
}

function AdminLinks({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Admin navigation" className={cn("grid gap-1", className)}>
      {adminItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(pathname, item.href);

        return (
          <Link
            className={cn(
              "flex min-h-11 items-center gap-3 rounded-md px-3 text-sm font-medium text-zinc-300 transition hover:bg-white/10 hover:text-white",
              active && "bg-white text-zinc-950 hover:bg-white hover:text-zinc-950"
            )}
            href={item.href}
            key={item.href}
          >
            <Icon className="size-4" />
            {item.label}
          </Link>
        );
      })}

      <button
        className="flex min-h-11 items-center gap-3 rounded-md px-3 text-left text-sm font-medium text-zinc-300 transition hover:bg-white/10 hover:text-white focus-visible:ring-3 focus-visible:ring-white/20 focus-visible:outline-none"
        onClick={showComingSoonToast}
        type="button"
      >
        <FileWarning className="size-4" />
        Reports
      </button>
    </nav>
  );
}

export function AdminNav() {
  return (
    <>
      <aside className="hidden w-72 shrink-0 bg-zinc-950 text-white lg:flex lg:min-h-screen lg:flex-col">
        <div className="border-b border-white/10 p-6">
          <Link className="text-lg font-semibold tracking-tight" href="/">
            Livario
          </Link>
          <div className="mt-3 flex items-center gap-2">
            <Badge className="border-white/10 bg-white/10 text-white" variant="outline">
              <Shield className="size-3" />
              Admin
            </Badge>
          </div>
        </div>

        <AdminLinks className="p-4" />

        <div className="mt-auto border-t border-white/10 p-4">
          <Button asChild className="w-full justify-start" variant="secondary">
            <Link href="/">
              <ExternalLink className="size-4" />
              Main site
            </Link>
          </Button>
        </div>
      </aside>

      <header className="sticky top-0 z-40 border-b border-border bg-background/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-md items-center justify-between gap-3">
          <Link className="text-lg font-semibold tracking-tight" href="/">
            Livario Admin
          </Link>

          <Sheet>
            <SheetTrigger asChild>
              <Button aria-label="Open admin menu" size="icon" variant="outline">
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent
              className="w-[min(22rem,88vw)] gap-4 border-zinc-800 bg-zinc-950 p-4 text-white sm:p-5"
              side="left"
            >
              <SheetHeader className="border-b border-white/10 pb-4">
                <SheetTitle className="flex items-center gap-2 text-left text-xl text-white">
                  <Home className="size-5" />
                  Livario Admin
                </SheetTitle>
              </SheetHeader>
              <AdminLinks />
              <Button asChild className="mt-auto justify-start" variant="secondary">
                <Link href="/">
                  <ExternalLink className="size-4" />
                  Main site
                </Link>
              </Button>
            </SheetContent>
          </Sheet>
        </div>
      </header>
    </>
  );
}
