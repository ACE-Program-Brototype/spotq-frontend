/**
 * CancellationReasonSelect Component
 * Accessible radio list of predefined cancellation reasons with smooth expansion of
 * an optional 250-character note input when "Other" is selected.
 */

import type * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import {
  CANCEL_ORDER_MESSAGES,
  CANCEL_ORDER_REASON_OPTIONS,
  CANCEL_ORDER_REASONS,
  MAX_CANCELLATION_NOTE_LENGTH,
} from "@/features/orders/constants/cancel-order.constants";
import type { CancelOrderReasonKey } from "@/features/orders/types/cancel-order.types";
import { cn } from "@/lib/utils/cn";

export interface CancellationReasonSelectProps {
  selectedReason: CancelOrderReasonKey | null;
  onReasonChange: (reason: CancelOrderReasonKey) => void;
  note: string;
  onNoteChange: (note: string) => void;
  disabled?: boolean;
  className?: string;
}

export function CancellationReasonSelect({
  selectedReason,
  onReasonChange,
  note,
  onNoteChange,
  disabled = false,
  className = "",
}: CancellationReasonSelectProps) {
  const isOtherSelected = selectedReason === CANCEL_ORDER_REASONS.OTHER;
  const remainingChars = MAX_CANCELLATION_NOTE_LENGTH - note.length;

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value.slice(0, MAX_CANCELLATION_NOTE_LENGTH);
    onNoteChange(value);
  };

  return (
    <div
      data-testid="cancellation-reason-select"
      className={cn("flex flex-col gap-3.5", className)}
    >
      <fieldset className="flex flex-col gap-2.5">
        <legend className="text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
          {CANCEL_ORDER_MESSAGES.REASON_LABEL}
        </legend>

        <div className="grid grid-cols-1 gap-2" role="radiogroup">
          {CANCEL_ORDER_REASON_OPTIONS.map((option) => {
            const isChecked = selectedReason === option.value;

            return (
              <label
                key={option.value}
                data-testid={`reason-option-${option.value}`}
                className={cn(
                  "relative flex items-center gap-3 rounded-xl border p-3 cursor-pointer text-xs sm:text-sm font-medium transition-all select-none",
                  isChecked
                    ? "border-neutral-900 bg-neutral-900/5 text-neutral-950 font-semibold shadow-2xs"
                    : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50/60",
                  disabled && "opacity-60 cursor-not-allowed pointer-events-none",
                )}
              >
                <input
                  type="radio"
                  name="cancellation-reason"
                  value={option.value}
                  checked={isChecked}
                  disabled={disabled}
                  onChange={() => onReasonChange(option.value)}
                  className="size-4 shrink-0 accent-neutral-900 focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-1"
                />
                <span className="flex-1 leading-snug">{option.label}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {/* Conditionally rendered Note Area for "Other" reason */}
      {isOtherSelected && (
        <div
          data-testid="cancellation-note-container"
          className="flex flex-col gap-1.5 pt-1 animate-in fade-in-50 slide-in-from-top-1 duration-200"
        >
          <div className="flex items-center justify-between text-xs">
            <label htmlFor="cancellation-note-input" className="font-semibold text-neutral-700">
              {CANCEL_ORDER_MESSAGES.NOTE_LABEL}
            </label>
            <span
              data-testid="note-character-counter"
              className={cn(
                "text-[11px] font-medium font-mono",
                remainingChars < 20 ? "text-amber-600 font-bold" : "text-neutral-400",
              )}
            >
              {note.length} / {MAX_CANCELLATION_NOTE_LENGTH}
            </span>
          </div>

          <Textarea
            id="cancellation-note-input"
            data-testid="cancellation-note-input"
            rows={3}
            value={note}
            onChange={handleNoteChange}
            placeholder={CANCEL_ORDER_MESSAGES.NOTE_PLACEHOLDER}
            disabled={disabled}
            maxLength={MAX_CANCELLATION_NOTE_LENGTH}
            className="rounded-xl border-neutral-200 bg-white p-3 text-xs sm:text-sm placeholder:text-neutral-400 focus-visible:border-neutral-900 focus-visible:ring-neutral-900/10 shadow-2xs"
          />
        </div>
      )}
    </div>
  );
}
