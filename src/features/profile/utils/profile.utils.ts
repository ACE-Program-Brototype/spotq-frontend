import env from "@/config/env";
import { PROFILE_MESSAGES } from "../constants/profile.constants";
import type { StaffProfile, StaffProfileRawData } from "../types/profile.types";

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

/**
 * Resolves avatar key or URL into full URL using configured CDN/S3/MinIO base URL.
 */
export function resolveAvatarUrl(avatar?: string | null): string | null {
  if (!avatar?.trim()) return null;

  const trimmed = avatar.trim();
  if (/^(https?:\/\/|data:|blob:)/i.test(trimmed)) return trimmed;

  const base = env.cdnBaseUrl?.replace(/\/+$/, "");
  return base ? `${base}/${trimmed.replace(/^\/+/, "")}` : null;
}

/**
 * Generates user initials from full name (e.g., "Julian Montgomery" -> "JM").
 */
export function getInitials(name?: string | null, fallback = "SP"): string {
  const parts = name?.trim().split(/\s+/).filter(Boolean) ?? [];
  if (!parts.length) return fallback;
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

/**
 * Formats backend role enum into user-friendly title case (e.g., "RESTAURANT_STAFF" -> "Staff").
 */
export function formatRole(role?: string | null): string {
  if (!role?.trim()) return PROFILE_MESSAGES.DEFAULT_ROLE;

  return role
    .replace(/^RESTAURANT_/i, "")
    .toLowerCase()
    .split(/[\s_]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Formats backend status enum into title case (e.g., "ACTIVE" -> "Active").
 */
export function formatStatus(status?: string | null): string {
  if (!status?.trim()) return PROFILE_MESSAGES.DEFAULT_STATUS;
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
}

/**
 * Formats timestamp to "Month DD, YYYY" (e.g., "October 24, 2024").
 */
export function formatDate(dateStr?: string | null): string {
  if (!dateStr) return PROFILE_MESSAGES.NOT_RECORDED;

  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Formats timestamp to "Month DD, YYYY - hh:mm A" matching the Figma design.
 */
export function formatDateTime(dateStr?: string | null): string {
  if (!dateStr) return PROFILE_MESSAGES.NOT_RECORDED;

  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;

  const datePart = formatDate(dateStr);
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = date.getHours() >= 12 ? "PM" : "AM";
  const hours = (date.getHours() % 12 || 12).toString().padStart(2, "0");

  return `${datePart} - ${hours}:${minutes} ${ampm}`;
}

/**
 * Normalizes backend raw profile data into clean frontend domain model.
 */
export function normalizeStaffProfile(raw: StaffProfileRawData): StaffProfile {
  return {
    id: raw.id || "",
    restaurantId: raw.restaurantId || raw.restaurant_id || "",
    fullName:
      raw.fullName?.trim() ||
      raw.fullname?.trim() ||
      raw.name?.trim() ||
      PROFILE_MESSAGES.DEFAULT_NAME,
    email: raw.email?.trim() || "",
    phone: raw.phone?.trim() || raw.phoneNumber?.trim() || null,
    avatarUrl: resolveAvatarUrl(raw.avatar_url || raw.avatar),
    role: formatRole(raw.role),
    status: formatStatus(raw.status),
    createdAt: raw.created_at || raw.createdAt || null,
  };
}
