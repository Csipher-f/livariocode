import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cache } from "react";
import { z } from "zod";

import { getSupabaseEnv } from "@/supabase/env";
import type { Database } from "@/types/database";

const propertyIdSchema = z.string().uuid();

export type PropertyReviewItem = {
  id: string;
  rating: number;
  title: string | null;
  body: string | null;
  createdAt: string;
};

export type PropertyReviewsSummary = {
  reviews: PropertyReviewItem[];
  averageRating: number | null;
  reviewCount: number;
};

function getAverageRating(reviews: PropertyReviewItem[]) {
  if (reviews.length === 0) {
    return null;
  }

  const total = reviews.reduce((sum, review) => sum + review.rating, 0);

  return Math.round((total / reviews.length) * 10) / 10;
}

export const getPublishedPropertyReviews = cache(
  async (propertyId: string): Promise<PropertyReviewsSummary> => {
    const parsedPropertyId = propertyIdSchema.safeParse(propertyId);

    if (!parsedPropertyId.success) {
      return {
        reviews: [],
        averageRating: null,
        reviewCount: 0,
      };
    }

    const { supabaseAnonKey, supabaseUrl } = getSupabaseEnv();
    const supabase = createSupabaseClient<Database>(
      supabaseUrl,
      supabaseAnonKey
    );

    const { data, error } = await supabase
      .from("property_reviews")
      .select("id,rating,title,body,created_at")
      .eq("property_id", parsedPropertyId.data)
      .eq("status", "published")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Property reviews fetch error:", JSON.stringify(error));

      return {
        reviews: [],
        averageRating: null,
        reviewCount: 0,
      };
    }

    const reviews = (data ?? []).map((review) => ({
      id: review.id,
      rating: review.rating,
      title: review.title,
      body: review.body,
      createdAt: review.created_at,
    }));

    return {
      reviews,
      averageRating: getAverageRating(reviews),
      reviewCount: reviews.length,
    };
  }
);
