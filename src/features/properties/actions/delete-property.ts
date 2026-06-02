"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireActiveLandlord } from "@/features/properties/actions/property-action-utils";
import { createClient } from "@/supabase/server-client";

const deletePropertySchema = z.object({
  propertyId: z.string().uuid(),
});

export type DeletePropertyResult =
  | {
      success: true;
      message: string;
    }
  | {
      success: false;
      message: string;
    };

export async function deleteProperty(input: {
  propertyId: string;
}): Promise<DeletePropertyResult> {
  const landlord = await requireActiveLandlord();

  if (landlord.error || !landlord.user) {
    return {
      success: false,
      message: landlord.error ?? "You are not allowed to delete listings.",
    };
  }

  const parsedInput = deletePropertySchema.safeParse(input);

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
    .eq("id", parsedInput.data.propertyId)
    .eq("owner_id", landlord.user.id);

  if (error) {
    return {
      success: false,
      message: "We could not archive this listing right now.",
    };
  }

  revalidatePath("/dashboard/landlord");
  revalidatePath("/dashboard/landlord/properties");
  revalidatePath(`/listings/${parsedInput.data.propertyId}`);
  revalidatePath("/listings");

  return {
    success: true,
    message: "Listing archived.",
  };
}
