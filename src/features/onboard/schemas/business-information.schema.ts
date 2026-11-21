import { z } from "zod";

const PHONE_REGEX = /^\+?[0-9\s\-()]{7,20}$/;
const OWNER_NAME_REGEX = /^[A-Za-z\s'.-]+$/;

export const businessInformationSchema = z.object({
  restaurant_name: z
    .string()
    .trim()
    .min(1, { message: "Restaurant name is required" })
    .min(2, { message: "Restaurant name must be at least 2 characters" })
    .max(100, { message: "Restaurant name must not exceed 100 characters" })
    .refine((val) => val.trim().length >= 2, {
      message: "Restaurant name must not be whitespace only",
    }),

  phone: z
    .string()
    .trim()
    .min(1, { message: "Phone number is required" })
    .refine((val) => !/[a-zA-Z]/.test(val), {
      message: "Phone number cannot contain letters",
    })
    .refine((val) => PHONE_REGEX.test(val) && val.replace(/\D/g, "").length >= 7, {
      message: "Enter a valid phone number",
    }),

  owner_name: z
    .string()
    .trim()
    .min(1, { message: "Owner name is required" })
    .min(2, { message: "Owner name must be at least 2 characters" })
    .max(100, { message: "Owner name must not exceed 100 characters" })
    .refine((val) => val.trim().length >= 2, {
      message: "Owner name must not be whitespace only",
    })
    .refine((val) => OWNER_NAME_REGEX.test(val.trim()), {
      message: "Owner name contains invalid characters",
    }),

  seating_capacity: z.coerce
    .number({ message: "Seating capacity must be a positive whole number" })
    .int({ message: "Seating capacity must be a whole number" })
    .min(1, { message: "Seating capacity must be at least 1" })
    .max(10000, { message: "Seating capacity must not exceed 10,000" }),
});

export type BusinessInformationFormValues = z.infer<typeof businessInformationSchema>;
