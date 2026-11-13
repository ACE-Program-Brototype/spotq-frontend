import { ArrowLeft, BellRing, LogOut, RefreshCw, Users, UtensilsCrossed } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { CUSTOMER_ROUTES } from "@/app/router/routes.constants";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { CustomerRingAlertModal } from "@/features/queue/components/CustomerRingAlertModal";
import { CancelledStatusCard } from "@/features/queue/components/tracker/CancelledStatusCard";
import { CircularPositionBadge } from "@/features/queue/components/tracker/CircularPositionBadge";
import { ConnectionStatusBadge } from "@/features/queue/components/tracker/ConnectionStatusBadge";
import { EstimatedWaitChip } from "@/features/queue/components/tracker/EstimatedWaitChip";
import { QueueProgressBar } from "@/features/queue/components/tracker/QueueProgressBar";
import { SeatedStatusCard } from "@/features/queue/components/tracker/SeatedStatusCard";
import { SkippedBanner } from "@/features/queue/components/tracker/SkippedBanner";
import { SkippedStatusCard } from "@/features/queue/components/tracker/SkippedStatusCard";
import { QUEUE_STATUS } from "@/features/queue/constants/queue.constants";
import { useCustomerQueueSocket } from "@/features/queue/hooks/use-customer-queue-socket";
import { useCustomerQueueStatus } from "@/features/queue/hooks/use-customer-queue-status";
import { useLeaveQueue } from "@/features/queue/hooks/use-leave-queue";
import type { QueueStatus } from "@/features/queue/types/queue.types";
import type { CustomerRingPayload } from "@/features/queue/types/ring-alert.types";
import {
  clearActiveCustomerTicket,
  formatQueueNumber,
  getActiveCustomerTicket,
  resolveDisplayTableLabel,
} from "@/features/queue/utils/active-queue.utils";
import { ringMedia } from "@/features/queue/utils/ring-sound.utils";

