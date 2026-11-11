import { z } from "zod";
import {
  ACCOUNT_NUMBER_REGEX,
  IFSC_REGEX,
  WALLET_VALIDATION_MESSAGES,
} from "../constants/wallet.constants";

export const bankAccountSchema = z
  .object({
    accountHolderName: z.string().trim().min(2, WALLET_VALIDATION_MESSAGES.ACCOUNT_HOLDER_NAME),
    accountNumber: z
      .string()
      .trim()
      .regex(ACCOUNT_NUMBER_REGEX, WALLET_VALIDATION_MESSAGES.ACCOUNT_NUMBER),
    confirmAccountNumber: z.string().trim(),
    ifsc: z.string().trim().toUpperCase().regex(IFSC_REGEX, WALLET_VALIDATION_MESSAGES.IFSC),
  })
  .refine((values) => values.accountNumber === values.confirmAccountNumber, {
    path: ["confirmAccountNumber"],
    message: WALLET_VALIDATION_MESSAGES.ACCOUNT_NUMBER_MISMATCH,
  });

export type BankAccountFormValues = z.infer<typeof bankAccountSchema>;
