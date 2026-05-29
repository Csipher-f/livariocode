import "server-only";

import { getCurrentUser } from "@/supabase/auth";
import { createClient } from "@/supabase/server-client";
import {
  PROPERTY_TYPES,
  type PaginatedProperties,
  type PropertyFilters,
  type PropertyListing,
  type PropertyType,
} from "@/features/properties/types";

export const LISTINGS_PAGE_SIZE = 12;

type SearchParamValue = string | string[] | undefined;

type ListingsSearchParams = {
  city?: SearchParamValue;
  type?: SearchParamValue;
  min_price?: SearchParamValue;
  max_price?: SearchParamValue;
  bedrooms?: SearchParamValue;
  page?: SearchParamValue;
};

type PropertyLocationJoin = {
  city: string | null;
  state: string | null;
};

type PropertyImageJoin = {
  image_url: string | null;
  is_primary: boolean | null;
  display_order: number | null;
};

type PropertyQueryRow = {
  id: string;
  title: string;
  price: number;
  property_type: string;
  bedrooms: number | null;
  bathrooms: number | null;
  status: "published";
  property_locations: PropertyLocationJoin | null;
  property_images: PropertyImageJoin[] | null;
};

type FavoritePropertyRow = {
  property_id: string;
};

function getSingleParam(value: SearchParamValue) {
  return Array.isArray(value) ? value[0] : value;
}

function getPositiveNumber(value: SearchParamValue) {
  const rawValue = getSingleParam(value);

  if (!rawValue) {
    return undefined;
  }

  const parsed = Number(rawValue);

  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

function getPropertyType(value: SearchParamValue): PropertyType | undefined {
  const rawValue = getSingleParam(value);

  if (!rawValue) {
    return undefined;
  }

  return PROPERTY_TYPES.find((type) => type === rawValue);
}

export function parsePropertyFilters(
  searchParams: ListingsSearchParams
): PropertyFilters {
  return {
    city: getSingleParam(searchParams.city)?.trim() || undefined,
    type: getPropertyType(searchParams.type),
    minPrice: getPositiveNumber(searchParams.min_price),
    maxPrice: getPositiveNumber(searchParams.max_price),
    bedrooms: getPositiveNumber(searchParams.bedrooms),
    page: getPositiveNumber(searchParams.page) ?? 1,
  };
}

function mapPropertyRow(
  row: PropertyQueryRow,
  favoritePropertyIds: Set<string>
): PropertyListing {
  const primaryImage =
    row.property_images?.find((image) => image.is_primary)?.image_url ??
    row.property_images?.[0]?.image_url ??
    null;

  return {
    id: row.id,
    title: row.title,
    price: row.price,
    propertyType: row.property_type,
    bedrooms: row.bedrooms,
    bathrooms: row.bathrooms,
    status: row.status,
    location: row.property_locations
      ? {
          city: row.property_locations.city ?? "Unknown city",
          state: row.property_locations.state ?? "Unknown state",
        }
      : null,
    primaryImageUrl: primaryImage,
    isFavorited: favoritePropertyIds.has(row.id),
  };
}

export async function getPublishedProperties(
  filters: PropertyFilters
): Promise<PaginatedProperties> {
  const supabase = await createClient();
  const user = await getCurrentUser();
  const start = (filters.page - 1) * LISTINGS_PAGE_SIZE;
  const end = start + LISTINGS_PAGE_SIZE - 1;

  let query = supabase
    .from("properties")
    .select(
      `
        id,
        title,
        price,
        property_type,
        bedrooms,
        bathrooms,
        status,
        property_locations!inner(city,state),
        property_images(image_url,is_primary,display_order)
      `,
      { count: "exact" }
    )
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .order("display_order", {
      ascending: true,
      foreignTable: "property_images",
    })
    .range(start, end);

  if (filters.city) {
    query = query.ilike("property_locations.city", `%${filters.city}%`);
  }

  if (filters.type) {
    query = query.eq("property_type", filters.type);
  }

  if (filters.bedrooms) {
    if (filters.bedrooms >= 4) {
      query = query.gte("bedrooms", 4);
    } else {
      query = query.eq("bedrooms", filters.bedrooms);
    }
  }

  if (filters.minPrice) {
    query = query.gte("price", filters.minPrice);
  }

  if (filters.maxPrice) {
    query = query.lte("price", filters.maxPrice);
  }

  const { data, count, error } = await query;

  if (error) {
    return {
      properties: [],
      page: filters.page,
      pageSize: LISTINGS_PAGE_SIZE,
      totalCount: 0,
      totalPages: 0,
    };
  }

  const rows = (data ?? []) as unknown as PropertyQueryRow[];
  const totalCount = count ?? 0;
  const favoritePropertyIds = new Set<string>();

  if (user && rows.length > 0) {
    const { data: favorites } = await supabase
      .from("favorites")
      .select("property_id")
      .eq("user_id", user.id)
      .in(
        "property_id",
        rows.map((row) => row.id)
      );

    ((favorites ?? []) as FavoritePropertyRow[]).forEach((favorite) => {
      favoritePropertyIds.add(favorite.property_id);
    });
  }

  return {
    properties: rows.map((row) => mapPropertyRow(row, favoritePropertyIds)),
    page: filters.page,
    pageSize: LISTINGS_PAGE_SIZE,
    totalCount,
    totalPages: Math.ceil(totalCount / LISTINGS_PAGE_SIZE),
  };
}
