import type { ReactNode } from "react";

import { AdminNav } from "@/features/admin/components/admin-nav";
import { requireAdmin } from "@/lib/admin";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="min-h-screen bg-[#FDFAF7] lg:flex">
      <AdminNav />
      <div className="min-w-0 max-w-full flex-1 pb-8">{children}</div>
    </div>
  );
}
