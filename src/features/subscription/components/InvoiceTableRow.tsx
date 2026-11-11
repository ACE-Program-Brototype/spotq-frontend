import { DownloadInvoiceButton } from "@/features/subscription/components/DownloadInvoiceButton";
import { InvoiceStatusBadge } from "@/features/subscription/components/InvoiceStatusBadge";
import { SUBSCRIPTION_HISTORY_MESSAGES } from "@/features/subscription/constants/subscription-history.constants";
import type { SubscriptionBillingTransactionItem } from "@/features/subscription/types/subscription-history.types";
import { formatCurrency } from "@/lib/utils/currency";
import { formatDate, formatTime } from "@/lib/utils/date";

export interface InvoiceTableRowProps {
  transaction: SubscriptionBillingTransactionItem;
}

export function InvoiceTableRow({ transaction: tx }: InvoiceTableRowProps) {
  return (
    <tr
      key={tx.id}
      className="hover:bg-[#faf5f0]/60 transition-colors"
      data-testid={`invoice-row-${tx.id}`}
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="font-medium text-neutral-900">
          {formatDate(tx.createdAt, {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: undefined,
            minute: undefined,
          })}
        </div>
        <div className="text-xs text-neutral-400">{formatTime(tx.createdAt)}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {tx.invoiceNumber ? (
          <span className="font-mono text-xs font-medium text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded">
            {tx.invoiceNumber}
          </span>
        ) : (
          <span className="text-neutral-400">-</span>
        )}
      </td>
      <td className="px-6 py-4">
        <div className="font-medium text-neutral-900">{tx.planName}</div>
        <div className="text-xs text-neutral-500 font-mono">{tx.planCode}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-neutral-600">
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#f5ebe1] text-[#78350f]">
          {tx.billingCycle === "YEARLY"
            ? SUBSCRIPTION_HISTORY_MESSAGES.CYCLE_YEARLY_LABEL
            : SUBSCRIPTION_HISTORY_MESSAGES.CYCLE_MONTHLY_LABEL}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap font-medium text-neutral-900">
        {formatCurrency(tx.amountRupees)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <InvoiceStatusBadge status={tx.status} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <DownloadInvoiceButton invoiceUrl={tx.invoiceUrl} invoiceNumber={tx.invoiceNumber} />
      </td>
    </tr>
  );
}
