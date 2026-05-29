import type { Metadata } from "next";
import { Inbox } from "lucide-react";

import { EmptyState } from "@/components/ui/empty-state";
import { getReceivedInquiries } from "@/features/inquiries/actions/get-inquiries";
import { InquiryList } from "@/features/inquiries/components/inquiry-list";
import { requireRole } from "@/supabase/auth";

export const metadata: Metadata = {
  title: "Inquiries",
  description: "Review tenant inquiries for your Livario listings.",
};

export default async function LandlordInquiriesPage() {
  const { user } = await requireRole({ allowedRoles: ["landlord"] });
  const inquiries = await getReceivedInquiries({ landlordId: user.id });

  return (
    <main className="mx-auto grid w-full max-w-5xl gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <p className="text-sm font-medium text-muted-foreground">
          Landlord dashboard
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Inquiries
        </h1>
      </div>

      {inquiries.length > 0 ? (
        <InquiryList inquiries={inquiries} />
      ) : (
        <EmptyState
          className="min-h-96 bg-background"
          description="Messages from tenants interested in your listings will appear here."
          icon={Inbox}
          title="No inquiries yet"
        />
      )}
    </main>
  );
}
