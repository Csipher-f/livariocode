"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { ONBOARDING_PATH } from "@/constants/routes";
import {
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema,
  signupSchema,
} from "@/lib/auth-validation";
import { getFormString } from "@/lib/form-data";
import { createClient } from "@/supabase/server-client";
import { upsertUserProfile } from "@/supabase/profiles";
import type { AuthActionState } from "@/types/auth";

const GENERIC_AUTH_ERROR =
  "We could not complete that request. Please try again.";

function validationError(errors: Record<string, string[]>): AuthActionState {
  return {
    success: false,
    message: "Please check the highlighted fields.",
    errors,
  };
}

async function getRequestOrigin() {
  const headerStore = await headers();
  const origin = headerStore.get("origin");

  return origin ?? "";
}

export async function signup(
  _state: AuthActionState | undefined,
  formData: FormData
): Promise<AuthActionState> {
  const parsed = signupSchema.safeParse({
    email: getFormString(formData, "email"),
    password: getFormString(formData, "password"),
    fullName: getFormString(formData, "fullName"),
  });

  if (!parsed.success) {
    return validationError(parsed.error.flatten().fieldErrors);
  }

  const origin = await getRequestOrigin();
  const supabase = await createClient();
  const { email, password, fullName } = parsed.data;
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
      emailRedirectTo: `${origin}/auth/callback?next=${ONBOARDING_PATH}`,
    },
  });

  if (error) {
    return {
      success: false,
      message: error.message || GENERIC_AUTH_ERROR,
    };
  }

  if (data.user) {
    await upsertUserProfile({
      id: data.user.id,
      email: data.user.email,
      fullName,
    });
  }

  if (data.session) {
    redirect(ONBOARDING_PATH);
  }

  return {
    success: true,
    message:
      "Account created. Check your email if confirmation is required, then continue onboarding.",
    redirectTo: ONBOARDING_PATH,
  };
}

export async function login(
  _state: AuthActionState | undefined,
  formData: FormData
): Promise<AuthActionState> {
  const parsed = loginSchema.safeParse({
    email: getFormString(formData, "email"),
    password: getFormString(formData, "password"),
  });

  if (!parsed.success) {
    return validationError(parsed.error.flatten().fieldErrors);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return {
      success: false,
      message: "Invalid email or password.",
    };
  }

  return {
    success: true,
    message: "Signed in successfully.",
  };
}

export async function logout(): Promise<AuthActionState> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return {
      success: false,
      message: GENERIC_AUTH_ERROR,
    };
  }

  return {
    success: true,
    message: "Signed out successfully.",
  };
}

export async function requestPasswordReset(
  _state: AuthActionState | undefined,
  formData: FormData
): Promise<AuthActionState> {
  const parsed = forgotPasswordSchema.safeParse({
    email: getFormString(formData, "email"),
  });

  if (!parsed.success) {
    return validationError(parsed.error.flatten().fieldErrors);
  }

  const origin = await getRequestOrigin();
  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(
    parsed.data.email,
    {
      redirectTo: `${origin}/auth/callback?next=/reset-password`,
    }
  );

  if (error) {
    return {
      success: false,
      message: GENERIC_AUTH_ERROR,
    };
  }

  return {
    success: true,
    message: "If an account exists, password reset instructions were sent.",
  };
}

export async function resetPassword(
  _state: AuthActionState | undefined,
  formData: FormData
): Promise<AuthActionState> {
  const parsed = resetPasswordSchema.safeParse({
    password: getFormString(formData, "password"),
  });

  if (!parsed.success) {
    return validationError(parsed.error.flatten().fieldErrors);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (error) {
    return {
      success: false,
      message: GENERIC_AUTH_ERROR,
    };
  }

  return {
    success: true,
    message: "Password updated successfully.",
  };
}
