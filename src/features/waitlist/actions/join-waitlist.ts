"use server";

import { z } from "zod";

import { createClient } from "@/supabase/server-client";
import type { JoinWaitlistInput } from "@/features/waitlist/types";

const joinSchema = z.object({
  email: z.string().email("Please provide a valid email address."),
  full_name: z.string().max(100, "Name must be under 100 characters.").optional(),
  role: z.enum(["tenant", "landlord"]),
});

export async function joinWaitlist(input: JoinWaitlistInput): Promise<{
  success: boolean;
  message: string;
}> {
  const parsed = joinSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Invalid input.",
    };
  }

  const { email, full_name, role } = parsed.data;
  const supabase = await createClient();

  const { error } = await supabase.from("waitlist_entries").insert({
    email: email.toLowerCase().trim(),
    full_name: full_name?.trim() || null,
    role,
  });

  if (error) {
    console.error("Waitlist join error FULL:", JSON.stringify(error));

    if (error.code === "23505") {
      return {
        success: true,
        message: "You're already on the list",
      };
    }

    return {
      success: false,
      message: "Something went wrong, please try again.",
    };
  }

  return {
    success: true,
    message: "You're on the list!",
  };
}
