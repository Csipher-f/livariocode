"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/supabase/server-client";
import { getCurrentProfile } from "@/supabase/auth";

export async function markAllNotificationsRead(): Promise<{
  success: boolean;
  message: string;
}> {
  const profile = await getCurrentProfile();

  if (!profile) {
    return {
      success: false,
      message: "You must be logged in.",
    };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("user_id", profile.id)
    .eq("is_read", false);

  if (error) {
    console.error("Failed to mark notifications as read", error.message);
    return {
      success: false,
      message: "Failed to mark notifications as read.",
    };
  }

  revalidatePath("/dashboard");

  return {
    success: true,
    message: "All notifications marked as read.",
  };
}
