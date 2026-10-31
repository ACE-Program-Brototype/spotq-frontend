import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QUEUE_MESSAGES } from "../constants/queue.constants";
import { queueService } from "../services/queue.service";
import type { QueueEntry } from "../types/queue.types";

interface SkipPartyModalProps {
  isOpen: boolean;
  onClose: () => void;
  entry: QueueEntry | null;
  restaurantId: string;
  onSuccess: (skippedEntryId: string, isReordered: boolean) => void;
}

const PRESET_REASONS = [
  "Party not present at host stand",
  "Requested delayed seating",
  "Party stepped away temporarily",
  "No response to announcement",
];

export function SkipPartyModal({
  isOpen,
  onClose,
  entry,
  restaurantId,
  onSuccess,
}: SkipPartyModalProps) {
  const [reason, setReason] = useState(PRESET_REASONS[0]);
  const [customReason, setCustomReason] = useState("");
  const [skipPositions, setSkipPositions] = useState<number | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !entry) return null;

  const effectiveReason = reason === "Other" ? customReason.trim() : reason;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || !effectiveReason) return;

    setIsSubmitting(true);
    try {
      await queueService.skipParty(restaurantId, entry.queueEntryId, {
        reason: effectiveReason,
        skipPositions: skipPositions && skipPositions > 0 ? skipPositions : undefined,
      });
      toast.success(QUEUE_MESSAGES.SKIP_SUCCESS);
      onSuccess(entry.queueEntryId, Boolean(skipPositions && skipPositions > 0));
      onClose();
    } catch {
      toast.error(QUEUE_MESSAGES.SKIP_FAILED);
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
          <h2 className="text-lg font-bold text-neutral-900">Skip Party</h2>
          <p className="text-xs text-neutral-600">
            Skip {entry.guestName} (Queue #{entry.position}). Select a reason below.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-1.5">
            <Label htmlFor="skip-reason">Reason</Label>
            <select
              id="skip-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={isSubmitting}
              className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm shadow-xs focus:border-[#9a3412] focus:outline-hidden"
            >
              {PRESET_REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
              <option value="Other">Other reason...</option>
            </select>
          </div>

          {reason === "Other" && (
            <div className="space-y-1.5">
              <Label htmlFor="custom-reason">Custom Reason</Label>
              <Input
                id="custom-reason"
                placeholder="Specify skip reason"
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="skip-positions">Reorder Position (Optional)</Label>
            <Input
              id="skip-positions"
              type="number"
              min={1}
              max={10}
              placeholder="e.g. 2 to shift down 2 places (omit to mark as terminal skipped)"
              value={skipPositions !== undefined ? skipPositions : ""}
              onChange={(e) =>
                setSkipPositions(e.target.value ? Number(e.target.value) : undefined)
              }
              disabled={isSubmitting}
            />
            <p className="text-[11px] text-neutral-500">
              Leave blank to remove party from active queue.
            </p>
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
              disabled={isSubmitting || !effectiveReason}
              className="rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold"
            >
              {isSubmitting ? "Skipping..." : "Confirm Skip"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
