"use server";

import { createClient } from "@/supabase/server-client";
import { getCurrentUser } from "@/supabase/auth";
import type { InquiryStatus } from "@/types/database";

export type ReplyWithProfile = {
  id: string;
  inquiryId: string;
  senderId: string;
  message: string;
  createdAt: string;
  senderName: string;
  senderAvatarUrl: string | null;
};

export type InquiryThread = {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyThumbnailUrl: string | null;
  tenantId: string;
  tenantName: string;
  tenantAvatarUrl: string | null;
  tenantEmail: string | null;
  landlordId: string;
  landlordName: string;
  landlordAvatarUrl: string | null;
  landlordEmail: string | null;
  status: InquiryStatus;
  originalMessage: string;
  createdAt: string;
  replies: ReplyWithProfile[];
};

type ImageRow = {
  image_url: string;
  is_primary: boolean;
  display_order: number;
};

type PropertyRow = {
  id: string;
  title: string;
  property_images: ImageRow[];
};

type ProfileRow = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  email: string | null;
};

type InquiryQueryRow = {
  id: string;
  message: string;
  status: InquiryStatus;
  created_at: string;
  sender_id: string;
  recipient_id: string;
  property_id: string;
  properties: PropertyRow | null;
  tenant: ProfileRow | null;
  landlord: ProfileRow | null;
};

type ReplyQueryRow = {
  id: string;
  inquiry_id: string;
  sender_id: string;
  message: string;
  created_at: string;
  profiles: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
};

function getPrimaryImage(images: ImageRow[] | null | undefined) {
  if (!images || images.length === 0) return null;
  return images.find((img) => img.is_primary)?.image_url ?? images[0].image_url;
}

export async function getInquiryThread(inquiryId: string): Promise<InquiryThread | null> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized: Please log in.");
  }

  const supabase = await createClient();

  const { data: inquiry, error: inquiryError } = await supabase
    .from("inquiries")
    .select(`
      id,
      message,
      status,
      created_at,
      sender_id,
      recipient_id,
      property_id,
      properties(
        id,
        title,
        property_images(image_url, is_primary, display_order)
      ),
      tenant:profiles!inquiries_sender_id_fkey(id, full_name, avatar_url, email),
      landlord:profiles!inquiries_recipient_id_fkey(id, full_name, avatar_url, email)
    `)
    .eq("id", inquiryId)
    .maybeSingle();

  if (inquiryError || !inquiry) {
    console.error("Failed to fetch inquiry thread", inquiryError?.message);
    return null;
  }

  const typedInquiry = inquiry as unknown as InquiryQueryRow;

  // Validate that the user is part of this inquiry
  if (typedInquiry.sender_id !== user.id && typedInquiry.recipient_id !== user.id) {
    throw new Error("Unauthorized: You do not have access to this thread.");
  }

  const { data: repliesData, error: repliesError } = await supabase
    .from("inquiry_replies")
    .select(`
      id,
      inquiry_id,
      sender_id,
      message,
      created_at,
      profiles(
        full_name,
        avatar_url
      )
    `)
    .eq("inquiry_id", inquiryId)
    .order("created_at", { ascending: true });

  if (repliesError) {
    console.error("Failed to fetch inquiry replies", repliesError.message);
  }

  const typedReplies = (repliesData || []) as unknown as ReplyQueryRow[];

  const replies: ReplyWithProfile[] = typedReplies.map((r) => ({
    id: r.id,
    inquiryId: r.inquiry_id,
    senderId: r.sender_id,
    message: r.message,
    createdAt: r.created_at,
    senderName: r.profiles?.full_name ?? "Livario User",
    senderAvatarUrl: r.profiles?.avatar_url ?? null,
  }));

  const propertyThumbnailUrl = getPrimaryImage(typedInquiry.properties?.property_images);

  return {
    id: typedInquiry.id,
    propertyId: typedInquiry.property_id,
    propertyTitle: typedInquiry.properties?.title ?? "Untitled listing",
    propertyThumbnailUrl,
    tenantId: typedInquiry.sender_id,
    tenantName: typedInquiry.tenant?.full_name ?? "Livario tenant",
    tenantAvatarUrl: typedInquiry.tenant?.avatar_url ?? null,
    tenantEmail: typedInquiry.tenant?.email ?? null,
    landlordId: typedInquiry.recipient_id,
    landlordName: typedInquiry.landlord?.full_name ?? "Livario landlord",
    landlordAvatarUrl: typedInquiry.landlord?.avatar_url ?? null,
    landlordEmail: typedInquiry.landlord?.email ?? null,
    status: typedInquiry.status,
    originalMessage: typedInquiry.message,
    createdAt: typedInquiry.created_at,
    replies,
  };
}
