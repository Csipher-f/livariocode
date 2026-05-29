"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { createProperty } from "@/features/properties/actions/create-property";
import { updateProperty } from "@/features/properties/actions/update-property";
import {
  ImageUploader,
  type ImageUploaderValue,
} from "@/features/properties/components/image-uploader";
import {
  PROPERTY_TYPES,
  type LandlordProperty,
} from "@/features/properties/types";

type FormMode = "create" | "edit";

function getInitialImageState(property?: LandlordProperty): ImageUploaderValue {
  const primaryImage = property?.images.find((image) => image.isPrimary);

  return {
    newImages: [],
    removedImageIds: [],
    primaryImageKey: primaryImage ? `existing:${primaryImage.id}` : "",
  };
}

export function PropertyForm({
  mode,
  property,
}: {
  mode: FormMode;
  property?: LandlordProperty;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [imageState, setImageState] = useState<ImageUploaderValue>(() =>
    getInitialImageState(property)
  );
  const submitLabel = mode === "create" ? "Create listing" : "Save changes";
  const existingImages = useMemo(() => property?.images ?? [], [property]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    imageState.newImages.forEach((image) => {
      formData.append("images", image.file);
    });
    imageState.removedImageIds.forEach((id) => {
      formData.append("removedImageIds", id);
    });
    formData.set("primaryImageKey", imageState.primaryImageKey);

    startTransition(async () => {
      const result =
        mode === "create"
          ? await createProperty(formData)
          : property
            ? await updateProperty(property.id, formData)
            : {
                success: false as const,
                message: "This listing could not be found.",
              };

      if (!result.success) {
        setFieldErrors(result.fieldErrors ?? {});
        toast({
          title: "Listing not saved",
          description: result.message,
          intent: "destructive",
        });
        return;
      }

      toast({
        title: mode === "create" ? "Listing created" : "Listing updated",
        description: result.message,
        intent: "success",
      });
      router.push("/dashboard/landlord/properties");
      router.refresh();
    });
  }

  return (
    <form className="grid gap-8" onSubmit={handleSubmit}>
      <div className="grid gap-5 rounded-md border border-border bg-card p-5 shadow-sm">
        <div className="grid gap-2">
          <Label htmlFor="title">Title</Label>
          <Input
            aria-invalid={Boolean(fieldErrors.title)}
            defaultValue={property?.title}
            disabled={isPending}
            id="title"
            name="title"
            placeholder="Modern apartment in Lekki"
            required
          />
          {fieldErrors.title ? (
            <p className="text-sm text-destructive">{fieldErrors.title}</p>
          ) : null}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            aria-invalid={Boolean(fieldErrors.description)}
            defaultValue={property?.description ?? ""}
            disabled={isPending}
            id="description"
            name="description"
            placeholder="Describe the space, neighborhood, and ideal tenant."
          />
          {fieldErrors.description ? (
            <p className="text-sm text-destructive">
              {fieldErrors.description}
            </p>
          ) : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="propertyType">Property type</Label>
            <select
              className="h-11 rounded-md border border-input bg-background px-3.5 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/20"
              defaultValue={property?.propertyType ?? "Apartment"}
              disabled={isPending}
              id="propertyType"
              name="propertyType"
            >
              {PROPERTY_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <select
              className="h-11 rounded-md border border-input bg-background px-3.5 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/20"
              defaultValue={
                property?.status === "published" ? "published" : "draft"
              }
              disabled={isPending}
              id="status"
              name="status"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="grid gap-2">
            <Label htmlFor="price">Monthly price</Label>
            <Input
              defaultValue={property?.price}
              disabled={isPending}
              id="price"
              min={1}
              name="price"
              required
              type="number"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="bedrooms">Bedrooms</Label>
            <Input
              defaultValue={property?.bedrooms ?? 0}
              disabled={isPending}
              id="bedrooms"
              min={0}
              name="bedrooms"
              required
              type="number"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="bathrooms">Bathrooms</Label>
            <Input
              defaultValue={property?.bathrooms ?? 0}
              disabled={isPending}
              id="bathrooms"
              min={0}
              name="bathrooms"
              required
              type="number"
            />
          </div>
        </div>
      </div>

      <div className="grid gap-5 rounded-md border border-border bg-card p-5 shadow-sm">
        <div className="grid gap-2">
          <Label htmlFor="address">Address</Label>
          <Input
            defaultValue={property?.location?.address ?? ""}
            disabled={isPending}
            id="address"
            name="address"
            placeholder="Street address"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="city">City</Label>
            <Input
              defaultValue={property?.location?.city}
              disabled={isPending}
              id="city"
              name="city"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="state">State</Label>
            <Input
              defaultValue={property?.location?.state}
              disabled={isPending}
              id="state"
              name="state"
              required
            />
          </div>
        </div>
      </div>

      <div className="rounded-md border border-border bg-card p-5 shadow-sm">
        <ImageUploader
          disabled={isPending}
          existingImages={existingImages}
          onChange={setImageState}
          value={imageState}
        />
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button
          disabled={isPending}
          onClick={() => router.push("/dashboard/landlord/properties")}
          type="button"
          variant="outline"
        >
          Cancel
        </Button>
        <Button disabled={isPending} type="submit">
          {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
