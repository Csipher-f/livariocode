"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireActiveLandlord } from "@/features/properties/actions/property-action-utils";
import { createClient } from "@/supabase/server-client";
import type { InquiryStatus } from "@/types/database";

export type LandlordInquiry = {
  id: string;
  propertyTitle: string;
  senderName: string;
  senderEmail: string | null;
  message: string;
  status: InquiryStatus;
  createdAt: string;
  lastMessageContent: string;
  lastActivityAt: string;
  hasNewReplies: boolean;
};

type InquiryProfileJoin = {
  full_name: string | null;
  email: string | null;
};

type InquiryPropertyJoin = {
  title: string | null;
};

type ReplyRow = {
  sender_id: string;
  message: string;
  created_at: string;
};

type InquiryRow = {
  id: string;
  sender_id: string;
  message: string;
  status: InquiryStatus;
  created_at: string;
  profiles: InquiryProfileJoin | null;
  properties: InquiryPropertyJoin | null;
  inquiry_replies: ReplyRow[] | null;
};

const inquiryIdSchema = z.string().uuid();

function mapInquiry(row: InquiryRow, landlordId: string): LandlordInquiry {
  const replies = row.inquiry_replies || [];
  // Sort replies in chronological order
  const sortedReplies = [...replies].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  const hasReplies = sortedReplies.length > 0;
  const latestMessage = hasReplies
    ? sortedReplies[sortedReplies.length - 1]
    : null;

  const lastMessageContent = latestMessage ? latestMessage.message : row.message;
  const lastActivityAt = latestMessage ? latestMessage.created_at : row.created_at;

  const lastSenderId = latestMessage ? latestMessage.sender_id : row.sender_id;

  // Landlord has unread if the last message is from the tenant (not landlord)
  // and status is pending or responded
  const hasNewReplies =
    lastSenderId !== landlordId &&
    (row.status === "pending" || row.status === "responded");

  return {
    id: row.id,
    propertyTitle: row.properties?.title ?? "Untitled listing",
    senderName: row.profiles?.full_name ?? "Livario tenant",
    senderEmail: row.profiles?.email ?? null,
    message: row.message,
    status: row.status,
    createdAt: row.created_at,
    lastMessageContent,
    lastActivityAt,
    hasNewReplies,
  };
}

export async function getReceivedInquiries({
  limit,
  landlordId,
}: {
  limit?: number;
  landlordId: string;
}): Promise<LandlordInquiry[]> {
  const supabase = await createClient();
  let query = supabase
    .from("inquiries")
    .select(
      `
        id,
        sender_id,
        message,
        status,
        created_at,
        profiles!inquiries_sender_id_fkey(full_name,email),
        properties(title),
        inquiry_replies(
          sender_id,
          message,
          created_at
        )
      `
    )
    .eq("recipient_id", landlordId)
    .order("created_at", { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Failed to fetch received inquiries", error.message);
    return [];
  }

  return ((data ?? []) as unknown as InquiryRow[]).map((row) =>
    mapInquiry(row, landlordId)
  );
}

export async function getReceivedInquiryCount(landlordId: string) {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("inquiries")
    .select("id", { count: "exact", head: true })
    .eq("recipient_id", landlordId);

  if (error) {
    return 0;
  }

  return count ?? 0;
}

export async function markInquiryAsRead(input: {
  inquiryId: string;
}): Promise<{ success: boolean; message: string }> {
  const landlord = await requireActiveLandlord();

  if (landlord.error || !landlord.user) {
    return {
      success: false,
      message: landlord.error ?? "You are not allowed to update inquiries.",
    };
  }

  const parsedInput = inquiryIdSchema.safeParse(input.inquiryId);

  if (!parsedInput.success) {
    return {
      success: false,
      message: "This inquiry could not be found.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("inquiries")
    .update({ status: "read" })
    .eq("id", parsedInput.data)
    .eq("recipient_id", landlord.user.id);

  if (error) {
    return {
      success: false,
      message: "We could not mark this inquiry as read.",
    };
  }

  revalidatePath("/dashboard/landlord");
  revalidatePath("/dashboard/landlord/inquiries");

  return {
    success: true,
    message: "Inquiry marked as read.",
  };
}
