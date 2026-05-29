"use client";

import Image from "next/image";
import { ImagePlus, Star, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { LandlordPropertyImage } from "@/features/properties/types";
import { cn } from "@/lib/utils";

export type NewImagePreview = {
  id: string;
  file: File;
  previewUrl: string;
};

export type ImageUploaderValue = {
  newImages: NewImagePreview[];
  removedImageIds: string[];
  primaryImageKey: string;
};

export function ImageUploader({
  disabled,
  existingImages = [],
  onChange,
  value,
}: {
  disabled?: boolean;
  existingImages?: LandlordPropertyImage[];
  onChange: (value: ImageUploaderValue) => void;
  value: ImageUploaderValue;
}) {
  const visibleExistingImages = existingImages.filter(
    (image) => !value.removedImageIds.includes(image.id)
  );
  const totalImages = visibleExistingImages.length + value.newImages.length;

  function addFiles(files: FileList | null) {
    if (!files) {
      return;
    }

    const imageFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );
    const availableSlots = Math.max(10 - totalImages, 0);
    const nextImages = imageFiles.slice(0, availableSlots).map((file) => ({
      id: crypto.randomUUID(),
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    onChange({
      ...value,
      newImages: [...value.newImages, ...nextImages],
      primaryImageKey:
        value.primaryImageKey ||
        (visibleExistingImages[0]
          ? `existing:${visibleExistingImages[0].id}`
          : nextImages[0]
            ? `new:${value.newImages.length}`
            : ""),
    });
  }

  function removeExistingImage(id: string) {
    const nextRemovedImageIds = [...value.removedImageIds, id];
    const nextExistingImages = existingImages.filter(
      (image) => !nextRemovedImageIds.includes(image.id)
    );
    const nextPrimaryImageKey =
      value.primaryImageKey === `existing:${id}`
        ? nextExistingImages[0]
          ? `existing:${nextExistingImages[0].id}`
          : value.newImages[0]
            ? "new:0"
            : ""
        : value.primaryImageKey;

    onChange({
      ...value,
      removedImageIds: nextRemovedImageIds,
      primaryImageKey: nextPrimaryImageKey,
    });
  }

  function removeNewImage(index: number) {
    const nextImages = value.newImages.filter((_, imageIndex) => {
      return imageIndex !== index;
    });
    const nextPrimaryImageKey =
      value.primaryImageKey === `new:${index}`
        ? visibleExistingImages[0]
          ? `existing:${visibleExistingImages[0].id}`
          : nextImages[0]
            ? "new:0"
            : ""
        : value.primaryImageKey;

    onChange({
      ...value,
      newImages: nextImages,
      primaryImageKey: nextPrimaryImageKey,
    });
  }

  return (
    <div className="grid gap-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-medium">Images</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Up to 10 images. Each file must be 5MB or smaller.
          </p>
        </div>
        <label
          className={cn(
            "inline-flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-4xl bg-primary px-3 text-sm font-medium text-primary-foreground transition hover:bg-primary/80",
            disabled && "pointer-events-none opacity-50"
          )}
        >
          <ImagePlus className="size-4" />
          Add images
          <input
            accept="image/*"
            className="sr-only"
            disabled={disabled}
            multiple
            onChange={(event) => addFiles(event.target.files)}
            type="file"
          />
        </label>
      </div>

      {totalImages > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {visibleExistingImages.map((image) => {
            const imageKey = `existing:${image.id}`;

            return (
              <div
                className="relative overflow-hidden rounded-md border border-border bg-card"
                key={image.id}
              >
                <div className="relative aspect-[4/3] bg-secondary">
                  <Image
                    alt=""
                    className="object-cover"
                    fill
                    sizes="(min-width: 1024px) 220px, 50vw"
                    src={image.imageUrl}
                    unoptimized
                  />
                </div>
                <div className="flex items-center justify-between gap-2 p-2">
                  <Button
                    disabled={disabled}
                    onClick={() =>
                      onChange({ ...value, primaryImageKey: imageKey })
                    }
                    size="sm"
                    type="button"
                    variant={
                      value.primaryImageKey === imageKey ? "default" : "outline"
                    }
                  >
                    <Star className="size-4" />
                    Primary
                  </Button>
                  <Button
                    aria-label="Remove image"
                    disabled={disabled}
                    onClick={() => removeExistingImage(image.id)}
                    size="icon-sm"
                    type="button"
                    variant="outline"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            );
          })}

          {value.newImages.map((image, index) => {
            const imageKey = `new:${index}`;

            return (
              <div
                className="relative overflow-hidden rounded-md border border-border bg-card"
                key={image.id}
              >
                <div className="relative aspect-[4/3] bg-secondary">
                  <Image
                    alt=""
                    className="object-cover"
                    fill
                    sizes="(min-width: 1024px) 220px, 50vw"
                    src={image.previewUrl}
                    unoptimized
                  />
                </div>
                <div className="h-1 bg-secondary">
                  <div className="h-full w-full bg-primary" />
                </div>
                <div className="flex items-center justify-between gap-2 p-2">
                  <Button
                    disabled={disabled}
                    onClick={() =>
                      onChange({ ...value, primaryImageKey: imageKey })
                    }
                    size="sm"
                    type="button"
                    variant={
                      value.primaryImageKey === imageKey ? "default" : "outline"
                    }
                  >
                    <Star className="size-4" />
                    Primary
                  </Button>
                  <Button
                    aria-label="Remove image"
                    disabled={disabled}
                    onClick={() => removeNewImage(index)}
                    size="icon-sm"
                    type="button"
                    variant="outline"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-md border border-dashed border-border bg-muted/20 p-6 text-center">
          <ImagePlus className="mx-auto size-6 text-muted-foreground" />
          <p className="mt-2 text-sm font-medium">No images added yet</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Add clear photos to help tenants understand the space.
          </p>
        </div>
      )}
    </div>
  );
}
