import "server-only";

import { createClient } from "@/supabase/server-client";

export type AdminReview = {
  id: string;
  rating: number;
  title: string | null;
  body: string | null;
  status: "pending" | "published" | "hidden";
  created_at: string;
  reviewer_name: string;
  property_title: string;
  property_id: string;
};

type ReviewQueryResponse = {
  id: string;
  rating: number;
  title: string | null;
  body: string | null;
  status: "pending" | "published" | "hidden";
  created_at: string;
  profiles: {
    full_name: string | null;
  } | null;
  properties: {
    id: string;
    title: string;
  } | null;
};

export async function getAdminReviews(): Promise<AdminReview[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("property_reviews")
      .select(`
        id,
        rating,
        title,
        body,
        status,
        created_at,
        profiles!property_reviews_reviewer_id_fkey(full_name),
        properties!property_reviews_property_id_fkey(id, title)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching admin reviews:", error);
      return [];
    }

    const rows = (data as unknown as ReviewQueryResponse[]) || [];

    return rows.map((row) => ({
      id: row.id,
      rating: row.rating,
      title: row.title,
      body: row.body,
      status: row.status,
      created_at: row.created_at,
      reviewer_name: row.profiles?.full_name ?? "Unknown Reviewer",
      property_title: row.properties?.title ?? "Unknown Property",
      property_id: row.properties?.id ?? "",
    }));
  } catch (err) {
    console.error("Failed to get admin reviews:", err);
    return [];
  }
}
