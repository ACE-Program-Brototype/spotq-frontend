import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SUBSCRIBER_MESSAGES } from "../constants/subscriber.constants";
import type { SubscriberInvoice } from "../types/subscriber.types";
import { formatDate, formatPrice, getPaymentStatusBadgeClass } from "../utils/subscriber.utils";

export interface SubscriberInvoicesTableProps {
  invoices: SubscriberInvoice[];
}

export function SubscriberInvoicesTable({ invoices }: SubscriberInvoicesTableProps) {
  return (
    <Card className="border-slate-200 shadow-xs" data-testid="subscriber-invoices-table">
      <CardHeader className="pb-3 border-b border-slate-100">
        <CardTitle className="text-base font-semibold text-slate-900">
          {SUBSCRIBER_MESSAGES.DETAILS_SECTION_INVOICES}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 p-0">
        {invoices.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">
            {SUBSCRIBER_MESSAGES.DETAILS_NO_INVOICES}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/80 hover:bg-slate-50/80">
                  <TableHead className="font-semibold text-slate-700 min-w-[140px]">
                    {SUBSCRIBER_MESSAGES.INV_HEADER_NUMBER}
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 min-w-[100px]">
                    {SUBSCRIBER_MESSAGES.INV_HEADER_AMOUNT}
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 min-w-[100px]">
                    {SUBSCRIBER_MESSAGES.INV_HEADER_STATUS}
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 min-w-[120px]">
                    {SUBSCRIBER_MESSAGES.INV_HEADER_PAID_AT}
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 min-w-[120px]">
                    {SUBSCRIBER_MESSAGES.INV_HEADER_DATE}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((inv) => (
                  <TableRow
                    key={inv.id}
                    className="hover:bg-slate-50/60 transition-colors"
                    data-testid={`subscriber-inv-row-${inv.id}`}
                  >
                    <TableCell className="font-medium text-slate-900">
                      {inv.invoiceNumber}
                    </TableCell>
                    <TableCell className="font-semibold text-slate-900">
                      {formatPrice(inv.amount, inv.currency)}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${getPaymentStatusBadgeClass(
                          inv.status,
                        )}`}
                      >
                        {inv.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-slate-600">
                      {formatDate(inv.paidAt)}
                    </TableCell>
                    <TableCell className="text-xs text-slate-600">
                      {formatDate(inv.createdAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
