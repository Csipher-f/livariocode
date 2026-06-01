"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";

import { createClient } from "@/supabase/server-client";
import { requireActiveLandlord } from "@/features/properties/actions/property-action-utils";

const closeInquirySchema = z.string().uuid();

export type CloseInquiryResult =
  | { success: true; message: string }
  | { success: false; message: string };

export async function closeInquiry(inquiryId: string): Promise<CloseInquiryResult> {
  const landlord = await requireActiveLandlord();
  if (landlord.error || !landlord.user) {
    return {
      success: false,
      message: landlord.error ?? "You are not authorized to perform this action.",
    };
  }

  const parsed = closeInquirySchema.safeParse(inquiryId);
  if (!parsed.success) {
    return {
      success: false,
      message: "Invalid inquiry ID.",
    };
  }

  const id = parsed.data;
  const supabase = await createClient();

  // Fetch the inquiry to confirm ownership
  const { data: inquiry, error: fetchError } = await supabase
    .from("inquiries")
    .select("id, recipient_id")
    .eq("id", id)
    .maybeSingle();

  if (fetchError || !inquiry) {
    console.error("Failed to fetch inquiry for closing", fetchError?.message);
    return {
      success: false,
      message: "The inquiry could not be found.",
    };
  }

  if (inquiry.recipient_id !== landlord.user.id) {
    return {
      success: false,
      message: "Unauthorized: Only the recipient landlord can close this inquiry.",
    };
  }

  const { error: updateError } = await supabase
    .from("inquiries")
    .update({ status: "closed" })
    .eq("id", id);

  if (updateError) {
    console.error("Failed to close inquiry", updateError.message);
    return {
      success: false,
      message: "Failed to close the inquiry. Please try again.",
    };
  }

  revalidatePath(`/dashboard/tenant/inquiries`);
  revalidatePath(`/dashboard/tenant/inquiries/${id}`);
  revalidatePath(`/dashboard/landlord/inquiries`);
  revalidatePath(`/dashboard/landlord/inquiries/${id}`);
  revalidatePath(`/dashboard/landlord`);
  revalidatePath(`/dashboard/tenant`);

  return {
    success: true,
    message: "Inquiry has been marked as closed.",
  };
}
