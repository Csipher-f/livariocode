"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { toast } from "@/hooks/use-toast";
import { toggleFavorite as toggleFavoriteAction } from "@/features/favorites/actions/toggle-favorite";

export function useFavorite({
  initialIsFavorited,
  isAuthenticated,
  propertyId,
}: {
  initialIsFavorited: boolean;
  isAuthenticated: boolean;
  propertyId: string;
}) {
  const router = useRouter();
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited);
  const [isPending, startTransition] = useTransition();

  function toggleFavorite() {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    const nextIsFavorited = !isFavorited;
    setIsFavorited(nextIsFavorited);

    startTransition(async () => {
      const result = await toggleFavoriteAction({ propertyId });

      if (!result.success) {
        setIsFavorited(isFavorited);
        toast({
          title: "Saved listing not updated",
          description: result.message,
          intent: "destructive",
        });
        return;
      }

      setIsFavorited(result.isFavorited);
    });
  }

  return {
    isFavorited,
    toggleFavorite,
    isPending,
  };
}
