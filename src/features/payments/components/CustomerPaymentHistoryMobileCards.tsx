/**
 * CustomerPaymentHistoryMobileCards Component
 * Mobile stacked card feed layout matching Figma frame 547:7771.
 * Renders touch-friendly cards for smaller screens (< 768px).
 */

import { ArrowRight, Download, Loader2, RotateCw } from "lucide-react";
import { Link } from "react-router-dom";
import { CUSTOMER_ROUTES } from "@/app/router/routes.constants";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { formatCurrency } from "@/lib/utils/currency";
import { formatDate } from "@/lib/utils/date";
import { CUSTOMER_PAYMENT_MESSAGES } from "../constants/customer-payment.constants";
import type { CustomerPaymentTransaction } from "../types/customer-payment.types";
import {
  formatOrderDisplayId,
  isPaymentRetryExpired,
  normalizePaymentStatus,
} from "../utils/customer-payment.utils";
import { CustomerPaymentMethodTag } from "./CustomerPaymentMethodTag";
import { CustomerPaymentStatusBadge } from "./CustomerPaymentStatusBadge";

interface CustomerPaymentHistoryMobileCardsProps {
  transactions: CustomerPaymentTransaction[];
  onRetry: (transaction: CustomerPaymentTransaction) => void;
  onDownloadInvoice: (transaction: CustomerPaymentTransaction) => void;
  isRetrying: (transactionId: string) => boolean;
  isDownloading: (transactionId: string) => boolean;
  className?: string;
}

export function CustomerPaymentHistoryMobileCards({
  transactions,
  onRetry,
  onDownloadInvoice,
  isRetrying,
  isDownloading,
  className,
}: CustomerPaymentHistoryMobileCardsProps) {
  return (
    <div
      data-testid="customer-payment-history-mobile-cards"
      className={cn("flex flex-col gap-3.5 w-full", className)}
    >
      {transactions.map((tx) => {
        const normalizedStatus = normalizePaymentStatus(tx.status);
        const isExpired =
          normalizedStatus === "FAILED" &&
          isPaymentRetryExpired(tx.retryExpiresAt, tx.retryEligible);
        const retrying = isRetrying(tx.transactionId);
        const downloading = isDownloading(tx.transactionId);
        const orderDisplayId = formatOrderDisplayId(tx.orderNumber, tx.orderId);

        return (
          <div
            key={tx.transactionId}
            data-testid={`mobile-payment-card-${tx.transactionId}`}
            className={cn(
              "flex flex-col gap-3 p-4 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs transition-all",
              tx._justSucceeded && "bg-emerald-50/60 ring-1 ring-emerald-300",
            )}
          >
            {/* Top Row: Order ID Link + Status Badge */}
            <div className="flex items-center justify-between gap-2 border-b border-neutral-100 pb-2.5">
              <Link
                to={CUSTOMER_ROUTES.ORDER_DETAILS(tx.orderId)}
                data-testid={`mobile-order-link-${tx.orderId}`}
                className="text-sm font-black text-neutral-900 hover:text-[#ff6b00] underline-offset-4 hover:underline transition-colors"
              >
                {orderDisplayId}
              </Link>
              <CustomerPaymentStatusBadge status={tx.status} />
            </div>

            {/* Middle Row: Date + Amount */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex flex-col">
                <span className="text-[11px] font-medium text-neutral-400">
                  {CUSTOMER_PAYMENT_MESSAGES.TABLE_HEADER_DATE}
                </span>
                <span className="text-xs font-semibold text-neutral-600">
                  {formatDate(tx.createdAt)}
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[11px] font-medium text-neutral-400">
                  {CUSTOMER_PAYMENT_MESSAGES.TABLE_HEADER_AMOUNT}
                </span>
                <span className="text-base font-extrabold text-neutral-900">
                  {formatCurrency(tx.amountInRupees)}
                </span>
              </div>
            </div>

            {/* Bottom Row: Payment Method Tag + Full-Width CTA */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-2 border-t border-neutral-100">
              <div className="flex items-center">
                <CustomerPaymentMethodTag method={tx.paymentMethod} />
              </div>

              <div className="flex flex-1 sm:justify-end">
                {normalizedStatus === "SUCCESS" && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={downloading}
                    onClick={() => onDownloadInvoice(tx)}
                    data-testid={`mobile-download-receipt-${tx.transactionId}`}
                    className="w-full sm:w-auto h-9 rounded-xl border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-800 text-xs font-semibold px-4 gap-2 shadow-2xs cursor-pointer"
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
                    data-testid={`mobile-retry-payment-${tx.transactionId}`}
                    className="w-full sm:w-auto h-9 rounded-xl bg-[#ff6b00] hover:bg-[#e05e00] text-white text-xs font-bold px-4 gap-2 shadow-xs cursor-pointer"
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
                  <div
                    data-testid={`mobile-expired-label-${tx.transactionId}`}
                    className="w-full sm:w-auto text-center py-1.5 px-4 rounded-xl text-xs font-medium bg-neutral-100 text-neutral-400 border border-neutral-200 select-none cursor-not-allowed"
                  >
                    {CUSTOMER_PAYMENT_MESSAGES.ACTION_EXPIRED}
                  </div>
                )}

                {normalizedStatus === "REFUNDED" && (
                  <Link
                    to={CUSTOMER_ROUTES.ORDER_DETAILS(tx.orderId)}
                    data-testid={`mobile-refund-details-${tx.transactionId}`}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 text-xs font-bold text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100/70 border border-purple-200/60 py-2 px-4 rounded-xl transition-colors"
                  >
                    <span>{CUSTOMER_PAYMENT_MESSAGES.ACTION_REFUND_DETAILS}</span>
                    <ArrowRight className="size-3.5" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
