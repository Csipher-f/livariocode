import "server-only";

import { redirect } from "next/navigation";

import {
  DEFAULT_UNAUTHENTICATED_PATH,
  ONBOARDING_PATH,
} from "@/constants/routes";
import { getDashboardPathForRole } from "@/features/auth/utils/redirects";
import { getCurrentProfile, requireUser } from "@/supabase/auth";

export async function isAdmin() {
  const profile = await getCurrentProfile();

  return profile?.is_admin === true;
}

export async function requireAdmin() {
  await requireUser(DEFAULT_UNAUTHENTICATED_PATH);
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect(ONBOARDING_PATH);
  }

  if (!profile.is_admin) {
    redirect(getDashboardPathForRole(profile.active_role));
  }

  return profile;
}
