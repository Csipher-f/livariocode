import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";

import {
  DEFAULT_UNAUTHENTICATED_PATH,
  DEFAULT_AUTHENTICATED_PATH,
  ONBOARDING_PATH,
} from "@/constants/routes";
import { getDashboardPathForRole } from "@/features/auth/utils/redirects";
import { createClient } from "@/supabase/server-client";
import type { AuthenticatedUser, RoleGuardOptions } from "@/types/auth";
import type { ActiveRole, Profile } from "@/types/database";

export const getCurrentUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
});

export const getCurrentProfile = cache(async (): Promise<Profile | null> => {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select(
      "id,email,full_name,is_tenant,is_landlord,active_role,avatar_url,created_at,updated_at"
    )
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    return null;
  }

  return data;
});

export const getAuthenticatedUser = cache(
  async (): Promise<AuthenticatedUser | null> => {
    const user = await getCurrentUser();

    if (!user) {
      return null;
    }

    const profile = await getCurrentProfile();

    return {
      user,
      profile,
    };
  }
);

export async function requireUser(redirectTo = DEFAULT_UNAUTHENTICATED_PATH) {
  const user = await getCurrentUser();

  if (!user) {
    redirect(redirectTo);
  }

  return user;
}

export async function requireRole({
  allowedRoles,
  redirectTo = DEFAULT_UNAUTHENTICATED_PATH,
}: RoleGuardOptions = {}) {
  const user = await requireUser(redirectTo);
  const profile = await getCurrentProfile();

  if (
    allowedRoles?.length &&
    !allowedRoles.includes(profile?.active_role as ActiveRole)
  ) {
    redirect(DEFAULT_AUTHENTICATED_PATH);
  }

  return {
    user,
    profile,
  };
}

export async function redirectIfAuthenticated(
  redirectTo = DEFAULT_AUTHENTICATED_PATH
) {
  const authenticatedUser = await getAuthenticatedUser();

  if (authenticatedUser) {
    redirect(
      authenticatedUser.profile
        ? getDashboardPathForRole(authenticatedUser.profile.active_role)
        : redirectTo === DEFAULT_AUTHENTICATED_PATH
          ? ONBOARDING_PATH
          : redirectTo
    );
  }
}
