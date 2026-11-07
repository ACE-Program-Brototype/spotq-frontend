import { z } from "zod";
import { CHECKOUT_MESSAGES, PHONE_REGEX } from "../constants/checkout.constants";

export const checkoutFormSchema = z.object({
  userName: z.string().trim().optional(),
  userPhone: z
    .string()
    .trim()
    .refine((val) => !val || PHONE_REGEX.test(val), CHECKOUT_MESSAGES.PHONE_INVALID)
    .optional(),
  specialInstructions: z.string().trim().optional(),
});

export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;
