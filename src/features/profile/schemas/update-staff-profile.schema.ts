import { z } from "zod";
import { PROFILE_MESSAGES } from "../constants/profile.constants";

const nameRegex = /^[\p{L}\p{M}]+(?:[' .-]+[\p{L}\p{M}]+)*\.?$/u;
const phoneRegex =
  /^(?:(?:\+91|91|0)[\s-]?)?[6-9]\d{4}[\s-]?\d{5}$|^(?:(?:\+91|91|0)[\s-]?)?[6-9]\d{9}$/;

export const updateStaffProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Name is required." })
    .min(2, { message: PROFILE_MESSAGES.VALIDATION.NAME_MIN_LENGTH })
    .max(100, { message: PROFILE_MESSAGES.VALIDATION.NAME_MAX_LENGTH })
    .refine((val) => nameRegex.test(val), {
      message: PROFILE_MESSAGES.VALIDATION.NAME_INVALID_CHARS,
    }),
  phone: z
    .string()
    .trim()
    .min(1, { message: "Phone number is required." })
    .refine((val) => phoneRegex.test(val), {
      message: "Please enter a valid phone number.",
    }),
});

export type UpdateStaffProfileFormData = z.infer<typeof updateStaffProfileSchema>;

/**
 * Normalizes Indian phone number into E.164 format (+91XXXXXXXXXX) expected by the backend.
 */
export function normalizeStaffPhone(rawPhone: string): string {
  const digits = rawPhone.replace(/\D/g, "");
  const last10 = digits.slice(-10);
  return `+91${last10}`;
}

/**
 * Validates selected avatar file for size and type constraints.
 * Requirements: JPG, GIF, PNG, WebP up to 2MB.
 */
export function validateAvatarFile(file: File): { valid: boolean; error?: string } {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  const maxSizeBytes = 2 * 1024 * 1024; // 2MB

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: PROFILE_MESSAGES.AVATAR_INVALID_FILE,
    };
  }

  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: PROFILE_MESSAGES.AVATAR_INVALID_FILE,
    };
  }

  return { valid: true };
}
