"use server";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export async function getWaitlistCount(): Promise<{
  total: number;
  tenants: number;
  landlords: number;
}> {
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { count: total } = await supabase
    .from("waitlist_entries")
    .select("*", { count: "exact", head: true });

  const { count: tenants } = await supabase
    .from("waitlist_entries")
    .select("*", { count: "exact", head: true })
    .eq("role", "tenant");

  const { count: landlords } = await supabase
    .from("waitlist_entries")
    .select("*", { count: "exact", head: true })
    .eq("role", "landlord");

  return {
    total: total ?? 0,
    tenants: tenants ?? 0,
    landlords: landlords ?? 0,
  };
}