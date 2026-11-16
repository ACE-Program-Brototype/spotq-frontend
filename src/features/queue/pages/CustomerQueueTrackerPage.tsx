import { ArrowLeft, BellRing, RefreshCw, UtensilsCrossed } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { CUSTOMER_ROUTES } from "@/app/router/routes.constants";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button.variants";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { CustomerRingAlertModal } from "@/features/queue/components/CustomerRingAlertModal";
import { ActiveQueueTrackerCard } from "@/features/queue/components/tracker/ActiveQueueTrackerCard";
import { CancelledStatusCard } from "@/features/queue/components/tracker/CancelledStatusCard";
import { ConnectionStatusBadge } from "@/features/queue/components/tracker/ConnectionStatusBadge";
import { SeatedStatusCard } from "@/features/queue/components/tracker/SeatedStatusCard";
import { SkippedBanner } from "@/features/queue/components/tracker/SkippedBanner";
import { SkippedStatusCard } from "@/features/queue/components/tracker/SkippedStatusCard";
import { QUEUE_STATUS } from "@/features/queue/constants/queue.constants";
import { useCustomerQueueStatus } from "@/features/queue/hooks/use-customer-queue-status";
import { useLeaveQueue } from "@/features/queue/hooks/use-leave-queue";
import { useTrackerLiveState } from "@/features/queue/hooks/use-tracker-live-state";
import {
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

  const {
    connectionStatus,
    liveStatus,
    livePosition,
    livePeopleAhead,
    liveWaitMinutes,
    assignedTableNumber,
    skippedNotice,
    skippedReason,
    cancelledReason,
    liveRingData,
    isRingModalOpen,
    setIsRingModalOpen,
    initialJoinState,
  } = useTrackerLiveState(activeQueueEntryId, accessToken, initialData);

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
        <ActiveQueueTrackerCard
          queueNumber={queueNumber}
          partySize={partySize}
          effectiveAssignedTable={effectiveAssignedTable}
          effectivePosition={effectivePosition}
          effectivePeopleAhead={effectivePeopleAhead}
          effectiveInitialPosition={effectiveInitialPosition}
          effectiveWaitMinutes={effectiveWaitMinutes}
          canCancel={initialData?.canCancel !== false}
          isLeaving={leaveQueueMutation.isPending}
          onLeaveClick={() => setIsLeaveConfirmOpen(true)}
        />
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
