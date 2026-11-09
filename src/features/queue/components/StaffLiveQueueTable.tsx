import {
  Bell,
  Clock,
  Eye,
  FastForward,
  Globe,
  MessageSquare,
  Sparkles,
  Users,
  UserX,
  UtensilsCrossed,
} from "lucide-react";
import { Spinner } from "@/components/common/LoadingIndicator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ResponseCountdownBadge } from "@/features/queue/components/ResponseCountdownBadge";
import {
  getQueueStatusBadgeClass,
  QUEUE_STATUS,
  REGISTRATION_TYPE,
} from "@/features/queue/constants/queue.constants";
import type { StaffLiveQueueEntry } from "@/features/queue/types/queue.types";
import { formatTime } from "@/lib/utils";

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
            {entries.map((entry) => {
              const isRinging = activeRingingId === entry.queueEntryId;
              const isCalledOrRinging = Boolean(entry.responseDeadline) || entry.ringCount > 0;
              const isWaiting = entry.status === QUEUE_STATUS.WAITING;
              const canAct = isWaiting || entry.status === QUEUE_STATUS.SKIPPED;

              return (
                <tr
                  key={entry.queueEntryId}
                  data-testid={`queue-row-${entry.queueEntryId}`}
                  className="hover:bg-[#faf7f5]/80 transition-colors group cursor-pointer"
                  onClick={() => onSelectEntry(entry)}
                >
                  {/* Position */}
                  <td className="px-4 py-3.5 font-bold text-neutral-900 whitespace-nowrap">
                    {entry.status === QUEUE_STATUS.SEATED ? (
                      <span className="inline-flex size-6 items-center justify-center rounded-md bg-emerald-50 text-xs font-black text-emerald-700 border border-emerald-200">
                        ✓
                      </span>
                    ) : (
                      <span className="inline-flex size-6 items-center justify-center rounded-md bg-[#faf7f5] text-xs font-black text-[#9a3412] border border-[#eddcd4]">
                        #{entry.position ?? "-"}
                      </span>
                    )}
                  </td>

                  {/* Guest & Ticket */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-neutral-900 group-hover:text-[#9a3412] transition-colors">
                        {entry.guestName}
                      </span>
                      <span className="font-mono text-[10px] bg-neutral-100 text-neutral-700 px-1.5 py-0.5 rounded font-semibold">
                        #{entry.queueNumber}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-[#756c66]">
                      {entry.guestPhone && <span className="font-mono">{entry.guestPhone}</span>}
                      <span className="inline-flex items-center gap-1 font-semibold">
                        {entry.registrationType === REGISTRATION_TYPE.ONLINE ? (
                          <>
                            <Globe className="size-3 text-blue-600" />
                            <span className="text-blue-700">Online</span>
                          </>
                        ) : (
                          <>
                            <Users className="size-3 text-[#9a3412]" />
                            <span className="text-[#9a3412]">Walk-In</span>
                          </>
                        )}
                      </span>
                    </div>
                  </td>

                  {/* Party Size */}
                  <td className="px-4 py-3.5 whitespace-nowrap font-semibold text-neutral-800">
                    {entry.partySize} {entry.partySize === 1 ? "Guest" : "Guests"}
                  </td>

                  {/* Special Notes */}
                  <td className="px-4 py-3.5 max-w-xs text-neutral-700">
                    {entry.specialNotes ? (
                      <div className="flex items-center gap-1.5">
                        <MessageSquare className="size-3.5 text-neutral-400 shrink-0" />
                        <span className="truncate">{entry.specialNotes}</span>
                      </div>
                    ) : (
                      <span className="text-neutral-400 italic">None</span>
                    )}
                  </td>

                  {/* Status Badge */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <Badge
                      className={`text-[10px] font-bold ${getQueueStatusBadgeClass(
                        entry.status,
                        isCalledOrRinging,
                      )}${isCalledOrRinging ? " animate-pulse" : ""}`}
                    >
                      {entry.status}
                    </Badge>
                  </td>

                  {/* Wait Time & Countdown */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-[11px] text-[#756c66]">
                        <Clock className="size-3 text-neutral-400" />
                        <span>{entry.waitDurationMinutes}m wait</span>
                        <span className="text-neutral-400">({formatTime(entry.joinedAt)})</span>
                      </div>
                      {isCalledOrRinging && (
                        <div>
                          <ResponseCountdownBadge deadline={entry.responseDeadline} />
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Action Buttons */}
                  <td
                    className="px-4 py-3.5 text-right whitespace-nowrap"
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => e.stopPropagation()}
                  >
                    {canAct ? (
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Ring Customer Button (Online guests only) */}
                        {entry.registrationType === "ONLINE" && (
                          <Button
                            type="button"
                            size="sm"
                            disabled={isRinging}
                            onClick={() => onRingCustomer(entry)}
                            data-testid={`action-ring-${entry.queueEntryId}`}
                            className={`h-8 px-2.5 rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1 ${
                              isCalledOrRinging
                                ? "bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300"
                                : "bg-[#9a3412] hover:bg-[#7c2d12] text-white"
                            }`}
                            title="Ring customer to notify table ready"
                          >
                            {isRinging ? <Spinner size="sm" /> : <Bell className="size-3.5" />}
                            <span>{isCalledOrRinging ? "Ring Again" : "Ring"}</span>
                          </Button>
                        )}

                        {/* Assign Table Button */}
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => onAssignTable(entry)}
                          data-testid={`action-assign-${entry.queueEntryId}`}
                          className="h-8 px-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1 shadow-2xs transition-all"
                          title="Assign table and seat party"
                        >
                          <UtensilsCrossed className="size-3.5" />
                          <span>Assign</span>
                        </Button>

                        {/* Skip Party Button */}
                        <button
                          type="button"
                          onClick={() => onSkipParty(entry)}
                          data-testid={`action-skip-${entry.queueEntryId}`}
                          className="size-8 rounded-xl border border-[#eadfd8] bg-white hover:bg-[#faf7f5] text-[#756c66] hover:text-[#9a3412] flex items-center justify-center transition-colors"
                          title="Skip party positions"
                        >
                          <FastForward className="size-3.5" />
                        </button>

                        {/* Cancel / No-Show Button */}
                        <button
                          type="button"
                          onClick={() => onCancelEntry(entry)}
                          data-testid={`action-cancel-${entry.queueEntryId}`}
                          className="size-8 rounded-xl border border-red-200 bg-white hover:bg-red-50 text-red-600 flex items-center justify-center transition-colors"
                          title="Mark no-show or cancel entry"
                        >
                          <UserX className="size-3.5" />
                        </button>

                        {/* Details Drawer Trigger */}
                        <button
                          type="button"
                          onClick={() => onSelectEntry(entry)}
                          data-testid={`action-details-${entry.queueEntryId}`}
                          className="size-8 rounded-xl border border-[#eadfd8] bg-white hover:bg-[#faf7f5] text-[#756c66] hover:text-neutral-900 flex items-center justify-center transition-colors"
                          title="View complete details"
                        >
                          <Eye className="size-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-xs font-semibold text-neutral-400 italic">
                          {entry.status}
                        </span>
                        <button
                          type="button"
                          onClick={() => onSelectEntry(entry)}
                          className="size-8 rounded-xl border border-[#eadfd8] bg-white hover:bg-[#faf7f5] text-[#756c66] hover:text-neutral-900 flex items-center justify-center transition-colors"
                          title="View details"
                        >
                          <Eye className="size-3.5" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
