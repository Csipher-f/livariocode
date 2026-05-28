"use client";

import Link from "next/link";
import { useActionState } from "react";

import { requestPasswordReset } from "@/actions/auth";
import { AuthField } from "@/features/auth/components/auth-form-fields";
import { AuthSubmitButton } from "@/features/auth/components/auth-submit-button";
import { FormMessage } from "@/features/auth/components/form-message";
import type { AuthActionState } from "@/types/auth";

const initialState: AuthActionState = {
  success: false,
  message: "",
};

export function ForgotPasswordForm() {
  const [state, formAction, isPending] = useActionState(
    requestPasswordReset,
    initialState
  );

  return (
    <form action={formAction} className="grid gap-5">
      <FormMessage
        message={state.message}
        tone={state.success ? "success" : "error"}
      />
      <AuthField
        label="Email"
        id="email"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        disabled={isPending}
        error={state.errors?.email?.[0]}
        required
      />
      <AuthSubmitButton
        isPending={isPending}
        idleText="Send reset email"
        pendingText="Sending email"
      />
      <Link
        href="/login"
        className="text-center text-sm font-medium text-primary underline-offset-4 hover:underline"
      >
        Back to log in
      </Link>
    </form>
  );
}
