import "server-only";

import { createClient } from "@/supabase/server-client";

export type Notification = {
  id: string;
  user_id: string;
  type: "new_inquiry" | "inquiry_reply" | "inquiry_closed";
  title: string;
  body: string;
  is_read: boolean;
  resource_id: string | null;
  resource_type: string | null;
  created_at: string;
};

export async function getNotifications(userId: string): Promise<Notification[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    console.error("Failed to fetch notifications", error.message);
    return [];
  }

  return (data ?? []) as Notification[];
}

export async function getUnreadCount(userId: string): Promise<number> {
  const supabase = await createClient();

  const { count, error } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("is_read", false);

  if (error) {
    console.error("Failed to count unread notifications", error.message);
    return 0;
  }

  return count ?? 0;
}
