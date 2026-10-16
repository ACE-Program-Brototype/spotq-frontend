import { z } from "zod";

/**
 * Validates phone numbers:
 * Strictly checks for a 10-digit mobile number (e.g. "9876543210"),
 * or 10-digit mobile number with +91 prefix (e.g. "+919876543210" or "+91 9876543210").
 * Fails for 7-digit, 8-digit, 9-digit, or >10-digit numbers.
 */
export function isValidPhone(phone: string): boolean {
  const trimmed = phone.trim().replace(/[\s-]/g, "");
  if (!trimmed) return false;

  // Exactly 10 digits
  if (/^\d{10}$/.test(trimmed)) {
    return true;
  }

  // 10 digits prefixed with +91
  if (/^\+91\d{10}$/.test(trimmed)) {
    return true;
  }

  return false;
}

/**
 * Normalizes phone numbers by ensuring +91 prefix is added to the 10-digit number.
 * e.g. "9876543210" -> "+919876543210"
 * e.g. "+919876543210" -> "+919876543210"
 */
export function normalizePhone(raw: string): string {
  const digits = raw.trim().replace(/\D/g, "");
  const last10 = digits.slice(-10);
  return `+91${last10}`;
}

export const walkInSchema = z.object({
  guestName: z
    .string()
    .trim()
    .min(1, "Guest name is required")
    .min(2, "Guest name must be at least 2 characters")
    .max(50, "Guest name cannot exceed 50 characters"),
  guestPhone: z
    .string()
    .trim()
    .min(1, "Phone number is required")
    .refine((val) => isValidPhone(val), {
      message: "Please enter a valid 10-digit mobile number",
    }),
  partySize: z
    .number({
      message: "Party size must be a valid number",
    })
    .int("Party size must be a whole number")
    .min(1, "Party size must be at least 1")
    .max(100, "Party size cannot exceed 100"),
  specialNotes: z.string().trim().max(250, "Special notes cannot exceed 250 characters").optional(),
});

export type WalkInFormData = z.infer<typeof walkInSchema>;
