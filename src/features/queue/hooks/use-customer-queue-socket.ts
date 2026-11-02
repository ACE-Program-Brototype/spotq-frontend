import { useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import env from "@/config/env";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { getOrRefreshAccessToken } from "@/lib/api/auth-refresh";
import { QUEUE_WS_CONFIG, QUEUE_WS_EVENTS } from "../constants/websocket.constants";
import type { CustomerRingPayload } from "../types/ring-alert.types";
import { ringMedia } from "../utils/ring-sound.utils";

export interface UseCustomerQueueSocketOptions {
  onRing?: (payload: CustomerRingPayload) => void;
  onSeated?: (payload: unknown) => void;
  onCancelled?: (payload: unknown) => void;
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
  const [lastRingData, setLastRingData] = useState<CustomerRingPayload | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const lastProcessedRingKeyRef = useRef<string | null>(null);

  const optionsRef = useRef(options);
  optionsRef.current = options;

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
          console.warn("[Socket] Failed to refresh access token for customer queue socket:", err);
        });
    }

    return () => {
      isCancelled = true;
    };
  }, [accessToken, authStoreToken, isAuthenticated]);

  useEffect(() => {
    if (!queueEntryId) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setIsConnected(false);
      }
      return;
    }

    if (isAuthenticated && !resolvedToken) {
      return;
    }

    const queryParams: Record<string, string> = {
      ticketId: queueEntryId,
    };
    if (resolvedToken) {
      queryParams.token = resolvedToken;
    }

    const socket: Socket = io(env.wsUrl, {
      path: QUEUE_WS_CONFIG.DEFAULT_PATH,
      transports: ["websocket", "polling"],
      withCredentials: true,
      query: queryParams,
      auth: resolvedToken ? { token: resolvedToken } : undefined,
      extraHeaders: resolvedToken ? { Authorization: `Bearer ${resolvedToken}` } : undefined,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    socketRef.current = socket;

    socket.on("connect_error", (error) => {
      console.warn(`[Socket] Connection error: ${error.message}`);
    });

    // 1. Connection & Reconnection Handler
    socket.on("connect", () => {
      setIsConnected(true);

      // Immediately join the customer's private ticket room
      socket.emit(
        QUEUE_WS_EVENTS.JOIN_TICKET,
        { ticketId: queueEntryId },
        (response?: { success: boolean; room?: string; error?: string }) => {
          if (response?.success) {
            console.log(
              `[Socket] Joined customer room ${response.room || `ticket:${queueEntryId}`}`,
            );
          } else if (response?.error) {
            console.warn(`[Socket] Failed to join ticket room: ${response.error}`);
          }
        },
      );
    });

    socket.on("disconnect", (reason) => {
      setIsConnected(false);
      console.log(`[Socket] Disconnected: ${reason}`);
    });

    // 2. Ring Alert Event Handler (Listens for ticket:called)
    const handleRingTriggered = (data: CustomerRingPayload) => {
      if (!data || data.queueEntryId !== queueEntryId) return;

      // Prevent duplicate chime triggers for redundant socket frames
      const ringKey = `${data.queueEntryId}_${data.ringCount || 1}_${data.lastRingedAt || ""}`;
      if (lastProcessedRingKeyRef.current === ringKey) return;
      lastProcessedRingKeyRef.current = ringKey;

      setLastRingData(data);

      // Play audio chime and trigger mobile vibration
      ringMedia.playChime();
      ringMedia.triggerVibration([250, 100, 250, 100, 400]);

      optionsRef.current?.onRing?.(data);
    };

    socket.on(QUEUE_WS_EVENTS.TICKET_CALLED, handleRingTriggered);

    // 3. Seated and Cancelled Event Handlers
    socket.on(QUEUE_WS_EVENTS.TICKET_SEATED, (payload) => {
      ringMedia.stopAll();
      optionsRef.current?.onSeated?.(payload);
    });

    socket.on(QUEUE_WS_EVENTS.TICKET_CANCELLED, (payload) => {
      ringMedia.stopAll();
      optionsRef.current?.onCancelled?.(payload);
    });

    return () => {
      socket.off(QUEUE_WS_EVENTS.TICKET_CALLED, handleRingTriggered);
      socket.off(QUEUE_WS_EVENTS.TICKET_SEATED);
      socket.off(QUEUE_WS_EVENTS.TICKET_CANCELLED);
      socket.disconnect();
      socketRef.current = null;
      ringMedia.stopAll();
      setIsConnected(false);
    };
  }, [queueEntryId, resolvedToken, isAuthenticated]);

  return {
    socket: socketRef.current,
    isConnected,
    lastRingData,
  };
}
