/**
 * Validation schema for Customer Edit Profile form.
 * Ensures strict validation on full name, date of birth, and gender.
 */

import { z } from "zod";
import { PROFILE_MESSAGES } from "../constants/profile.constants";

const nameRegex = /^[\p{L}\p{M}]+(?:[' -][\p{L}\p{M}]+)*$/u;

export const editProfileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, { message: PROFILE_MESSAGES.VALIDATION.NAME_MIN_LENGTH })
    .max(100, { message: PROFILE_MESSAGES.VALIDATION.NAME_MAX_LENGTH })
    .refine((val) => nameRegex.test(val), {
      message: PROFILE_MESSAGES.VALIDATION.NAME_INVALID_CHARS,
    }),
  email: z.string().email(),
  phone: z.string().nullable().optional(),
  dob: z
    .string()
    .refine(
      (val) => {
        if (!val) return true;
        const parsed = new Date(val);
        if (Number.isNaN(parsed.getTime())) return false;
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        return parsed <= today;
      },
      {
        message: PROFILE_MESSAGES.VALIDATION.DOB_FUTURE,
      },
    )
    .nullable()
    .optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER", ""]).nullable().optional(),
});

export type EditProfileFormData = z.infer<typeof editProfileSchema>;
