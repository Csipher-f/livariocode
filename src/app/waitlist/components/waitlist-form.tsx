"use client";

import { useRef, useState, useTransition } from "react";
import { Check, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { joinWaitlist } from "@/features/waitlist/actions/join-waitlist";
import type { WaitlistRole } from "@/features/waitlist/types";

type WaitlistFormProps = {
  role: WaitlistRole;
  buttonLabel: string;
};

export function WaitlistForm({ role, buttonLabel }: WaitlistFormProps) {
  const [isPending, startTransition] = useTransition();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    setError(null);

    startTransition(async () => {
      const email = formData.get("email") as string;
      const full_name = formData.get("full_name") as string;

      const result = await joinWaitlist({
        email,
        full_name: full_name || undefined,
        role,
      });

      if (result.success) {
        setSuccessMessage(result.message);
        formRef.current?.reset();
      } else {
        setError(result.message);
      }
    });
  }

  if (successMessage) {
    const isAlreadyOnList = successMessage === "You're already on the list";

    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-[#FDE8DF]">
          <Check className="size-6 text-[#E8623A]" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">
          {isAlreadyOnList ? "Already registered!" : "You\u2019re on the list!"}
        </h3>
        <p className="mt-1 text-sm text-[#8C7B6B]">
          {isAlreadyOnList
            ? "This email is already on the waitlist. We\u2019ll be in touch soon."
            : "We\u2019ll reach out soon with your early access details."}
        </p>
      </div>
    );
  }

  return (
    <form ref={formRef} action={handleSubmit} className="mt-5 space-y-3">
      <div>
        <Label htmlFor={`name-${role}`} className="sr-only">
          Your name
        </Label>
        <Input
          disabled={isPending}
          id={`name-${role}`}
          name="full_name"
          placeholder="Your name (optional)"
          type="text"
        />
      </div>
      <div>
        <Label htmlFor={`email-${role}`} className="sr-only">
          Email address
        </Label>
        <Input
          disabled={isPending}
          id={`email-${role}`}
          name="email"
          placeholder="your@email.com"
          required
          type="email"
        />
      </div>
      {error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : null}
      <Button
        className="w-full"
        disabled={isPending}
        size="lg"
        type="submit"
      >
        {isPending ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Submitting...
          </>
        ) : (
          buttonLabel
        )}
      </Button>
    </form>
  );
}