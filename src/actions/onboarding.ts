"use server";

import { redirect } from "next/navigation";

import { getDashboardPathForRole } from "@/features/auth/utils/redirects";
import { onboardingRoleSchema } from "@/lib/auth-validation";
import { getFormString } from "@/lib/form-data";
import { createClient } from "@/supabase/server-client";
import type { ActiveRole } from "@/types/database";

function getRoleFlags(activeRole: ActiveRole) {
  return {
    is_tenant: true,
    is_landlord: activeRole === "landlord",
    active_role: activeRole,
  };
}

function getUserFullName(userMetadata: Record<string, unknown> | undefined) {
  const fullName = userMetadata?.full_name;

  return typeof fullName === "string" ? fullName : null;
}

export async function chooseOnboardingRole(formData: FormData) {
  const parsed = onboardingRoleSchema.safeParse({
    activeRole: getFormString(formData, "activeRole"),
  });

  if (!parsed.success) {
    throw new Error("Choose how you would like to use Livario.");
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("Onboarding user lookup failed", { error: userError });
    throw new Error("Please log in again to finish onboarding.");
  }

  const roleFields = getRoleFlags(parsed.data.activeRole);
  const { data: updatedProfile, error: updateError } = await supabase
    .from("profiles")
    .update(roleFields)
    .eq("id", user.id)
    .select("id")
    .maybeSingle();

  if (updateError) {
    console.error("Onboarding profile update failed", {
      userId: user.id,
      activeRole: parsed.data.activeRole,
      error: updateError,
    });
    throw new Error(
      "We could not save your onboarding choice. Please try again."
    );
  }

  if (!updatedProfile) {
    const { error: insertError } = await supabase.from("profiles").insert({
      id: user.id,
      email: user.email ?? null,
      full_name: getUserFullName(user.user_metadata),
      ...roleFields,
    });

    if (insertError) {
      console.error("Onboarding profile insert failed", {
        userId: user.id,
        activeRole: parsed.data.activeRole,
        error: insertError,
      });
      throw new Error(
        "We could not save your onboarding choice. Please try again."
      );
    }
  }

  redirect(getDashboardPathForRole(parsed.data.activeRole));
}
