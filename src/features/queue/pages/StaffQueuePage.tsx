import { AlertCircle, RefreshCw, UserPlus } from "lucide-react";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { AssignTableModal } from "@/features/queue/components/AssignTableModal";
import { CancelQueueEntryModal } from "@/features/queue/components/CancelQueueEntryModal";
import { QueueEntryDetailDrawer } from "@/features/queue/components/QueueEntryDetailDrawer";
import { QueueFilterBar } from "@/features/queue/components/QueueFilterBar";
import { QueueStatisticsBar } from "@/features/queue/components/QueueStatisticsBar";
import { SkipQueueEntryModal } from "@/features/queue/components/SkipQueueEntryModal";
import { StaffLiveQueueTable } from "@/features/queue/components/StaffLiveQueueTable";
import { WalkInRegistrationModal } from "@/features/queue/components/WalkInRegistrationModal";
import { QUEUE_MESSAGES } from "@/features/queue/constants/queue.constants";
import { useQueueActions } from "@/features/queue/hooks/use-queue-actions";
import { useStaffLiveQueue } from "@/features/queue/hooks/use-staff-live-queue";
import { useStaffQueueSocket } from "@/features/queue/hooks/use-staff-queue-socket";
import type {
  QueueCancelReason,
  QueueEntry,
  StaffLiveQueueEntry,
} from "@/features/queue/types/queue.types";

