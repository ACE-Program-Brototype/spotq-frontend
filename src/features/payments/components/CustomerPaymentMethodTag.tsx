/**
 * CustomerPaymentMethodTag Component
 * Displays the payment method tag (Online).
 */

import { Globe } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface CustomerPaymentMethodTagProps {
  method?: string;
  className?: string;
}

export function CustomerPaymentMethodTag({ className }: CustomerPaymentMethodTagProps) {
  return (
    <span
      data-testid="payment-method-online"
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold select-none",
        "bg-blue-50 text-blue-800 border border-blue-200/80 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800",
        className,
      )}
    >
      <Globe className="size-3.5 shrink-0 text-blue-600 dark:text-blue-400" />
      <span>Online</span>
    </span>
  );
}
