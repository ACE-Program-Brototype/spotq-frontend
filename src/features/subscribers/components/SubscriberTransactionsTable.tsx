import { type Column, DataTable } from "@/components/common/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils/date";
import { DATE_ONLY_FORMAT_OPTIONS, SUBSCRIBER_MESSAGES } from "../constants/subscriber.constants";
import type { SubscriberTransaction } from "../types/subscriber.types";
import { formatPrice, getPaymentStatusBadgeClass } from "../utils/subscriber.utils";

export interface SubscriberTransactionsTableProps {
  transactions: SubscriberTransaction[];
}

const transactionColumns: Column<SubscriberTransaction>[] = [
  {
    key: "id",
    header: SUBSCRIBER_MESSAGES.TXN_HEADER_ID,
    headerClassName: "font-semibold text-slate-700 min-w-[140px]",
    className: "font-mono text-xs text-slate-700",
    cell: ({ row }) => row.id,
  },
  {
    key: "amount",
    header: SUBSCRIBER_MESSAGES.TXN_HEADER_AMOUNT,
    headerClassName: "font-semibold text-slate-700 min-w-[100px]",
    className: "font-semibold text-slate-900",
    cell: ({ row }) => formatPrice(row.amount, row.currency),
  },
  {
    key: "status",
    header: SUBSCRIBER_MESSAGES.TXN_HEADER_STATUS,
    headerClassName: "font-semibold text-slate-700 min-w-[100px]",
    cell: ({ row }) => (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${getPaymentStatusBadgeClass(
          row.status,
        )}`}
      >
        {row.status}
      </span>
    ),
  },
  {
    key: "razorpayOrderId",
    header: SUBSCRIBER_MESSAGES.TXN_HEADER_ORDER_ID,
    headerClassName: "font-semibold text-slate-700 min-w-[150px]",
    className: "font-mono text-xs text-slate-500",
    cell: ({ row }) => row.razorpayOrderId || SUBSCRIBER_MESSAGES.NOT_APPLICABLE,
  },
  {
    key: "razorpayPaymentId",
    header: SUBSCRIBER_MESSAGES.TXN_HEADER_PAYMENT_ID,
    headerClassName: "font-semibold text-slate-700 min-w-[150px]",
    className: "font-mono text-xs text-slate-500",
    cell: ({ row }) => row.razorpayPaymentId || SUBSCRIBER_MESSAGES.NOT_APPLICABLE,
  },
  {
    key: "createdAt",
    header: SUBSCRIBER_MESSAGES.TXN_HEADER_DATE,
    headerClassName: "font-semibold text-slate-700 min-w-[110px]",
    className: "text-xs text-slate-600",
    cell: ({ row }) => formatDate(row.createdAt, DATE_ONLY_FORMAT_OPTIONS),
  },
];

export function SubscriberTransactionsTable({ transactions }: SubscriberTransactionsTableProps) {
  return (
    <Card className="border-slate-200 shadow-xs" data-testid="subscriber-transactions-table">
      <CardHeader className="pb-3 border-b border-slate-100">
        <CardTitle className="text-base font-semibold text-slate-900">
          {SUBSCRIBER_MESSAGES.DETAILS_SECTION_TRANSACTIONS}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <DataTable<SubscriberTransaction>
          data={transactions}
          columns={transactionColumns}
          getRowId={(row) => row.id}
          getRowTestId={(row) => `subscriber-txn-row-${row.id}`}
          emptyState={
            <div className="p-4 text-center text-sm text-slate-500">
              {SUBSCRIBER_MESSAGES.DETAILS_NO_TRANSACTIONS}
            </div>
          }
          className="rounded-none border-0 shadow-none"
          theme="admin"
          aria-label={SUBSCRIBER_MESSAGES.DETAILS_SECTION_TRANSACTIONS}
        />
      </CardContent>
    </Card>
  );
}
