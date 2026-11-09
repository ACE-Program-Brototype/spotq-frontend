import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowDownToLine, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";
import { type WithdrawalFormValues, withdrawalSchema } from "../schemas/withdrawal.schema";
import { WalletDialog } from "./WalletDialog";

export function WithdrawFundsDialog({
  open,
  onOpenChange,
  balancePaise,
  bankName,
  accountNumberMasked,
  onWithdraw,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  balancePaise: number;
  bankName: string;
  accountNumberMasked: string;
  onWithdraw: (amountPaise: number) => Promise<void>;
}) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<WithdrawalFormValues>({
    resolver: zodResolver(withdrawalSchema),
    defaultValues: { amountRupees: "" },
  });
  const amountRupees = watch("amountRupees");
  const amountPaise = Math.round(Number(amountRupees) * 100);
  const exceedsBalance = Number.isFinite(amountPaise) && amountPaise > balancePaise;

  useEffect(() => {
    if (open) reset({ amountRupees: "" });
  }, [open, reset]);

  const selectPercentage = (percentage: number) => {
    const paise = Math.floor((balancePaise * percentage) / 100 / 100) * 100;
    setValue("amountRupees", String(paise / 100), { shouldValidate: true });
  };

  return (
    <WalletDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Withdraw funds"
      description="Transfer available funds to your linked payout bank account."
    >
      <form
        className="space-y-5 overflow-y-auto p-5 sm:p-6"
        onSubmit={handleSubmit(({ amountRupees: amount }) =>
          onWithdraw(Math.round(Number(amount) * 100)),
        )}
        noValidate
      >
        <div className="rounded-xl bg-[#faf7f5] p-4">
          <p className="text-xs font-medium text-neutral-500">Available balance</p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-neutral-900">
            {formatCurrency(balancePaise / 100)}
          </p>
        </div>
        <div className="space-y-2">
          <label htmlFor="withdraw-amount" className="text-sm font-semibold text-neutral-700">
            Amount to withdraw
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-neutral-500">
              ₹
            </span>
            <Input
              id="withdraw-amount"
              autoFocus
              inputMode="decimal"
              placeholder="0.00"
              className="pl-8"
              {...register("amountRupees")}
            />
          </div>
          {(errors.amountRupees || exceedsBalance) && (
            <p role="alert" className="text-xs font-medium text-rose-600">
              {exceedsBalance
                ? "Amount cannot exceed available balance"
                : errors.amountRupees?.message}
            </p>
          )}
          <div className="flex flex-wrap gap-2 pt-1">
            {[25, 50, 75, 100].map((percentage) => (
              <button
                key={percentage}
                type="button"
                onClick={() => selectPercentage(percentage)}
                className="rounded-full border border-[#eddcd4] px-3 py-1.5 text-xs font-semibold text-neutral-700 transition-colors hover:border-[#e85d04] hover:bg-orange-50 hover:text-[#c94e00]"
              >
                {percentage === 100 ? "Max (100%)" : `${percentage}%`}
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-[#eddcd4] p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Destination bank
          </p>
          <p className="mt-2 font-semibold text-neutral-900">{bankName}</p>
          <p className="text-sm text-neutral-500">{accountNumberMasked} · Instant IMPS transfer</p>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-neutral-500">Payout fee</span>
          <span className="font-medium text-neutral-900">₹0.00</span>
        </div>
        <div className="flex items-center justify-between border-t border-[#f0e3d6] pt-3 text-sm">
          <span className="text-neutral-600">You will receive</span>
          <span className="font-bold tabular-nums text-neutral-900">
            {formatCurrency(Number.isFinite(amountPaise) ? amountPaise : 0)}
          </span>
        </div>
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
            disabled={isSubmitting || exceedsBalance || balancePaise < 10_000}
            className="gap-2 bg-[#e85d04] text-white hover:bg-[#c94e00]"
          >
            {isSubmitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <ArrowDownToLine className="size-4" />
            )}
            Confirm withdrawal
          </Button>
        </div>
      </form>
    </WalletDialog>
  );
}
