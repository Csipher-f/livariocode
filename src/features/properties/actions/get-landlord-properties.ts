import "server-only";

import { cache } from "react";
import { z } from "zod";

import { createClient } from "@/supabase/server-client";
import type {
  LandlordPropertiesResult,
  LandlordProperty,
} from "@/features/properties/types";

type LandlordLocationJoin = {
  id: string;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
};

type LandlordImageJoin = {
  id: string;
  image_url: string | null;
  storage_path: string | null;
  is_primary: boolean | null;
  display_order: number | null;
};

type LandlordPropertyRow = {
  id: string;
  owner_id: string;
  location_id: string | null;
  title: string;
  description: string | null;
  price: number;
  property_type: string;
  bedrooms: number | null;
  bathrooms: number | null;
  status: "draft" | "published" | "archived" | "rented";
  created_at: string;
  updated_at: string;
  property_locations: LandlordLocationJoin | null;
  property_images: LandlordImageJoin[] | null;
};

const propertyIdSchema = z.string().uuid();

function mapLandlordProperty(row: LandlordPropertyRow): LandlordProperty {
  return {
    id: row.id,
    ownerId: row.owner_id,
    locationId: row.location_id,
    title: row.title,
    description: row.description,
    price: row.price,
    propertyType: row.property_type,
    bedrooms: row.bedrooms,
    bathrooms: row.bathrooms,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    location: row.property_locations
      ? {
          id: row.property_locations.id,
          address: row.property_locations.address,
          city: row.property_locations.city ?? "Unknown city",
          state: row.property_locations.state ?? "Unknown state",
          country: row.property_locations.country ?? "Nigeria",
        }
      : null,
    images: (row.property_images ?? [])
      .filter((image) => Boolean(image.image_url && image.storage_path))
      .map((image) => ({
        id: image.id,
        imageUrl: image.image_url as string,
        storagePath: image.storage_path as string,
        isPrimary: Boolean(image.is_primary),
        displayOrder: image.display_order ?? 0,
      }))
      .sort((first, second) => first.displayOrder - second.displayOrder),
  };
}

export const getLandlordProperties = cache(
  async (ownerId: string): Promise<LandlordPropertiesResult> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("properties")
      .select(
        `
          id,
          owner_id,
          location_id,
          title,
          description,
          price,
          property_type,
          bedrooms,
          bathrooms,
          status,
          created_at,
          updated_at,
          property_locations(id,address,city,state,country),
          property_images(id,image_url,storage_path,is_primary,display_order)
        `
      )
      .eq("owner_id", ownerId)
      .order("created_at", { ascending: false })
      .order("display_order", {
        ascending: true,
        foreignTable: "property_images",
      });

    if (error) {
      return {
        properties: [],
        stats: {
          totalListings: 0,
          publishedListings: 0,
          draftListings: 0,
        },
      };
    }

    const properties = ((data ?? []) as unknown as LandlordPropertyRow[]).map(
      mapLandlordProperty
    );

    return {
      properties,
      stats: {
        totalListings: properties.length,
        publishedListings: properties.filter(
          (property) => property.status === "published"
        ).length,
        draftListings: properties.filter(
          (property) => property.status === "draft"
        ).length,
      },
    };
  }
);

export const getLandlordPropertyById = cache(
  async ({
    ownerId,
    propertyId,
  }: {
    ownerId: string;
    propertyId: string;
  }): Promise<LandlordProperty | null> => {
    const parsedPropertyId = propertyIdSchema.safeParse(propertyId);

    if (!parsedPropertyId.success) {
      return null;
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("properties")
      .select(
        `
          id,
          owner_id,
          location_id,
          title,
          description,
          price,
          property_type,
          bedrooms,
          bathrooms,
          status,
          created_at,
          updated_at,
          property_locations(id,address,city,state,country),
          property_images(id,image_url,storage_path,is_primary,display_order)
        `
      )
      .eq("id", parsedPropertyId.data)
      .eq("owner_id", ownerId)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return mapLandlordProperty(data as unknown as LandlordPropertyRow);
  }
);
