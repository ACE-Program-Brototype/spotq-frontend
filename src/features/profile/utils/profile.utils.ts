import env from "@/config/env";
import { PROFILE_MESSAGES } from "../constants/profile.constants";
import type { StaffProfile, StaffProfileRawData } from "../types/profile.types";

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
    .split(/[_\s]+/)
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

