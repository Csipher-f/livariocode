"use client";

import {
  Building2,
  CreditCard,
  FileText,
  Home,
  Inbox,
  MessageCircle,
  PlusCircle,
  User,
  Users,
} from "lucide-react";

import { DashboardNav } from "@/features/dashboard/components/dashboard-nav";
import type { Profile } from "@/types/database";
import type { Notification } from "@/features/notifications/actions/get-notifications";

const landlordActiveItems = [
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
    href: "/dashboard/landlord/properties/new",
    label: "Add Listing",
    icon: PlusCircle,
  },
  {
    href: "/dashboard/landlord/inquiries",
    label: "Inquiries",
    icon: Inbox,
  },
];

const landlordBottomItems = [
  {
    href: "/dashboard/landlord",
    label: "Dashboard",
    icon: Home,
  },
  {
    href: "/dashboard/landlord/properties",
    label: "Properties",
    icon: Building2,
  },
  {
    href: "/dashboard/landlord/inquiries",
    label: "Inquiries",
    icon: Inbox,
  },
  {
    href: "/settings",
    label: "Profile",
    icon: User,
  },
];

const landlordComingSoonItems = [
  {
    label: "Applications",
    icon: FileText,
  },
  {
    label: "Tenants",
    icon: Users,
  },
  {
    label: "Payments",
    icon: CreditCard,
  },
  {
    label: "Complaints",
    icon: Inbox,
  },
  {
    label: "Messages",
    icon: MessageCircle,
  },
];

export function LandlordSidebar({
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
      activeItems={landlordActiveItems}
      bottomItems={landlordBottomItems}
      comingSoonItems={landlordComingSoonItems}
      profile={profile}
      title="Landlord dashboard"
      unreadCount={unreadCount}
      notifications={notifications}
    />
  );
}
