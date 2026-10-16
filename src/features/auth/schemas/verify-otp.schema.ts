import { z } from "zod";
import { AUTH_MESSAGES } from "../constants/auth.constants";

export const verifyOtpSchema = z.object({
  otp: z
    .string()
    .length(6, { message: "Please enter a 6-digit OTP" })
    .regex(/^\d+$/, { message: "OTP must contain only numbers" }),
});

export type VerifyOtpFormValues = z.infer<typeof verifyOtpSchema>;

export const requestVerificationEmailSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, { message: AUTH_MESSAGES.ENTER_VALID_EMAIL })
    .email({ message: AUTH_MESSAGES.ENTER_VALID_EMAIL }),
});

export type RequestVerificationEmailFormValues = z.infer<typeof requestVerificationEmailSchema>;
