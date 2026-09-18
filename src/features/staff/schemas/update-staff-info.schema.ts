import { z } from "zod";
import { STAFF_MESSAGES } from "@/features/staff/constants/staff.constants";

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
    .min(1, STAFF_MESSAGES.NAME_REQUIRED)
    .min(2, STAFF_MESSAGES.NAME_MIN_LENGTH)
    .max(100, STAFF_MESSAGES.NAME_MAX_LENGTH)
    .refine((val) => val.trim().length > 0, {
      message: STAFF_MESSAGES.NAME_REQUIRED,
    }),
  phone: z
    .string()
    .trim()
    .min(1, STAFF_MESSAGES.PHONE_REQUIRED)
    .regex(INDIAN_PHONE_REGEX, STAFF_MESSAGES.PHONE_INVALID),
});

export type UpdateStaffInfoFormValues = z.infer<typeof updateStaffInfoSchema>;
