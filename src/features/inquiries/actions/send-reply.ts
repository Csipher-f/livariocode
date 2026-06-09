"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";

import { createClient } from "@/supabase/server-client";
import { getAuthenticatedUser } from "@/supabase/auth";
import { createNotification } from "@/features/notifications/actions/create-notification";
import type { ReplyWithProfile } from "./get-inquiry-thread";

const replySchema = z.object({
  inquiryId: z.string().uuid(),
  message: z.string().trim().min(1, "Message cannot be empty").max(2000, "Message is too long"),
});

export type SendReplyResult =
  | {
      success: true;
      reply: ReplyWithProfile;
      message: string;
    }
  | {
      success: false;
      message: string;
    };

export async function sendReply(input: {
  inquiryId: string;
  message: string;
}): Promise<SendReplyResult> {
  const authSession = await getAuthenticatedUser();
  if (!authSession || !authSession.user || !authSession.profile) {
    return {
      success: false,
      message: "Please log in to send a reply.",
    };
  }

  const parsed = replySchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Invalid input.",
    };
  }

  const { inquiryId, message } = parsed.data;
  const supabase = await createClient();

  // Fetch parent inquiry to verify membership and status
  const { data: inquiry, error: inquiryError } = await supabase
    .from("inquiries")
    .select("id, sender_id, recipient_id, status, property_id")
    .eq("id", inquiryId)
    .maybeSingle();

  if (inquiryError || !inquiry) {
    console.error("Failed to lookup parent inquiry", inquiryError?.message);
    return {
      success: false,
      message: "This inquiry thread could not be found.",
    };
  }

  // Validate user is part of the thread
  if (inquiry.sender_id !== authSession.user.id && inquiry.recipient_id !== authSession.user.id) {
    return {
      success: false,
      message: "You are not authorized to reply to this thread.",
    };
  }

  // Verify not closed
  if (inquiry.status === "closed") {
    return {
      success: false,
      message: "This inquiry has been closed. No further replies can be sent.",
    };
  }

  // Insert the reply
  const { data: newReply, error: replyError } = await supabase
    .from("inquiry_replies")
    .insert({
      inquiry_id: inquiryId,
      sender_id: authSession.user.id,
      message: message,
    })
    .select("id, created_at")
    .single();

  if (replyError || !newReply) {
    console.error("Failed to insert reply", replyError?.message);
    return {
      success: false,
      message: "Failed to send your message. Please try again.",
    };
  }

  // Update inquiry status to responded
  const { error: statusError } = await supabase
    .from("inquiries")
    .update({ status: "responded" })
    .eq("id", inquiryId);

  if (statusError) {
    console.error("Failed to update parent inquiry status", statusError.message);
  }

  // Determine who should be notified about the reply
  const isSenderTenant = inquiry.sender_id === authSession.user.id;
  const notifyUserId = isSenderTenant ? inquiry.recipient_id : inquiry.sender_id;

  // Fetch property title for notification
  const { data: replyProperty } = await supabase
    .from("properties")
    .select("title")
    .eq("id", inquiry.property_id)
    .maybeSingle();

  createNotification({
    userId: notifyUserId,
    type: "inquiry_reply",
    title: "New reply to your inquiry",
    body: `${authSession.profile.full_name ?? "Someone"} replied to your inquiry about ${replyProperty?.title ?? "a property"}`,
    resourceId: inquiryId,
    resourceType: "inquiry",
  });

  // Revalidate paths
  revalidatePath(`/dashboard/tenant/inquiries`);
  revalidatePath(`/dashboard/tenant/inquiries/${inquiryId}`);
  revalidatePath(`/dashboard/landlord/inquiries`);
  revalidatePath(`/dashboard/landlord/inquiries/${inquiryId}`);
  revalidatePath(`/dashboard/landlord`);
  revalidatePath(`/dashboard/tenant`);

  return {
    success: true,
    message: "Reply sent successfully.",
    reply: {
      id: newReply.id,
      inquiryId,
      senderId: authSession.user.id,
      message,
      createdAt: newReply.created_at,
      senderName: authSession.profile.full_name ?? "Livario User",
      senderAvatarUrl: authSession.profile.avatar_url ?? null,
    },
  };
}
