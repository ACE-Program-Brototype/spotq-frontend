import { z } from "zod";
import { AMOUNT_FORMAT_REGEX } from "../constants/wallet.constants";

export const withdrawalSchema = z.object({
  amountRupees: z
    .string()
    .refine((value) => AMOUNT_FORMAT_REGEX.test(value), "Enter a valid amount")
    .refine((value) => Number(value) >= 100, "Minimum withdrawal is ₹100")
    .refine(
      (value) => Number.isSafeInteger(Math.round(Number(value) * 100)),
      "Enter a valid amount",
    ),
});

export type WithdrawalFormValues = z.infer<typeof withdrawalSchema>;
