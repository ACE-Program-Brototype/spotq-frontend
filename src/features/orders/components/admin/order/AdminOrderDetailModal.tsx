/**
 * Platform Admin Order Detail Modal Component
 * Displays authoritative server-calculated financial breakdowns,
 * payment references, timestamps, and order lifecycle states.
 */

import { Check, Clock, Copy, CreditCard, Receipt, Store, User, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import type { AdminOrderListItem } from "@/features/orders/types/admin-orders.types";
import { formatCurrency } from "@/lib/utils/currency";
import { formatDate } from "@/lib/utils/date";
import { AdminPaymentStatusBadge } from "./AdminPaymentStatusBadge";
import { OrderStatusBadge } from "./OrderStatusBadge";

interface AdminOrderDetailModalProps {
  order: AdminOrderListItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AdminOrderDetailModal({ order, isOpen, onClose }: AdminOrderDetailModalProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Keyboard accessibility: Escape to close, focus trapping, and focus restoration
  useEffect(() => {
    if (!isOpen || !order) return;

    // 1. Remember previously focused element
    previousFocusRef.current = document.activeElement as HTMLElement | null;

    // 2. Lock body scroll
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // 3. Focus first interactive element inside modal
    const focusableSelector =
      'button:not([disabled]):not([tabindex="-1"]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

    const focusTimer = setTimeout(() => {
      if (!modalRef.current) return;
      const focusables = modalRef.current.querySelectorAll<HTMLElement>(focusableSelector);
      if (focusables.length > 0) {
        focusables[0]?.focus();
      } else {
        modalRef.current.focus();
      }
    }, 30);

    // 4. Handle Escape and Tab key trapping
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key === "Tab") {
        if (!modalRef.current) return;
        const focusables = Array.from(
          modalRef.current.querySelectorAll<HTMLElement>(focusableSelector),
        ).filter((el) => el.offsetParent !== null);

        if (focusables.length === 0) {
          event.preventDefault();
          return;
        }

        const firstElement = focusables[0];
        const lastElement = focusables[focusables.length - 1];

        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement?.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(focusTimer);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
      // 5. Restore focus to previously active element
      previousFocusRef.current?.focus();
    };
  }, [isOpen, order, onClose]);

  if (!isOpen || !order) return null;

  const handleCopy = async (text: string, field: string) => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
      }
    } catch (err) {
      console.error("Failed to copy text to clipboard:", err);
    }
  };

  const paymentRef = order.paymentReference;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-details-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      {/* Backdrop click to close */}
      <button
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        aria-label="Close modal overlay"
        onClick={onClose}
        className="fixed inset-0 cursor-default"
      />

      {/* Modal Card */}
      <div
        ref={modalRef}
        tabIndex={-1}
        className="relative z-10 w-full max-w-xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] outline-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-[#0052cc] border border-blue-100">
              <Receipt className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="order-details-title" className="text-base font-bold text-slate-900">
                  Order #{order.orderNumber}
                </h2>
                <button
                  type="button"
                  onClick={() => handleCopy(order.orderNumber, "orderNumber")}
                  className="text-slate-400 hover:text-slate-600 transition-colors p-0.5"
                  title="Copy order number"
                >
                  {copiedField === "orderNumber" ? (
                    <Check className="size-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="size-3.5" />
                  )}
                </button>
              </div>
              <p className="text-xs text-slate-500 font-mono truncate max-w-xs">{order.orderId}</p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="size-5" />
          </Button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Status Badges Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Order Lifecycle
              </span>
              <OrderStatusBadge status={order.status} size="md" />
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Payment Status
              </span>
              <AdminPaymentStatusBadge status={order.paymentStatus} size="md" />
            </div>
          </div>

          {/* Restaurant & Customer Context */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Restaurant */}
            <div className="rounded-xl border border-slate-200/80 p-4 bg-white shadow-2xs space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <Store className="size-3.5 text-slate-400" />
                <span>Restaurant</span>
              </div>
              <p className="text-sm font-bold text-slate-900">
                {order.restaurantName || "SpotQ Restaurant"}
              </p>
              <p className="text-xs text-slate-400 font-mono truncate" title={order.restaurantId}>
                ID: {order.restaurantId}
              </p>
            </div>

            {/* Customer */}
            <div className="rounded-xl border border-slate-200/80 p-4 bg-white shadow-2xs space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <User className="size-3.5 text-slate-400" />
                <span>Customer</span>
              </div>
              <p className="text-sm font-bold text-slate-900">
                {order.customerId ? `User (${order.customerId.slice(0, 8)})` : "Guest Customer"}
              </p>
              <p
                className="text-xs text-slate-400 font-mono truncate"
                title={order.customerId ?? "Guest"}
              >
                ID: {order.customerId ?? "N/A"}
              </p>
            </div>
          </div>

          {/* Payment Reference */}
          <div className="rounded-xl border border-slate-200/80 p-4 bg-white shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <CreditCard className="size-3.5 text-slate-400" />
                <span>Payment Reference</span>
              </div>
              {paymentRef && (
                <button
                  type="button"
                  onClick={() => handleCopy(paymentRef, "paymentRef")}
                  className="inline-flex items-center gap-1 text-xs font-medium text-[#0052cc] hover:underline"
                >
                  {copiedField === "paymentRef" ? (
                    <>
                      <Check className="size-3 text-emerald-600" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="size-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              )}
            </div>
            <p className="text-xs sm:text-sm font-mono text-slate-800 break-all bg-slate-50 p-2.5 rounded-lg border border-slate-200/60">
              {paymentRef || "No gateway reference (Pending or not recorded)"}
            </p>
          </div>

          {/* Pricing Ledger / Financial Breakdown */}
          <div className="rounded-xl border border-slate-200/80 p-4 bg-white shadow-2xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Authoritative Financial Breakdown
            </h3>

            <div className="space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal (Items Net)</span>
                <span className="font-semibold">{formatCurrency(order.subtotal)}</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Tax Amount (GST / VAT)</span>
                <span className="font-semibold">{formatCurrency(order.taxAmount)}</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Platform Fee Assessed</span>
                <span className="font-semibold text-[#0052cc]">
                  {formatCurrency(order.platformFeeAssessed)}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-between text-sm sm:text-base font-black text-slate-900">
                <span>Grand Total</span>
                <span className="text-emerald-600">{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 gap-2 px-1">
            <div className="flex items-center gap-1.5">
              <Clock className="size-3.5" />
              <span>Created: {formatDate(order.createdAt)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="size-3.5" />
              <span>Updated: {formatDate(order.updatedAt)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-4 border-t border-slate-100 bg-slate-50/70">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="rounded-xl border-slate-200 text-xs font-semibold"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
