import { BadgeCheck, Building2, Landmark, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { WalletOverview } from "@/features/wallet/types/wallet.types";
import { maskAccountNumber } from "../utils/wallet.utils";

export function WalletBankAccountCard({
  bankAccount,
  onEdit,
}: {
  bankAccount: WalletOverview["linkedBankAccount"];
  onEdit: () => void;
}) {
  return (
    <article className="rounded-2xl border border-[#eddcd4] bg-white p-5 shadow-xs sm:p-7">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-neutral-600">
          <Landmark className="size-4 text-[#e85d04]" /> Linked payout bank account
        </div>
        {bankAccount?.isLinked && (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
            <BadgeCheck className="size-3.5" /> Verified
          </span>
        )}
      </div>
      {bankAccount?.isLinked ? (
        <>
          <div className="mt-5 flex items-center gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#faf7f5] text-[#9a3412]">
              <Building2 className="size-6" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-lg font-bold text-neutral-900">
                {bankAccount.bankName ?? "Bank account"}
              </p>
              <p className="mt-0.5 text-sm text-neutral-500">
                Account: {maskAccountNumber(bankAccount.accountNumberMasked)}
              </p>
            </div>
          </div>
          <div className="mt-5 flex flex-col gap-3 border-t border-[#f0e3d6] pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-center gap-1.5 text-xs text-neutral-500">
              <LockKeyhole className="size-3.5" /> Securely linked for payouts
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={onEdit}
              className="border-[#eddcd4] text-[#9a3412] hover:bg-[#faf7f5]"
            >
              Change bank account
            </Button>
          </div>
        </>
      ) : (
        <div className="mt-5 rounded-xl border border-dashed border-amber-300 bg-amber-50/60 p-5">
          <p className="font-semibold text-neutral-900">No bank account linked</p>
          <p className="mt-1 text-sm text-neutral-600">
            Link a payout account to withdraw your wallet balance.
          </p>
          <Button
            type="button"
            onClick={onEdit}
            className="mt-4 bg-[#e85d04] text-white hover:bg-[#c94e00]"
          >
            Link bank account
          </Button>
        </div>
      )}
    </article>
  );
}
