"use client";

import { Heart, Search, Settings } from "lucide-react";

import { DashboardNav } from "@/features/dashboard/components/dashboard-nav";
import type { Profile } from "@/types/database";

const tenantItems = [
  {
    href: "/listings",
    label: "Browse",
    icon: Search,
  },
  {
    href: "/dashboard/tenant/saved",
    label: "Saved",
    icon: Heart,
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
