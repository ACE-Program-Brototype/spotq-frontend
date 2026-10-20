import { Check, X } from "lucide-react";
import { CART_UI_MESSAGES } from "../constants/cart.constants";

interface RemoveConfirmationPillProps {
  onConfirm: () => void;
  onCancel: () => void;
  isPending?: boolean;
  className?: string;
}

export function RemoveConfirmationPill({
  onConfirm,
  onCancel,
  isPending = false,
  className = "",
}: RemoveConfirmationPillProps) {
  return (
    <div
      data-testid="remove-confirmation-pill"
      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 animate-in fade-in zoom-in-95 duration-150 ${className}`}
    >
      <span className="text-[11px] font-semibold tracking-tight">
        {CART_UI_MESSAGES.REMOVE_CONFIRM_TITLE}
      </span>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={onConfirm}
          disabled={isPending}
          aria-label={CART_UI_MESSAGES.CONFIRM_REMOVE_ARIA}
          data-testid="remove-confirm-button"
          className="size-5 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center transition-colors disabled:opacity-50"
        >
          <Check className="size-3" />
        </button>

        <button
          type="button"
          onClick={onCancel}
          disabled={isPending}
          aria-label={CART_UI_MESSAGES.CANCEL_REMOVE_ARIA}
          data-testid="remove-cancel-button"
          className="size-5 rounded-full bg-white hover:bg-neutral-100 text-neutral-600 border border-neutral-200 flex items-center justify-center transition-colors disabled:opacity-50"
        >
          <X className="size-3" />
        </button>
      </div>
    </div>
  );
}

export default RemoveConfirmationPill;
