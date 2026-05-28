import { z } from "zod";

import { ACTIVE_ROLES } from "@/constants/user-roles";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long.");

export const signupSchema = z.object({
  email: z.email("Please enter a valid email address.").trim().toLowerCase(),
  password: passwordSchema,
  fullName: z.string().trim().min(2, "Name must be at least 2 characters."),
});

export const loginSchema = z.object({
  email: z.email("Please enter a valid email address.").trim().toLowerCase(),
  password: z.string().min(1, "Password is required."),
});

export const forgotPasswordSchema = z.object({
  email: z.email("Please enter a valid email address.").trim().toLowerCase(),
});

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your new password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "The passwords do not match yet.",
    path: ["confirmPassword"],
  });

export const onboardingRoleSchema = z.object({
  activeRole: z.enum(ACTIVE_ROLES),
});
