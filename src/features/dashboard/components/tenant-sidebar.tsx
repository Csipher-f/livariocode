"use client";

import { Heart, Home, Inbox, Search, Settings } from "lucide-react";

import { DashboardNav } from "@/features/dashboard/components/dashboard-nav";
import type { Profile } from "@/types/database";

const tenantItems = [
  {
    href: "/dashboard/tenant",
    label: "Dashboard",
    icon: Home,
  },
  {
    href: "/listings",
    label: "Browse",
    icon: Search,
  },
  {
    href: "/dashboard/tenant/saved",
    label: "Saved Listings",
    icon: Heart,
  },
  {
    href: "/dashboard/tenant/inquiries",
    label: "Inquiries",
    icon: Inbox,
  },
  {
    href: "/settings",
    label: "Settings",
    icon: Settings,
  },
];

export function TenantSidebar({ profile }: { profile: Profile }) {
  return (
    <DashboardNav
      items={tenantItems}
      profile={profile}
      title="Tenant dashboard"
    />
  );
}
