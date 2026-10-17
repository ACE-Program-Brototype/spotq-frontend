import { z } from "zod";

export function isValidPhone(phone: string): boolean {
  const trimmed = phone.trim().replace(/[\s-]/g, "");
  if (!trimmed) return false;

  if (/^[6-9]\d{9}$/.test(trimmed)) {
    return true;
  }

  if (/^\+91[6-9]\d{9}$/.test(trimmed)) {
    return true;
  }

  return false;
}

export function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  return digits.length >= 10 ? `+91${digits.slice(-10)}` : raw.trim();
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
    .max(20, "Party size cannot exceed 20"),
  specialNotes: z.string().trim().max(250, "Special notes cannot exceed 250 characters").optional(),
});

export type WalkInFormData = z.infer<typeof walkInSchema>;
