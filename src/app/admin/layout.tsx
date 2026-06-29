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
      {/* FIXED: Constrained width tightly on mobile to prevent layout blowouts */}
      <div className="w-full max-w-full min-w-0 flex-1 pb-8 overflow-x-hidden">
        {children}
      </div>
    </div>
  );
}
