"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Shield, Palette, Bell } from "lucide-react";

import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const settingsTabs = [
  {
    href: "/settings/profile",
    label: "Profile",
    icon: User,
    isPlaceholder: false,
  },
  {
    href: "/settings/account",
    label: "Account",
    icon: Shield,
    isPlaceholder: false,
  },
  {
    href: "#appearance",
    label: "Appearance",
    icon: Palette,
    isPlaceholder: true,
  },
  {
    href: "#notifications",
    label: "Notifications",
    icon: Bell,
    isPlaceholder: true,
  },
];

export function SettingsNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/settings/profile") {
      return pathname === "/settings" || pathname === "/settings/profile";
    }
    return pathname === href;
  };

  const handlePlaceholderClick = (e: React.MouseEvent, label: string) => {
    e.preventDefault();
    toast({
      title: `${label} Settings`,
      description: "This feature is on the way.",
    });
  };

  return (
    <nav className="flex flex-row overflow-x-auto border-b border-border pb-px lg:flex-col lg:border-b-0 lg:border-r lg:pb-0 lg:pr-4 gap-1 no-scrollbar">
      {settingsTabs.map((tab) => {
        const Icon = tab.icon;
        const active = isActive(tab.href);

        if (tab.isPlaceholder) {
          return (
            <button
              key={tab.label}
              onClick={(e) => handlePlaceholderClick(e, tab.label)}
              className="flex items-center gap-3 border-b-2 border-transparent px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground lg:border-b-0 lg:border-l-2 lg:px-4 lg:py-2.5 transition-all text-left whitespace-nowrap cursor-pointer focus-visible:outline-none"
              type="button"
            >
              <Icon className="size-4 shrink-0" />
              <span>{tab.label}</span>
              <span className="ml-auto text-[10px] font-semibold tracking-wider uppercase bg-muted text-muted-foreground px-1.5 py-0.5 rounded-sm">
                Soon
              </span>
            </button>
          );
        }

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "flex items-center gap-3 border-b-2 px-3 py-2.5 text-sm font-medium transition-all whitespace-nowrap lg:border-b-0 lg:border-l-2 lg:px-4 lg:py-2.5",
              active
                ? "border-primary text-primary font-semibold lg:border-l-primary"
                : "border-transparent text-muted-foreground hover:text-foreground lg:border-l-transparent"
            )}
          >
            <Icon className="size-4 shrink-0" />
            <span>{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
