"use client";

import Image from "next/image";
import type { DragEvent } from "react";
import { useState } from "react";
import { GripVertical, ImagePlus, Star, Trash2 } from "lucide-react";

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
  existingImageOrder: string[];
};

type ImageItem =
  | {
      key: string;
      kind: "existing";
      id: string;
      imageUrl: string;
    }
  | {
      key: string;
      kind: "new";
      id: string;
      image: NewImagePreview;
      index: number;
    };

const maxImages = 10;
const maxImageSize = 5 * 1024 * 1024;

function getVisibleExistingImages(
  existingImages: LandlordPropertyImage[],
  value: ImageUploaderValue
) {
  const visibleImages = existingImages.filter(
    (image) => !value.removedImageIds.includes(image.id)
  );
  const imageMap = new Map(visibleImages.map((image) => [image.id, image]));
  const orderedImages = value.existingImageOrder
    .map((id) => imageMap.get(id))
    .filter((image): image is LandlordPropertyImage => Boolean(image));
  const unorderedImages = visibleImages.filter(
    (image) => !value.existingImageOrder.includes(image.id)
  );

  return [...orderedImages, ...unorderedImages];
}

function reorderItems(items: ImageItem[], fromKey: string, toKey: string) {
  const fromIndex = items.findIndex((item) => item.key === fromKey);
  const toIndex = items.findIndex((item) => item.key === toKey);

  if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) {
    return items;
  }

  const nextItems = [...items];
  const [movedItem] = nextItems.splice(fromIndex, 1);
  nextItems.splice(toIndex, 0, movedItem);

  return nextItems;
}

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
  const [imageError, setImageError] = useState("");
  const visibleExistingImages = getVisibleExistingImages(existingImages, value);
  const items: ImageItem[] = [
    ...visibleExistingImages.map((image) => ({
      key: `existing:${image.id}`,
      kind: "existing" as const,
      id: image.id,
      imageUrl: image.imageUrl,
    })),
    ...value.newImages.map((image, index) => ({
      key: `new:${index}`,
      kind: "new" as const,
      id: image.id,
      image,
      index,
    })),
  ];
  const totalImages = items.length;

  function getNextPrimaryImageKey(
    nextItems: ImageItem[],
    primaryKey = value.primaryImageKey
  ) {
    const primaryItem =
      items.find((item) => item.key === primaryKey) ?? nextItems[0];

    if (!primaryItem) {
      return "";
    }

    if (primaryItem.kind === "existing") {
      return nextItems.some((item) => item.key === primaryItem.key)
        ? primaryItem.key
        : nextItems[0]?.key ?? "";
    }

    const newIndex = nextItems
      .filter((item) => item.kind === "new")
      .findIndex((item) => item.image.id === primaryItem.image.id);

    if (newIndex >= 0) {
      return `new:${newIndex}`;
    }

    return nextItems[0]?.key ?? "";
  }

  function applyItems(nextItems: ImageItem[], primaryKey = value.primaryImageKey) {
    onChange({
      ...value,
      existingImageOrder: nextItems
        .filter((item) => item.kind === "existing")
        .map((item) => item.id),
      newImages: nextItems
        .filter((item) => item.kind === "new")
        .map((item) => item.image),
      primaryImageKey: getNextPrimaryImageKey(nextItems, primaryKey),
    });
  }

  function addFiles(files: FileList | File[]) {
    const selectedFiles = Array.from(files);
    const invalidFile = selectedFiles.find(
      (file) => !file.type.startsWith("image/") || file.size > maxImageSize
    );
    const imageFiles = selectedFiles.filter((file) => {
      return file.type.startsWith("image/") && file.size <= maxImageSize;
    });
    const availableSlots = Math.max(maxImages - totalImages, 0);
    const nextImages = imageFiles.slice(0, availableSlots).map((file) => ({
      id: crypto.randomUUID(),
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    if (invalidFile) {
      setImageError("Only image files up to 5MB can be added.");
    } else if (imageFiles.length > availableSlots) {
      setImageError("Listings can have up to 10 images.");
    } else {
      setImageError("");
    }

    if (nextImages.length === 0) {
      return;
    }

    const nextItems: ImageItem[] = [
      ...items,
      ...nextImages.map((image, imageIndex) => ({
        key: `new:${value.newImages.length + imageIndex}`,
        kind: "new" as const,
        id: image.id,
        image,
        index: value.newImages.length + imageIndex,
      })),
    ];

    applyItems(nextItems, value.primaryImageKey || nextItems[0]?.key || "");
  }

  function removeImage(imageKey: string) {
    const item = items.find((currentItem) => currentItem.key === imageKey);

    if (!item) {
      return;
    }

    const nextRemovedImageIds =
      item.kind === "existing"
        ? [...value.removedImageIds, item.id]
        : value.removedImageIds;
    const nextItems = items.filter((currentItem) => currentItem.key !== imageKey);

    onChange({
      ...value,
      removedImageIds: nextRemovedImageIds,
      existingImageOrder: nextItems
        .filter((currentItem) => currentItem.kind === "existing")
        .map((currentItem) => currentItem.id),
      newImages: nextItems
        .filter((currentItem) => currentItem.kind === "new")
        .map((currentItem) => currentItem.image),
      primaryImageKey: getNextPrimaryImageKey(nextItems, value.primaryImageKey),
    });
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();

    if (disabled) {
      return;
    }

    const sourceKey = event.dataTransfer.getData("text/plain");
    const targetKey = event.currentTarget.dataset.imageKey;

    if (sourceKey && targetKey) {
      applyItems(reorderItems(items, sourceKey, targetKey));
      return;
    }

    if (event.dataTransfer.files.length > 0) {
      addFiles(event.dataTransfer.files);
    }
  }

  return (
    <div
      className="grid gap-4"
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        if (event.dataTransfer.files.length > 0) {
          handleDrop(event);
        }
      }}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium">Photos</h3>
            <span className="rounded-4xl bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
              {totalImages} of {maxImages} images
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Drag photos in, then drag thumbnails to reorder. Each image must be
            5MB or smaller.
          </p>
        </div>
        <label
          className={cn(
            "inline-flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-4xl bg-primary px-3 text-sm font-medium text-primary-foreground transition hover:bg-primary/80",
            disabled && "pointer-events-none opacity-50"
          )}
        >
          <ImagePlus className="size-4" />
          Add photos
          <input
            accept="image/*"
            className="sr-only"
            disabled={disabled || totalImages >= maxImages}
            multiple
            onChange={(event) => {
              if (event.target.files) {
                addFiles(event.target.files);
                event.target.value = "";
              }
            }}
            type="file"
          />
        </label>
      </div>

      {totalImages > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const imageUrl =
              item.kind === "existing" ? item.imageUrl : item.image.previewUrl;
            const isPrimary = value.primaryImageKey === item.key;

            return (
              <div
                className={cn(
                  "relative overflow-hidden rounded-md border bg-card shadow-xs transition",
                  isPrimary ? "border-primary/50 ring-2 ring-primary/15" : "border-border"
                )}
                data-image-key={item.key}
                draggable={!disabled}
                key={item.key}
                onDragStart={(event) => {
                  event.dataTransfer.setData("text/plain", item.key);
                  event.dataTransfer.effectAllowed = "move";
                }}
                onDrop={handleDrop}
              >
                <div className="relative aspect-[4/3] bg-secondary">
                  <Image
                    alt=""
                    className="object-cover"
                    fill
                    sizes="(min-width: 1024px) 220px, 50vw"
                    src={imageUrl}
                    unoptimized
                  />
                  <div className="absolute left-2 top-2 rounded-4xl bg-background/90 px-2 py-1 text-xs font-medium shadow-sm backdrop-blur">
                    {isPrimary ? "Primary" : "Photo"}
                  </div>
                </div>
                <div className="flex items-center justify-between gap-2 p-2">
                  <Button
                    aria-label="Drag to reorder"
                    disabled={disabled}
                    size="icon-sm"
                    type="button"
                    variant="ghost"
                  >
                    <GripVertical className="size-4" />
                  </Button>
                  <div className="flex items-center gap-2">
                    <Button
                      disabled={disabled}
                      onClick={() => onChange({ ...value, primaryImageKey: item.key })}
                      size="sm"
                      type="button"
                      variant={isPrimary ? "default" : "outline"}
                    >
                      <Star className="size-4" />
                      Primary
                    </Button>
                    <Button
                      aria-label="Remove image"
                      disabled={disabled}
                      onClick={() => removeImage(item.key)}
                      size="icon-sm"
                      type="button"
                      variant="outline"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-md border border-dashed border-border bg-muted/20 p-8 text-center">
          <ImagePlus className="mx-auto size-7 text-muted-foreground" />
          <p className="mt-3 text-sm font-medium">Drop photos here</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Add clear, bright photos so tenants can understand the space.
          </p>
        </div>
      )}
      {imageError ? <p className="text-sm text-destructive">{imageError}</p> : null}
    </div>
  );
}
