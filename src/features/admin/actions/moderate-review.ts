"use server";

import { revalidatePath } from "next/cache";

import { getCurrentProfile } from "@/supabase/auth";
import { createClient } from "@/supabase/server-client";

export async function publishReview(
  reviewId: string
): Promise<{ success: boolean; message: string }> {
  try {
    const profile = await getCurrentProfile();
    if (!profile || !profile.is_admin) {
      return {
        success: false,
        message: "Unauthorized. Admin permissions required.",
      };
    }

    const supabase = await createClient();
    const { error } = await supabase
      .from("property_reviews")
      .update({ status: "published" })
      .eq("id", reviewId);

    if (error) {
      console.error("Error publishing review:", error);

      return {
        success: false,
        message: error.message,
      };
    }

    revalidatePath("/admin/reviews");

    return {
      success: true,
      message: "Review has been published successfully.",
    };
  } catch (err) {
    console.error("Failed to publish review:", err);
    const message =
      err instanceof Error ? err.message : "An unexpected error occurred.";

    return {
      success: false,
      message,
    };
  }
}

export async function hideReview(
  reviewId: string
): Promise<{ success: boolean; message: string }> {
  try {
    const profile = await getCurrentProfile();
    if (!profile || !profile.is_admin) {
      return {
        success: false,
        message: "Unauthorized. Admin permissions required.",
      };
    }

    const supabase = await createClient();
    const { error } = await supabase
      .from("property_reviews")
      .update({ status: "hidden" })
      .eq("id", reviewId);

    if (error) {
      console.error("Error hiding review:", error);

      return {
        success: false,
        message: error.message,
      };
    }

    revalidatePath("/admin/reviews");

    return {
      success: true,
      message: "Review has been hidden successfully.",
    };
  } catch (err) {
    console.error("Failed to hide review:", err);
    const message =
      err instanceof Error ? err.message : "An unexpected error occurred.";

    return {
      success: false,
      message,
    };
  }
}
