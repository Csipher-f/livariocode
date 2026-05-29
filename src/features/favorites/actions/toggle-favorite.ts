"use server";

import { z } from "zod";

import { getCurrentUser } from "@/supabase/auth";
import { createClient } from "@/supabase/server-client";

const toggleFavoriteSchema = z.object({
  propertyId: z.string().uuid(),
});

export type ToggleFavoriteResult =
  | {
      success: true;
      isFavorited: boolean;
      message: string;
    }
  | {
      success: false;
      isFavorited: boolean;
      message: string;
    };

export async function toggleFavorite(input: {
  propertyId: string;
}): Promise<ToggleFavoriteResult> {
  const user = await getCurrentUser();

  if (!user) {
    return {
      success: false,
      isFavorited: false,
      message: "Please log in to save listings.",
    };
  }

  const parsedInput = toggleFavoriteSchema.safeParse(input);

  if (!parsedInput.success) {
    return {
      success: false,
      isFavorited: false,
      message: "This listing could not be saved.",
    };
  }

  const supabase = await createClient();
  const { data: property, error: propertyError } = await supabase
    .from("properties")
    .select("id")
    .eq("id", parsedInput.data.propertyId)
    .eq("status", "published")
    .maybeSingle();

  if (propertyError || !property) {
    return {
      success: false,
      isFavorited: false,
      message: "This listing is no longer available.",
    };
  }

  const { data: existingFavorite, error: favoriteLookupError } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", user.id)
    .eq("property_id", parsedInput.data.propertyId)
    .maybeSingle();

  if (favoriteLookupError) {
    return {
      success: false,
      isFavorited: false,
      message: "We could not update this saved listing right now.",
    };
  }

  if (existingFavorite) {
    const { error: deleteError } = await supabase
      .from("favorites")
      .delete()
      .eq("id", existingFavorite.id)
      .eq("user_id", user.id);

    if (deleteError) {
      return {
        success: false,
        isFavorited: true,
        message: "We could not remove this saved listing right now.",
      };
    }

    return {
      success: true,
      isFavorited: false,
      message: "Listing removed from saved listings.",
    };
  }

  const { error: insertError } = await supabase.from("favorites").insert({
    user_id: user.id,
    property_id: parsedInput.data.propertyId,
  });

  if (insertError) {
    return {
      success: false,
      isFavorited: false,
      message: "We could not save this listing right now.",
    };
  }

  return {
    success: true,
    isFavorited: true,
    message: "Listing saved.",
  };
}
