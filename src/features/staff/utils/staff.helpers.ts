import {
  STAFF_INVITATION_STATUS,
  STAFF_MESSAGES,
  type StaffInvitationStatus,
} from "@/features/staff/constants/staff.constants";
import { formatDate } from "@/lib/utils/date";

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
  if (status === STAFF_INVITATION_STATUS.EXPIRED) return true;
  if (status === STAFF_INVITATION_STATUS.PENDING) {
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

/**
 * Format date nicely for staff display (e.g. "Sep 9, 2026")
 */
export function formatStaffDate(dateStr?: string | null): string {
  if (!dateStr) return STAFF_MESSAGES.NOT_AVAILABLE;
  try {
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return STAFF_MESSAGES.NOT_AVAILABLE;
    const formatted = formatDate(dateStr, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: undefined,
      minute: undefined,
    });
    return formatted === "N/A" ? STAFF_MESSAGES.NOT_AVAILABLE : formatted;
  } catch {
    return STAFF_MESSAGES.NOT_AVAILABLE;
  }
}
