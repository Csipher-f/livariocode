import "server-only";

import { createClient } from "@/supabase/server-client";
import type {
  PaginatedProperties,
  PropertyListing,
} from "@/features/properties/types";

export const FAVORITES_PAGE_SIZE = 12;

type FavoritePropertyLocationJoin = {
  city: string | null;
  state: string | null;
};

type FavoritePropertyImageJoin = {
  image_url: string | null;
  is_primary: boolean | null;
  display_order: number | null;
};

type FavoritePropertyJoin = {
  id: string;
  title: string;
  price: number;
  property_type: string;
  bedrooms: number | null;
  bathrooms: number | null;
  status: "published";
  rent_period: "monthly" | "six_months" | "yearly" | null;
  property_locations: FavoritePropertyLocationJoin | null;
  property_images: FavoritePropertyImageJoin[] | null;
};

type FavoriteQueryRow = {
  id: string;
  created_at: string;
  properties: FavoritePropertyJoin | null;
};

function mapFavoriteRow(row: FavoriteQueryRow): PropertyListing | null {
  if (!row.properties) {
    return null;
  }

  const primaryImage =
    row.properties.property_images?.find((image) => image.is_primary)
      ?.image_url ??
    row.properties.property_images?.[0]?.image_url ??
    null;

  return {
    id: row.properties.id,
    title: row.properties.title,
    price: row.properties.price,
    propertyType: row.properties.property_type,
    bedrooms: row.properties.bedrooms,
    bathrooms: row.properties.bathrooms,
    status: row.properties.status,
    rentPeriod: row.properties.rent_period ?? "yearly",
    location: row.properties.property_locations
      ? {
          city: row.properties.property_locations.city ?? "Unknown city",
          state: row.properties.property_locations.state ?? "Unknown state",
        }
      : null,
    primaryImageUrl: primaryImage,
    isFavorited: true,
  };
}

export async function getFavoriteProperties({
  page,
  userId,
}: {
  page: number;
  userId: string;
}): Promise<PaginatedProperties> {
  const supabase = await createClient();
  const safePage = Number.isFinite(page) && page > 0 ? page : 1;
  const start = (safePage - 1) * FAVORITES_PAGE_SIZE;
  const end = start + FAVORITES_PAGE_SIZE - 1;

  const { data, count, error } = await supabase
    .from("favorites")
    .select(
      `
        id,
        created_at,
        properties!inner(
          id,
          title,
          price,
          property_type,
          bedrooms,
          bathrooms,
          status,
          rent_period,
          property_locations(city,state),
          property_images(image_url,is_primary,display_order)
        )
      `,
      { count: "exact" }
    )
    .eq("user_id", userId)
    .eq("properties.status", "published")
    .order("created_at", { ascending: false })
    .order("display_order", {
      ascending: true,
      foreignTable: "properties.property_images",
    })
    .range(start, end);

  if (error) {
    return {
      properties: [],
      isAuthenticated: true,
      page: safePage,
      pageSize: FAVORITES_PAGE_SIZE,
      totalCount: 0,
      totalPages: 0,
    };
  }

  const rows = (data ?? []) as unknown as FavoriteQueryRow[];
  const totalCount = count ?? 0;

  return {
    properties: rows.flatMap((row) => {
      const property = mapFavoriteRow(row);

      return property ? [property] : [];
    }),
    isAuthenticated: true,
    page: safePage,
    pageSize: FAVORITES_PAGE_SIZE,
    totalCount,
    totalPages: Math.ceil(totalCount / FAVORITES_PAGE_SIZE),
  };
}