import type { User } from "@supabase/supabase-js";

import type { Profile, UserRole } from "@/types/database";

export type AuthUser = User;

export type AuthenticatedUser = {
  user: AuthUser;
  profile: Profile | null;
};

export type AuthActionState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export type AuthRouteIntent = "public" | "auth" | "protected";

export type RoleGuardOptions = {
  allowedRoles?: UserRole[];
  redirectTo?: string;
};
