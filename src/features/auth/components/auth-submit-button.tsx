"use client";

import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

type AuthSubmitButtonProps = {
  isPending: boolean;
  idleText: string;
  pendingText: string;
};

export function AuthSubmitButton({
  isPending,
  idleText,
  pendingText,
}: AuthSubmitButtonProps) {
  return (
    <Button
      type="submit"
      size="lg"
      className="mt-1 w-full"
      disabled={isPending}
    >
      {isPending ? (
        <>
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          {pendingText}
        </>
      ) : (
        idleText
      )}
    </Button>
  );
}
