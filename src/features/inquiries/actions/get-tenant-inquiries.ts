import "server-only";

import { createClient } from "@/supabase/server-client";
import type { InquiryStatus } from "@/types/database";

export type TenantInquiry = {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyThumbnailUrl: string | null;
  message: string;
  status: InquiryStatus;
  createdAt: string;
  lastMessageContent: string;
  lastActivityAt: string;
  hasNewReplies: boolean;
};

type TenantInquiryPropertyImageJoin = {
  image_url: string | null;
  is_primary: boolean | null;
  display_order: number | null;
};

type TenantInquiryPropertyJoin = {
  id: string;
  title: string | null;
  property_images: TenantInquiryPropertyImageJoin[] | null;
};

type ReplyRow = {
  sender_id: string;
  message: string;
  created_at: string;
};

type TenantInquiryRow = {
  id: string;
  sender_id: string;
  message: string;
  status: InquiryStatus;
  created_at: string;
  properties: TenantInquiryPropertyJoin | null;
  inquiry_replies: ReplyRow[] | null;
};

function getPrimaryImage(
  images: TenantInquiryPropertyImageJoin[] | null | undefined
) {
  return (
    images?.find((image) => image.is_primary)?.image_url ??
    images?.[0]?.image_url ??
    null
  );
}

function mapTenantInquiry(
  row: TenantInquiryRow,
  tenantId: string
): TenantInquiry | null {
  if (!row.properties) {
    return null;
  }

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

  // Tenant has unread if the last message is from the landlord (not tenant)
  // and status is responded
  const hasNewReplies =
    lastSenderId !== tenantId && row.status === "responded";

  return {
    id: row.id,
    propertyId: row.properties.id,
    propertyTitle: row.properties.title ?? "Untitled listing",
    propertyThumbnailUrl: getPrimaryImage(row.properties.property_images),
    message: row.message,
    status: row.status,
    createdAt: row.created_at,
    lastMessageContent,
    lastActivityAt,
    hasNewReplies,
  };
}

export async function getTenantInquiries({
  limit,
  tenantId,
}: {
  limit?: number;
  tenantId: string;
}): Promise<TenantInquiry[]> {
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
        properties(
          id,
          title,
          property_images(image_url,is_primary,display_order)
        ),
        inquiry_replies(
          sender_id,
          message,
          created_at
        )
      `
    )
    .eq("sender_id", tenantId)
    .order("created_at", { ascending: false })
    .order("display_order", {
      ascending: true,
      foreignTable: "properties.property_images",
    });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Failed to fetch tenant inquiries", error.message);
    return [];
  }

  return ((data ?? []) as unknown as TenantInquiryRow[]).flatMap((row) => {
    const inquiry = mapTenantInquiry(row, tenantId);

    return inquiry ? [inquiry] : [];
  });
}

export async function getTenantInquiryCount(tenantId: string) {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("inquiries")
    .select("id", { count: "exact", head: true })
    .eq("sender_id", tenantId);

  if (error) {
    return 0;
  }

  return count ?? 0;
}
