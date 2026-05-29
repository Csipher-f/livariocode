"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Loader2, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { deleteProperty } from "@/features/properties/actions/delete-property";
import { updateProperty } from "@/features/properties/actions/update-property";
import type { LandlordProperty } from "@/features/properties/types";

export function PropertyManagementActions({
  property,
}: {
  property: LandlordProperty;
}) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const nextStatus = property.status === "published" ? "draft" : "published";

  function toggleStatus() {
    const formData = new FormData();
    formData.set("title", property.title);
    formData.set("description", property.description ?? "");
    formData.set("propertyType", property.propertyType);
    formData.set("price", String(property.price));
    formData.set("bedrooms", String(property.bedrooms ?? 0));
    formData.set("bathrooms", String(property.bathrooms ?? 0));
    formData.set("address", property.location?.address ?? "");
    formData.set("city", property.location?.city ?? "");
    formData.set("state", property.location?.state ?? "");
    formData.set("status", nextStatus);
    const primaryImage = property.images.find((image) => image.isPrimary);
    formData.set(
      "primaryImageKey",
      primaryImage ? `existing:${primaryImage.id}` : ""
    );

    startTransition(async () => {
      const result = await updateProperty(property.id, formData);

      toast({
        title: result.success ? "Listing updated" : "Listing not updated",
        description: result.message,
        intent: result.success ? "success" : "destructive",
      });
    });
  }

  function confirmDelete() {
    startTransition(async () => {
      const result = await deleteProperty({ propertyId: property.id });

      toast({
        title: result.success ? "Listing archived" : "Listing not archived",
        description: result.message,
        intent: result.success ? "success" : "destructive",
      });

      if (result.success) {
        setDeleteOpen(false);
      }
    });
  }

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <Button asChild size="sm" variant="outline">
          <Link href={`/dashboard/landlord/properties/${property.id}/edit`}>
            <Pencil className="size-4" />
            Edit
          </Link>
        </Button>
        {property.status === "archived" ? null : (
          <Button
            disabled={isPending}
            onClick={toggleStatus}
            size="sm"
            type="button"
            variant="outline"
          >
            {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
            {property.status === "published" ? "Unpublish" : "Publish"}
          </Button>
        )}
        <Button
          disabled={isPending}
          onClick={() => setDeleteOpen(true)}
          size="sm"
          type="button"
          variant="destructive"
        >
          <Trash2 className="size-4" />
          Delete
        </Button>
      </div>

      <Dialog onOpenChange={setDeleteOpen} open={deleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Archive this listing?</DialogTitle>
            <DialogDescription>
              This removes the listing from public discovery while keeping its
              record in your dashboard.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              disabled={isPending}
              onClick={() => setDeleteOpen(false)}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              disabled={isPending}
              onClick={confirmDelete}
              type="button"
              variant="destructive"
            >
              {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
              Archive listing
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
