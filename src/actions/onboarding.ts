"use server";

import { redirect } from "next/navigation";

import { DEFAULT_AUTHENTICATED_PATH } from "@/constants/routes";
import { onboardingRoleSchema } from "@/lib/auth-validation";
import { getFormString } from "@/lib/form-data";
import { setInitialProfileRole } from "@/supabase/profiles";

export async function chooseOnboardingRole(formData: FormData) {
  const parsed = onboardingRoleSchema.safeParse({
    activeRole: getFormString(formData, "activeRole"),
  });

  if (!parsed.success) {
    throw new Error("Choose how you would like to use Livario.");
  }

  const { error } = await setInitialProfileRole(parsed.data.activeRole);

  if (error) {
    throw new Error(
      "We could not save your onboarding choice. Please try again."
    );
  }

  redirect(DEFAULT_AUTHENTICATED_PATH);
}