export default function CustomerQueueTrackerPage() {
  const navigate = useNavigate();
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const [searchParams] = useSearchParams();
  const accessToken = useAuthStore((state) => state.accessToken);

  const queryQueueEntryId = searchParams.get("queueEntryId");
  const storedTicket = getActiveCustomerTicket();
  const matchingStoredTicket =
    storedTicket && storedTicket.restaurantId === restaurantId ? storedTicket : null;
  const activeQueueEntryId = queryQueueEntryId || matchingStoredTicket?.queueEntryId || null;

  const [isLeaveConfirmOpen, setIsLeaveConfirmOpen] = useState(false);

  const leaveQueueMutation = useLeaveQueue({
    onSuccess: () => {
      setIsLeaveConfirmOpen(false);
      if (restaurantId) {
        navigate(CUSTOMER_ROUTES.RESTAURANT_DETAIL(restaurantId));
      }
    },
  });

  const handleConfirmLeave = () => {
    if (!restaurantId || !activeQueueEntryId) return;
    leaveQueueMutation.mutate({
      restaurantId,
      queueEntryId: activeQueueEntryId,
    });
  };

  const {
    data: statusResponse,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useCustomerQueueStatus(restaurantId, activeQueueEntryId || undefined);

  const initialData = statusResponse?.data;

  const [liveStatus, setLiveStatus] = useState<QueueStatus | null>(null);
  const [livePosition, setLivePosition] = useState<number | null>(null);
  const [livePeopleAhead, setLivePeopleAhead] = useState<number | null>(null);
  const [liveWaitMinutes, setLiveWaitMinutes] = useState<number | null | undefined>(undefined);
  const [assignedTableNumber, setAssignedTableNumber] = useState<string | null | undefined>(
    undefined,
  );
  const [skippedNotice, setSkippedNotice] = useState<{
    eventId: number;
    reason?: string;
    position?: number;
  } | null>(null);
  const [skippedReason, setSkippedReason] = useState<string | undefined>(undefined);
  const [cancelledReason, setCancelledReason] = useState<string | undefined>(undefined);
  const [liveRingData, setLiveRingData] = useState<CustomerRingPayload | null>(null);
  const [isRingModalOpen, setIsRingModalOpen] = useState(false);
  const [initialJoinState, setInitialJoinState] = useState<{
    queueEntryId: string;
    position: number;
  } | null>(null);
  const lastSyncedEntryIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!initialData) return;

    setLiveStatus(null);
    setLivePosition(null);
    setLivePeopleAhead(null);
    setLiveWaitMinutes(undefined);
    setAssignedTableNumber(undefined);

    if (lastSyncedEntryIdRef.current !== initialData.queueEntryId) {
      lastSyncedEntryIdRef.current = initialData.queueEntryId;
      setSkippedNotice(null);
      setSkippedReason(undefined);
      setCancelledReason(undefined);
      setLiveRingData(null);
      setIsRingModalOpen(false);
      setInitialJoinState(
        typeof initialData.position === "number" && initialData.position > 0
          ? { queueEntryId: initialData.queueEntryId, position: initialData.position }
          : null,
      );
    }
  }, [initialData]);

  const { connectionStatus } = useCustomerQueueSocket(activeQueueEntryId, accessToken, {
    onPositionUpdated: (payload) => {
      setLivePosition(payload.position);
      setLivePeopleAhead(Math.max(0, payload.position - 1));
      setLiveWaitMinutes(payload.estimatedWaitMinutes);
    },
    onRing: (payload) => {
      setLiveStatus(QUEUE_STATUS.CALLED);
      setLiveRingData(payload);
      setIsRingModalOpen(true);
      const tableLabel = resolveDisplayTableLabel(
        payload.assignedTableNumber,
        payload.assignedTableIds,
      );
      if (tableLabel) {
        setAssignedTableNumber(tableLabel);
      }
    },
    onSkipped: (payload) => {
      if (payload.status === QUEUE_STATUS.SKIPPED && typeof payload.position !== "number") {
        setLiveStatus(QUEUE_STATUS.SKIPPED);
        setSkippedReason(payload.reason);
        setSkippedNotice(null);
        setIsRingModalOpen(false);
        clearActiveCustomerTicket();
        return;
      }

      setSkippedNotice((prev) => ({
        eventId: (prev?.eventId ?? 0) + 1,
        reason: payload.reason,
        position: typeof payload.position === "number" ? payload.position : undefined,
      }));
      if (typeof payload.position === "number") {
        setLivePosition(payload.position);
        setLivePeopleAhead(Math.max(0, payload.position - 1));
      }
    },
    onSeated: (payload) => {
      setLiveStatus(QUEUE_STATUS.SEATED);
      setIsRingModalOpen(false);
      const tableLabel = resolveDisplayTableLabel(
        payload?.tableNumber,
        payload?.tableIds ?? (payload?.tableId ? [payload.tableId] : null),
      );
      if (tableLabel) {
        setAssignedTableNumber(tableLabel);
      }
      clearActiveCustomerTicket();
    },
    onCancelled: (payload) => {
      setLiveStatus(
        payload?.status === QUEUE_STATUS.NO_SHOW ? QUEUE_STATUS.NO_SHOW : QUEUE_STATUS.CANCELLED,
      );
      setCancelledReason(payload?.reason);
      setSkippedNotice(null);
      setIsRingModalOpen(false);
      clearActiveCustomerTicket();
    },
  });

  const isMatchingStoredTicket = matchingStoredTicket?.queueEntryId === activeQueueEntryId;

  const restaurantName = initialData?.restaurantName || "Restaurant";
  const rawQueueNumber =
    initialData?.queueNumber ||
    (isMatchingStoredTicket ? matchingStoredTicket?.queueNumber : null) ||
    "—";
  const queueNumber = formatQueueNumber(rawQueueNumber) ?? "—";
  const partySize = initialData?.partySize || 1;

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[420px] px-3.5 sm:px-4 py-4 space-y-3">
        <Skeleton className="h-5 w-28 bg-[#eddcd4]/60 rounded-lg" />
        <Skeleton className="h-72 w-full rounded-2xl bg-[#faf7f5] border border-[#eddcd4]" />
      </div>
    );
  }

  if (isError || !activeQueueEntryId || !initialData) {
    return (
      <div className="mx-auto max-w-[420px] px-4 py-12 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-[#fcf5f0] text-[#9a3412]">
          <UtensilsCrossed className="size-6" />
        </div>
        <h2 className="mt-3 text-lg font-bold text-neutral-900">Queue Entry Not Found</h2>
        <p className="mt-1 text-xs text-neutral-500">
          We couldn't retrieve an active queue entry for this session.
        </p>
        <div className="mt-5 flex flex-col sm:flex-row justify-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isRefetching}
            className="border-[#eddcd4] text-xs h-8"
          >
            <RefreshCw className={`mr-1.5 size-3.5 ${isRefetching ? "animate-spin" : ""}`} />
            Try Again
          </Button>
          {restaurantId && (
            <Link
              to={CUSTOMER_ROUTES.RESTAURANT_DETAIL(restaurantId)}
              className={buttonVariants({
                variant: "default",
                size: "sm",
                className: "bg-[#2e1b12] text-white hover:bg-neutral-800 text-xs h-8",
              })}
            >
              Back to Restaurant
            </Link>
          )}
        </div>
      </div>
    );
  }

  const effectiveStatus = liveStatus ?? initialData.status ?? QUEUE_STATUS.WAITING;
  const isSeated = effectiveStatus === QUEUE_STATUS.SEATED;
  const isSkipped = effectiveStatus === QUEUE_STATUS.SKIPPED;
  const isCancelledOrNoShow =
    effectiveStatus === QUEUE_STATUS.CANCELLED || effectiveStatus === QUEUE_STATUS.NO_SHOW;
  const isTerminal = isSeated || isCancelledOrNoShow || isSkipped;
  const hasActiveRing =
    !isTerminal &&
    (effectiveStatus === QUEUE_STATUS.CALLED ||
      (effectiveStatus === QUEUE_STATUS.WAITING && Boolean(initialData.lastRingAt)));

  const effectivePosition = livePosition ?? initialData.position ?? null;
  const effectivePeopleAhead =
    livePeopleAhead ??
    initialData.peopleAhead ??
    (typeof effectivePosition === "number" && effectivePosition > 0
      ? Math.max(0, effectivePosition - 1)
      : null);
  const effectiveWaitMinutes =
    liveWaitMinutes !== undefined ? liveWaitMinutes : initialData.estimatedWaitMinutes;
  const effectiveAssignedTable =
    assignedTableNumber !== undefined
      ? assignedTableNumber
      : resolveDisplayTableLabel(
          initialData.assignedTableNumber,
          initialData.assignedTableId ? [initialData.assignedTableId] : null,
        );
  const effectiveInitialPosition =
    initialJoinState?.queueEntryId === activeQueueEntryId
      ? initialJoinState.position
      : typeof initialData.position === "number" && initialData.position > 0
        ? initialData.position
        : null;

  return (
    <div className="mx-auto max-w-[420px] px-3 sm:px-4 py-2 sm:py-4 space-y-2.5 sm:space-y-3 pb-20 sm:pb-8 animate-in fade-in duration-200">
      <div className="flex items-center justify-between gap-3">
        <Link
          to={CUSTOMER_ROUTES.RESTAURANT_DETAIL(restaurantId || "")}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900 transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          <span className="truncate max-w-[200px]">{restaurantName}</span>
        </Link>
        <div className="flex items-center gap-1.5">
          <ConnectionStatusBadge status={connectionStatus} />
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => refetch()}
            disabled={isRefetching}
            title="Refresh status"
            aria-label="Refresh status"
            className="text-neutral-500 hover:text-neutral-900 cursor-pointer size-7"
          >
            <RefreshCw className={`size-3.5 ${isRefetching ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {skippedNotice && !isTerminal && (
        <SkippedBanner
          key={skippedNotice.eventId}
          reason={skippedNotice.reason}
          position={skippedNotice.position}
        />
      )}

      {hasActiveRing && (
        <div
          role="status"
          className="rounded-xl border border-emerald-300 bg-emerald-50/90 p-2.5 sm:p-3 text-emerald-950 shadow-xs flex items-center justify-between gap-2.5"
        >
          <div className="flex items-start gap-2.5">
            <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-xs">
              <BellRing className="size-3.5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-emerald-950">
                Table Ready — Head to Host Stand
              </h4>
              <p className="mt-0.5 text-[11px] text-emerald-800 leading-tight">
                {liveRingData?.message ||
                  "Staff has called your party. Please check in at the host stand now."}
              </p>
            </div>
          </div>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => {
              ringMedia.stopAll();
              setIsRingModalOpen(false);
            }}
            className="shrink-0 border-emerald-300 bg-white text-emerald-900 hover:bg-emerald-100 text-[11px] font-semibold h-7 px-2 rounded-lg cursor-pointer"
          >
            Silence
          </Button>
        </div>
      )}

      {isSeated && (
        <SeatedStatusCard
          restaurantId={restaurantId || ""}
          restaurantName={restaurantName}
          tableNumber={effectiveAssignedTable}
        />
      )}

      {isSkipped && (
        <SkippedStatusCard
          restaurantId={restaurantId || ""}
          restaurantName={restaurantName}
          reason={skippedReason}
        />
      )}

      {isCancelledOrNoShow && (
        <CancelledStatusCard
          restaurantId={restaurantId || ""}
          restaurantName={restaurantName}
          reason={cancelledReason}
        />
      )}

      {!isTerminal && (
        <Card className="relative overflow-hidden rounded-2xl border border-[#eddcd4] bg-white p-3.5 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#eddcd4]/60 pb-2.5 sm:pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                Queue Number
              </span>
              <div className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight leading-none mt-0.5">
                {queueNumber}
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              {effectiveAssignedTable && (
                <div className="flex items-center gap-1 rounded-lg bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-800 border border-emerald-200/60">
                  <span>Table: {effectiveAssignedTable}</span>
                </div>
              )}
              <div className="flex items-center gap-1 rounded-lg bg-[#fcf5f0] px-2 py-1 text-[11px] font-semibold text-[#9a3412] border border-[#eddcd4]">
                <Users className="size-3 text-[#e8631b]" />
                <span>
                  {partySize} {partySize === 1 ? "Guest" : "Guests"}
                </span>
              </div>
            </div>
          </div>

          <div className="py-2.5 sm:py-3.5">
            <CircularPositionBadge
              position={effectivePosition}
              peopleAhead={effectivePeopleAhead}
            />
          </div>

          <div className="pt-2 pb-2.5 border-t border-[#eddcd4]/50">
            <QueueProgressBar
              currentPosition={effectivePosition}
              initialPosition={effectiveInitialPosition}
            />
          </div>

          <div className="flex items-center justify-between gap-2 pt-1">
            <EstimatedWaitChip estimatedWaitMinutes={effectiveWaitMinutes} />
            <span className="text-[10px] text-neutral-400">Auto-updates live</span>
          </div>

          {initialData?.canCancel !== false && (
            <div className="pt-2.5 mt-2.5 border-t border-dashed border-[#eddcd4] flex items-center justify-between gap-2">
              <span className="text-[11px] text-neutral-500">Need to cancel?</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsLeaveConfirmOpen(true)}
                disabled={leaveQueueMutation.isPending}
                className="border-[#eddcd4] text-neutral-600 hover:text-red-600 hover:bg-red-50 hover:border-red-200 text-xs font-semibold h-7.5 px-2.5 rounded-xl transition-all cursor-pointer"
              >
                <LogOut className="mr-1 size-3" />
                Leave Queue
              </Button>
            </div>
          )}
        </Card>
      )}

      <ConfirmDialog
        open={isLeaveConfirmOpen}
        onOpenChange={setIsLeaveConfirmOpen}
        title="Leave the Queue?"
        description="Are you sure you want to leave the queue? You will lose your current spot in line and need to rejoin if you change your mind."
        confirmText="Leave Queue"
        cancelText="Stay in Line"
        confirmVariant="destructive"
        isLoading={leaveQueueMutation.isPending}
        loadingText="Leaving Queue..."
        onConfirm={handleConfirmLeave}
        onCancel={() => setIsLeaveConfirmOpen(false)}
      />

      <CustomerRingAlertModal
        isOpen={isRingModalOpen && !isTerminal}
        onClose={() => setIsRingModalOpen(false)}
        message={liveRingData?.message}
        ringCount={liveRingData?.ringCount ?? 1}
        assignedTableIds={liveRingData?.assignedTableIds}
        queueNumber={queueNumber !== "—" ? queueNumber.replace(/^#/, "") : undefined}
      />
    </div>
  );
}
