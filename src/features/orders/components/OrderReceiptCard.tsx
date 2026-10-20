import type { OrderReceipt } from "../types/order-receipt.types";
import { ReceiptBillBreakdown } from "./ReceiptBillBreakdown";
import { ReceiptHeader } from "./ReceiptHeader";
import { ReceiptItemList } from "./ReceiptItemList";

export interface OrderReceiptCardProps {
  receipt: OrderReceipt;
  className?: string;
}

export function OrderReceiptCard({ receipt, className }: OrderReceiptCardProps) {
  return (
    <div
      data-testid="order-receipt-card"
      className={`w-full max-w-xl mx-auto rounded-2xl bg-white border border-neutral-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow ${className ?? ""}`}
    >
      <ReceiptHeader receipt={receipt} />

      <ReceiptItemList items={receipt.items} />

      <ReceiptBillBreakdown receipt={receipt} />
    </div>
  );
}
