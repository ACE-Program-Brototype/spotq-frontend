import type { StaffInvitationStatus } from "@/features/staff/types/staff-invitation.types";

/**
 * Get display initials for avatar fallback (e.g. "John Doe" -> "JD")
 */
export function getStaffInitials(name: string): string {
  if (!name) return "ST";
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Check if a staff invitation has expired
 */
export function isInvitationExpired(
  status: StaffInvitationStatus,
  expiresAt: string | Date,
): boolean {
  if (status === "EXPIRED") return true;
  if (status === "PENDING") {
    return new Date(expiresAt) < new Date();
  }
  return false;
}

/**
 * Format employee code or fallback to truncated ID
 */
export function formatEmployeeCode(id: string, code?: string): string {
  if (code) return code;
  return `EMP-${id.slice(-6).toUpperCase()}`;
}
