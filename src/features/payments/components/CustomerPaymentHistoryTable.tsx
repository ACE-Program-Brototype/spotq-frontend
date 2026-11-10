/**
 * CustomerPaymentHistoryTable Component
 * Desktop Data Table layout matching Figma frame 547:7577.
 * Renders structured columns for Date, Order ID, Rupee Amount,
 * Payment Method, Status Badge, and Contextual Actions.
 */

import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  ArrowUpDown,
  Download,
  Loader2,
  RotateCw,
} from "lucide-react";
import { Link } from "react-router-dom";
import { CUSTOMER_ROUTES } from "@/app/router/routes.constants";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CUSTOMER_PAYMENT_MESSAGES } from "@/features/payments/constants/customer-payment.constants";
import type {
  CustomerPaymentSortBy,
  CustomerPaymentSortOrder,
  CustomerPaymentTransaction,
} from "@/features/payments/types/customer-payment.types";
import {
  formatOrderDisplayId,
  isPaymentRetryExpired,
  normalizePaymentStatus,
} from "@/features/payments/utils/customer-payment.utils";
import { cn } from "@/lib/utils/cn";
import { formatCurrency } from "@/lib/utils/currency";
import { formatDate } from "@/lib/utils/date";
import { CustomerPaymentMethodTag } from "./CustomerPaymentMethodTag";
import { CustomerPaymentStatusBadge } from "./CustomerPaymentStatusBadge";

interface CustomerPaymentHistoryTableProps {
  transactions: CustomerPaymentTransaction[];
  onRetry: (transaction: CustomerPaymentTransaction) => void;
  onDownloadInvoice: (transaction: CustomerPaymentTransaction) => void;
  isRetrying: (transactionId: string) => boolean;
  isDownloading: (transactionId: string) => boolean;
  sortBy?: CustomerPaymentSortBy;
  sortOrder?: CustomerPaymentSortOrder;
  onSort?: (field: CustomerPaymentSortBy) => void;
  className?: string;
}

