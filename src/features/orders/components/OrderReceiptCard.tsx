import { Download, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ORDER_RECEIPT_MESSAGES } from "../constants/order-receipt.constants";
import type { OrderReceipt } from "../types/order-receipt.types";
import { downloadReceiptAsHtml } from "../utils/receipt-download.utils";
import { ReceiptBillBreakdown } from "./ReceiptBillBreakdown";
import { ReceiptHeader } from "./ReceiptHeader";
import { ReceiptItemList } from "./ReceiptItemList";

export interface OrderReceiptCardProps {
  receipt: OrderReceipt;
  onDownload?: () => void;
  className?: string;
}

export function OrderReceiptCard({ receipt, onDownload, className }: OrderReceiptCardProps) {
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const handleDownload = () => {
    setIsDownloading(true);
    try {
      if (onDownload) {
        onDownload();
      } else {
        downloadReceiptAsHtml(receipt);
      }
    } finally {
      setTimeout(() => setIsDownloading(false), 500);
    }
  };

  return (
    <div
      data-testid="order-receipt-card"
      className={`w-full max-w-xl mx-auto rounded-2xl bg-white border border-neutral-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow ${className ?? ""}`}
    >
      <ReceiptHeader receipt={receipt} />

      <ReceiptItemList items={receipt.items} />

      <ReceiptBillBreakdown receipt={receipt} />

      <div className="p-6 bg-white border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 text-xs text-neutral-400">
          <ShieldCheck className="size-4 text-emerald-600" />
          <span>{ORDER_RECEIPT_MESSAGES.OFFLINE_COPY_NOTICE}</span>
        </div>

        <Button
          type="button"
          data-testid="download-receipt-button"
          onClick={handleDownload}
          disabled={isDownloading}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#e8631b] hover:bg-[#d45513] text-white font-semibold px-5 py-2.5 rounded-xl shadow-xs transition-colors"
        >
          <Download className="size-4" />
          <span>
            {isDownloading
              ? ORDER_RECEIPT_MESSAGES.DOWNLOADING
              : ORDER_RECEIPT_MESSAGES.DOWNLOAD_RECEIPT}
          </span>
        </Button>
      </div>
    </div>
  );
}
