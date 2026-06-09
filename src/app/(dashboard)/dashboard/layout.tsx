import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { LandlordSidebar } from "@/features/dashboard/components/landlord-sidebar";
import { TenantSidebar } from "@/features/dashboard/components/tenant-sidebar";
import {
  getNotifications,
  getUnreadCount,
} from "@/features/notifications/actions/get-notifications";
import { getCurrentProfile, requireUser } from "@/supabase/auth";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireUser();
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/onboarding");
  }

  const [unreadCount, notifications] = await Promise.all([
    getUnreadCount(profile.id),
    getNotifications(profile.id),
  ]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#FDFAF7] lg:flex">
      {profile.active_role === "landlord" ? (
        <LandlordSidebar
          profile={profile}
          unreadCount={unreadCount}
          notifications={notifications}
        />
      ) : (
        <TenantSidebar
          profile={profile}
          unreadCount={unreadCount}
          notifications={notifications}
        />
      )}
      <div className="min-w-0 w-full flex-1 pb-20 lg:pb-0">{children}</div>
    </div>
  );
}
