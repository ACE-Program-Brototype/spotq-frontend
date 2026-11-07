import { z } from "zod";

export const checkoutFormSchema = z.object({
  userName: z.string().trim().optional(),
  userPhone: z
    .string()
    .trim()
    .refine(
      (val) => !val || /^\+?[0-9\s-]{7,20}$/.test(val),
      "Please enter a valid mobile number (7-20 digits)",
    )
    .optional(),
  specialInstructions: z.string().trim().optional(),
});

export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;
