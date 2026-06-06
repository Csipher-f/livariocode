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

import { LivarioLogo } from "@/components/livario-logo";
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
              "flex min-h-11 items-center gap-3 px-3 text-sm font-medium transition",
              active
                ? "bg-[#FDE8DF] text-[#E8623A] font-medium rounded-lg"
                : "text-[#8C7B6B] hover:bg-[#F5EFE8] hover:text-[#1C1612] rounded-md"
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
        className="flex min-h-11 items-center gap-3 rounded-md px-3 text-left text-sm font-medium text-[#8C7B6B] transition hover:bg-[#F5EFE8] hover:text-[#1C1612] focus-visible:ring-3 focus-visible:ring-[#E8623A]/20 focus-visible:outline-none"
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
      <aside className="hidden w-72 shrink-0 bg-[#FFF8F2] border-r border-[#E8DDD4] text-[#1C1612] lg:flex lg:min-h-screen lg:flex-col">
        <div className="border-b border-[#E8DDD4] p-6">
          <Link href="/">
            <LivarioLogo />
          </Link>
          <div className="mt-3 flex items-center gap-2">
            <Badge className="border-0 bg-[#FDE8DF] text-[#C44D28] font-semibold" variant="outline">
              <Shield className="size-3" />
              Admin
            </Badge>
          </div>
        </div>

        <AdminLinks className="p-4" />

        <div className="mt-auto border-t border-[#E8DDD4] p-4">
          <Button asChild className="w-full justify-start" variant="secondary">
            <Link href="/">
              <ExternalLink className="size-4" />
              Main site
            </Link>
          </Button>
        </div>
      </aside>

      <header className="sticky top-0 z-40 border-b border-[#E8DDD4] bg-[#FFF8F2]/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-md items-center justify-between gap-3">
          <Link href="/">
            <LivarioLogo />
          </Link>

          <Sheet>
            <SheetTrigger asChild>
              <Button aria-label="Open admin menu" size="icon" variant="outline">
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent
              className="w-[min(22rem,88vw)] gap-4 border-[#E8DDD4] bg-[#FFF8F2] p-4 text-[#1C1612] sm:p-5"
              side="left"
            >
              <SheetHeader className="border-b border-[#E8DDD4] pb-4">
                <SheetTitle className="flex items-center gap-2 text-left text-xl text-[#1C1612]">
                  <Home className="size-5 text-[#E8623A]" />
                  <LivarioLogo />
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
