"use client";

import {
  CreditCard,
  FileText,
  Heart,
  Home,
  Inbox,
  MessageCircle,
  Search,
  User,
  Wrench,
} from "lucide-react";

import { DashboardNav } from "@/features/dashboard/components/dashboard-nav";
import type { Profile } from "@/types/database";
import type { Notification } from "@/features/notifications/actions/get-notifications";

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

export function TenantSidebar({
  profile,
  unreadCount = 0,
  notifications = [],
}: {
  profile: Profile;
  unreadCount?: number;
  notifications?: Notification[];
}) {
  return (
    <DashboardNav
      activeItems={tenantActiveItems}
      bottomItems={tenantBottomItems}
      comingSoonItems={tenantComingSoonItems}
      profile={profile}
      title="Tenant dashboard"
      unreadCount={unreadCount}
      notifications={notifications}
    />
  );
}
