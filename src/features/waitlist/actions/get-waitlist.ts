"use server";

import { createClient } from "@/supabase/server-client";
import { getCurrentProfile } from "@/supabase/auth";
import type { WaitlistEntry, WaitlistRole } from "@/features/waitlist/types";

export async function getWaitlist(
  role: WaitlistRole | "all" = "all"
): Promise<WaitlistEntry[]> {
  const profile = await getCurrentProfile();

  if (!profile?.is_admin) {
    return [];
  }

  const supabase = await createClient();

  let query = supabase
    .from("waitlist_entries")
    .select("*")
    .order("created_at", { ascending: false });

  if (role !== "all") {
    query = query.eq("role", role);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Failed to fetch waitlist:", error);
    return [];
  }

  return data;
}
