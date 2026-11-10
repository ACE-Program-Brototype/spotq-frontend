import { FileX2, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils/currency";
import { formatDate, formatTime } from "@/lib/utils/date";
import { SUBSCRIPTION_HISTORY_MESSAGES } from "../constants/subscription-history.constants";
import type { SubscriptionBillingTransactionItem } from "../types/subscription-history.types";
import { DownloadInvoiceButton } from "./DownloadInvoiceButton";
import { InvoiceStatusBadge } from "./InvoiceStatusBadge";

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
    return (
      <div
        className="w-full overflow-hidden rounded-xl border border-[#f3e6de] bg-white shadow-xs"
        data-testid="invoice-table-loading"
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
              {Array.from({ length: 5 }).map((_, idx) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: Static skeleton array
                <tr key={idx} className="animate-pulse">
                  <td className="px-6 py-4">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="mt-1 h-3 w-16" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-4 w-24" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="mt-1 h-3 w-20" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-4 w-16" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-4 w-20" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Skeleton className="ml-auto h-7 w-24 rounded-lg" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (transactions.length === 0) {
    if (isFiltered) {
      return (
        <div
          className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#f3e6de] bg-white px-6 py-12 text-center"
          data-testid="invoice-table-filter-empty"
        >
          <div className="flex size-12 items-center justify-center rounded-full bg-[#fef3ec] text-[#ea580c] mb-3">
            <FileX2 className="size-6" aria-hidden="true" />
          </div>
          <h3 className="text-base font-semibold text-neutral-900">
            {SUBSCRIPTION_HISTORY_MESSAGES.FILTER_EMPTY_TITLE}
          </h3>
          <p className="mt-1 max-w-sm text-sm text-neutral-500">
            {SUBSCRIPTION_HISTORY_MESSAGES.FILTER_EMPTY_DESCRIPTION}
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onResetFilter}
            className="mt-4 border-[#f3e6de] text-[#9a3412] hover:bg-[#fef3ec]"
            data-testid="reset-filter-button"
          >
            {SUBSCRIPTION_HISTORY_MESSAGES.RESET_FILTER_BUTTON}
          </Button>
        </div>
      );
    }

    return (
      <div
        className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#f3e6de] bg-white px-6 py-12 text-center"
        data-testid="invoice-table-empty"
      >
        <div className="flex size-12 items-center justify-center rounded-full bg-[#fef3ec] text-[#ea580c] mb-3">
          <Receipt className="size-6" aria-hidden="true" />
        </div>
        <h3 className="text-base font-semibold text-neutral-900">
          {SUBSCRIPTION_HISTORY_MESSAGES.EMPTY_TITLE}
        </h3>
        <p className="mt-1 max-w-sm text-sm text-neutral-500">
          {SUBSCRIPTION_HISTORY_MESSAGES.EMPTY_DESCRIPTION}
        </p>
      </div>
    );
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
                  <DownloadInvoiceButton
                    invoiceUrl={tx.invoiceUrl}
                    invoiceNumber={tx.invoiceNumber}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
