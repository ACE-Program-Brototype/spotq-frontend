import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import env from "@/config/env";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { QUEUE_QUERY_KEYS } from "@/features/queue/constants/queue.constants";
import { QUEUE_WS_CONFIG, QUEUE_WS_EVENTS } from "@/features/queue/constants/websocket.constants";
import { getOrRefreshAccessToken } from "@/lib/api/auth-refresh";

export interface UseStaffQueueSocketOptions {
  onEntryCreated?: (data: unknown) => void;
  onEntryCalled?: (data: unknown) => void;
  onEntrySeated?: (data: unknown) => void;
  onEntrySkipped?: (data: unknown) => void;
  onEntryCancelled?: (data: unknown) => void;
  playChimeOnRing?: boolean;
}

export function useStaffQueueSocket(
  restaurantId?: string | null,
  options?: UseStaffQueueSocketOptions,
) {
  const queryClient = useQueryClient();
  const authStoreToken = useAuthStore((state) => state.accessToken);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [resolvedToken, setResolvedToken] = useState<string | null>(authStoreToken || null);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    let isCancelled = false;
    if (authStoreToken) {
      setResolvedToken(authStoreToken);
      return;
    }

    if (isAuthenticated) {
      getOrRefreshAccessToken()
        .then((token) => {
          if (!isCancelled && token) {
            setResolvedToken(token);
          }
        })
        .catch(() => {});
    }

    return () => {
      isCancelled = true;
    };
  }, [authStoreToken, isAuthenticated]);

  useEffect(() => {
    if (!restaurantId || !resolvedToken) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setIsConnected(false);
      }
      return;
    }

    const queryParams: Record<string, string> = {
      token: resolvedToken,
      ...(restaurantId ? { restaurantId } : {}),
    };

    const socket: Socket = io(env.wsUrl, {
      path: QUEUE_WS_CONFIG.DEFAULT_PATH,
      transports: ["websocket", "polling"],
      withCredentials: true,
      query: queryParams,
      auth: { token: resolvedToken },
      extraHeaders: { Authorization: `Bearer ${resolvedToken}` },
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setIsConnected(true);

      // Join the restaurant-wide live queue room
      socket.emit(QUEUE_WS_EVENTS.JOIN_RESTAURANT, { restaurantId }, () => {
        // Refresh the query snapshot on connect / reconnect
        queryClient.invalidateQueries({
          queryKey: QUEUE_QUERY_KEYS.STAFF_LIVE_QUEUE(restaurantId),
        });
      });
    });

    socket.on("connect_error", (error) => {
      setIsConnected(false);
      if (env.isDev) {
        console.warn(`[StaffSocket] Connection error: ${error.message}`);
      }
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    // Helper to refresh live queue cache on updates
    const refreshQueue = () => {
      queryClient.invalidateQueries({
        queryKey: QUEUE_QUERY_KEYS.STAFF_LIVE_QUEUE(restaurantId),
      });
    };

    socket.on(QUEUE_WS_EVENTS.QUEUE_ENTRY_CREATED, (payload) => {
      refreshQueue();
      optionsRef.current?.onEntryCreated?.(payload);
    });

    socket.on(QUEUE_WS_EVENTS.TICKET_CALLED, (payload: { queueEntryId?: string }) => {
      refreshQueue();
      optionsRef.current?.onEntryCalled?.(payload);
    });

    socket.on(QUEUE_WS_EVENTS.QUEUE_ENTRY_SEATED, (payload) => {
      refreshQueue();
      optionsRef.current?.onEntrySeated?.(payload);
    });

    socket.on(QUEUE_WS_EVENTS.QUEUE_ENTRY_SKIPPED, (payload) => {
      refreshQueue();
      optionsRef.current?.onEntrySkipped?.(payload);
    });

    socket.on(QUEUE_WS_EVENTS.QUEUE_ENTRY_CANCELLED, (payload) => {
      refreshQueue();
      optionsRef.current?.onEntryCancelled?.(payload);
    });

    socket.on(QUEUE_WS_EVENTS.QUEUE_ENTRY_NO_SHOW, (payload) => {
      refreshQueue();
      optionsRef.current?.onEntryCancelled?.(payload);
    });

    socket.on(QUEUE_WS_EVENTS.QUEUE_POSITION_UPDATED, () => {
      refreshQueue();
    });

    socket.on(QUEUE_WS_EVENTS.QUEUE_UPDATED, () => {
      refreshQueue();
    });

    return () => {
      socket.emit(QUEUE_WS_EVENTS.LEAVE_RESTAURANT, { restaurantId });
      socket.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    };
  }, [restaurantId, resolvedToken, queryClient]);

  return {
    isConnected,
  };
}
