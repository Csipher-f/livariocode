"use client";

import { Heart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useFavorite } from "@/features/favorites/hooks/use-favorite";
import { cn } from "@/lib/utils";

export function FavoriteButton({
  className,
  initialIsFavorited = false,
  isAuthenticated,
  propertyId,
}: {
  className?: string;
  initialIsFavorited?: boolean;
  isAuthenticated: boolean;
  propertyId: string;
}) {
  const { isFavorited, isPending, toggleFavorite } = useFavorite({
    initialIsFavorited,
    isAuthenticated,
    propertyId,
  });

  return (
    <Button
      aria-label={isFavorited ? "Remove saved listing" : "Save listing"}
      aria-pressed={isFavorited}
      className={cn(
        "rounded-full bg-background/90 shadow-sm backdrop-blur hover:bg-background",
        className
      )}
      data-pending={isPending ? "" : undefined}
      onClick={toggleFavorite}
      size="icon"
      type="button"
      variant="outline"
    >
      <Heart
        className={cn(
          "size-4 transition",
          isFavorited && "fill-[#E8623A] text-[#E8623A]"
        )}
      />
    </Button>
  );
}
