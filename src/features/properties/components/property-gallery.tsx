"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { PropertyDetailImage } from "@/features/properties/types";
import { cn } from "@/lib/utils";

const fallbackImage = "/images/listings/listing-1.svg";
const propertyBlurDataUrl =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNCIgaGVpZ2h0PSIzIiB2aWV3Qm94PSIwIDAgNCAzIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjMiIGZpbGw9IiNlNWU3ZWIiLz48L3N2Zz4=";

function normalizeImages(images: PropertyDetailImage[]) {
  if (images.length > 0) {
    return images;
  }

  return [
    {
      id: "fallback",
      imageUrl: fallbackImage,
      isPrimary: true,
      displayOrder: 0,
    },
  ];
}

export function PropertyGallery({
  images,
  title,
}: {
  images: PropertyDetailImage[];
  title: string;
}) {
  const galleryImages = useMemo(() => normalizeImages(images), [images]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const activeImage = galleryImages[activeIndex] ?? galleryImages[0];
  const hasMultipleImages = galleryImages.length > 1;

  const showPrevious = useCallback(() => {
    setActiveIndex((currentIndex) =>
      currentIndex === 0 ? galleryImages.length - 1 : currentIndex - 1
    );
  }, [galleryImages.length]);

  const showNext = useCallback(() => {
    setActiveIndex((currentIndex) =>
      currentIndex === galleryImages.length - 1 ? 0 : currentIndex + 1
    );
  }, [galleryImages.length]);

  useEffect(() => {
    if (!lightboxOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setLightboxOpen(false);
      }

      if (event.key === "ArrowLeft") {
        showPrevious();
      }

      if (event.key === "ArrowRight") {
        showNext();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [lightboxOpen, showNext, showPrevious]);

  function handleTouchEnd(endX: number) {
    if (touchStart === null) {
      return;
    }

    const distance = touchStart - endX;

    if (Math.abs(distance) > 40) {
      if (distance > 0) {
        showNext();
      } else {
        showPrevious();
      }
    }

    setTouchStart(null);
  }

  return (
    <section aria-label={`${title} image gallery`} className="grid gap-3">
      <button
        aria-label="Open image gallery"
        className="group relative aspect-[4/3] overflow-hidden rounded-md bg-secondary text-left shadow-sm sm:aspect-[16/9]"
        onClick={() => setLightboxOpen(true)}
        type="button"
      >
        <Image
          alt={title}
          className="object-cover transition duration-500 group-hover:scale-[1.02]"
          fill
          priority
          placeholder="blur"
          blurDataURL={propertyBlurDataUrl}
          sizes="100vw"
          src={activeImage.imageUrl}
        />
        {hasMultipleImages ? (
          <span className="absolute bottom-4 right-4 rounded-full bg-background/90 px-3 py-1 text-xs font-medium shadow-sm backdrop-blur">
            {activeIndex + 1} / {galleryImages.length}
          </span>
        ) : null}
      </button>

      {hasMultipleImages ? (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {galleryImages.map((image, index) => (
            <button
              aria-label={`Show image ${index + 1}`}
              className={cn(
                "relative h-20 w-28 shrink-0 overflow-hidden rounded-md border bg-secondary transition",
                index === activeIndex
                  ? "border-foreground"
                  : "border-border opacity-70 hover:opacity-100"
              )}
              key={image.id}
              onClick={() => setActiveIndex(index)}
              type="button"
            >
              <Image
                alt=""
                className="object-cover"
                fill
                placeholder="blur"
                blurDataURL={propertyBlurDataUrl}
                sizes="112px"
                src={image.imageUrl}
              />
            </button>
          ))}
        </div>
      ) : null}

      {lightboxOpen ? (
        <div
          aria-modal="true"
          className="fixed inset-0 z-50 grid bg-background/95 backdrop-blur"
          role="dialog"
        >
          <div className="absolute left-4 top-4 z-10 rounded-full bg-background/80 px-3 py-1 text-sm font-medium shadow-sm">
            {activeIndex + 1} / {galleryImages.length}
          </div>
          <Button
            aria-label="Close gallery"
            className="absolute right-4 top-4 z-10 bg-background/80 shadow-sm"
            onClick={() => setLightboxOpen(false)}
            size="icon"
            type="button"
            variant="outline"
          >
            <X className="size-4" />
          </Button>

          {hasMultipleImages ? (
            <>
              <Button
                aria-label="Previous image"
                className="absolute left-4 top-1/2 z-10 hidden -translate-y-1/2 bg-background/80 shadow-sm sm:inline-flex"
                onClick={showPrevious}
                size="icon"
                type="button"
                variant="outline"
              >
                <ChevronLeft className="size-4" />
              </Button>
              <Button
                aria-label="Next image"
                className="absolute right-4 top-1/2 z-10 hidden -translate-y-1/2 bg-background/80 shadow-sm sm:inline-flex"
                onClick={showNext}
                size="icon"
                type="button"
                variant="outline"
              >
                <ChevronRight className="size-4" />
              </Button>
            </>
          ) : null}

          <div
            className="relative m-auto h-full w-full max-w-7xl"
            onTouchEnd={(event) =>
              handleTouchEnd(event.changedTouches[0]?.clientX ?? 0)
            }
            onTouchStart={(event) =>
              setTouchStart(event.changedTouches[0]?.clientX ?? null)
            }
          >
            <Image
              alt={title}
              className="object-contain transition-opacity duration-300"
              fill
              priority
              placeholder="blur"
              blurDataURL={propertyBlurDataUrl}
              sizes="100vw"
              src={activeImage.imageUrl}
            />
          </div>
        </div>
      ) : null}
    </section>
  );
}
