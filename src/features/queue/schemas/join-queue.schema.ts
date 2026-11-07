import { z } from "zod";
import { PARTY_SIZE_LIMITS } from "../constants/queue.constants";

/**
 * Validates a local phone number based on the selected country dialing prefix.
 */
export function isValidLocalPhone(phone: string, countryCode: string = "+91"): boolean {
  const trimmed = phone.trim().replace(/[\s-]/g, "");
  if (!trimmed) return false;

  if (countryCode === "+91") {
    return /^[6-9]\d{9}$/.test(trimmed);
  }

  // Generic international phone: between 6 and 14 digits
  return /^\d{6,14}$/.test(trimmed);
}

/**
 * Combines country code and cleaned phone digits into standard international representation.
 */
export function formatFullPhone(countryCode: string, phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return `${countryCode}${digits}`;
}

export const joinQueueSchema = z
  .object({
    guestName: z
      .string()
      .trim()
      .min(1, "Guest name is required")
      .min(2, "Guest name must be at least 2 characters")
      .max(50, "Guest name cannot exceed 50 characters"),
    countryCode: z.string().min(1, "Country code is required"),
    phone: z.string().trim().min(1, "Phone number is required"),
    partySize: z
      .number({
        message: "Party size must be a valid number",
      })
      .int("Party size must be a whole number")
      .min(PARTY_SIZE_LIMITS.MIN, `Party size must be at least ${PARTY_SIZE_LIMITS.MIN}`)
      .max(PARTY_SIZE_LIMITS.MAX, `Party size cannot exceed ${PARTY_SIZE_LIMITS.MAX}`),
    specialNotes: z
      .string()
      .trim()
      .max(250, "Special notes cannot exceed 250 characters")
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.phone || data.phone.trim() === "") {
      return;
    }

    if (!isValidLocalPhone(data.phone, data.countryCode)) {
      ctx.addIssue({
        code: "custom",
        message:
          data.countryCode === "+91"
            ? "Please enter a valid 10-digit mobile number"
            : "Please enter a valid phone number (6-14 digits)",
        path: ["phone"],
      });
    }
  });

export type JoinQueueFormData = z.infer<typeof joinQueueSchema>;
