import type { ActiveRole } from "@/types/database";

export function getDashboardPathForRole(activeRole?: ActiveRole | null) {
  return activeRole === "landlord"
    ? "/dashboard/landlord"
    : "/dashboard/tenant";
}
