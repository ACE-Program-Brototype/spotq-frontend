/**
 * Platform Admin Order Detail Modal Component
 * Displays authoritative server-calculated financial breakdowns,
 * payment references, timestamps, and order lifecycle states.
 */

import { Check, Clock, Copy, Receipt, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  ADMIN_ORDERS_MESSAGES,
  ADMIN_ORDERS_TABLE_LABELS,
  ADMIN_ORDER_COPY_FIELDS,
  ADMIN_ORDER_DETAIL_LABELS,
} from "@/features/orders/constants/admin-orders.constants";
import type { AdminOrderListItem } from "@/features/orders/types/admin-orders.types";
import { AdminOrderDetailFinancials } from "@/features/orders/components/admin/order/AdminOrderDetailFinancials";
import { AdminPaymentStatusBadge } from "@/features/orders/components/admin/order/AdminPaymentStatusBadge";
import { OrderStatusBadge } from "@/features/orders/components/admin/order/OrderStatusBadge";
import { formatDate } from "@/lib/utils/date";

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

    previousFocusRef.current = document.activeElement as HTMLElement | null;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

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
    } catch {
      toast.error(ADMIN_ORDERS_MESSAGES.COPY_FAILED);
    }
  };

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
        aria-label={ADMIN_ORDER_DETAIL_LABELS.CLOSE_OVERLAY_ARIA}
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
                  {ADMIN_ORDER_DETAIL_LABELS.TITLE_PREFIX}{order.orderNumber}
                </h2>
                <button
                  type="button"
                  onClick={() => handleCopy(order.orderNumber, ADMIN_ORDER_COPY_FIELDS.ORDER_NUMBER)}
                  className="text-slate-400 hover:text-slate-600 transition-colors p-0.5 cursor-pointer rounded-xs focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0052cc]"
                  title={ADMIN_ORDERS_TABLE_LABELS.COPY_ORDER_NUMBER}
                  aria-label={ADMIN_ORDERS_TABLE_LABELS.COPY_ORDER_NUMBER}
                >
                  {copiedField === ADMIN_ORDER_COPY_FIELDS.ORDER_NUMBER ? (
                    <Check className="size-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="size-3.5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            aria-label={ADMIN_ORDER_DETAIL_LABELS.CLOSE_DIALOG_ARIA}
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
                {ADMIN_ORDER_DETAIL_LABELS.ORDER_LIFECYCLE}
              </span>
              <OrderStatusBadge status={order.status} size="md" />
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                {ADMIN_ORDER_DETAIL_LABELS.PAYMENT_STATUS}
              </span>
              <AdminPaymentStatusBadge status={order.paymentStatus} size="md" />
            </div>
          </div>

          {/* Financial Breakdown & Context */}
          <AdminOrderDetailFinancials
            order={order}
            copiedField={copiedField}
            onCopy={handleCopy}
          />

          {/* Timestamps */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 gap-2 px-1">
            <div className="flex items-center gap-1.5">
              <Clock className="size-3.5" />
              <span>{ADMIN_ORDER_DETAIL_LABELS.CREATED} {formatDate(order.createdAt)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="size-3.5" />
              <span>{ADMIN_ORDER_DETAIL_LABELS.UPDATED} {formatDate(order.updatedAt)}</span>
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
            {ADMIN_ORDER_DETAIL_LABELS.CLOSE}
          </Button>
        </div>
      </div>
    </div>
  );
}
