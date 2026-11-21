import { Skeleton } from "@/components/ui/skeleton";
import { SUBSCRIPTION_HISTORY_MESSAGES } from "@/features/subscription/constants/subscription-history.constants";

export interface InvoiceTableSkeletonProps {
  rowCount?: number;
}

export function InvoiceTableSkeleton({ rowCount = 5 }: InvoiceTableSkeletonProps) {
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
            {Array.from({ length: rowCount }).map((_, idx) => (
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
