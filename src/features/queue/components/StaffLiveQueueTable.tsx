import { Sparkles, Users } from "lucide-react";
import { Spinner } from "@/components/common/LoadingIndicator";
import { Button } from "@/components/ui/button";
import { StaffLiveQueueRow } from "@/features/queue/components/StaffLiveQueueRow";
import type { StaffLiveQueueEntry } from "@/features/queue/types/queue.types";

interface StaffLiveQueueTableProps {
  entries: StaffLiveQueueEntry[];
  isLoading: boolean;
  activeRingingId: string | null;
  onSelectEntry: (entry: StaffLiveQueueEntry) => void;
  onRingCustomer: (entry: StaffLiveQueueEntry) => void;
  onAssignTable: (entry: StaffLiveQueueEntry) => void;
  onSkipParty: (entry: StaffLiveQueueEntry) => void;
  onCancelEntry: (entry: StaffLiveQueueEntry) => void;
  onAddWalkInClick: () => void;
}

export function StaffLiveQueueTable({
  entries,
  isLoading,
  activeRingingId,
  onSelectEntry,
  onRingCustomer,
  onAssignTable,
  onSkipParty,
  onCancelEntry,
  onAddWalkInClick,
}: StaffLiveQueueTableProps) {
  if (isLoading) {
    return (
      <div
        data-testid="queue-table-loading"
        className="rounded-2xl border border-[#eddcd4] bg-white p-12 flex flex-col items-center justify-center space-y-3"
      >
        <Spinner size="lg" />
        <p className="text-xs font-bold text-[#756c66]">Loading live queue waitlist...</p>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div
        data-testid="queue-empty-state"
        className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-[#eddcd4] bg-[#faf7f5]/60"
      >
        <div className="size-14 rounded-2xl bg-[#fed7aa]/40 flex items-center justify-center text-[#9a3412] mb-3 border border-[#fbd0a7]">
          <Users className="size-7 text-[#9a3412]" />
        </div>
        <h3 className="text-base font-bold text-neutral-900">No Guests in Queue</h3>
        <p className="text-xs text-[#756c66] mt-1 max-w-sm">
          There are currently no waiting parties matching the current filter. Add a new walk-in
          guest or check back soon.
        </p>
        <Button
          type="button"
          onClick={onAddWalkInClick}
          className="mt-4 h-9 px-4 rounded-xl bg-[#9a3412] hover:bg-[#7c2d12] text-white font-bold text-xs flex items-center gap-2"
        >
          <Sparkles className="size-3.5" />
          <span>Add Walk-In Guest</span>
        </Button>
      </div>
    );
  }

  return (
    <div
      data-testid="staff-live-queue-table"
      className="overflow-hidden rounded-2xl border border-[#eddcd4] bg-white shadow-2xs"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-neutral-600">
          <thead className="border-b border-[#eddcd4] bg-[#faf7f5] text-[11px] font-bold uppercase tracking-wider text-[#756c66]">
            <tr>
              <th scope="col" className="px-4 py-3.5">
                Pos
              </th>
              <th scope="col" className="px-4 py-3.5">
                Guest & Ticket
              </th>
              <th scope="col" className="px-4 py-3.5">
                Party
              </th>
              <th scope="col" className="px-4 py-3.5">
                Notes
              </th>
              <th scope="col" className="px-4 py-3.5">
                Status
              </th>
              <th scope="col" className="px-4 py-3.5">
                Wait Time / Timer
              </th>
              <th scope="col" className="px-4 py-3.5 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f3e6de]">
            {entries.map((entry) => (
              <StaffLiveQueueRow
                key={entry.queueEntryId}
                entry={entry}
                isRinging={activeRingingId === entry.queueEntryId}
                onSelectEntry={onSelectEntry}
                onRingCustomer={onRingCustomer}
                onAssignTable={onAssignTable}
                onSkipParty={onSkipParty}
                onCancelEntry={onCancelEntry}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
