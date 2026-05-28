"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";

import { resetPassword } from "@/actions/auth";
import { AuthField } from "@/features/auth/components/auth-form-fields";
import { AuthSubmitButton } from "@/features/auth/components/auth-submit-button";
import { FormMessage } from "@/features/auth/components/form-message";
import { createClient } from "@/supabase/browser-client";
import type { AuthActionState } from "@/types/auth";

const initialState: AuthActionState = {
  success: false,
  message: "",
};

type TokenStatus = "idle" | "checking" | "ready" | "error";

export function ResetPasswordForm() {
  const router = useRouter();
  const [tokenStatus, setTokenStatus] = useState<TokenStatus>("idle");
  const [tokenMessage, setTokenMessage] = useState("");
  const [state, formAction, isPending] = useActionState(
    resetPassword,
    initialState
  );

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.slice(1));
    const queryParams = new URLSearchParams(window.location.search);
    const accessToken = hashParams.get("access_token");
    const refreshToken = hashParams.get("refresh_token");
    const code = queryParams.get("code");

    if (!accessToken && !refreshToken && !code) {
      return;
    }

    let isMounted = true;

    async function prepareResetSession() {
      setTokenStatus("checking");

      const supabase = createClient();
      const { error } =
        accessToken && refreshToken
          ? await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            })
          : await supabase.auth.exchangeCodeForSession(code ?? "");

      if (!isMounted) {
        return;
      }

      if (error) {
        setTokenStatus("error");
        setTokenMessage(
          "This reset link is no longer active. Please request a new one."
        );
        return;
      }

      setTokenStatus("ready");
      setTokenMessage("You can now choose a new password.");
      window.history.replaceState(null, "", "/reset-password");
      router.refresh();
    }

    void prepareResetSession();

    return () => {
      isMounted = false;
    };
  }, [router]);

  const isPreparingToken = tokenStatus === "checking";

  return (
    <form action={formAction} className="grid gap-5">
      <FormMessage
        message={tokenMessage}
        tone={tokenStatus === "error" ? "error" : "success"}
      />
      <FormMessage
        message={!state.success ? state.message : undefined}
        tone="error"
      />
      <AuthField
        label="New password"
        id="password"
        name="password"
        type="password"
        autoComplete="new-password"
        disabled={isPending || isPreparingToken}
        error={state.errors?.password?.[0]}
        required
      />
      <AuthField
        label="Confirm password"
        id="confirmPassword"
        name="confirmPassword"
        type="password"
        autoComplete="new-password"
        disabled={isPending || isPreparingToken}
        error={state.errors?.confirmPassword?.[0]}
        required
      />
      <AuthSubmitButton
        isPending={isPending || isPreparingToken}
        idleText="Update password"
        pendingText={isPreparingToken ? "Preparing reset" : "Updating password"}
      />
    </form>
  );
}
