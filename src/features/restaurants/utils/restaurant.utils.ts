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

/**
 * Formats a raw operating time string into a clean 12-hour format (e.g. "10:00 AM").
 * Handles:
 * - ISO timestamps: "1970-01-01T10:00:00.000Z" -> "10:00 AM"
 * - 24-hour time strings: "10:00", "23:00:00" -> "11:00 PM"
 * - 12-hour strings: "10:00 AM" -> "10:00 AM"
 */
export function formatOperatingTime(timeStr?: string | null): string {
  if (!timeStr) return "";

  const trimmed = timeStr.trim();
  if (!trimmed) return "";

  // Already 12-hour format with AM/PM
  if (/(AM|PM)/i.test(trimmed)) {
    return trimmed;
  }

  // ISO timestamp (e.g., "1970-01-01T10:00:00.000Z")
  if (trimmed.includes("T")) {
    const match = trimmed.match(/T(\d{2}):(\d{2})/);
    if (match) {
      let hours = parseInt(match[1], 10);
      const minutes = match[2];
      const period = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      return `${hours}:${minutes} ${period}`;
    }
  }

  // 24-hour format (e.g., "10:00", "23:00:00")
  const standardMatch = trimmed.match(/^(\d{1,2}):(\d{2})/);
  if (standardMatch) {
    let hours = parseInt(standardMatch[1], 10);
    const minutes = standardMatch[2];
    const period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${period}`;
  }

  return trimmed;
}

