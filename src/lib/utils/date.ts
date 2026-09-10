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
