import { redirect } from "next/navigation";

import { ProfileForm } from "@/features/settings/components/ProfileForm";
import { getCurrentProfile, requireUser } from "@/supabase/auth";

export const metadata = {
  title: "Profile Settings - Livario",
  description: "Update your profile details on Livario.",
};

export default async function ProfileSettingsPage() {
  await requireUser();
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/onboarding");
  }

  return <ProfileForm profile={profile} />;
}
