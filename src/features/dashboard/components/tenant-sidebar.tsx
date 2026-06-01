"use client";

import {
  CreditCard,
  FileText,
  Heart,
  Home,
  Inbox,
  MessageCircle,
  Search,
  Settings,
  User,
  Wrench,
} from "lucide-react";

import { DashboardNav } from "@/features/dashboard/components/dashboard-nav";
import type { Profile } from "@/types/database";

const tenantActiveItems = [
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

const tenantBottomItems = [
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
    href: "/dashboard/tenant/inquiries",
    label: "Inquiries",
    icon: Inbox,
  },
  {
    href: "/settings",
    label: "Profile",
    icon: User,
  },
];

const tenantComingSoonItems = [
  {
    label: "My Lease",
    icon: FileText,
  },
  {
    label: "Payments",
    icon: CreditCard,
  },
  {
    label: "Maintenance",
    icon: Wrench,
  },
  {
    label: "Messages",
    icon: MessageCircle,
  },
];

export function TenantSidebar({ profile }: { profile: Profile }) {
  return (
    <DashboardNav
      activeItems={tenantActiveItems}
      bottomItems={tenantBottomItems}
      comingSoonItems={tenantComingSoonItems}
      profile={profile}
      title="Tenant dashboard"
    />
  );
}
