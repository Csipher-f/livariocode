import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getInquiryThread } from "@/features/inquiries/actions/get-inquiry-thread";
import { InquiryThreadComponent } from "@/features/inquiries/components/inquiry-thread";
import { requireRole } from "@/supabase/auth";

export const metadata: Metadata = {
  title: "Inquiry Thread",
  description: "View and reply to messages regarding your property inquiry.",
};

type TenantInquiryDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function TenantInquiryDetailPage({ params }: TenantInquiryDetailPageProps) {
  const [{ id }, { user }] = await Promise.all([
    params,
    requireRole({ allowedRoles: ["tenant"] }),
  ]);

  const thread = await getInquiryThread(id);

  if (!thread) {
    notFound();
  }

  // Double check that the tenant owns this inquiry thread
  if (thread.tenantId !== user.id) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
      <InquiryThreadComponent
        initialThread={thread}
        currentUserId={user.id}
        currentUserRole="tenant"
      />
    </main>
  );
}
