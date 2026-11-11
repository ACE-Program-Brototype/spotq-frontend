import { useCallback, useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import env from "@/config/env";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { getOrRefreshAccessToken } from "@/lib/api/auth-refresh";
import {
  QUEUE_WS_CONFIG,
  QUEUE_WS_EVENTS,
  SOCKET_CONNECTION_STATUS,
  type SocketConnectionStatus,
} from "../constants/websocket.constants";
import type {
  QueueEntryCancelledPayload,
  QueueEntrySeatedPayload,
  QueueEntrySkippedPayload,
  QueuePositionUpdatedPayload,
} from "../types/queue.types";
import type { CustomerRingPayload } from "../types/ring-alert.types";
import { ringMedia } from "../utils/ring-sound.utils";

export type { SocketConnectionStatus };

export interface UseCustomerQueueSocketOptions {
  onRing?: (payload: CustomerRingPayload) => void;
  onPositionUpdated?: (payload: QueuePositionUpdatedPayload) => void;
  onSkipped?: (payload: QueueEntrySkippedPayload) => void;
  onSeated?: (payload: QueueEntrySeatedPayload) => void;
  onCancelled?: (payload: QueueEntryCancelledPayload) => void;
  onConnectionChange?: (status: SocketConnectionStatus) => void;
}

export function useCustomerQueueSocket(
  queueEntryId?: string | null,
  accessToken?: string | null,
  options?: UseCustomerQueueSocketOptions,
) {
  const authStoreToken = useAuthStore((state) => state.accessToken);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [resolvedToken, setResolvedToken] = useState<string | null>(
    accessToken || authStoreToken || null,
  );
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<SocketConnectionStatus>(
    SOCKET_CONNECTION_STATUS.DISCONNECTED,
  );
  const [lastRingData, setLastRingData] = useState<CustomerRingPayload | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const lastProcessedRingKeyRef = useRef<string | null>(null);

  const optionsRef = useRef(options);
  optionsRef.current = options;

  const updateStatus = useCallback((status: SocketConnectionStatus) => {
    setConnectionStatus(status);
    setIsConnected(status === SOCKET_CONNECTION_STATUS.CONNECTED);
    optionsRef.current?.onConnectionChange?.(status);
  }, []);

  useEffect(() => {
    let isCancelled = false;
    const currentToken = accessToken || authStoreToken;
    if (currentToken) {
      setResolvedToken(currentToken);
      return;
    }

    if (isAuthenticated) {
      getOrRefreshAccessToken()
        .then((freshToken) => {
          if (!isCancelled && freshToken) {
            setResolvedToken(freshToken);
          }
        })
        .catch((err) => {
          if (env.isDev) {
            console.warn("[Socket] Failed to refresh access token for customer queue socket:", err);
          }
        });
    }

    return () => {
      isCancelled = true;
    };
  }, [accessToken, authStoreToken, isAuthenticated]);

  useEffect(() => {
    if (!queueEntryId) {
      return;
    }

    if (!resolvedToken) {
      return;
    }

    updateStatus(SOCKET_CONNECTION_STATUS.CONNECTING);

    const queryParams: Record<string, string> = {
      ticketId: queueEntryId,
      token: resolvedToken,
    };

    const socket: Socket = io(env.wsUrl, {
      path: QUEUE_WS_CONFIG.DEFAULT_PATH,
      transports: ["websocket", "polling"],
      withCredentials: true,
      query: queryParams,
      auth: { token: resolvedToken },
      extraHeaders: { Authorization: `Bearer ${resolvedToken}` },
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    socketRef.current = socket;

    const handleConnectError = (error: Error) => {
      if (env.isDev) {
        console.warn(`[Socket] Connection error: ${error.message}`);
      }
      updateStatus(SOCKET_CONNECTION_STATUS.RECONNECTING);
    };

    const handleReconnectAttempt = () => {
      updateStatus(SOCKET_CONNECTION_STATUS.RECONNECTING);
    };

    const handleConnect = () => {
      updateStatus(SOCKET_CONNECTION_STATUS.CONNECTED);

      socket.emit(
        QUEUE_WS_EVENTS.JOIN_TICKET,
        { ticketId: queueEntryId },
        (response?: { success: boolean; room?: string; error?: string }) => {
          if (response?.success) {
            if (env.isDev) {
              console.log(
                `[Socket] Joined customer room ${response.room || `ticket:${queueEntryId}`}`,
              );
            }
          } else if (response?.error) {
            if (env.isDev) {
              console.warn(`[Socket] Failed to join ticket room: ${response.error}`);
            }
          }
        },
      );
    };

    const handleDisconnect = (reason: string) => {
      updateStatus(SOCKET_CONNECTION_STATUS.DISCONNECTED);
      if (env.isDev) {
        console.log(`[Socket] Disconnected: ${reason}`);
      }
    };

    socket.on(QUEUE_WS_EVENTS.CONNECT_ERROR, handleConnectError);
    socket.io?.on(QUEUE_WS_EVENTS.RECONNECT_ATTEMPT, handleReconnectAttempt);
    socket.on(QUEUE_WS_EVENTS.CONNECT, handleConnect);
    socket.on(QUEUE_WS_EVENTS.DISCONNECT, handleDisconnect);

    const handleRingTriggered = (data: CustomerRingPayload) => {
      if (!data || data.queueEntryId !== queueEntryId) return;

      const ringKey = `${data.queueEntryId}_${data.ringCount || 1}_${data.lastRingedAt || ""}`;
      if (lastProcessedRingKeyRef.current === ringKey) return;
      lastProcessedRingKeyRef.current = ringKey;

      setLastRingData(data);
      ringMedia.playChime();
      ringMedia.triggerVibration([250, 100, 250, 100, 400]);

      optionsRef.current?.onRing?.(data);
    };

    const handlePositionUpdated = (payload: QueuePositionUpdatedPayload) => {
      if (!payload || (payload.queueEntryId && payload.queueEntryId !== queueEntryId)) return;
      optionsRef.current?.onPositionUpdated?.(payload);
    };

    const handleSkipped = (payload: QueueEntrySkippedPayload) => {
      if (!payload || (payload.queueEntryId && payload.queueEntryId !== queueEntryId)) return;
      optionsRef.current?.onSkipped?.(payload);
    };

    const handleSeated = (payload: QueueEntrySeatedPayload) => {
      if (payload?.queueEntryId && payload.queueEntryId !== queueEntryId) return;
      ringMedia.stopAll();
      optionsRef.current?.onSeated?.(payload);
    };

    const handleCancelled = (payload: QueueEntryCancelledPayload) => {
      if (payload?.queueEntryId && payload.queueEntryId !== queueEntryId) return;
      ringMedia.stopAll();
      optionsRef.current?.onCancelled?.(payload);
    };

    socket.on(QUEUE_WS_EVENTS.TICKET_CALLED, handleRingTriggered);
    socket.on(QUEUE_WS_EVENTS.CUSTOMER_RING_TRIGGERED, handleRingTriggered);

    socket.on(QUEUE_WS_EVENTS.QUEUE_POSITION_UPDATED, handlePositionUpdated);
    socket.on(QUEUE_WS_EVENTS.QUEUE_POSITION_UPDATED_ALT, handlePositionUpdated);

    socket.on(QUEUE_WS_EVENTS.QUEUE_ENTRY_SKIPPED, handleSkipped);

    socket.on(QUEUE_WS_EVENTS.TICKET_SEATED, handleSeated);
    socket.on(QUEUE_WS_EVENTS.QUEUE_ENTRY_SEATED, handleSeated);

    socket.on(QUEUE_WS_EVENTS.TICKET_CANCELLED, handleCancelled);
    socket.on(QUEUE_WS_EVENTS.QUEUE_ENTRY_CANCELLED, handleCancelled);
    socket.on(QUEUE_WS_EVENTS.QUEUE_ENTRY_NO_SHOW, handleCancelled);

    return () => {
      socket.emit(QUEUE_WS_EVENTS.LEAVE_TICKET, { ticketId: queueEntryId });
      socket.off(QUEUE_WS_EVENTS.CONNECT, handleConnect);
      socket.off(QUEUE_WS_EVENTS.DISCONNECT, handleDisconnect);
      socket.off(QUEUE_WS_EVENTS.CONNECT_ERROR, handleConnectError);
      socket.io?.off(QUEUE_WS_EVENTS.RECONNECT_ATTEMPT, handleReconnectAttempt);
      socket.off(QUEUE_WS_EVENTS.TICKET_CALLED, handleRingTriggered);
      socket.off(QUEUE_WS_EVENTS.CUSTOMER_RING_TRIGGERED, handleRingTriggered);
      socket.off(QUEUE_WS_EVENTS.QUEUE_POSITION_UPDATED, handlePositionUpdated);
      socket.off(QUEUE_WS_EVENTS.QUEUE_POSITION_UPDATED_ALT, handlePositionUpdated);
      socket.off(QUEUE_WS_EVENTS.QUEUE_ENTRY_SKIPPED, handleSkipped);
      socket.off(QUEUE_WS_EVENTS.TICKET_SEATED, handleSeated);
      socket.off(QUEUE_WS_EVENTS.QUEUE_ENTRY_SEATED, handleSeated);
      socket.off(QUEUE_WS_EVENTS.TICKET_CANCELLED, handleCancelled);
      socket.off(QUEUE_WS_EVENTS.QUEUE_ENTRY_CANCELLED, handleCancelled);
      socket.off(QUEUE_WS_EVENTS.QUEUE_ENTRY_NO_SHOW, handleCancelled);
      socket.disconnect();
      socketRef.current = null;
      ringMedia.stopAll();
      updateStatus(SOCKET_CONNECTION_STATUS.DISCONNECTED);
    };
  }, [queueEntryId, resolvedToken, updateStatus]);

  return {
    socket: socketRef.current,
    isConnected,
    connectionStatus,
    lastRingData,
  };
}
