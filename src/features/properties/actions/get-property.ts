import "server-only";

import { cache } from "react";
import { z } from "zod";

import { createClient } from "@/supabase/server-client";
import type { PropertyDetail } from "@/features/properties/types";

const propertyIdSchema = z.string().uuid();

type PropertyLocationJoin = {
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
};

type PropertyImageJoin = {
  id: string;
  image_url: string | null;
  is_primary: boolean | null;
  display_order: number | null;
};

type ProfileJoin = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string | null;
};

type PropertyDetailRow = {
  id: string;
  owner_id: string;
  title: string;
  description: string | null;
  price: number;
  property_type: string;
  bedrooms: number | null;
  bathrooms: number | null;
  status: "published";
  created_at: string;
  property_locations: PropertyLocationJoin | null;
  property_images: PropertyImageJoin[] | null;
  profiles: ProfileJoin | null;
};

function mapPropertyDetail(row: PropertyDetailRow): PropertyDetail {
  const images = (row.property_images ?? [])
    .filter((image) => Boolean(image.image_url))
    .map((image) => ({
      id: image.id,
      imageUrl: image.image_url as string,
      isPrimary: Boolean(image.is_primary),
      displayOrder: image.display_order ?? 0,
    }))
    .sort((first, second) => {
      if (first.isPrimary !== second.isPrimary) {
        return first.isPrimary ? -1 : 1;
      }

      return first.displayOrder - second.displayOrder;
    });

  return {
    id: row.id,
    ownerId: row.owner_id,
    title: row.title,
    description: row.description,
    price: row.price,
    propertyType: row.property_type,
    bedrooms: row.bedrooms,
    bathrooms: row.bathrooms,
    status: row.status,
    createdAt: row.created_at,
    amenities: [],
    location: row.property_locations
      ? {
          address: row.property_locations.address,
          city: row.property_locations.city ?? "Unknown city",
          state: row.property_locations.state ?? "Unknown state",
          country: row.property_locations.country ?? "Nigeria",
        }
      : null,
    images,
    landlord: {
      id: row.profiles?.id ?? row.owner_id,
      fullName: row.profiles?.full_name ?? null,
      avatarUrl: row.profiles?.avatar_url ?? null,
      createdAt: row.profiles?.created_at ?? null,
    },
  };
}

export const getPublishedPropertyById = cache(
  async (id: string): Promise<PropertyDetail | null> => {
    const parsedId = propertyIdSchema.safeParse(id);

    if (!parsedId.success) {
      return null;
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("properties")
      .select(
        `
          id,
          owner_id,
          title,
          description,
          price,
          property_type,
          bedrooms,
          bathrooms,
          status,
          created_at,
          property_locations(address,city,state,country),
          property_images(id,image_url,is_primary,display_order),
          profiles!properties_owner_id_fkey(id,full_name,avatar_url,created_at)
        `
      )
      .eq("id", parsedId.data)
      .eq("status", "published")
      .order("display_order", {
        ascending: true,
        foreignTable: "property_images",
      })
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return mapPropertyDetail(data as unknown as PropertyDetailRow);
  }
);
