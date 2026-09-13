import { z } from "zod";

export const acceptInvitationSchema = z
  .object({
    fullname: z
      .string()
      .trim()
      .min(2, "Full name must be at least 2 characters")
      .max(60, "Full name must not exceed 60 characters"),

    phone: z
      .string()
      .trim()
      .regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),

    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type AcceptInvitationFormValues = z.infer<typeof acceptInvitationSchema>;
