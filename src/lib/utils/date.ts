/**
 * Formats an ISO date string into a user-friendly readable date with optional time.
 * e.g., "Mar 11, 2024, 02:30 PM"
 */
export function formatDate(
  isoString?: string | null,
  options?: Intl.DateTimeFormatOptions,
): string {
  if (!isoString) return "N/A";
  try {
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) {
      return isoString;
    }
    const defaultOptions: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      ...options,
    };
    return date.toLocaleDateString("en-US", defaultOptions);
  } catch {
    return isoString;
  }
}

/**
 * Safely formats an ISO date string into a localized time string (e.g., "02:30 PM").
 * Gracefully falls back to a placeholder without throwing if string is missing or invalid.
 */
export function formatTime(
  isoString?: string | null,
  options?: Intl.DateTimeFormatOptions,
  fallback = "--:--",
): string {
  if (!isoString) return fallback;
  try {
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) {
      return fallback;
    }
    const defaultOptions: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
      ...options,
    };
    return date.toLocaleTimeString([], defaultOptions);
  } catch {
    return fallback;
  }
}
