import { InvoiceTableEmptyState } from "@/features/subscription/components/InvoiceTableEmptyState";
import { InvoiceTableRow } from "@/features/subscription/components/InvoiceTableRow";
import { InvoiceTableSkeleton } from "@/features/subscription/components/InvoiceTableSkeleton";
import { SUBSCRIPTION_HISTORY_MESSAGES } from "@/features/subscription/constants/subscription-history.constants";
import type { SubscriptionBillingTransactionItem } from "@/features/subscription/types/subscription-history.types";

export interface InvoiceTableProps {
  transactions: SubscriptionBillingTransactionItem[];
  isLoading: boolean;
  isFiltered: boolean;
  onResetFilter: () => void;
}

export function InvoiceTable({
  transactions,
  isLoading,
  isFiltered,
  onResetFilter,
}: InvoiceTableProps) {
  if (isLoading) {
    return <InvoiceTableSkeleton />;
  }

  if (transactions.length === 0) {
    return <InvoiceTableEmptyState isFiltered={isFiltered} onResetFilter={onResetFilter} />;
  }

  return (
    <div
      className="w-full overflow-hidden rounded-xl border border-[#f3e6de] bg-white shadow-xs"
      data-testid="invoice-table"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#faf5f0] text-xs font-semibold uppercase tracking-wider text-neutral-600 border-b border-[#f3e6de]">
            <tr>
              <th scope="col" className="px-6 py-3.5">
                {SUBSCRIPTION_HISTORY_MESSAGES.TABLE_HEADER_DATE}
              </th>
              <th scope="col" className="px-6 py-3.5">
                {SUBSCRIPTION_HISTORY_MESSAGES.TABLE_HEADER_INVOICE}
              </th>
              <th scope="col" className="px-6 py-3.5">
                {SUBSCRIPTION_HISTORY_MESSAGES.TABLE_HEADER_PLAN}
              </th>
              <th scope="col" className="px-6 py-3.5">
                {SUBSCRIPTION_HISTORY_MESSAGES.TABLE_HEADER_CYCLE}
              </th>
              <th scope="col" className="px-6 py-3.5">
                {SUBSCRIPTION_HISTORY_MESSAGES.TABLE_HEADER_AMOUNT}
              </th>
              <th scope="col" className="px-6 py-3.5">
                {SUBSCRIPTION_HISTORY_MESSAGES.TABLE_HEADER_STATUS}
              </th>
              <th scope="col" className="px-6 py-3.5 text-right">
                {SUBSCRIPTION_HISTORY_MESSAGES.TABLE_HEADER_ACTIONS}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f3e6de] bg-white">
            {transactions.map((tx) => (
              <InvoiceTableRow key={tx.id} transaction={tx} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
