"use server";

import { createClient } from "@/supabase/server-client";

export async function getWaitlistCount(): Promise<{
  total: number;
  tenants: number;
  landlords: number;
}> {
  const supabase = await createClient();

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
