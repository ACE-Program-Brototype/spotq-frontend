import { z } from "zod";
import { AMOUNT_FORMAT_REGEX, WALLET_VALIDATION_MESSAGES } from "../constants/wallet.constants";

export const withdrawalSchema = z.object({
  amountRupees: z
    .string()
    .refine((value) => AMOUNT_FORMAT_REGEX.test(value), WALLET_VALIDATION_MESSAGES.AMOUNT)
    .refine((value) => Number(value) >= 100, WALLET_VALIDATION_MESSAGES.MINIMUM_WITHDRAWAL)
    .refine(
      (value) => Number.isSafeInteger(Math.round(Number(value) * 100)),
      WALLET_VALIDATION_MESSAGES.AMOUNT,
    ),
});

export type WithdrawalFormValues = z.infer<typeof withdrawalSchema>;
