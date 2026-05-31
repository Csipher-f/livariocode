"use server";

import { z } from "zod";

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
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    if (userError) {
      console.error("Favorite toggle auth lookup failed", userError.message);
    }

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

  const { data: property, error: propertyError } = await supabase
    .from("properties")
    .select("id")
    .eq("id", parsedInput.data.propertyId)
    .eq("status", "published")
    .maybeSingle();

  if (propertyError || !property) {
    if (propertyError) {
      console.error(
        "Favorite toggle property lookup failed",
        propertyError.message
      );
    }

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
    console.error(
      "Favorite toggle favorite lookup failed",
      favoriteLookupError.message
    );

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
      console.error("Favorite toggle delete failed", deleteError.message);

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
    console.error("Favorite toggle insert failed", insertError.message);

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
