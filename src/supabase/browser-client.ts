"use client";

import { createBrowserClient } from "@supabase/ssr";

import { getSupabaseEnv } from "@/supabase/env";
import type { Database } from "@/types/database";

export function createClient() {
  const { supabaseUrl, supabaseAnonKey } = getSupabaseEnv();

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}
