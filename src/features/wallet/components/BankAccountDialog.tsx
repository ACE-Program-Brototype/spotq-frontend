import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type BankAccountFormValues, bankAccountSchema } from "../schemas/bank-account.schema";
import { WalletDialog } from "./WalletDialog";

export function BankAccountDialog({
  open,
  onOpenChange,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (
    values: Pick<BankAccountFormValues, "accountHolderName" | "accountNumber" | "ifsc">,
  ) => Promise<void>;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BankAccountFormValues>({
    resolver: zodResolver(bankAccountSchema),
    defaultValues: { accountHolderName: "", accountNumber: "", confirmAccountNumber: "", ifsc: "" },
  });

  useEffect(() => {
    if (open)
      reset({ accountHolderName: "", accountNumber: "", confirmAccountNumber: "", ifsc: "" });
  }, [open, reset]);

  return (
    <WalletDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Link payout bank account"
      description="Add the account where you want to receive your restaurant payouts."
    >
      <form
        className="space-y-4 overflow-y-auto p-5 sm:p-6"
        onSubmit={handleSubmit(({ confirmAccountNumber: _confirm, ...values }) => onSave(values))}
        noValidate
      >
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs leading-relaxed text-emerald-800">
          Your bank details are encrypted and used only for restaurant payouts.
        </div>
        <BankField
          id="accountHolderName"
          label="Account holder name"
          error={errors.accountHolderName?.message}
        >
          <Input
            autoFocus
            id="accountHolderName"
            autoComplete="name"
            placeholder="e.g. Bawarchi Spice Kitchen LLP"
            {...register("accountHolderName")}
          />
        </BankField>
        <BankField
          id="accountNumber"
          label="Bank account number"
          error={errors.accountNumber?.message}
        >
          <Input
            inputMode="numeric"
            id="accountNumber"
            autoComplete="off"
            placeholder="Enter account number"
            {...register("accountNumber")}
          />
        </BankField>
        <BankField
          id="confirmAccountNumber"
          label="Confirm account number"
          error={errors.confirmAccountNumber?.message}
        >
          <Input
            inputMode="numeric"
            id="confirmAccountNumber"
            autoComplete="off"
            placeholder="Re-enter account number"
            {...register("confirmAccountNumber")}
          />
        </BankField>
        <BankField id="ifsc" label="IFSC code" error={errors.ifsc?.message}>
          <Input
            autoCapitalize="characters"
            id="ifsc"
            autoComplete="off"
            placeholder="e.g. HDFC0001234"
            {...register("ifsc", { setValueAs: (value: string) => value.toUpperCase() })}
          />
        </BankField>
        <div className="flex flex-col-reverse gap-2 border-t border-[#f0e3d6] pt-4 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="gap-2 bg-[#e85d04] text-white hover:bg-[#c94e00]"
          >
            {isSubmitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Building2 className="size-4" />
            )}
            Save &amp; verify account
          </Button>
        </div>
      </form>
    </WalletDialog>
  );
}

function BankField({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-neutral-700">
        {label}
      </label>
      {children}
      {error && (
        <p role="alert" className="text-xs font-medium text-rose-600">
          {error}
        </p>
      )}
    </div>
  );
}
