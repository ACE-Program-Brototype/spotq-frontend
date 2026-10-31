import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QUEUE_MESSAGES } from "../constants/queue.constants";
import { queueService } from "../services/queue.service";
import type { QueueEntry } from "../types/queue.types";

interface CancelQueueModalProps {
  isOpen: boolean;
  onClose: () => void;
  entry: QueueEntry | null;
  restaurantId: string;
  onSuccess: (cancelledEntryId: string) => void;
}

export function CancelQueueModal({
  isOpen,
  onClose,
  entry,
  restaurantId,
  onSuccess,
}: CancelQueueModalProps) {
  const [outcome, setOutcome] = useState<"CANCELLED" | "NO_SHOW">("NO_SHOW");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !entry) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await queueService.cancelQueueEntry(restaurantId, entry.queueEntryId, {
        reason: outcome,
        notes: notes.trim() || undefined,
      });

      const successMsg =
        outcome === "NO_SHOW" ? QUEUE_MESSAGES.NO_SHOW_SUCCESS : QUEUE_MESSAGES.CANCEL_SUCCESS;
      toast.success(successMsg);
      onSuccess(entry.queueEntryId);
      onClose();
    } catch {
      toast.error(QUEUE_MESSAGES.CANCEL_FAILED);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-xl border border-[#eddcd4]">
        <div className="space-y-1 pb-3 border-b border-[#eddcd4]">
          <h2 className="text-lg font-bold text-neutral-900">Cancel or Mark No-Show</h2>
          <p className="text-xs text-neutral-600">
            Process cancellation for {entry.guestName} (Queue #{entry.position}).
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Action Type</Label>
            <div className="grid grid-cols-2 gap-2">
              <label
                className={`flex cursor-pointer items-center justify-center rounded-lg border p-3 text-xs font-semibold transition-all ${
                  outcome === "NO_SHOW"
                    ? "border-red-500 bg-red-50 text-red-700"
                    : "border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50"
                }`}
              >
                <input
                  type="radio"
                  name="outcome"
                  value="NO_SHOW"
                  checked={outcome === "NO_SHOW"}
                  onChange={() => setOutcome("NO_SHOW")}
                  className="sr-only"
                />
                <span>Mark No-Show</span>
              </label>

              <label
                className={`flex cursor-pointer items-center justify-center rounded-lg border p-3 text-xs font-semibold transition-all ${
                  outcome === "CANCELLED"
                    ? "border-neutral-800 bg-neutral-100 text-neutral-900"
                    : "border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50"
                }`}
              >
                <input
                  type="radio"
                  name="outcome"
                  value="CANCELLED"
                  checked={outcome === "CANCELLED"}
                  onChange={() => setOutcome("CANCELLED")}
                  className="sr-only"
                />
                <span>Customer Cancel</span>
              </label>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="audit-notes">Optional Notes</Label>
            <Input
              id="audit-notes"
              placeholder="e.g. No response after 2 rings"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#eddcd4]">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold"
            >
              {isSubmitting ? "Processing..." : "Confirm Removal"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
