import { AlertTriangle, UserX, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/common/LoadingIndicator";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  QUEUE_CANCEL_REASON,
  QUEUE_CANCEL_REASONS,
} from "@/features/queue/constants/queue.constants";
import type { QueueCancelReason, StaffLiveQueueEntry } from "@/features/queue/types/queue.types";

interface CancelQueueEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  queueEntry: StaffLiveQueueEntry | null;
  onConfirm: (reason: QueueCancelReason, notes?: string) => Promise<void>;
  isSubmitting: boolean;
  initialReason?: QueueCancelReason;
}

export function CancelQueueEntryModal({
  isOpen,
  onClose,
  queueEntry,
  onConfirm,
  isSubmitting,
  initialReason = QUEUE_CANCEL_REASON.NO_SHOW,
}: CancelQueueEntryModalProps) {
  const [selectedReason, setSelectedReason] = useState<QueueCancelReason>(initialReason);
  const [notes, setNotes] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      setSelectedReason(initialReason);
      setNotes("");
    }
  }, [isOpen, initialReason]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isSubmitting) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen || !queueEntry) {
    return null;
  }

  const isNoShow = selectedReason === QUEUE_CANCEL_REASON.NO_SHOW;

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      await onConfirm(selectedReason, notes.trim() || undefined);
      onClose();
    } catch {
      // Error handled by mutation hook
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cancel-party-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150"
      data-testid="cancel-queue-entry-modal"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close modal overlay"
        onClick={onClose}
        disabled={isSubmitting}
        className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs cursor-default border-0 outline-none w-full h-full disabled:cursor-not-allowed"
      />

      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white border border-[#eddcd4] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#eddcd4] bg-red-50/50 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-red-100 flex items-center justify-center text-red-700">
              <UserX className="size-4.5" />
            </div>
            <div>
              <h2 id="cancel-party-modal-title" className="text-base font-bold text-neutral-900">
                {isNoShow ? "Mark as No-Show" : "Cancel Queue Entry"}
              </h2>
              <p className="text-xs text-[#756c66]">
                Remove #{queueEntry.queueNumber} ({queueEntry.guestName}) from waitlist
              </p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-xs text-amber-900">
            <AlertTriangle className="size-4 text-amber-700 shrink-0 mt-0.5" />
            <span>
              This will remove the party from the live queue and update their ticket status. This
              action cannot be undone.
            </span>
          </div>

          {/* Cancellation reason radio options */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#756c66] uppercase tracking-wider block">
              Reason <span className="text-red-500">*</span>
            </span>
            <div className="space-y-1.5">
              {QUEUE_CANCEL_REASONS.map((item) => (
                <label
                  key={item.value}
                  className={`flex items-center gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    selectedReason === item.value
                      ? "border-red-300 bg-red-50/60 font-bold text-red-900 shadow-2xs"
                      : "border-[#eadfd8] bg-[#faf7f5]/40 text-neutral-700 hover:bg-[#faf7f5]"
                  }`}
                >
                  <input
                    type="radio"
                    name="cancelReason"
                    value={item.value}
                    checked={selectedReason === item.value}
                    onChange={() => setSelectedReason(item.value)}
                    className="size-4 text-red-600 focus:ring-red-500"
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Optional notes textarea */}
          <div className="space-y-1.5">
            <label
              htmlFor="cancel-notes"
              className="text-xs font-bold text-[#756c66] uppercase tracking-wider"
            >
              Notes (Optional)
            </label>
            <Textarea
              id="cancel-notes"
              placeholder="Add optional notes (e.g. called twice without answer, etc.)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="text-xs rounded-xl border-[#eadfd8] min-h-[72px]"
              data-testid="cancel-notes-input"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#eddcd4]">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl h-10 px-4 text-xs font-bold border-[#eadfd8]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              data-testid="confirm-cancel-button"
              className="rounded-xl h-10 px-5 text-xs font-bold bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
            >
              {isSubmitting ? <Spinner size="sm" /> : <UserX className="size-4" />}
              <span>
                {isSubmitting ? "Updating..." : isNoShow ? "Mark No-Show" : "Cancel Entry"}
              </span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
