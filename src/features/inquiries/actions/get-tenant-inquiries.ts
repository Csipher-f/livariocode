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

type TenantInquiryRow = {
  id: string;
  message: string;
  status: InquiryStatus;
  created_at: string;
  properties: TenantInquiryPropertyJoin | null;
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

function mapTenantInquiry(row: TenantInquiryRow): TenantInquiry | null {
  if (!row.properties) {
    return null;
  }

  return {
    id: row.id,
    propertyId: row.properties.id,
    propertyTitle: row.properties.title ?? "Untitled listing",
    propertyThumbnailUrl: getPrimaryImage(row.properties.property_images),
    message: row.message,
    status: row.status,
    createdAt: row.created_at,
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
        message,
        status,
        created_at,
        properties(
          id,
          title,
          property_images(image_url,is_primary,display_order)
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
    return [];
  }

  return ((data ?? []) as unknown as TenantInquiryRow[]).flatMap((row) => {
    const inquiry = mapTenantInquiry(row);

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
