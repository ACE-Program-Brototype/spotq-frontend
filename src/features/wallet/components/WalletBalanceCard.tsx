import { CreditCard, Wallet as WalletIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

export function WalletBalanceCard({
  balancePaise,
  isLocked,
  canWithdraw,
  onWithdraw,
}: {
  balancePaise: number;
  isLocked: boolean;
  canWithdraw: boolean;
  onWithdraw: () => void;
}) {
  return (
    <article className="relative overflow-hidden rounded-2xl border border-[#eddcd4] bg-white p-5 shadow-xs sm:p-7">
      <div className="absolute -right-12 -top-16 size-48 rounded-full bg-orange-50" />
      <div className="relative">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-neutral-600">
            <WalletIcon className="size-4 text-[#e85d04]" /> Available balance
          </div>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${isLocked ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"}`}
          >
            <span
              className={`size-1.5 rounded-full ${isLocked ? "bg-rose-500" : "bg-emerald-500"}`}
            />
            {isLocked ? "Locked" : "Active"}
          </span>
        </div>
        <p className="mt-5 text-4xl font-extrabold tracking-tight text-neutral-950 tabular-nums sm:text-5xl">
          {formatCurrency(balancePaise / 100)}
        </p>
        <p className="mt-2 text-sm text-neutral-500">
          Ready to withdraw to your linked bank account.
        </p>
        <Button
          type="button"
          disabled={!canWithdraw}
          onClick={onWithdraw}
          className="mt-6 gap-2 rounded-xl bg-[#e85d04] px-5 text-white hover:bg-[#c94e00]"
        >
          <CreditCard className="size-4" /> Withdraw funds
        </Button>
        {!canWithdraw && (
          <p className="mt-2 text-xs text-neutral-500">
            {isLocked
              ? "Withdrawals are temporarily unavailable."
              : balancePaise <= 0
                ? "No balance available to withdraw."
                : "Link a bank account to withdraw funds."}
          </p>
        )}
      </div>
    </article>
  );
}
