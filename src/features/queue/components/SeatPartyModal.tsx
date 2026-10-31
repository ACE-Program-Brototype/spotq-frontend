import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QUEUE_MESSAGES } from "../constants/queue.constants";
import { queueService } from "../services/queue.service";
import type { QueueEntry } from "../types/queue.types";

interface SeatPartyModalProps {
  isOpen: boolean;
  onClose: () => void;
  entry: QueueEntry | null;
  restaurantId: string;
  onSuccess: (seatedEntryId: string) => void;
}

export function SeatPartyModal({
  isOpen,
  onClose,
  entry,
  restaurantId,
  onSuccess,
}: SeatPartyModalProps) {
  const [tableInput, setTableInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !entry) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const tableIds = tableInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const finalTableIds = tableIds.length > 0 ? tableIds : ["tbl-auto-1"];

    setIsSubmitting(true);
    try {
      await queueService.seatParty(restaurantId, entry.queueEntryId, {
        tableIds: finalTableIds,
      });
      toast.success(QUEUE_MESSAGES.SEAT_SUCCESS);
      onSuccess(entry.queueEntryId);
      onClose();
    } catch {
      toast.error(QUEUE_MESSAGES.SEAT_FAILED);
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
          <h2 className="text-lg font-bold text-neutral-900">Seat Party</h2>
          <p className="text-xs text-neutral-600">
            Confirm table allocation to seat {entry.guestName} (Party of {entry.partySize}).
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-1.5">
            <Label htmlFor="table-ids">Table Identifier(s)</Label>
            <Input
              id="table-ids"
              placeholder="e.g. T-01 or comma-separated table IDs"
              value={tableInput}
              onChange={(e) => setTableInput(e.target.value)}
              disabled={isSubmitting}
            />
            <p className="text-[11px] text-neutral-500">
              Leave blank to auto-confirm authoritative assignment.
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
              disabled={isSubmitting}
              className="rounded-xl bg-[#9a3412] hover:bg-[#7c2d12] text-white font-bold"
            >
              {isSubmitting ? "Seating..." : "Confirm Seating"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
