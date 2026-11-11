import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react";
import type React from "react";
import { io } from "socket.io-client";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { QUEUE_WS_EVENTS } from "../constants/websocket.constants";
import { useStaffQueueSocket } from "./use-staff-queue-socket";

jest.mock("socket.io-client");

describe("useStaffQueueSocket", () => {
  let queryClient: QueryClient;
  let mockSocket: {
    on: jest.Mock;
    off: jest.Mock;
    emit: jest.Mock;
    disconnect: jest.Mock;
  };
  let eventHandlers: Record<string, (...args: unknown[]) => void>;

  beforeEach(() => {
    jest.clearAllMocks();
    eventHandlers = {};

    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    useAuthStore.setState({
      accessToken: "mock-staff-token",
      isAuthenticated: true,
      user: {
        email: "staff@restaurant.com",
        restaurantId: "rest-staff-1",
        role: "STAFF",
      },
    });

    mockSocket = {
      on: jest.fn((event: string, handler: (...args: unknown[]) => void) => {
        eventHandlers[event] = handler;
      }),
      off: jest.fn((event: string) => {
        delete eventHandlers[event];
      }),
      emit: jest.fn(),
      disconnect: jest.fn(),
    };

    (io as unknown as jest.Mock).mockReturnValue(mockSocket);
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it("does not connect when restaurantId is missing", () => {
    const { result } = renderHook(() => useStaffQueueSocket(null), { wrapper });

    expect(io).not.toHaveBeenCalled();
    expect(result.current.isConnected).toBe(false);
  });

  it("connects and emits join:restaurant with restaurantId on connect", () => {
    const { result } = renderHook(() => useStaffQueueSocket("rest-staff-1"), { wrapper });

    expect(io).toHaveBeenCalled();
    expect(mockSocket.on).toHaveBeenCalledWith("connect", expect.any(Function));

    act(() => {
      eventHandlers.connect();
    });

    expect(result.current.isConnected).toBe(true);
    expect(mockSocket.emit).toHaveBeenCalledWith(
      QUEUE_WS_EVENTS.JOIN_RESTAURANT,
      { restaurantId: "rest-staff-1" },
      expect.any(Function),
    );
  });

  it("refreshes queue and invokes callback on ticket:called event", () => {
    const invalidateSpy = jest.spyOn(queryClient, "invalidateQueries");
    const onEntryCalled = jest.fn();
    renderHook(
      () =>
        useStaffQueueSocket("rest-staff-1", {
          onEntryCalled,
        }),
      { wrapper },
    );

    act(() => {
      eventHandlers[QUEUE_WS_EVENTS.TICKET_CALLED]({ queueEntryId: "entry-999" });
    });

    expect(invalidateSpy).toHaveBeenCalled();
    expect(onEntryCalled).toHaveBeenCalledWith({ queueEntryId: "entry-999" });
  });

  it("invalidates queries on queue entry events", () => {
    const invalidateSpy = jest.spyOn(queryClient, "invalidateQueries");
    const onEntryCreated = jest.fn();

    renderHook(
      () =>
        useStaffQueueSocket("rest-staff-1", {
          onEntryCreated,
        }),
      { wrapper },
    );

    act(() => {
      eventHandlers[QUEUE_WS_EVENTS.QUEUE_ENTRY_CREATED]({ queueEntryId: "entry-1" });
    });

    expect(invalidateSpy).toHaveBeenCalled();
    expect(onEntryCreated).toHaveBeenCalledWith({ queueEntryId: "entry-1" });
  });

  it("disconnects and emits leave:restaurant on unmount", () => {
    const { unmount } = renderHook(() => useStaffQueueSocket("rest-staff-1"), { wrapper });

    unmount();

    expect(mockSocket.emit).toHaveBeenCalledWith(QUEUE_WS_EVENTS.LEAVE_RESTAURANT, {
      restaurantId: "rest-staff-1",
    });
    expect(mockSocket.disconnect).toHaveBeenCalled();
  });
});