export function CustomerPaymentHistoryTable({
  transactions,
  onRetry,
  onDownloadInvoice,
  isRetrying,
  isDownloading,
  sortBy,
  sortOrder,
  onSort,
  className,
}: CustomerPaymentHistoryTableProps) {
  return (
    <div
      data-testid="customer-payment-history-table-container"
      className={cn(
        "w-full rounded-2xl border border-neutral-200/80 bg-white overflow-hidden shadow-xs",
        className,
      )}
    >
      <Table>
        <TableHeader>
          <TableRow className="bg-neutral-50/70 hover:bg-neutral-50/70 border-b border-neutral-200/80">
            <TableHead className="py-3 px-3 sm:px-3 lg:px-4 text-xs font-bold uppercase tracking-wider text-neutral-600">
              {onSort ? (
                <button
                  type="button"
                  onClick={() => onSort("createdAt")}
                  data-testid="sort-date-button"
                  className="inline-flex items-center gap-1.5 hover:text-neutral-900 transition-colors cursor-pointer group"
                >
                  <span>{CUSTOMER_PAYMENT_MESSAGES.TABLE_HEADER_DATE}</span>
                  {sortBy === "createdAt" ? (
                    sortOrder === "asc" ? (
                      <ArrowUp className="size-3.5 text-[#ff6b00]" />
                    ) : (
                      <ArrowDown className="size-3.5 text-[#ff6b00]" />
                    )
                  ) : (
                    <ArrowUpDown className="size-3 text-neutral-400 group-hover:text-neutral-600" />
                  )}
                </button>
              ) : (
                CUSTOMER_PAYMENT_MESSAGES.TABLE_HEADER_DATE
              )}
            </TableHead>
            <TableHead className="py-3 px-3 sm:px-3 lg:px-4 text-xs font-bold uppercase tracking-wider text-neutral-600">
              {CUSTOMER_PAYMENT_MESSAGES.TABLE_HEADER_ORDER_ID}
            </TableHead>
            <TableHead className="py-3 px-3 sm:px-3 lg:px-4 text-xs font-bold uppercase tracking-wider text-neutral-600">
              {onSort ? (
                <button
                  type="button"
                  onClick={() => onSort("amountPaise")}
                  data-testid="sort-amount-button"
                  className="inline-flex items-center gap-1.5 hover:text-neutral-900 transition-colors cursor-pointer group"
                >
                  <span>{CUSTOMER_PAYMENT_MESSAGES.TABLE_HEADER_AMOUNT}</span>
                  {sortBy === "amountPaise" ? (
                    sortOrder === "asc" ? (
                      <ArrowUp className="size-3.5 text-[#ff6b00]" />
                    ) : (
                      <ArrowDown className="size-3.5 text-[#ff6b00]" />
                    )
                  ) : (
                    <ArrowUpDown className="size-3 text-neutral-400 group-hover:text-neutral-600" />
                  )}
                </button>
              ) : (
                CUSTOMER_PAYMENT_MESSAGES.TABLE_HEADER_AMOUNT
              )}
            </TableHead>
            <TableHead className="py-3 px-3 sm:px-3 lg:px-4 text-xs font-bold uppercase tracking-wider text-neutral-600">
              {CUSTOMER_PAYMENT_MESSAGES.TABLE_HEADER_METHOD}
            </TableHead>
            <TableHead className="py-3 px-3 sm:px-3 lg:px-4 text-xs font-bold uppercase tracking-wider text-neutral-600">
              {CUSTOMER_PAYMENT_MESSAGES.TABLE_HEADER_STATUS}
            </TableHead>
            <TableHead className="py-3 px-3 sm:px-3 lg:px-4 text-right text-xs font-bold uppercase tracking-wider text-neutral-600">
              {CUSTOMER_PAYMENT_MESSAGES.TABLE_HEADER_ACTIONS}
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {transactions.map((tx) => {
            const normalizedStatus = normalizePaymentStatus(tx.status);
            const isExpired =
              normalizedStatus === "FAILED" &&
              isPaymentRetryExpired(tx.retryExpiresAt, tx.retryEligible);
            const retrying = isRetrying(tx.transactionId);
            const downloading = isDownloading(tx.transactionId);
            const orderDisplayId = formatOrderDisplayId(tx.orderNumber, tx.orderId);

            return (
              <TableRow
                key={tx.transactionId}
                data-testid={`payment-row-${tx.transactionId}`}
                className={cn(
                  "border-b border-neutral-100 hover:bg-neutral-50/60 transition-colors",
                  tx._justSucceeded && "bg-emerald-50/60 ring-1 ring-inset ring-emerald-300",
                )}
              >
                {/* 1. Date */}
                <TableCell className="py-3.5 px-3 sm:px-3 lg:px-4 text-xs lg:text-sm font-medium text-neutral-600 whitespace-nowrap">
                  {formatDate(tx.createdAt)}
                </TableCell>

                {/* 2. Order ID Link */}
                <TableCell className="py-3.5 px-3 sm:px-3 lg:px-4 whitespace-nowrap">
                  <Link
                    to={CUSTOMER_ROUTES.ORDER_DETAILS(tx.orderId)}
                    data-testid={`order-link-${tx.orderId}`}
                    className="inline-flex items-center text-xs lg:text-sm font-bold text-neutral-900 hover:text-[#ff6b00] underline-offset-4 hover:underline transition-colors"
                  >
                    {orderDisplayId}
                  </Link>
                </TableCell>

                {/* 3. Amount */}
                <TableCell className="py-3.5 px-3 sm:px-3 lg:px-4 text-xs lg:text-sm font-bold text-neutral-900 whitespace-nowrap">
                  {formatCurrency(tx.amountInRupees)}
                </TableCell>

                {/* 4. Payment Method */}
                <TableCell className="py-3.5 px-3 sm:px-3 lg:px-4 whitespace-nowrap">
                  <CustomerPaymentMethodTag method={tx.paymentMethod} />
                </TableCell>

                {/* 5. Status Badge */}
                <TableCell className="py-3.5 px-3 sm:px-3 lg:px-4 whitespace-nowrap">
                  <CustomerPaymentStatusBadge status={tx.status} />
                </TableCell>

                {/* 6. Contextual Actions */}
                <TableCell className="py-3.5 px-3 sm:px-3 lg:px-4 text-right whitespace-nowrap">
                  {normalizedStatus === "SUCCESS" && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={downloading}
                      onClick={() => onDownloadInvoice(tx)}
                      data-testid={`download-receipt-button-${tx.transactionId}`}
                      className="h-8 rounded-xl border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-800 text-xs font-semibold px-2.5 sm:px-3 gap-1.5 shadow-2xs cursor-pointer"
                    >
                      {downloading ? (
                        <Loader2 className="size-3.5 animate-spin text-neutral-600" />
                      ) : (
                        <Download className="size-3.5 text-neutral-600" />
                      )}
                      <span>
                        {downloading
                          ? CUSTOMER_PAYMENT_MESSAGES.ACTION_DOWNLOADING
                          : CUSTOMER_PAYMENT_MESSAGES.ACTION_DOWNLOAD_RECEIPT}
                      </span>
                    </Button>
                  )}

                  {normalizedStatus === "FAILED" && !isExpired && (
                    <Button
                      type="button"
                      size="sm"
                      disabled={retrying}
                      onClick={() => onRetry(tx)}
                      data-testid={`retry-payment-button-${tx.transactionId}`}
                      className="h-8 rounded-xl bg-[#ff6b00] hover:bg-[#e05e00] text-white text-xs font-bold px-2.5 sm:px-3 gap-1.5 shadow-xs cursor-pointer"
                    >
                      <RotateCw className={cn("size-3.5", retrying && "animate-spin")} />
                      <span>
                        {retrying
                          ? CUSTOMER_PAYMENT_MESSAGES.ACTION_RETRYING
                          : CUSTOMER_PAYMENT_MESSAGES.ACTION_RETRY_PAYMENT}
                      </span>
                    </Button>
                  )}

                  {normalizedStatus === "FAILED" && isExpired && (
                    <span
                      data-testid={`expired-payment-label-${tx.transactionId}`}
                      className="inline-flex items-center px-2.5 sm:px-3 py-1 rounded-xl text-xs font-medium bg-neutral-100 text-neutral-400 border border-neutral-200 select-none cursor-not-allowed"
                    >
                      {CUSTOMER_PAYMENT_MESSAGES.ACTION_EXPIRED}
                    </span>
                  )}

                  {normalizedStatus === "REFUNDED" && (
                    <Link
                      to={CUSTOMER_ROUTES.ORDER_DETAILS(tx.orderId)}
                      data-testid={`refund-details-button-${tx.transactionId}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-purple-700 hover:text-purple-900 transition-colors py-1 px-2 rounded-lg hover:bg-purple-50"
                    >
                      <span>{CUSTOMER_PAYMENT_MESSAGES.ACTION_REFUND_DETAILS}</span>
                      <ArrowRight className="size-3.5" />
                    </Link>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
