import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { BankAccountDialog } from "@/features/wallet/components/BankAccountDialog";
import { WalletBalanceCard } from "@/features/wallet/components/WalletBalanceCard";
import { WalletBankAccountCard } from "@/features/wallet/components/WalletBankAccountCard";
import { WalletLoadingSkeleton } from "@/features/wallet/components/WalletLoadingSkeleton";
import { WalletPageHeader } from "@/features/wallet/components/WalletPageHeader";
import { WalletTodaySummary } from "@/features/wallet/components/WalletTodaySummary";
import { WithdrawFundsDialog } from "@/features/wallet/components/WithdrawFundsDialog";
import {
  useLinkWalletBankAccount,
  useWalletOverview,
  useWithdrawWalletFunds,
} from "@/features/wallet/hooks/useWallet";
import { createIdempotencyKey } from "@/lib/api/idempotency";
import type { BankAccountFormValues } from "../schemas/bank-account.schema";

export default function RestaurantWalletPage() {
  const [isBankDialogOpen, setBankDialogOpen] = useState(false);
  const [isWithdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const { data: wallet, isLoading, isError, error, refetch } = useWalletOverview();
  const linkBank = useLinkWalletBankAccount();
  const withdraw = useWithdrawWalletFunds();

  const saveBankAccount = async (
    values: Pick<BankAccountFormValues, "accountHolderName" | "accountNumber" | "ifsc">,
  ) => {
    try {
      await linkBank.mutateAsync(values);
      toast.success("Bank account linked successfully");
      setBankDialogOpen(false);
    } catch (cause) {
      toast.error(cause instanceof Error ? cause.message : "Unable to link bank account");
    }
  };

  const withdrawFunds = async (amountPaise: number) => {
    const idempotencyKey = createIdempotencyKey();
    try {
      await withdraw.mutateAsync({
        input: { amountPaise, mode: "IMPS" },
        idempotencyKey,
      });
      toast.success("Withdrawal submitted successfully");
      setWithdrawDialogOpen(false);
    } catch (cause) {
      toast.error(cause instanceof Error ? cause.message : "Unable to submit withdrawal");
    }
  };

  if (isLoading) return <WalletLoadingSkeleton />;

  if (isError || !wallet) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <section role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 p-6">
          <h1 className="text-xl font-bold text-neutral-900">Unable to load wallet</h1>
          <p className="mt-2 text-sm text-rose-800">
            {error instanceof Error ? error.message : "Please try again."}
          </p>
          <Button type="button" variant="outline" className="mt-4" onClick={() => void refetch()}>
            Try again
          </Button>
        </section>
      </main>
    );
  }

  const bankAccount = wallet.linkedBankAccount;
  const canWithdraw = wallet.balancePaise > 0 && Boolean(bankAccount?.isLinked) && !wallet.isLocked;

  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 px-4 py-5 sm:px-6 lg:px-8">
      <WalletPageHeader />
      <section aria-label="Wallet overview" className="grid gap-4 lg:grid-cols-2">
        <WalletBalanceCard
          balancePaise={wallet.balancePaise}
          isLocked={wallet.isLocked}
          canWithdraw={canWithdraw}
          onWithdraw={() => setWithdrawDialogOpen(true)}
        />
        <WalletBankAccountCard bankAccount={bankAccount} onEdit={() => setBankDialogOpen(true)} />
      </section>
      <WalletTodaySummary {...wallet.todayStats} />
      <BankAccountDialog
        open={isBankDialogOpen}
        onOpenChange={setBankDialogOpen}
        onSave={saveBankAccount}
      />
      {bankAccount?.isLinked && bankAccount.bankName && bankAccount.accountNumberMasked && (
        <WithdrawFundsDialog
          open={isWithdrawDialogOpen}
          onOpenChange={setWithdrawDialogOpen}
          balancePaise={wallet.balancePaise}
          bankName={bankAccount.bankName}
          accountNumberMasked={bankAccount.accountNumberMasked}
          onWithdraw={withdrawFunds}
        />
      )}
    </main>
  );
}
