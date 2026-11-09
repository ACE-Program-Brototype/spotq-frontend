import {
  Bell,
  Clock,
  FastForward,
  Globe,
  MessageSquare,
  Phone,
  User,
  Users,
  UserX,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { useEffect } from "react";
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
import { formatDate } from "@/lib/utils/date";

interface QueueEntryDetailDrawerProps {
  entry: StaffLiveQueueEntry | null;
  onClose: () => void;
  onRingCustomer: (entry: StaffLiveQueueEntry) => void;
  onAssignTable: (entry: StaffLiveQueueEntry) => void;
  onSkipParty: (entry: StaffLiveQueueEntry) => void;
  onCancelEntry: (entry: StaffLiveQueueEntry) => void;
  isRinging?: boolean;
}

export function QueueEntryDetailDrawer({
  entry,
  onClose,
  onRingCustomer,
  onAssignTable,
  onSkipParty,
  onCancelEntry,
  isRinging = false,
}: QueueEntryDetailDrawerProps) {
  const isOpen = Boolean(entry);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !entry) {
    return null;
  }

  const isOnline = entry.registrationType === REGISTRATION_TYPE.ONLINE;
  const isCalledOrRinging = isOnline && (Boolean(entry.responseDeadline) || entry.ringCount > 0);
  const isTerminalState =
    entry.status === QUEUE_STATUS.SEATED ||
    entry.status === QUEUE_STATUS.CANCELLED ||
    entry.status === QUEUE_STATUS.NO_SHOW;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Queue entry details"
      className="fixed inset-0 z-40 overflow-hidden"
      data-testid="queue-entry-detail-drawer"
    >
      {/* Semi-transparent Backdrop */}
      <button
        type="button"
        aria-label="Close drawer"
        onClick={onClose}
        className="fixed inset-0 w-full h-full bg-neutral-900/50 backdrop-blur-xs transition-opacity duration-200 animate-in fade-in cursor-default border-0 outline-none"
      />

      {/* Slide-over Drawer */}
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-8 sm:pl-10 h-full">
        <aside className="w-screen max-w-md sm:max-w-lg h-full bg-white border-l border-[#eadfd8] shadow-2xl flex flex-col justify-between overflow-y-auto transform transition-transform duration-200 ease-out animate-in slide-in-from-right">
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-[#eddcd4] bg-[#faf7f5]/90 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-[#fed7aa]/40 border border-[#fbd0a7] flex items-center justify-center text-[#9a3412] font-black text-sm">
                #{entry.position ?? "-"}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-neutral-900">
                    Ticket #{entry.queueNumber}
                  </h2>
                  <Badge
                    className={`text-[10px] font-bold ${getQueueStatusBadgeClass(
                      entry.status,
                      isCalledOrRinging,
                    )}`}
                  >
                    {entry.status}
                  </Badge>
                </div>
                <p className="text-xs text-[#756c66] mt-0.5">
                  Joined {formatDate(entry.joinedAt)} ({formatTime(entry.joinedAt)})
                </p>
              </div>
            </div>

            <button
              type="button"
              aria-label="Close details"
              onClick={onClose}
              className="rounded-lg p-2 text-neutral-400 hover:bg-[#f3e6de] hover:text-neutral-700 transition-colors"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="p-6 space-y-6 flex-1">
            {/* Countdown Banner if Called / Ringing */}
            {isCalledOrRinging && (
              <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="size-5 text-amber-700 animate-bounce" />
                  <div>
                    <p className="text-xs font-bold text-amber-900">Guest Called / Alerted</p>
                    <p className="text-[11px] text-amber-700">Response countdown timer active</p>
                  </div>
                </div>
                <ResponseCountdownBadge
                  deadline={entry.responseDeadline}
                  className="text-xs px-2.5 py-1"
                />
              </div>
            )}

            {/* Guest Profile Card */}
            <div className="rounded-2xl border border-[#eadfd8] bg-[#faf7f5]/40 p-4 space-y-3">
              <h3 className="text-xs font-bold text-[#756c66] uppercase tracking-wider flex items-center gap-2">
                <User className="size-3.5 text-[#9a3412]" />
                <span>Guest Information</span>
              </h3>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-[#756c66]">Name</p>
                  <p className="font-bold text-neutral-900 text-sm mt-0.5">{entry.guestName}</p>
                </div>
                <div>
                  <p className="text-[#756c66]">Phone</p>
                  <p className="font-mono font-medium text-neutral-800 mt-0.5 flex items-center gap-1">
                    <Phone className="size-3 text-neutral-400" />
                    <span>{entry.guestPhone || "Not provided"}</span>
                  </p>
                </div>
                <div>
                  <p className="text-[#756c66]">Party Size</p>
                  <p className="font-bold text-neutral-900 mt-0.5 flex items-center gap-1">
                    <Users className="size-3.5 text-[#9a3412]" />
                    <span>
                      {entry.partySize} {entry.partySize === 1 ? "Guest" : "Guests"}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-[#756c66]">Registration</p>
                  <span className="inline-flex items-center gap-1 font-bold text-neutral-800 mt-0.5">
                    {entry.registrationType === "ONLINE" ? (
                      <>
                        <Globe className="size-3 text-blue-600" />
                        <span>Online</span>
                      </>
                    ) : (
                      <>
                        <Users className="size-3 text-[#9a3412]" />
                        <span>Walk-In</span>
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Wait Details Card */}
            <div className="rounded-2xl border border-[#eadfd8] bg-white p-4 space-y-3 shadow-2xs">
              <h3 className="text-xs font-bold text-[#756c66] uppercase tracking-wider flex items-center gap-2">
                <Clock className="size-3.5 text-[#9a3412]" />
                <span>{isOnline ? "Wait & Ring Metrics" : "Wait Metrics"}</span>
              </h3>

              <div className={`grid ${isOnline ? "grid-cols-2" : "grid-cols-1"} gap-3 text-xs`}>
                <div>
                  <p className="text-[#756c66]">Wait Duration</p>
                  <p className="font-bold text-neutral-900 text-sm mt-0.5">
                    {entry.waitDurationMinutes} mins
                  </p>
                </div>
                {isOnline && (
                  <div>
                    <p className="text-[#756c66]">Ring Count</p>
                    <p className="font-bold text-neutral-900 text-sm mt-0.5">
                      {entry.ringCount > 0 ? `${entry.ringCount} times` : "Not rung yet"}
                    </p>
                  </div>
                )}
                {isOnline && entry.lastRingAt && (
                  <div className="col-span-2">
                    <p className="text-[#756c66]">Last Notified At</p>
                    <p className="font-medium text-neutral-800 mt-0.5">
                      {formatDate(entry.lastRingAt)} at {formatTime(entry.lastRingAt)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Special Notes */}
            <div className="rounded-2xl border border-[#eadfd8] bg-[#faf7f5]/40 p-4 space-y-2">
              <h3 className="text-xs font-bold text-[#756c66] uppercase tracking-wider flex items-center gap-2">
                <MessageSquare className="size-3.5 text-[#9a3412]" />
                <span>Special Instructions</span>
              </h3>
              <p className="text-xs text-neutral-700 bg-white p-3 rounded-xl border border-[#eddcd4]">
                {entry.specialNotes ? entry.specialNotes : "No special notes or requests provided."}
              </p>
            </div>
          </div>

          {/* Footer Actions */}
          {!isTerminalState && (
            <div className="sticky bottom-0 z-10 p-5 bg-[#faf7f5] border-t border-[#eddcd4] space-y-2.5">
              {isOnline ? (
                <div className="grid grid-cols-2 gap-2.5">
                  {/* Ring Customer Button (Online guests only) */}
                  <Button
                    type="button"
                    onClick={() => onRingCustomer(entry)}
                    disabled={isRinging}
                    data-testid="drawer-ring-button"
                    className="rounded-xl h-10 text-xs font-bold bg-[#9a3412] hover:bg-[#7c2d12] text-white flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <Bell className="size-3.5" />
                    <span>
                      {isRinging ? "Ringing..." : isCalledOrRinging ? "Ring Again" : "Ring Guest"}
                    </span>
                  </Button>

                  {/* Assign Table Button */}
                  <Button
                    type="button"
                    onClick={() => onAssignTable(entry)}
                    data-testid="drawer-assign-button"
                    className="rounded-xl h-10 text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <UtensilsCrossed className="size-3.5" />
                    <span>Assign Table</span>
                  </Button>
                </div>
              ) : (
                <div>
                  {/* Assign Table Button (Full width for walk-in guests) */}
                  <Button
                    type="button"
                    onClick={() => onAssignTable(entry)}
                    data-testid="drawer-assign-button"
                    className="w-full rounded-xl h-10 text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <UtensilsCrossed className="size-3.5" />
                    <span>Assign Table</span>
                  </Button>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2.5">
                {/* Skip Party Button */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onSkipParty(entry)}
                  data-testid="drawer-skip-button"
                  className="rounded-xl h-9 text-xs font-bold border-[#eadfd8] text-neutral-700 hover:bg-white flex items-center justify-center gap-1.5"
                >
                  <FastForward className="size-3.5 text-amber-600" />
                  <span>Skip Party</span>
                </Button>

                {/* Cancel / No-Show Button */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onCancelEntry(entry)}
                  data-testid="drawer-cancel-button"
                  className="rounded-xl h-9 text-xs font-bold border-red-200 text-red-700 hover:bg-red-50 flex items-center justify-center gap-1.5"
                >
                  <UserX className="size-3.5 text-red-600" />
                  <span>No-Show / Cancel</span>
                </Button>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
