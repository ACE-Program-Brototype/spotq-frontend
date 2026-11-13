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
      <div className="mx-auto max-w-lg px-4 py-8 space-y-6">
        <Skeleton className="h-6 w-36 bg-stone-200" />
        <Skeleton className="h-44 w-full rounded-3xl bg-stone-200" />
        <Skeleton className="h-64 w-full rounded-3xl bg-stone-200" />
      </div>
    );
  }

  if (isError || !activeQueueEntryId || !initialData) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-stone-100 text-stone-500">
          <UtensilsCrossed className="h-7 w-7" />
        </div>
        <h2 className="mt-4 text-xl font-bold text-stone-900">Queue Entry Not Found</h2>
        <p className="mt-1 text-sm text-stone-600">
          We couldn't retrieve an active queue entry for this session.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={isRefetching}
            className="border-stone-300"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefetching ? "animate-spin" : ""}`} />
            Try Again
          </Button>
          {restaurantId && (
            <Link
              to={CUSTOMER_ROUTES.RESTAURANT_DETAIL(restaurantId)}
              className={buttonVariants({
                variant: "default",
                className: "bg-stone-900 text-white hover:bg-stone-800",
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
    <div className="mx-auto max-w-lg px-3.5 sm:px-4 py-3 sm:py-6 space-y-3.5 sm:space-y-5 pb-24 sm:pb-12 animate-in fade-in duration-200">
      <div className="flex items-center justify-between gap-4">
        <Link
          to={CUSTOMER_ROUTES.RESTAURANT_DETAIL(restaurantId || "")}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-stone-600 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{restaurantName}</span>
        </Link>
        <div className="flex items-center gap-2">
          <ConnectionStatusBadge status={connectionStatus} />
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => refetch()}
            disabled={isRefetching}
            title="Refresh status"
            aria-label="Refresh status"
            className="text-stone-500 hover:text-stone-900 cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefetching ? "animate-spin" : ""}`} />
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
          className="rounded-2xl border border-emerald-300 bg-emerald-50/90 p-3.5 sm:p-4 text-emerald-950 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
              <BellRing className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-emerald-950">
                Table Ready — Please Head to the Host Stand
              </h4>
              <p className="mt-0.5 text-[11px] sm:text-xs text-emerald-800 leading-relaxed">
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
            className="shrink-0 border-emerald-300 bg-white text-emerald-900 hover:bg-emerald-100 text-xs font-semibold h-7.5 sm:h-8 rounded-xl cursor-pointer"
          >
            Silence Alert
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
        <div className="space-y-4 sm:space-y-5">
          <Card className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-stone-200/80 bg-white p-4 sm:p-7 shadow-lg sm:shadow-xl">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3 sm:pb-4">
              <div>
                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Queue Number
                </span>
                <div className="text-xl sm:text-2xl lg:text-3xl font-black text-stone-900">{queueNumber}</div>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                {effectiveAssignedTable && (
                  <div className="flex items-center gap-1 sm:gap-1.5 rounded-lg sm:rounded-xl bg-emerald-50 px-2 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs font-semibold text-emerald-800 border border-emerald-200/60">
                    <span>Table: {effectiveAssignedTable}</span>
                  </div>
                )}
                <div className="flex items-center gap-1 sm:gap-1.5 rounded-lg sm:rounded-xl bg-orange-50 px-2 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs font-semibold text-orange-800 border border-orange-200/60">
                  <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-orange-600" />
                  <span>
                    {partySize} {partySize === 1 ? "Guest" : "Guests"}
                  </span>
                </div>
              </div>
            </div>

            <div className="py-4 sm:py-6">
              <CircularPositionBadge
                position={effectivePosition}
                peopleAhead={effectivePeopleAhead}
              />
            </div>

            <div className="pt-2 pb-3.5 sm:pb-5 border-t border-stone-100">
              <QueueProgressBar
                currentPosition={effectivePosition}
                initialPosition={effectiveInitialPosition}
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3 pt-1 sm:pt-2">
              <EstimatedWaitChip estimatedWaitMinutes={effectiveWaitMinutes} />
              <span className="text-[11px] sm:text-xs text-stone-500">Auto-updates in real time</span>
            </div>

            {initialData?.canCancel !== false && (
              <div className="pt-3.5 sm:pt-5 mt-3.5 sm:mt-5 border-t border-dashed border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-3">
                <span className="text-[11px] sm:text-xs text-stone-500">Need to cancel or change plans?</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsLeaveConfirmOpen(true)}
                  disabled={leaveQueueMutation.isPending}
                  className="w-full sm:w-auto border-stone-200 text-stone-600 hover:text-red-600 hover:bg-red-50 hover:border-red-200 text-xs font-semibold h-8 px-3 rounded-xl transition-all cursor-pointer"
                >
                  <LogOut className="mr-1.5 h-3.5 w-3.5" />
                  Leave Queue
                </Button>
              </div>
            )}
          </Card>
        </div>
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
