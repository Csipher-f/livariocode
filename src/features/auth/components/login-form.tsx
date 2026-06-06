"use client";

import Link from "next/link";
import { useActionState } from "react";

import { login } from "@/actions/auth";
import { AuthField } from "@/features/auth/components/auth-form-fields";
import { AuthSubmitButton } from "@/features/auth/components/auth-submit-button";
import { FormMessage } from "@/features/auth/components/form-message";
import type { AuthActionState } from "@/types/auth";

const initialState: AuthActionState = {
  success: false,
  message: "",
};

type LoginFormProps = {
  notice?: string;
};

export function LoginForm({ notice }: LoginFormProps) {
  const [state, formAction, isPending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="grid gap-5">
      <FormMessage message={notice} tone="success" />
      <FormMessage
        message={!state.success ? state.message : undefined}
        tone="error"
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
        autoComplete="current-password"
        disabled={isPending}
        error={state.errors?.password?.[0]}
        required
        labelAction={
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-[#E8623A] hover:text-[#C44D28] underline-offset-4 hover:underline"
          >
            Forgot password?
          </Link>
        }
      />
      <AuthSubmitButton
        isPending={isPending}
        idleText="Log in"
        pendingText="Logging in"
      />
      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="font-medium text-[#E8623A] hover:text-[#C44D28] underline-offset-4 hover:underline"
        >
          Sign up
        </Link>
      </p>
    </form>
  );
}
