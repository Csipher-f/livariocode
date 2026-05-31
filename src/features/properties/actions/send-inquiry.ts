"use server";

import { z } from "zod";

import { createClient } from "@/supabase/server-client";

const inquirySchema = z.object({
  propertyId: z.string().uuid(),
  message: z.string().trim().min(10).max(1000),
});

export type SendInquiryState =
  | {
      success: true;
      message: string;
    }
  | {
      success: false;
      message: string;
    };

type InquiryPropertyRow = {
  id: string;
  owner_id: string;
  status: "published";
};

export async function sendInquiry(input: {
  propertyId: string;
  message: string;
}): Promise<SendInquiryState> {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    if (userError) {
      console.error("Inquiry auth lookup failed", userError.message);
    }

    return {
      success: false,
      message: "Please log in to contact this landlord.",
    };
  }

  const parsedInput = inquirySchema.safeParse(input);

  if (!parsedInput.success) {
    return {
      success: false,
      message: "Add a message of at least 10 characters before sending.",
    };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id,is_tenant,active_role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    console.error("Inquiry profile lookup failed", profileError.message);

    return {
      success: false,
      message: "We could not send your inquiry right now. Please try again.",
    };
  }

  if (!profile?.is_tenant || profile.active_role !== "tenant") {
    return {
      success: false,
      message: "Switch to tenant mode before contacting landlords.",
    };
  }

  const { data: property, error: propertyError } = await supabase
    .from("properties")
    .select("id,owner_id,status")
    .eq("id", parsedInput.data.propertyId)
    .eq("status", "published")
    .maybeSingle();

  if (propertyError || !property) {
    if (propertyError) {
      console.error("Inquiry property lookup failed", propertyError.message);
    }

    return {
      success: false,
      message: "This listing is no longer available.",
    };
  }

  const publishedProperty = property as InquiryPropertyRow;

  if (publishedProperty.owner_id === user.id) {
    return {
      success: false,
      message: "You cannot inquire about your own property.",
    };
  }

  const { error: inquiryError } = await supabase.from("inquiries").insert({
    property_id: publishedProperty.id,
    sender_id: user.id,
    recipient_id: publishedProperty.owner_id,
    message: parsedInput.data.message,
    status: "pending",
  });

  if (inquiryError) {
    console.error("Inquiry insert failed", inquiryError.message);

    return {
      success: false,
      message: "We could not send your inquiry right now. Please try again.",
    };
  }

  return {
    success: true,
    message: "Your inquiry has been sent. The landlord can now respond.",
  };
}
