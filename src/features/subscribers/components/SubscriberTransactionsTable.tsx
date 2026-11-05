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
import type { SubscriberTransaction } from "../types/subscriber.types";
import { formatDate, formatPrice, getPaymentStatusBadgeClass } from "../utils/subscriber.utils";

export interface SubscriberTransactionsTableProps {
  transactions: SubscriberTransaction[];
}

export function SubscriberTransactionsTable({ transactions }: SubscriberTransactionsTableProps) {
  return (
    <Card className="border-slate-200 shadow-xs" data-testid="subscriber-transactions-table">
      <CardHeader className="pb-3 border-b border-slate-100">
        <CardTitle className="text-base font-semibold text-slate-900">
          {SUBSCRIBER_MESSAGES.DETAILS_SECTION_TRANSACTIONS}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 p-0">
        {transactions.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">
            {SUBSCRIBER_MESSAGES.DETAILS_NO_TRANSACTIONS}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/80 hover:bg-slate-50/80">
                  <TableHead className="font-semibold text-slate-700 min-w-[140px]">
                    {SUBSCRIBER_MESSAGES.TXN_HEADER_ID}
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 min-w-[100px]">
                    {SUBSCRIBER_MESSAGES.TXN_HEADER_AMOUNT}
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 min-w-[100px]">
                    {SUBSCRIBER_MESSAGES.TXN_HEADER_STATUS}
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 min-w-[150px]">
                    {SUBSCRIBER_MESSAGES.TXN_HEADER_ORDER_ID}
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 min-w-[150px]">
                    {SUBSCRIBER_MESSAGES.TXN_HEADER_PAYMENT_ID}
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 min-w-[110px]">
                    {SUBSCRIBER_MESSAGES.TXN_HEADER_DATE}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((txn) => (
                  <TableRow
                    key={txn.id}
                    className="hover:bg-slate-50/60 transition-colors"
                    data-testid={`subscriber-txn-row-${txn.id}`}
                  >
                    <TableCell className="font-mono text-xs text-slate-700">{txn.id}</TableCell>
                    <TableCell className="font-semibold text-slate-900">
                      {formatPrice(txn.amount, txn.currency)}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${getPaymentStatusBadgeClass(
                          txn.status,
                        )}`}
                      >
                        {txn.status}
                      </span>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-slate-500">
                      {txn.razorpayOrderId || SUBSCRIBER_MESSAGES.NOT_APPLICABLE}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-slate-500">
                      {txn.razorpayPaymentId || SUBSCRIBER_MESSAGES.NOT_APPLICABLE}
                    </TableCell>
                    <TableCell className="text-xs text-slate-600">
                      {formatDate(txn.createdAt)}
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
