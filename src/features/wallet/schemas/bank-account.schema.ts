import { z } from "zod";
import { ACCOUNT_NUMBER_REGEX, IFSC_REGEX } from "../constants/wallet.constants";

export const bankAccountSchema = z
  .object({
    accountHolderName: z.string().trim().min(2, "Enter the account holder name"),
    accountNumber: z.string().regex(ACCOUNT_NUMBER_REGEX, "Account number must be 9–18 digits"),
    confirmAccountNumber: z.string(),
    ifsc: z.string().trim().toUpperCase().regex(IFSC_REGEX, "Enter a valid IFSC code"),
  })
  .refine((values) => values.accountNumber === values.confirmAccountNumber, {
    path: ["confirmAccountNumber"],
    message: "Account numbers do not match",
  });

export type BankAccountFormValues = z.infer<typeof bankAccountSchema>;
