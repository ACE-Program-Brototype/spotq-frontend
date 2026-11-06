import { type Column, DataTable } from "@/components/common/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils/date";
import { DATE_ONLY_FORMAT_OPTIONS, SUBSCRIBER_MESSAGES } from "../constants/subscriber.constants";
import type { SubscriberInvoice } from "../types/subscriber.types";
import { formatPrice, getPaymentStatusBadgeClass } from "../utils/subscriber.utils";

export interface SubscriberInvoicesTableProps {
  invoices: SubscriberInvoice[];
}

const invoiceColumns: Column<SubscriberInvoice>[] = [
  {
    key: "invoiceNumber",
    header: SUBSCRIBER_MESSAGES.INV_HEADER_NUMBER,
    headerClassName: "font-semibold text-slate-700 min-w-[140px]",
    className: "font-medium text-slate-900",
    cell: ({ row }) => row.invoiceNumber,
  },
  {
    key: "amount",
    header: SUBSCRIBER_MESSAGES.INV_HEADER_AMOUNT,
    headerClassName: "font-semibold text-slate-700 min-w-[100px]",
    className: "font-semibold text-slate-900",
    cell: ({ row }) => formatPrice(row.amount, row.currency),
  },
  {
    key: "status",
    header: SUBSCRIBER_MESSAGES.INV_HEADER_STATUS,
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
    key: "paidAt",
    header: SUBSCRIBER_MESSAGES.INV_HEADER_PAID_AT,
    headerClassName: "font-semibold text-slate-700 min-w-[120px]",
    className: "text-xs text-slate-600",
    cell: ({ row }) => formatDate(row.paidAt, DATE_ONLY_FORMAT_OPTIONS),
  },
  {
    key: "createdAt",
    header: SUBSCRIBER_MESSAGES.INV_HEADER_DATE,
    headerClassName: "font-semibold text-slate-700 min-w-[120px]",
    className: "text-xs text-slate-600",
    cell: ({ row }) => formatDate(row.createdAt, DATE_ONLY_FORMAT_OPTIONS),
  },
];

export function SubscriberInvoicesTable({ invoices }: SubscriberInvoicesTableProps) {
  return (
    <Card className="border-slate-200 shadow-xs" data-testid="subscriber-invoices-table">
      <CardHeader className="pb-3 border-b border-slate-100">
        <CardTitle className="text-base font-semibold text-slate-900">
          {SUBSCRIBER_MESSAGES.DETAILS_SECTION_INVOICES}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <DataTable<SubscriberInvoice>
          data={invoices}
          columns={invoiceColumns}
          getRowId={(row) => row.id}
          getRowTestId={(row) => `subscriber-inv-row-${row.id}`}
          emptyState={
            <div className="p-4 text-center text-sm text-slate-500">
              {SUBSCRIBER_MESSAGES.DETAILS_NO_INVOICES}
            </div>
          }
          className="rounded-none border-0 shadow-none"
          theme="admin"
          aria-label={SUBSCRIBER_MESSAGES.DETAILS_SECTION_INVOICES}
        />
      </CardContent>
    </Card>
  );
}
