/**
 * CancelOrderTriggerButton Component
 * Three-dot ("dots") action menu trigger on the order listing card.
 * Conditionally rendered for PLACED and CONFIRMED orders; opens the CancelOrderModal on click.
 */

import { MoreVertical, Trash2 } from "lucide-react";
import type * as React from "react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils/cn";
import { CANCEL_ORDER_MESSAGES } from "../../constants/cancel-order.constants";
import { ORDER_STATUS } from "../../constants/orders.constants";
import type { OrderStatus } from "../../types/orders.types";
import { CancelOrderModal } from "./CancelOrderModal";

export interface CancelOrderTriggerButtonProps {
  orderId: string;
  orderNumber?: string;
  status: OrderStatus | string;
  actionLabel?: string;
  showDisabled?: boolean;
  className?: string;
  onCancelled?: () => void;
}

export function isOrderCancellable(status?: OrderStatus | string): boolean {
  if (!status) return false;
  const normalized = status.toUpperCase();
  return normalized === ORDER_STATUS.PLACED || normalized === ORDER_STATUS.CONFIRMED;
}

export function getDisabledTooltip(status?: OrderStatus | string): string {
  if (!status) return "";
  const normalized = status.toUpperCase();

  switch (normalized) {
    case ORDER_STATUS.PREPARING:
    case ORDER_STATUS.READY:
    case ORDER_STATUS.SERVED:
      return CANCEL_ORDER_MESSAGES.TRIGGER_TOOLTIP_PREPARING;
    case ORDER_STATUS.COMPLETED:
      return CANCEL_ORDER_MESSAGES.TRIGGER_TOOLTIP_COMPLETED;
    case ORDER_STATUS.CANCELLED:
      return CANCEL_ORDER_MESSAGES.TRIGGER_TOOLTIP_CANCELLED;
    default:
      return "";
  }
}

export function CancelOrderTriggerButton({
  orderId,
  orderNumber,
  status,
  actionLabel = CANCEL_ORDER_MESSAGES.TRIGGER_BUTTON,
  showDisabled = false,
  className = "",
  onCancelled,
}: CancelOrderTriggerButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const cancellable = isOrderCancellable(status);

  // Close dropdown on click outside or Escape
  useEffect(() => {
    if (!isMenuOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen]);

  // If order cannot be cancelled and showDisabled is false, do not render
  if (!cancellable && !showDisabled) {
    return null;
  }

  const tooltipText = !cancellable ? getDisabledTooltip(status) : undefined;

  const handleToggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (cancellable) {
      setIsMenuOpen((prev) => !prev);
    }
  };

  const handleOpenModalFromMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsMenuOpen(false);
    setIsModalOpen(true);
  };

  return (
    <>
      <div ref={menuRef} className={cn("relative inline-flex items-center", className)}>
        <button
          type="button"
          onClick={handleToggleMenu}
          disabled={!cancellable}
          title={tooltipText}
          aria-label={`Order actions for order #${orderNumber || orderId}`}
          aria-haspopup="menu"
          aria-expanded={isMenuOpen}
          data-testid="cancel-order-menu-trigger"
          className={cn(
            "flex size-8 items-center justify-center rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 active:scale-95 transition-all outline-none focus-visible:ring-2 focus-visible:ring-neutral-400",
            !cancellable &&
              "opacity-40 cursor-not-allowed hover:bg-transparent hover:text-neutral-400",
          )}
        >
          <MoreVertical className="size-4 shrink-0" aria-hidden="true" />
        </button>

        {/* Three-dot Dropdown Menu */}
        {isMenuOpen && (
          <div
            role="menu"
            data-testid="order-actions-dropdown"
            aria-label="Order actions menu"
            className="absolute right-0 top-full mt-1.5 z-40 min-w-36 rounded-2xl bg-white p-1.5 border border-neutral-200 shadow-lg shadow-neutral-900/10 animate-in fade-in zoom-in-95 duration-150"
          >
            <button
              type="button"
              role="menuitem"
              data-testid="delete-order-button"
              onClick={handleOpenModalFromMenu}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors text-left"
            >
              <Trash2 className="size-3.5 shrink-0 text-rose-600" aria-hidden="true" />
              <span>{actionLabel}</span>
            </button>
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      <CancelOrderModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        orderId={orderId}
        orderNumber={orderNumber}
        onSuccess={onCancelled}
      />
    </>
  );
}

export default CancelOrderTriggerButton;
