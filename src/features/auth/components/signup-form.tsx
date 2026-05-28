"use client";

import Link from "next/link";
import { useActionState } from "react";

import { signup } from "@/actions/auth";
import { AuthField } from "@/features/auth/components/auth-form-fields";
import { AuthSubmitButton } from "@/features/auth/components/auth-submit-button";
import { FormMessage } from "@/features/auth/components/form-message";
import type { AuthActionState } from "@/types/auth";

const initialState: AuthActionState = {
  success: false,
  message: "",
};

export function SignupForm() {
  const [state, formAction, isPending] = useActionState(signup, initialState);

  return (
    <form action={formAction} className="grid gap-5">
      <FormMessage
        message={state.message}
        tone={state.success ? "success" : "error"}
      />
      <AuthField
        label="Full name"
        id="fullName"
        name="fullName"
        autoComplete="name"
        placeholder="Your full name"
        disabled={isPending}
        error={state.errors?.fullName?.[0]}
        required
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
      <AuthField
        label="Password"
        id="password"
        name="password"
        type="password"
        autoComplete="new-password"
        disabled={isPending}
        error={state.errors?.password?.[0]}
        required
      />
      <AuthSubmitButton
        isPending={isPending}
        idleText="Create account"
        pendingText="Creating account"
      />
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Log in
        </Link>
      </p>
    </form>
  );
}
