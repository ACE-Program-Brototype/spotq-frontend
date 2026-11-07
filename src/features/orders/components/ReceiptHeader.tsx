import { CheckCircle2, Clock, Store } from "lucide-react";
import { formatDate } from "@/lib/utils/date";
import {
  ORDER_RECEIPT_MESSAGES,
  ORDER_STATUS_VARIANTS,
} from "../constants/order-receipt.constants";
import type { OrderReceipt } from "../types/order-receipt.types";

export interface ReceiptHeaderProps {
  receipt: OrderReceipt;
}

export function ReceiptHeader({ receipt }: ReceiptHeaderProps) {
  const statusConfig = ORDER_STATUS_VARIANTS[receipt.status] ?? {
    badgeClass: "bg-neutral-100 text-neutral-700 border-neutral-300",
    label: receipt.status,
  };

  return (
    <div
      data-testid="receipt-header"
      className="border-b border-neutral-100 p-6 bg-gradient-to-b from-neutral-50/50 to-white"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
            <Store className="size-3.5 text-[#e8631b]" />
            <span data-testid="receipt-restaurant-name">{receipt.restaurant.name}</span>
          </div>

          <h2
            data-testid="receipt-order-number"
            className="text-2xl font-bold tracking-tight text-neutral-900"
          >
            {ORDER_RECEIPT_MESSAGES.ORDER_NUMBER_PREFIX}
            {receipt.order_number}
          </h2>

          <div className="flex items-center gap-1.5 text-xs text-neutral-500">
            <Clock className="size-3.5 text-neutral-400" />
            <span data-testid="receipt-date">{formatDate(receipt.created_at)}</span>
          </div>
        </div>

        <div className="flex items-center">
          <span
            data-testid="receipt-status-badge"
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusConfig.badgeClass}`}
          >
            <CheckCircle2 className="size-3.5" />
            {statusConfig.label}
          </span>
        </div>
      </div>
    </div>
  );
}
