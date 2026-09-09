/**
 * Customer Profile Utility Functions
 */

/**
 * Formats a YYYY-MM-DD date string into a localized readable date (e.g. "April 12, 1995").
 */
export function formatDateOfBirth<T extends string | null = null>(
  dob?: string | null,
  fallback: T = null as T,
): string | T {
  if (!dob) return fallback;

  try {
    const [year, month, day] = dob.split("-").map(Number);
    if (year && month && day) {
      const date = new Date(Date.UTC(year, month - 1, day));
      return new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
      }).format(date);
    }
    return dob;
  } catch {
    return dob;
  }
}

/**
 * Formats a gender value into capitalized display text (e.g. "MALE" -> "Male").
 */
export function formatGender(gender?: string | null, fallback = "Not specified"): string {
  if (!gender) return fallback;
  return gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase();
}

/**
 * Formats an E.164 phone number for readable display (e.g. "+919876543210" -> "+91 98765 43210").
 */
export function formatPhoneNumber(phone?: string | null, fallback = "Not provided"): string {
  if (!phone) return fallback;
  if (phone.startsWith("+91") && phone.length === 13) {
    return `+91 ${phone.slice(3, 8)} ${phone.slice(8)}`;
  }
  return phone;
}

/**
 * Extracts 2-letter uppercase initials from a user's full name.
 */
export function getProfileInitials(name?: string | null, fallback = "CU"): string {
  if (!name?.trim()) return fallback;
  const nameParts = name.trim().split(/\s+/).filter(Boolean);
  if (nameParts.length >= 2) {
    return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
  }
  if (nameParts.length === 1) {
    return nameParts[0].slice(0, 2).toUpperCase();
  }
  return fallback;
}
