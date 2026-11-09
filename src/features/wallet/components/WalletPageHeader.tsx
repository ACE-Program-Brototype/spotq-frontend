import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";

export function WalletPageHeader() {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#9a3412]">
          Restaurant admin · Finance
        </p>
        <h1 className="mt-1 text-2xl font-bold text-neutral-900 sm:text-3xl">Wallet</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Manage your available earnings and payout account.
        </p>
      </div>
      <Button
        type="button"
        variant="outline"
        disabled
        className="mt-3 self-start gap-2 sm:mt-0 sm:self-auto"
      >
        <CalendarDays className="size-4" /> Today
      </Button>
    </div>
  );
}
