import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { LandlordSidebar } from "@/features/dashboard/components/landlord-sidebar";
import { TenantSidebar } from "@/features/dashboard/components/tenant-sidebar";
import { SettingsNav } from "@/features/settings/components/SettingsNav";
import { getCurrentProfile, requireUser } from "@/supabase/auth";

export default async function SettingsLayout({
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
    <div className="min-h-screen bg-[#FDFAF7] lg:flex">
      {profile.active_role === "landlord" ? (
        <LandlordSidebar profile={profile} />
      ) : (
        <TenantSidebar profile={profile} />
      )}
      <div className="min-w-0 flex-1 pb-20 lg:pb-0">
        <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold tracking-tight text-[#1C1612]">Settings</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Manage your profile details, security preferences, and configurations.
            </p>
          </div>

          <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
            <aside className="w-full shrink-0 lg:w-64">
              <SettingsNav />
            </aside>
            <div className="min-w-0 flex-1 bg-[#FFF8F2] rounded-xl border border-[#E8DDD4] p-6 shadow-xs">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
