import "server-only";

import { createClient } from "@/supabase/server-client";
import type { PropertyListing } from "@/features/properties/types";
import type { PropertyStatus } from "@/types/database";

export type LandlordProfile = {
  profile: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    created_at: string;
  };
  properties: PropertyListing[];
  totalCount: number;
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
  rent_period: "monthly" | "six_months" | "yearly";
  property_type: string;
  bedrooms: number | null;
  bathrooms: number | null;
  status: PropertyStatus;
  property_locations: PropertyLocationJoin | null;
  property_images: PropertyImageJoin[] | null;
};

export async function getLandlordProfile(
  landlordId: string
): Promise<LandlordProfile | null> {
  const supabase = await createClient();

  // Query 1 — fetch profile
  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url, created_at")
    .eq("id", landlordId)
    .eq("is_landlord", true)
    .single();

  if (profileError || !profileData) {
    return null;
  }

  // Query 2 — fetch published properties
  const { data: propertiesData, error: propertiesError } = await supabase
    .from("properties")
    .select(`
      id,
      title,
      price,
      rent_period,
      property_type,
      bedrooms,
      bathrooms,
      status,
      property_locations!location_id(city, state),
      property_images(image_url, is_primary, display_order)
    `)
    .eq("owner_id", landlordId)
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .order("display_order", {
      ascending: true,
      foreignTable: "property_images",
    });

  if (propertiesError) {
    console.error("Error fetching landlord properties:", propertiesError);
  }

  const rawProperties = (propertiesData || []) as unknown as PropertyQueryRow[];

  // Map the result into clean PropertyListing objects
  const mappedProperties: PropertyListing[] = rawProperties.map((prop) => {
    const primaryImage =
      prop.property_images?.find((img) => img.is_primary)?.image_url ??
      prop.property_images?.[0]?.image_url ??
      null;

    return {
      id: prop.id,
      title: prop.title,
      price: prop.price,
      rentPeriod: prop.rent_period,
      propertyType: prop.property_type,
      bedrooms: prop.bedrooms,
      bathrooms: prop.bathrooms,
      status: prop.status,
      location: prop.property_locations
        ? {
            city: prop.property_locations.city ?? "Unknown city",
            state: prop.property_locations.state ?? "Unknown state",
          }
        : null,
      primaryImageUrl: primaryImage,
    };
  });

  return {
    profile: {
      id: profileData.id,
      full_name: profileData.full_name,
      avatar_url: profileData.avatar_url,
      created_at: profileData.created_at,
    },
    properties: mappedProperties,
    totalCount: mappedProperties.length,
  };
}
