"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { ACTIVE_ROLES } from "@/constants/user-roles";
import { createClient } from "@/supabase/server-client";
import type { ActiveRole } from "@/types/database";

const updateProfileSchema = z.object({
  fullName: z.string().trim().min(2, "Name must be at least 2 characters."),
  avatarUrl: z.string().url().nullable().optional(),
});

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required."),
    newPassword: z.string().min(8, "New password must be at least 8 characters long."),
    confirmPassword: z.string().min(1, "Please confirm your new password."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "The passwords do not match yet.",
    path: ["confirmPassword"],
  });

const switchRoleSchema = z.object({
  activeRole: z.enum(ACTIVE_ROLES),
});

/**
 * Updates user profile: full name and avatar url.
 */
export async function updateProfile(payload: {
  fullName: string;
  avatarUrl?: string | null;
}) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      success: false,
      message: "You must be logged in to update your profile.",
    };
  }

  const parsed = updateProfileSchema.safeParse(payload);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message || "Invalid input.",
    };
  }

  const { fullName, avatarUrl } = parsed.data;

  type ProfileUpdate = {
    full_name: string;
    updated_at: string;
    avatar_url?: string | null;
  };

  const updateData: ProfileUpdate = {
    full_name: fullName,
    updated_at: new Date().toISOString(),
  };

  if (avatarUrl !== undefined) {
    updateData.avatar_url = avatarUrl;
  }

  const { error: updateError } = await supabase
    .from("profiles")
    .update(updateData)
    .eq("id", user.id);

  if (updateError) {
    console.error("Profile update error:", updateError);
    return {
      success: false,
      message: "Failed to update profile data.",
    };
  }

  revalidatePath("/settings");
  revalidatePath("/settings/profile");

  return {
    success: true,
    message: "Profile updated successfully.",
  };
}

/**
 * Changes user password. Verifies current password first using Supabase Auth.
 */
export async function changePassword(payload: z.infer<typeof changePasswordSchema>) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      success: false,
      message: "You must be logged in to change your password.",
    };
  }

  const parsed = changePasswordSchema.safeParse(payload);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message || "Invalid input.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { currentPassword, newPassword } = parsed.data;

  // Verify current password by attempting sign in
  const { error: verifyError } = await supabase.auth.signInWithPassword({
    email: user.email!,
    password: currentPassword,
  });

  if (verifyError) {
    return {
      success: false,
      message: "Incorrect current password.",
    };
  }

  // Update password
  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (updateError) {
    console.error("Password update error:", updateError);
    return {
      success: false,
      message: "Failed to update password.",
    };
  }

  return {
    success: true,
    message: "Password changed successfully.",
  };
}

/**
 * Switches the active role. Grants landlord capability if activating for the first time.
 */
export async function switchRole(payload: { activeRole: ActiveRole }) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      success: false,
      message: "You must be logged in to switch roles.",
    };
  }

  const parsed = switchRoleSchema.safeParse(payload);
  if (!parsed.success) {
    return {
      success: false,
      message: "Invalid role selected.",
    };
  }

  const { activeRole } = parsed.data;

  // Fetch profile to verify existing capability
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("is_tenant, is_landlord")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return {
      success: false,
      message: "Failed to retrieve your profile.",
    };
  }

  type RoleUpdate = {
    active_role: ActiveRole;
    updated_at: string;
    is_landlord?: boolean;
    is_tenant?: boolean;
  };

  const updateData: RoleUpdate = {
    active_role: activeRole,
    updated_at: new Date().toISOString(),
  };

  if (activeRole === "landlord" && !profile.is_landlord) {
    updateData.is_landlord = true;
  } else if (activeRole === "tenant" && !profile.is_tenant) {
    updateData.is_tenant = true;
  }

  const { error: updateError } = await supabase
    .from("profiles")
    .update(updateData)
    .eq("id", user.id);

  if (updateError) {
    console.error("Role switch database update error:", updateError);
    return {
      success: false,
      message: "Failed to switch role.",
    };
  }

  revalidatePath("/");
  revalidatePath("/settings");

  return {
    success: true,
    message: `Successfully switched to ${activeRole === "landlord" ? "Landlord" : "Tenant"} mode.`,
    redirectTo: activeRole === "landlord" ? "/dashboard/landlord" : "/dashboard/tenant",
  };
}