"use client";

import { Building2, Home, Inbox, Settings } from "lucide-react";

import { DashboardNav } from "@/features/dashboard/components/dashboard-nav";
import type { Profile } from "@/types/database";

const landlordItems = [
  {
    href: "/dashboard/landlord",
    label: "Dashboard",
    icon: Home,
  },
  {
    href: "/dashboard/landlord/properties",
    label: "My Properties",
    icon: Building2,
  },
  {
    href: "/dashboard/landlord/inquiries",
    label: "Inquiries",
    icon: Inbox,
  },
  {
    href: "/settings",
    label: "Settings",
    icon: Settings,
  },
];

export function LandlordSidebar({ profile }: { profile: Profile }) {
  return (
    <DashboardNav
      items={landlordItems}
      profile={profile}
      title="Landlord dashboard"
    />
  );
}
