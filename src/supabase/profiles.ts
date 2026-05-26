import "server-only";

import { DEFAULT_USER_ROLE } from "@/constants/user-roles";
import { createClient } from "@/supabase/server-client";
import type { UserRole } from "@/types/database";

type UpsertProfileInput = {
  id: string;
  email?: string | null;
  fullName?: string | null;
  role?: UserRole;
};

export async function upsertUserProfile({
  id,
  email = null,
  fullName = null,
  role = DEFAULT_USER_ROLE,
}: UpsertProfileInput) {
  const supabase = await createClient();

  return supabase.from("profiles").upsert(
    {
      id,
      email,
      full_name: fullName,
      role,
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: "id",
    }
  );
}