export default function StaffQueuePage() {
  const user = useAuthStore((state) => state.user);
  const restaurantId = user?.restaurantId || "";

  // Modal and drawer state
  const [isWalkInModalOpen, setIsWalkInModalOpen] = useState(false);
  const [selectedEntryForAssign, setSelectedEntryForAssign] = useState<QueueEntry | null>(null);
  const [selectedEntryForSkip, setSelectedEntryForSkip] = useState<StaffLiveQueueEntry | null>(
    null,
  );
  const [selectedEntryForCancel, setSelectedEntryForCancel] = useState<StaffLiveQueueEntry | null>(
    null,
  );
  const [selectedEntryForDetail, setSelectedEntryForDetail] = useState<StaffLiveQueueEntry | null>(
    null,
  );

  // Live Queue Query & Filtering
  const {
    filteredEntries,
    statistics,
    partySizeFilter,
    setPartySizeFilter,
    registrationTypeFilter,
    setRegistrationTypeFilter,
    searchQuery,
    setSearchQuery,
    isLoading,
    isError,
    error,
    refetch,
  } = useStaffLiveQueue({ restaurantId });

  // Real-time WebSocket connection to /ws/queues
  const { isConnected } = useStaffQueueSocket(restaurantId);

  // Queue actions (ring, skip, cancel mutations)
  const { ringCustomer, activeRingingId, skipParty, isSkipping, cancelQueueEntry, isCancelling } =
    useQueueActions(restaurantId);

  // Convert StaffLiveQueueEntry to QueueEntry required by AssignTableModal
  const handleAssignClick = useCallback(
    (entry: StaffLiveQueueEntry) => {
      setSelectedEntryForAssign({
        queueEntryId: entry.queueEntryId,
        restaurantId,
        userId: null,
        guestName: entry.guestName,
        guestPhone: entry.guestPhone ?? null,
        partySize: entry.partySize,
        specialNotes: entry.specialNotes ?? null,
        registrationType: entry.registrationType,
        position: entry.position ?? 0,
        estimatedWaitMinutes: null,
        status: entry.status,
        joinedAt: entry.joinedAt,
        queueNumber: entry.queueNumber,
      });
    },
    [restaurantId],
  );

  const handleRingClick = useCallback(
    async (entry: StaffLiveQueueEntry) => {
      try {
        await ringCustomer(entry.queueEntryId);
      } catch {
        // Handled in mutation hook
      }
    },
    [ringCustomer],
  );

  const handleConfirmSkip = useCallback(
    async (skipPositions: number, reason: string) => {
      if (!selectedEntryForSkip) return;
      await skipParty({
        queueEntryId: selectedEntryForSkip.queueEntryId,
        input: { skipPositions, reason },
      });
      setSelectedEntryForSkip(null);
      // Close detail drawer if currently open for this entry
      if (selectedEntryForDetail?.queueEntryId === selectedEntryForSkip.queueEntryId) {
        setSelectedEntryForDetail(null);
      }
    },
    [selectedEntryForSkip, selectedEntryForDetail, skipParty],
  );

  const handleConfirmCancel = useCallback(
    async (reason: QueueCancelReason, notes?: string) => {
      if (!selectedEntryForCancel) return;
      await cancelQueueEntry({
        queueEntryId: selectedEntryForCancel.queueEntryId,
        input: { reason, notes },
      });
      setSelectedEntryForCancel(null);
      // Close detail drawer if currently open for this entry
      if (selectedEntryForDetail?.queueEntryId === selectedEntryForCancel.queueEntryId) {
        setSelectedEntryForDetail(null);
      }
    },
    [selectedEntryForCancel, selectedEntryForDetail, cancelQueueEntry],
  );

  return (
    <div className="space-y-6 max-w-full" data-testid="staff-queue-page">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-[#eadfd8] bg-white p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#1c1714]">
              Queue Management
            </h1>
            <span
              data-testid="header-live-badge"
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold border transition-colors ${
                isConnected
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-amber-50 text-amber-700 border-amber-200"
              }`}
            >
              <span
                className={`size-1.5 rounded-full ${
                  isConnected ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
                }`}
              />
              <span>{isConnected ? "Live Host Terminal" : "Connecting..."}</span>
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-[#756c66]">
            Real-time guest waitlist monitoring, response alerts, and seating management.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => refetch()}
            className="h-11 px-3.5 rounded-xl border-[#eadfd8] text-neutral-700 hover:bg-[#faf7f5]"
            title="Refresh Queue"
          >
            <RefreshCw className="size-4" />
          </Button>

          <Button
            type="button"
            onClick={() => setIsWalkInModalOpen(true)}
            data-testid="header-add-queue-button"
            className="h-11 px-5 rounded-xl bg-[#9a3412] hover:bg-[#7c2d12] text-white font-bold shadow-sm transition-all flex items-center gap-2"
          >
            <UserPlus className="size-4.5" />
            <span>Add Walk-In</span>
          </Button>
        </div>
      </div>

      {/* Overview Statistics Bar */}
      <QueueStatisticsBar statistics={statistics} />

      {/* Filter & Search Bar */}
      <QueueFilterBar
        registrationTypeFilter={registrationTypeFilter}
        onRegistrationTypeChange={setRegistrationTypeFilter}
        partySizeFilter={partySizeFilter}
        onPartySizeChange={setPartySizeFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddWalkInClick={() => setIsWalkInModalOpen(true)}
        isConnected={isConnected}
      />

      {/* Error Alert if query fails */}
      {isError && (
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 p-4 flex items-center justify-between text-xs text-red-800"
        >
          <div className="flex items-center gap-2.5">
            <AlertCircle className="size-4 text-red-600 shrink-0" />
            <span>{error?.message || QUEUE_MESSAGES.FETCH_QUEUE_FAILED}</span>
          </div>
          <Button
            type="button"
            size="sm"
            onClick={() => refetch()}
            className="h-7 px-3 text-xs bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold"
          >
            Retry
          </Button>
        </div>
      )}

      {/* Live Queue Table */}
      {!isError && (
        <StaffLiveQueueTable
          entries={filteredEntries}
          isLoading={isLoading}
          activeRingingId={activeRingingId}
          onSelectEntry={(entry) => setSelectedEntryForDetail(entry)}
          onRingCustomer={handleRingClick}
          onAssignTable={handleAssignClick}
          onSkipParty={(entry) => setSelectedEntryForSkip(entry)}
          onCancelEntry={(entry) => setSelectedEntryForCancel(entry)}
          onAddWalkInClick={() => setIsWalkInModalOpen(true)}
        />
      )}

      {/* Queue Entry Detail Drawer */}
      <QueueEntryDetailDrawer
        entry={selectedEntryForDetail}
        onClose={() => setSelectedEntryForDetail(null)}
        onRingCustomer={handleRingClick}
        onAssignTable={(entry) => {
          setSelectedEntryForDetail(null);
          handleAssignClick(entry);
        }}
        onSkipParty={(entry) => {
          setSelectedEntryForDetail(null);
          setSelectedEntryForSkip(entry);
        }}
        onCancelEntry={(entry) => {
          setSelectedEntryForDetail(null);
          setSelectedEntryForCancel(entry);
        }}
        isRinging={activeRingingId === selectedEntryForDetail?.queueEntryId}
      />

      {/* Walk-In Registration Modal */}
      <WalkInRegistrationModal
        isOpen={isWalkInModalOpen}
        onClose={() => setIsWalkInModalOpen(false)}
        restaurantId={restaurantId}
        onSuccess={() => {
          refetch();
        }}
      />

      {/* Assign Table Modal */}
      {selectedEntryForAssign && (
        <AssignTableModal
          isOpen={Boolean(selectedEntryForAssign)}
          onClose={() => setSelectedEntryForAssign(null)}
          restaurantId={restaurantId}
          queueEntry={selectedEntryForAssign}
          onSuccess={() => {
            setSelectedEntryForAssign(null);
            refetch();
          }}
        />
      )}

      {/* Skip Party Modal */}
      <SkipQueueEntryModal
        isOpen={Boolean(selectedEntryForSkip)}
        onClose={() => setSelectedEntryForSkip(null)}
        queueEntry={selectedEntryForSkip}
        onConfirm={handleConfirmSkip}
        isSubmitting={isSkipping}
      />

      {/* Cancel / Mark No-Show Modal */}
      <CancelQueueEntryModal
        isOpen={Boolean(selectedEntryForCancel)}
        onClose={() => setSelectedEntryForCancel(null)}
        queueEntry={selectedEntryForCancel}
        onConfirm={handleConfirmCancel}
        isSubmitting={isCancelling}
      />
    </div>
  );
}
