import { ArrowLeft, LogOut, RefreshCw, Users, UtensilsCrossed } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { CUSTOMER_ROUTES } from "@/app/router/routes.constants";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { CancelledStatusCard } from "../components/tracker/CancelledStatusCard";
import { CircularPositionBadge } from "../components/tracker/CircularPositionBadge";
import { ConnectionStatusBadge } from "../components/tracker/ConnectionStatusBadge";
import { EstimatedWaitChip } from "../components/tracker/EstimatedWaitChip";
import { QueueProgressBar } from "../components/tracker/QueueProgressBar";
import { SeatedStatusCard } from "../components/tracker/SeatedStatusCard";
import { SkippedBanner } from "../components/tracker/SkippedBanner";
import { useCustomerQueueSocket } from "../hooks/use-customer-queue-socket";
import { useCustomerQueueStatus } from "../hooks/use-customer-queue-status";
import { useLeaveQueue } from "../hooks/use-leave-queue";
import type { QueueStatus } from "../types/queue.types";
import { clearActiveCustomerTicket, getActiveCustomerTicket } from "../utils/active-queue.utils";

export default function CustomerQueueTrackerPage() {
  const navigate = useNavigate();
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const [searchParams] = useSearchParams();
  const accessToken = useAuthStore((state) => state.accessToken);

  const queryQueueEntryId = searchParams.get("queueEntryId");
  const [activeQueueEntryId, setActiveQueueEntryId] = useState<string | null>(() => {
    if (queryQueueEntryId) return queryQueueEntryId;
    const stored = getActiveCustomerTicket();
    return stored?.queueEntryId || null;
  });

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

  useEffect(() => {
    if (queryQueueEntryId) {
      setActiveQueueEntryId(queryQueueEntryId);
    }
  }, [queryQueueEntryId]);

  const {
    data: statusResponse,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useCustomerQueueStatus(restaurantId, activeQueueEntryId || undefined);

  const initialData = statusResponse?.data;

  const [liveStatus, setLiveStatus] = useState<QueueStatus | null>(null);
  const [livePosition, setLivePosition] = useState<number>(1);
  const [livePeopleAhead, setLivePeopleAhead] = useState<number>(0);
  const [liveWaitMinutes, setLiveWaitMinutes] = useState<number | null>(null);
  const [assignedTableNumber, setAssignedTableNumber] = useState<string | null>(null);
  const [skippedNotice, setSkippedNotice] = useState<{ reason?: string; position?: number } | null>(
    null,
  );
  const [cancelledReason, setCancelledReason] = useState<string | undefined>(undefined);
  const [initialJoinPosition, setInitialJoinPosition] = useState<number | null>(null);

  useEffect(() => {
    if (initialData) {
      setLiveStatus(initialData.status);
      setLivePosition(initialData.position);
      setLivePeopleAhead(initialData.peopleAhead);
      setLiveWaitMinutes(initialData.estimatedWaitMinutes);
      setAssignedTableNumber(initialData.assignedTableNumber);
      if (initialJoinPosition === null) {
        setInitialJoinPosition(initialData.position);
      }
    }
  }, [initialData, initialJoinPosition]);

  const { connectionStatus } = useCustomerQueueSocket(activeQueueEntryId, accessToken, {
    onPositionUpdated: (payload) => {
      setLivePosition(payload.position);
      setLivePeopleAhead(Math.max(0, payload.position - 1));
      setLiveWaitMinutes(payload.estimatedWaitMinutes);
    },
    onRing: (payload) => {
      setLiveStatus("CALLED");
      if (payload.assignedTableNumber) {
        setAssignedTableNumber(payload.assignedTableNumber);
      }
    },
    onSkipped: (payload) => {
      setSkippedNotice({ reason: payload.reason, position: payload.position });
      if (typeof payload.position === "number") {
        setLivePosition(payload.position);
        setLivePeopleAhead(Math.max(0, payload.position - 1));
      }
    },
    onSeated: (payload) => {
      setLiveStatus("SEATED");
      if (payload?.tableNumber) {
        setAssignedTableNumber(payload.tableNumber);
      }
      clearActiveCustomerTicket();
    },
    onCancelled: (payload) => {
      setLiveStatus("CANCELLED");
      setCancelledReason(payload?.reason);
      setSkippedNotice(null);
      clearActiveCustomerTicket();
    },
  });

  const storedTicket = getActiveCustomerTicket();
  const isMatchingStoredTicket = storedTicket?.queueEntryId === activeQueueEntryId;

  const restaurantName = initialData?.restaurantName || "Restaurant";
  const rawQueueNumber =
    initialData?.queueNumber || (isMatchingStoredTicket ? storedTicket?.queueNumber : null) || "—";
  const queueNumber =
    rawQueueNumber !== "—"
      ? rawQueueNumber.startsWith("#")
        ? rawQueueNumber
        : `#${rawQueueNumber}`
      : "—";
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

  if (isError || !activeQueueEntryId) {
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

  const effectiveStatus = liveStatus || initialData?.status || "WAITING";

  return (
    <div className="mx-auto max-w-lg px-4 py-6 sm:py-8 space-y-6 animate-in fade-in duration-200">
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
            className="text-stone-500 hover:text-stone-900"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefetching ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {skippedNotice && effectiveStatus === "WAITING" && (
        <SkippedBanner reason={skippedNotice.reason} position={skippedNotice.position} />
      )}

      {effectiveStatus === "SEATED" && (
        <SeatedStatusCard
          restaurantId={restaurantId || ""}
          restaurantName={restaurantName}
          tableNumber={assignedTableNumber}
        />
      )}

      {(effectiveStatus === "CANCELLED" || effectiveStatus === "NO_SHOW") && (
        <CancelledStatusCard
          restaurantId={restaurantId || ""}
          restaurantName={restaurantName}
          reason={cancelledReason}
        />
      )}

      {effectiveStatus !== "SEATED" &&
        effectiveStatus !== "CANCELLED" &&
        effectiveStatus !== "NO_SHOW" && (
          <div className="space-y-5">
            <Card className="relative overflow-hidden rounded-3xl border border-stone-200/80 bg-white p-6 sm:p-8 shadow-xl">
              <div className="flex items-center justify-between border-b border-stone-100 pb-5">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                    Queue Number
                  </span>
                  <div className="text-2xl sm:text-3xl font-black text-stone-900">
                    {queueNumber}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {assignedTableNumber && (
                    <div className="flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 border border-emerald-200/60">
                      <span>Table: {assignedTableNumber}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 rounded-xl bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-800 border border-orange-200/60">
                    <Users className="h-4 w-4 text-orange-600" />
                    <span>
                      {partySize} {partySize === 1 ? "Guest" : "Guests"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="py-8">
                <CircularPositionBadge position={livePosition} peopleAhead={livePeopleAhead} />
              </div>

              <div className="pt-2 pb-5 border-t border-stone-100">
                <QueueProgressBar
                  currentPosition={livePosition}
                  initialPosition={initialJoinPosition}
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <EstimatedWaitChip estimatedWaitMinutes={liveWaitMinutes} />
                <span className="text-xs text-stone-500">Auto-updates in real time</span>
              </div>

              {initialData?.canCancel !== false && (
                <div className="pt-5 mt-5 border-t border-dashed border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <span className="text-xs text-stone-500">Need to cancel or change plans?</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsLeaveConfirmOpen(true)}
                    disabled={leaveQueueMutation.isPending}
                    className="w-full sm:w-auto border-stone-200 text-stone-600 hover:text-red-600 hover:bg-red-50 hover:border-red-200 text-xs font-semibold h-8 px-3 rounded-xl transition-all"
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
    </div>
  );
}
