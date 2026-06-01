import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getInquiryThread } from "@/features/inquiries/actions/get-inquiry-thread";
import { InquiryThreadComponent } from "@/features/inquiries/components/inquiry-thread";
import { requireRole } from "@/supabase/auth";
import { createClient } from "@/supabase/server-client";

export const metadata: Metadata = {
  title: "Inquiry Thread",
  description: "View and reply to messages regarding your property listing.",
};

type LandlordInquiryDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function LandlordInquiryDetailPage({ params }: LandlordInquiryDetailPageProps) {
  const [{ id }, { user }] = await Promise.all([
    params,
    requireRole({ allowedRoles: ["landlord"] }),
  ]);

  const thread = await getInquiryThread(id);

  if (!thread) {
    notFound();
  }

  // Double check that the landlord owns this inquiry thread
  if (thread.landlordId !== user.id) {
    notFound();
  }

  // Automatically mark the inquiry as read if it is still pending
  if (thread.status === "pending") {
    const supabase = await createClient();
    const { error } = await supabase
      .from("inquiries")
      .update({ status: "read" })
      .eq("id", id)
      .eq("recipient_id", user.id);

    if (!error) {
      thread.status = "read";
    }
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
      <InquiryThreadComponent
        initialThread={thread}
        currentUserId={user.id}
        currentUserRole="landlord"
      />
    </main>
  );
}
