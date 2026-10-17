/**
 * User Identity and Presentation Helpers
 * Reusable utility functions for formatting user display names and generating avatar initials.
 */

import type { User } from "../types/auth.types";

/**
 * Returns a human-friendly display name for a user.
 * Resolution priority:
 * 1. user.fullName
 * 2. user.name
 * 3. Username portion of user.email (before '@')
 * 4. Custom fallback (defaults to empty string)
 */
export function getUserDisplayName(user?: Partial<User> | null, fallback = ""): string {
  if (!user) return fallback;
  return (
    user.fullName?.trim() || user.name?.trim() || user.email?.split("@")[0]?.trim() || fallback
  );
}

/**
 * Generates 1-2 letter uppercase avatar initials from a user object or a name string.
 *
 * Rules:
 * - 2 or more words: First letter of first word + First letter of last word (e.g. "John Doe" -> "JD")
 * - 1 word (length >= 2): First 2 letters capitalized (e.g. "John" -> "JO")
 * - 1 word (length = 1): Single letter capitalized (e.g. "J" -> "J")
 * - Fallback: Provided fallback or "CU" (Customer)
 */
export function getUserInitials(
  nameOrUser?: Partial<User> | string | null,
  fallback = "CU",
): string {
  if (!nameOrUser) return fallback;

  const rawName = typeof nameOrUser === "string" ? nameOrUser : getUserDisplayName(nameOrUser, "");

  const trimmed = rawName.trim();
  if (!trimmed) return fallback;

  const nameParts = trimmed.split(/\s+/).filter(Boolean);
  if (nameParts.length >= 2) {
    return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
  }
  if (nameParts.length === 1 && nameParts[0].length >= 2) {
    return nameParts[0].slice(0, 2).toUpperCase();
  }
  return nameParts[0]?.[0]?.toUpperCase() || fallback;
}
