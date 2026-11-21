/**
 * Generates user initials from staff member's full name (e.g., "Julian Montgomery" -> "JM").
 */
export function getStaffInitials(fullName?: string | null, fallback = "ST"): string {
  if (!fullName) return fallback;
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return fallback;
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}
