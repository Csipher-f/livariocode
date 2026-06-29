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
      {/* OVERRIDE DEF FLEX: min-w-0 breaks the intrinsic width trap so it can't expand past the phone screen */}
      <div className="w-full min-w-0 flex-1 pb-8">{children}</div>
    </div>
  );
}
