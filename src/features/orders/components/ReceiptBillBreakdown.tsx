import { Download, Receipt } from "lucide-react";
import { formatCurrency } from "@/lib/utils/currency";
import { ORDER_RECEIPT_MESSAGES } from "../constants/order-receipt.constants";
import type { OrderReceipt } from "../types/order-receipt.types";

export interface ReceiptBillBreakdownProps {
  receipt: OrderReceipt;
}

export function ReceiptBillBreakdown({ receipt }: ReceiptBillBreakdownProps) {
  const handleDownload = () => {
    window.print();
  };

  const taxLabel = receipt.tax_rate
    ? `${ORDER_RECEIPT_MESSAGES.TAX_LABEL} (${receipt.tax_rate}%)`
    : ORDER_RECEIPT_MESSAGES.TAX_LABEL;

  return (
    <div
      data-testid="receipt-bill-breakdown"
      className="p-6 bg-neutral-50/70 border-t border-neutral-100 space-y-3"
    >
      <div className="flex items-center gap-2 pb-1 text-xs font-bold uppercase tracking-wider text-neutral-400">
        <Receipt className="size-3.5 text-neutral-400" />
        <span>{ORDER_RECEIPT_MESSAGES.BILL_SUMMARY_HEADER}</span>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between text-neutral-600">
          <span>{ORDER_RECEIPT_MESSAGES.SUBTOTAL_LABEL}</span>
          <span data-testid="receipt-subtotal" className="font-medium text-neutral-900">
            {formatCurrency(receipt.sub_total)}
          </span>
        </div>

        <div className="flex items-center justify-between text-neutral-600">
          <span>{taxLabel}</span>
          <span data-testid="receipt-tax" className="font-medium text-neutral-900">
            {formatCurrency(receipt.tax_amount)}
          </span>
        </div>

        <div className="flex items-center justify-between text-neutral-600">
          <span>{ORDER_RECEIPT_MESSAGES.PLATFORM_FEE_LABEL}</span>
          <span data-testid="receipt-platform-fee" className="font-medium text-neutral-900">
            {formatCurrency(receipt.platform_fee)}
          </span>
        </div>

        <div className="pt-3 border-t border-dashed border-neutral-200 flex items-center justify-between">
          <span className="font-bold text-neutral-900 text-base">
            {ORDER_RECEIPT_MESSAGES.TOTAL_LABEL}
          </span>
          <span data-testid="receipt-total" className="text-lg font-bold text-[#e8631b]">
            {formatCurrency(receipt.total_amount)}
          </span>
        </div>
      </div>

      <div className="pt-3 print:hidden">
        <button
          type="button"
          data-testid="receipt-download-button"
          onClick={handleDownload}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-neutral-900 text-white font-medium text-sm hover:bg-neutral-800 active:scale-[0.99] transition-all shadow-xs cursor-pointer"
        >
          <Download className="size-4" />
          <span>{ORDER_RECEIPT_MESSAGES.DOWNLOAD_BUTTON}</span>
        </button>
      </div>
    </div>
  );
}
