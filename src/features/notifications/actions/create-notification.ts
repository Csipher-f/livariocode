import "server-only";

import { createClient } from "@/supabase/server-client";

type CreateNotificationInput = {
  userId: string;
  type: "new_inquiry" | "inquiry_reply" | "inquiry_closed";
  title: string;
  body: string;
  resourceId?: string;
  resourceType?: string;
};

export async function createNotification(input: CreateNotificationInput): Promise<void> {
  try {
    const supabase = await createClient();

    const { error } = await supabase.from("notifications").insert({
      user_id: input.userId,
      type: input.type,
      title: input.title,
      body: input.body,
      resource_id: input.resourceId ?? null,
      resource_type: input.resourceType ?? null,
    });

    if (error) {
      console.error("Failed to create notification", error.message);
    }
  } catch (err) {
    console.error("Failed to create notification", err);
  }
}
