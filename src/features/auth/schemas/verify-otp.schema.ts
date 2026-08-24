import { z } from "zod";

export const verifyOtpSchema = z.object({
  otp: z
    .string()
    .length(6, { message: "Please enter a 6-digit OTP" })
    .regex(/^\d+$/, { message: "OTP must contain only numbers" }),
});

export type VerifyOtpFormValues = z.infer<typeof verifyOtpSchema>;
