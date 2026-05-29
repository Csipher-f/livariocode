import type { Metadata } from "next";

import { PropertyForm } from "@/features/properties/components/property-form";
import { requireRole } from "@/supabase/auth";

export const metadata: Metadata = {
  title: "Create Property",
  description: "Create a new Livario property listing.",
};

export default async function NewPropertyPage() {
  await requireRole({ allowedRoles: ["landlord"] });

  return (
    <main className="mx-auto grid w-full max-w-4xl gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <p className="text-sm font-medium text-muted-foreground">
          Property management
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Create new listing
        </h1>
      </div>
      <PropertyForm mode="create" />
    </main>
  );
}
