import type { ActiveRole } from "./database";

export interface ProfileUpdatePayload {
  fullName: string;
  avatarUrl?: string | null;
}

export interface RoleSwitchPayload {
  activeRole: ActiveRole;
}
