"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAdmin } from "@/lib/admin";
import { createClient } from "@/supabase/server-client";

const propertyInputSchema = z.object({
  propertyId: z.string().uuid(),
});

export type AdminActionResult =
  | {
      success: true;
      message: string;
    }
  | {
      success: false;
      message: string;
    };

export async function adminArchiveProperty(input: {
  propertyId: string;
}): Promise<AdminActionResult> {
  await requireAdmin();
  const parsedInput = propertyInputSchema.safeParse(input);

  if (!parsedInput.success) {
    return {
      success: false,
      message: "This listing could not be found.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("properties")
    .update({ status: "archived" })
    .eq("id", parsedInput.data.propertyId);

  if (error) {
    return {
      success: false,
      message: "We could not archive this listing right now.",
    };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/properties");
  revalidatePath("/listings");
  revalidatePath(`/listings/${parsedInput.data.propertyId}`);

  return {
    success: true,
    message: "Listing archived.",
  };
}

export async function adminDeleteProperty(input: {
  propertyId: string;
}): Promise<AdminActionResult> {
  await requireAdmin();
  const parsedInput = propertyInputSchema.safeParse(input);

  if (!parsedInput.success) {
    return {
      success: false,
      message: "This listing could not be found.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("properties")
    .delete()
    .eq("id", parsedInput.data.propertyId);

  if (error) {
    return {
      success: false,
      message: "We could not delete this listing right now.",
    };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/properties");
  revalidatePath("/listings");
  revalidatePath(`/listings/${parsedInput.data.propertyId}`);

  return {
    success: true,
    message: "Listing permanently deleted.",
  };
}
