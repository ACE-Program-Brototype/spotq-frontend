import { z } from "zod";

/**
 * Regex validating 10-digit Indian phone numbers with optional +91, 91, or 0 prefix.
 */
export const INDIAN_PHONE_REGEX = /^(?:(?:\+91|91|0)[\s-]?)?[6-9](?:[\s-]?\d){9}$/;

/**
 * Normalizes any valid Indian phone number into E.164 standard +91XXXXXXXXXX
 */
export function normalizePhoneNumber(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  const last10 = digits.slice(-10);
  return `+91${last10}`;
}

export const updateStaffInfoSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must not exceed 100 characters")
    .refine((val) => val.trim().length > 0, {
      message: "Name is required",
    }),
  phone: z
    .string()
    .trim()
    .min(1, "Phone number is required")
    .regex(INDIAN_PHONE_REGEX, "Please enter a valid phone number"),
});

export type UpdateStaffInfoFormValues = z.infer<typeof updateStaffInfoSchema>;
