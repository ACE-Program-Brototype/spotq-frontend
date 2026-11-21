import { z } from "zod";

export const locationSchema = z.object({
  address_line1: z
    .string()
    .trim()
    .min(2, "Address Line 1 must be at least 2 characters")
    .max(200, "Address Line 1 cannot exceed 200 characters"),

  address_line2: z
    .string()
    .trim()
    .max(200, "Address Line 2 cannot exceed 200 characters")
    .optional(),

  city: z
    .string()
    .trim()
    .min(2, "City name must be at least 2 characters")
    .max(100, "City name cannot exceed 100 characters"),

  state: z
    .string()
    .trim()
    .min(2, "State name must be at least 2 characters")
    .max(100, "State name cannot exceed 100 characters"),

  country: z
    .string()
    .trim()
    .min(2, "Country name must be at least 2 characters")
    .max(100, "Country name cannot exceed 100 characters"),

  pincode: z
    .string()
    .trim()
    .min(3, "Pincode must be at least 3 characters")
    .max(10, "Pincode cannot exceed 10 characters"),

  latitude: z
    .number({ message: "Latitude must be a valid number" })
    .min(-90, "Latitude must be between -90 and 90")
    .max(90, "Latitude must be between -90 and 90"),

  longitude: z
    .number({ message: "Longitude must be a valid number" })
    .min(-180, "Longitude must be between -180 and 180")
    .max(180, "Longitude must be between -180 and 180"),
});

export type LocationFormValues = z.infer<typeof locationSchema>;
