export const AUTH_ROUTES = [
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
] as const;

export const PROTECTED_ROUTES = [
  "/admin",
  "/onboarding",
  "/dashboard",
  "/dashboard/properties",
  "/dashboard/saved",
  "/settings",
] as const;

export const ONBOARDING_PATH = "/onboarding";
export const DEFAULT_AUTHENTICATED_PATH = "/dashboard";
export const DEFAULT_UNAUTHENTICATED_PATH = "/login";
