import "server-only";

import { createClient } from "@/supabase/server-client";
import type { ActiveRole } from "@/types/database";

type UpsertProfileInput = {
  id: string;
  email?: string | null;
  fullName?: string | null;
  isTenant?: boolean;
  isLandlord?: boolean;
  activeRole?: ActiveRole;
};

export async function upsertUserProfile({
  id,
  email = null,
  fullName = null,
  isTenant = true,
  isLandlord = false,
  activeRole = "tenant",
}: UpsertProfileInput) {
  const supabase = await createClient();

  return supabase.from("profiles").upsert(
    {
      id,
      email,
      full_name: fullName,
      is_tenant: isTenant,
      is_landlord: isLandlord,
      active_role: activeRole,
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: "id",
    }
  );
}

export async function setInitialProfileRole(activeRole: ActiveRole) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      error: userError ?? new Error("User is not authenticated."),
    };
  }

  return supabase
    .from("profiles")
    .update({
      is_tenant: true,
      is_landlord: activeRole === "landlord",
      active_role: activeRole,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);
}
