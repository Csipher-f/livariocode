import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getLandlordPropertyById } from "@/features/properties/actions/get-landlord-properties";
import { PropertyForm } from "@/features/properties/components/property-form";
import { requireRole } from "@/supabase/auth";

export const metadata: Metadata = {
  title: "Edit Property",
  description: "Edit a Livario property listing.",
};

type EditPropertyPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditPropertyPage({
  params,
}: EditPropertyPageProps) {
  const [{ id }, { user }] = await Promise.all([
    params,
    requireRole({ allowedRoles: ["landlord"] }),
  ]);
  const property = await getLandlordPropertyById({
    ownerId: user.id,
    propertyId: id,
  });

  if (!property) {
    notFound();
  }

  return (
    <main className="mx-auto grid w-full max-w-4xl gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <p className="text-sm font-medium text-muted-foreground">
          Property management
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Edit listing
        </h1>
      </div>
      <PropertyForm mode="edit" property={property} />
    </main>
  );
}
