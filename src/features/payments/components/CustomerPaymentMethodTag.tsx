/**
 * CustomerPaymentMethodTag Component
 * Displays payment method branding with contextual icon:
 * [⚡ Razorpay UPI], [💳 Card], [🏦 Net Banking], [💼 Wallet].
 */

import { CreditCard, Landmark, Wallet, Zap } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface CustomerPaymentMethodTagProps {
  method: string;
  className?: string;
}

export function CustomerPaymentMethodTag({ method, className }: CustomerPaymentMethodTagProps) {
  const normalized = (method || "").toUpperCase().trim();

  if (normalized.includes("UPI")) {
    return (
      <span
        data-testid="payment-method-upi"
        className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold select-none",
          "bg-amber-50 text-amber-800 border border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
          className,
        )}
      >
        <Zap className="size-3.5 shrink-0 fill-amber-500 text-amber-600" />
        <span>Razorpay UPI</span>
      </span>
    );
  }

  if (normalized.includes("CARD")) {
    return (
      <span
        data-testid="payment-method-card"
        className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold select-none",
          "bg-blue-50 text-blue-800 border border-blue-200/80 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800",
          className,
        )}
      >
        <CreditCard className="size-3.5 shrink-0 text-blue-600 dark:text-blue-400" />
        <span>Card</span>
      </span>
    );
  }

  if (normalized.includes("NET") || normalized.includes("BANK")) {
    return (
      <span
        data-testid="payment-method-netbanking"
        className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold select-none",
          "bg-cyan-50 text-cyan-800 border border-cyan-200/80 dark:bg-cyan-950/40 dark:text-cyan-300 dark:border-cyan-800",
          className,
        )}
      >
        <Landmark className="size-3.5 shrink-0 text-cyan-600 dark:text-cyan-400" />
        <span>Net Banking</span>
      </span>
    );
  }

  if (normalized.includes("WALLET")) {
    return (
      <span
        data-testid="payment-method-wallet"
        className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold select-none",
          "bg-emerald-50 text-emerald-800 border border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
          className,
        )}
      >
        <Wallet className="size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
        <span>Wallet</span>
      </span>
    );
  }

  return (
    <span
      data-testid="payment-method-default"
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-medium select-none",
        "bg-neutral-100 text-neutral-700 border border-neutral-200",
        className,
      )}
    >
      <CreditCard className="size-3.5 shrink-0 text-neutral-500" />
      <span>{method || "Online"}</span>
    </span>
  );
}
