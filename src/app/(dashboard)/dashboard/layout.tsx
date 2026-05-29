import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { LandlordSidebar } from "@/features/dashboard/components/landlord-sidebar";
import { TenantSidebar } from "@/features/dashboard/components/tenant-sidebar";
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

  return (
    <div className="min-h-screen bg-secondary/30 lg:flex">
      {profile.active_role === "landlord" ? (
        <LandlordSidebar profile={profile} />
      ) : (
        <TenantSidebar profile={profile} />
      )}
      <div className="min-w-0 flex-1 pb-20 lg:pb-0">{children}</div>
    </div>
  );
}
