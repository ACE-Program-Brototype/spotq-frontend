import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  FileText,
  MessageSquare,
  Phone,
  Receipt,
  User,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils/currency";
import { formatDate } from "@/lib/utils/date";
import type { RestaurantOrderDetail } from "../../../types/restaurant-orders.types";
import { OrderStatusBadge } from "./OrderStatusBadge";

export interface OrderQuickViewProps {
  order: RestaurantOrderDetail | null;
  isOpen: boolean;
  onClose: () => void;
}

export function OrderQuickView({ order, isOpen, onClose }: OrderQuickViewProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !order) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-neutral-900/60 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-quick-view-title"
    >
      {/* Backdrop click listener */}
      <div className="fixed inset-0 -z-10" onClick={onClose} aria-hidden="true" />

      {/* Modal Dialog Card */}
      <div className="relative flex flex-col w-full max-w-2xl max-h-[90vh] rounded-3xl bg-white border border-[#eddcd4] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-[#f3e6de] bg-[#fffcf9]">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-[#fef3ec] text-[#e8631b] border border-[#fae2d3] shadow-2xs">
              <Receipt className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2
                  id="order-quick-view-title"
                  className="text-base sm:text-lg font-bold tracking-tight text-neutral-900"
                >
                  Order #{order.orderNumber}
                </h2>
                <OrderStatusBadge status={order.orderStatus} size="sm" />
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">
                {order.orderType === "DINE_IN"
                  ? "Dine-In"
                  : order.orderType === "PRE_ORDER"
                    ? "Pre-Order"
                    : "Takeaway"}{" "}
                {order.tableNumber !== null && `• Table ${order.tableNumber}`}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-neutral-800">
          {/* Cancelled Banner if applicable */}
          {order.orderStatus === "CANCELLED" && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-4 text-xs">
              <div className="flex items-center gap-2 text-rose-800 font-bold">
                <AlertTriangle className="size-4 shrink-0 text-rose-600" />
                <span>Order Cancelled</span>
              </div>
              {order.cancellationReason && (
                <p className="mt-1 text-rose-700 font-medium">Reason: {order.cancellationReason}</p>
              )}
            </div>
          )}

          {/* Quick Info Grid: Date & Time, Payment Status, Order Type */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Placed On */}
            <div className="rounded-2xl border border-[#eddcd4] bg-[#faf7f5]/60 p-3.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-500">
                <Calendar className="size-3.5 text-[#e8631b]" />
                <span>Date &amp; Time</span>
              </div>
              <p className="mt-1 text-xs sm:text-sm font-bold text-neutral-900">
                {formatDate(order.createdAt)}
              </p>
            </div>

            {/* Payment Status & Mode */}
            <div className="rounded-2xl border border-[#eddcd4] bg-[#faf7f5]/60 p-3.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-500">
                <CreditCard className="size-3.5 text-emerald-600" />
                <span>Payment</span>
              </div>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-xs sm:text-sm font-bold text-neutral-900">
                  {order.paymentMode}
                </span>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    order.paymentStatus === "PAID" || order.paymentStatus === "PAID_OFFLINE"
                      ? "bg-emerald-100 text-emerald-800"
                      : order.paymentStatus === "REFUNDED"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {order.paymentStatus}
                </span>
              </div>
            </div>

            {/* Estimated Time / Table */}
            <div className="rounded-2xl border border-[#eddcd4] bg-[#faf7f5]/60 p-3.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-500">
                <Clock className="size-3.5 text-indigo-600" />
                <span>Service Mode</span>
              </div>
              <p className="mt-1 text-xs sm:text-sm font-bold text-neutral-900">
                {order.orderType === "DINE_IN"
                  ? `Table ${order.tableNumber ?? "--"}`
                  : order.orderType === "PRE_ORDER"
                    ? "Pre-Order Pickup"
                    : "Takeaway Pickup"}
              </p>
            </div>
          </div>

          {/* Customer Information Card */}
          <div className="rounded-2xl border border-[#eddcd4] bg-white p-4 shadow-2xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2.5 flex items-center gap-2">
              <User className="size-3.5 text-[#e8631b]" />
              <span>Customer Information</span>
            </h3>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs sm:text-sm">
              <div>
                <span className="font-bold text-neutral-900">
                  {order.customer.name ?? "Guest Customer"}
                </span>
                {order.customer.email && (
                  <span className="text-neutral-500 block sm:inline sm:ml-2">
                    ({order.customer.email})
                  </span>
                )}
              </div>
              {order.customer.phone && (
                <div className="flex items-center gap-1.5 text-neutral-600 font-medium">
                  <Phone className="size-3.5 text-neutral-400" />
                  <span>{order.customer.phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Ordered Items List */}
          <div className="rounded-2xl border border-[#eddcd4] bg-white p-4 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-2">
                <UtensilsCrossed className="size-3.5 text-[#e8631b]" />
                <span>Ordered Items ({order.items.length})</span>
              </h3>
            </div>

            <div className="divide-y divide-[#f3e6de]">
              {order.items.map((item) => (
                <div key={item.itemId} className="py-3.5 first:pt-1 last:pb-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex size-6 items-center justify-center rounded-lg bg-[#fef3ec] text-[#9a3412] text-xs font-bold border border-[#fae2d3]">
                          {item.quantity}×
                        </span>
                        <span className="text-sm font-bold text-neutral-900">{item.itemName}</span>
                      </div>

                      {item.variantName && (
                        <p className="mt-1 ml-8 text-xs font-medium text-neutral-500">
                          Variant: <span className="text-neutral-700">{item.variantName}</span>
                        </p>
                      )}

                      {/* Add-ons list */}
                      {item.addons && item.addons.length > 0 && (
                        <div className="mt-1.5 ml-8 space-y-1">
                          {item.addons.map((addon) => (
                            <div
                              key={addon.addonId}
                              className="text-xs text-neutral-600 flex items-center gap-1.5"
                            >
                              <span className="text-[#e8631b] font-bold">+</span>
                              <span>{addon.addonName}</span>
                              <span className="text-neutral-400 font-medium">
                                ({formatCurrency(addon.price)})
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Item-specific special instructions */}
                      {item.specialInstructions && (
                        <div className="mt-2 ml-8 flex items-start gap-1.5 rounded-lg bg-amber-50/70 border border-amber-200/60 p-2 text-xs text-amber-900">
                          <MessageSquare className="size-3.5 shrink-0 text-amber-600 mt-0.5" />
                          <span>
                            <strong className="font-semibold">Instruction:</strong>{" "}
                            {item.specialInstructions}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-neutral-900">
                        {formatCurrency(item.totalPrice)}
                      </p>
                      <p className="text-[11px] text-neutral-400">
                        {formatCurrency(item.unitPrice)} each
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* General Special Instructions / Chef Notes */}
          {order.specialInstructions && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-3.5 text-xs text-amber-900 flex items-start gap-2.5">
              <FileText className="size-4 shrink-0 text-amber-600 mt-0.5" />
              <div>
                <p className="font-bold">Order Note:</p>
                <p className="mt-0.5">{order.specialInstructions}</p>
              </div>
            </div>
          )}

          {/* Bill & Pricing Breakdown */}
          <div className="rounded-2xl border border-[#eddcd4] bg-[#faf7f5]/80 p-4 space-y-2 text-xs">
            <h3 className="font-bold uppercase tracking-wider text-neutral-500 mb-2">
              Payment Summary
            </h3>

            <div className="flex justify-between text-neutral-600">
              <span>Subtotal</span>
              <span className="font-medium text-neutral-900">
                {formatCurrency(order.pricing.subtotal)}
              </span>
            </div>

            {order.pricing.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>
                  Discount {order.pricing.couponCode ? `(${order.pricing.couponCode})` : ""}
                </span>
                <span className="font-semibold">
                  -{formatCurrency(order.pricing.discountAmount)}
                </span>
              </div>
            )}

            <div className="flex justify-between text-neutral-600">
              <span>Taxes &amp; Fees (GST)</span>
              <span className="font-medium text-neutral-900">
                {formatCurrency(order.pricing.taxAmount)}
              </span>
            </div>

            {order.pricing.platformFee > 0 && (
              <div className="flex justify-between text-neutral-600">
                <span>Platform Fee</span>
                <span className="font-medium text-neutral-900">
                  {formatCurrency(order.pricing.platformFee)}
                </span>
              </div>
            )}

            <div className="pt-2 border-t border-[#eddcd4] flex justify-between items-center text-sm font-bold text-neutral-900">
              <span className="text-base">Total Amount</span>
              <span className="text-lg text-[#9a3412]">
                {formatCurrency(order.pricing.grandTotal)}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 border-t border-[#f3e6de] bg-[#fffcf9]">
          <div className="flex items-center gap-1.5 text-xs text-neutral-500">
            <CheckCircle2 className="size-4 text-emerald-600" />
            <span>Order verified</span>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="rounded-xl border-[#eddcd4] bg-white text-neutral-700 hover:bg-[#faf7f5]"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
