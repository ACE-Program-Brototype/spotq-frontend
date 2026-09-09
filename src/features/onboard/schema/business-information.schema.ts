import { z } from "zod";

const PHONE_REGEX = /^\+?[1-9]\d{7,14}$/;

const NAME_REGEX = /^[A-Za-z][A-Za-z\s'.-]*$/;

export const businessInformationSchema = z.object({
  restaurant_name: z
    .string()
    .trim()
    .min(2, "Restaurant name must be at least 2 characters")
    .max(100, "Restaurant name must be under 100 characters"),

  email: z
    .string()
    .trim()
    .min(1, "Restaurant email is required")
    .max(255, "Email must be under 255 characters")
    .email("Enter a valid email address"),

  phone: z
    .string()
    .trim()
    .min(1, "Phone number is required")
    .transform((val) => val.replace(/[\s()-]/g, ""))
    .refine((val) => PHONE_REGEX.test(val), {
      message: "Enter a valid phone number",
    }),

  owner_name: z
    .string()
    .trim()
    .min(2, "Owner name must be at least 2 characters")
    .max(100, "Owner name must be under 100 characters")
    .refine((val) => NAME_REGEX.test(val), {
      message: "Owner name contains unsupported characters",
    }),

  owner_email: z
    .string()
    .trim()
    .min(1, "Owner email is required")
    .max(255, "Email must be under 255 characters")
    .email("Enter a valid email address"),

  seating_capacity: z.coerce
    .number({ error: "Seating capacity must be a number" })
    .int("Seating capacity must be a whole number")
    .positive("Seating capacity must be greater than 0")
    .max(10000, "Seating capacity must be 10,000 or less"),
});

export type BusinessInformationFormValues = z.infer<typeof businessInformationSchema>;
