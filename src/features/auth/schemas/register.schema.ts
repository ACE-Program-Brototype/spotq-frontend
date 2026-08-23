import { z } from "zod";

export const registerSchema = z
  .object({
    fullName: z.string().trim().min(3, "Full name must be at least 3 characters"),

    email: z.string().trim().toLowerCase().email("Invalid email address"),

    phoneNumber: z
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
    termsAccepted: z.boolean().refine((value) => value === true, {
      message: "You must accept the Terms and Conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
