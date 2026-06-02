import { redirect } from "next/navigation";

import { Separator } from "@/components/ui/separator";
import { PasswordForm } from "@/features/settings/components/PasswordForm";
import { RoleSwitcher } from "@/features/settings/components/RoleSwitcher";
import { getCurrentProfile, requireUser } from "@/supabase/auth";

export const metadata = {
  title: "Account Settings - Livario",
  description: "Manage your account credentials and switch active roles.",
};

export default async function AccountSettingsPage() {
  await requireUser();
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/onboarding");
  }

  return (
    <div className="space-y-8">
      <PasswordForm />
      <Separator />
      <RoleSwitcher profile={profile} />
    </div>
  );
}
