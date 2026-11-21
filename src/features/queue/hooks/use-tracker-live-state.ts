import { useEffect, useRef, useState } from "react";
import { QUEUE_STATUS } from "@/features/queue/constants/queue.constants";
import { useCustomerQueueSocket } from "@/features/queue/hooks/use-customer-queue-socket";
import type { CustomerQueueStatusSnapshot, QueueStatus } from "@/features/queue/types/queue.types";
import type { CustomerRingPayload } from "@/features/queue/types/ring-alert.types";
import { clearActiveCustomerTicket, resolveDisplayTableLabel } from "@/features/queue/utils/active-queue.utils";

export function useTrackerLiveState(
  activeQueueEntryId: string | null,
  accessToken: string | null,
  initialData?: CustomerQueueStatusSnapshot | null,
) {
  const [liveStatus, setLiveStatus] = useState<QueueStatus | null>(null);
  const [livePosition, setLivePosition] = useState<number | null>(null);
  const [livePeopleAhead, setLivePeopleAhead] = useState<number | null>(null);
  const [liveWaitMinutes, setLiveWaitMinutes] = useState<number | null | undefined>(undefined);
  const [assignedTableNumber, setAssignedTableNumber] = useState<string | null | undefined>(undefined);
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

  return {
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
  };
}

