import { Loader2, Minus, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { CART_LIMITS, CART_UI_MESSAGES } from "../constants/cart.constants";
import { RemoveConfirmationPill } from "./RemoveConfirmationPill";

export interface QuantityStepperProps {
  quantity: number;
  min?: number;
  max?: number;
  isPending?: boolean;
  disabled?: boolean;
  confirmRemove?: boolean;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove?: () => void;
  className?: string;
  size?: "sm" | "md";
}

export function QuantityStepper({
  quantity,
  min = CART_LIMITS.MIN_QUANTITY,
  max = CART_LIMITS.MAX_QUANTITY,
  isPending = false,
  disabled = false,
  confirmRemove = false,
  onIncrement,
  onDecrement,
  onRemove,
  className = "",
  size = "sm",
}: QuantityStepperProps) {
  const [isConfirming, setIsConfirming] = useState(false);

  const isAtMax = quantity >= max;
  const isAtMin = quantity <= min;

  const handleDecrementClick = () => {
    if (disabled || isPending) return;

    if (isAtMin && confirmRemove) {
      setIsConfirming(true);
      return;
    }

    onDecrement();
  };

  const handleConfirmRemove = () => {
    setIsConfirming(false);
    if (onRemove) {
      onRemove();
    } else {
      onDecrement();
    }
  };

  const handleCancelRemove = () => {
    setIsConfirming(false);
  };

  if (isConfirming) {
    return (
      <RemoveConfirmationPill
        onConfirm={handleConfirmRemove}
        onCancel={handleCancelRemove}
        isPending={isPending}
        className={className}
      />
    );
  }

  const isSmall = size === "sm";
  const btnSizeClass = isSmall ? "size-6" : "size-7";
  const iconSizeClass = isSmall ? "size-3" : "size-3.5";
  const textSizeClass = isSmall ? "text-xs w-6" : "text-sm w-7";

  return (
    <div
      data-testid="quantity-stepper"
      className={`inline-flex items-center rounded-lg border border-neutral-200/90 bg-white p-0.5 shadow-2xs transition-all ${
        disabled ? "opacity-60 cursor-not-allowed" : "hover:border-neutral-300"
      } ${className}`}
    >
      <button
        type="button"
        onClick={handleDecrementClick}
        disabled={disabled || isPending}
        aria-label={
          isAtMin && onRemove
            ? CART_UI_MESSAGES.REMOVE_CONFIRM_ACTION
            : CART_UI_MESSAGES.DECREASE_QUANTITY_ARIA
        }
        data-testid="quantity-stepper-decrement"
        className={`${btnSizeClass} flex items-center justify-center rounded-md text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ff6b00]`}
      >
        {isAtMin && onRemove && !confirmRemove ? (
          <Trash2 className={`${iconSizeClass} text-red-500`} />
        ) : (
          <Minus className={iconSizeClass} />
        )}
      </button>

      <span
        data-testid="quantity-stepper-count"
        aria-live="polite"
        className={`${textSizeClass} font-semibold text-center text-neutral-800 tabular-nums select-none flex items-center justify-center`}
      >
        {isPending ? (
          <Loader2 className={`${iconSizeClass} animate-spin text-neutral-400`} />
        ) : (
          quantity
        )}
      </span>

      <button
        type="button"
        onClick={onIncrement}
        disabled={disabled || isPending || isAtMax}
        title={isAtMax ? CART_UI_MESSAGES.MAX_QUANTITY_REACHED_TOOLTIP : undefined}
        aria-label={CART_UI_MESSAGES.INCREASE_QUANTITY_ARIA}
        data-testid="quantity-stepper-increment"
        className={`${btnSizeClass} flex items-center justify-center rounded-md text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ff6b00]`}
      >
        <Plus className={iconSizeClass} />
      </button>
    </div>
  );
}

export default QuantityStepper;
