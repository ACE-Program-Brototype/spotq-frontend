import { act, renderHook } from "@testing-library/react";
import { io } from "socket.io-client";
import { QUEUE_WS_EVENTS } from "../constants/websocket.constants";
import { ringMedia } from "../utils/ring-sound.utils";
import { useCustomerQueueSocket } from "./use-customer-queue-socket";

jest.mock("socket.io-client");
jest.mock("../utils/ring-sound.utils", () => ({
  ringMedia: {
    playChime: jest.fn(),
    playAlarmSound: jest.fn(),
    triggerVibration: jest.fn(),
    stopVibration: jest.fn(),
    stopSound: jest.fn(),
    stopAll: jest.fn(),
  },
}));

describe("useCustomerQueueSocket", () => {
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

  it("does not connect if queueEntryId is not provided", () => {
    const { result } = renderHook(() => useCustomerQueueSocket(null));

    expect(io).not.toHaveBeenCalled();
    expect(result.current.isConnected).toBe(false);
  });

  it("does not connect if token is null or undefined", () => {
    const { result } = renderHook(() => useCustomerQueueSocket("entry-123", null));

    expect(io).not.toHaveBeenCalled();
    expect(result.current.isConnected).toBe(false);
  });

  it("connects and emits join:ticket on connect event", () => {
    renderHook(() => useCustomerQueueSocket("entry-123", "mock-token"));

    expect(io).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        path: "/ws/queues",
        query: expect.objectContaining({
          token: "mock-token",
          ticketId: "entry-123",
        }),
      }),
    );

    // Simulate connect inside act
    act(() => {
      eventHandlers.connect();
    });

    expect(mockSocket.emit).toHaveBeenCalledWith(
      QUEUE_WS_EVENTS.JOIN_TICKET,
      { ticketId: "entry-123" },
      expect.any(Function),
    );
  });

  it("triggers chime, vibration, and onRing callback when ticket:called event arrives", () => {
    const onRing = jest.fn();

    renderHook(() =>
      useCustomerQueueSocket("entry-123", "mock-token", {
        onRing,
      }),
    );

    const ringPayload = {
      event: "ticket:called",
      queueEntryId: "entry-123",
      restaurantId: "rest-999",
      ringCount: 1,
      message: "Your table is ready!",
    };

    act(() => {
      eventHandlers[QUEUE_WS_EVENTS.TICKET_CALLED](ringPayload);
    });

    expect(ringMedia.playChime).toHaveBeenCalledTimes(1);
    expect(ringMedia.triggerVibration).toHaveBeenCalledTimes(1);
    expect(onRing).toHaveBeenCalledWith(ringPayload);
  });

  it("ignores ring events meant for a different queueEntryId", () => {
    const onRing = jest.fn();

    renderHook(() =>
      useCustomerQueueSocket("entry-123", "mock-token", {
        onRing,
      }),
    );

    const alienPayload = {
      event: "ticket:called",
      queueEntryId: "other-entry-888",
      restaurantId: "rest-999",
      ringCount: 1,
    };

    act(() => {
      eventHandlers[QUEUE_WS_EVENTS.TICKET_CALLED](alienPayload);
    });

    expect(ringMedia.playChime).not.toHaveBeenCalled();
    expect(onRing).not.toHaveBeenCalled();
  });

  it("prevents duplicate alerts for duplicate incoming ring frames", () => {
    const onRing = jest.fn();

    renderHook(() =>
      useCustomerQueueSocket("entry-123", "mock-token", {
        onRing,
      }),
    );

    const ringPayload = {
      event: "ticket:called",
      queueEntryId: "entry-123",
      restaurantId: "rest-999",
      ringCount: 1,
      lastRingedAt: "2026-11-01T16:00:00.000Z",
    };

    act(() => {
      // First arrival
      eventHandlers[QUEUE_WS_EVENTS.TICKET_CALLED](ringPayload);
      // Duplicate arrival
      eventHandlers[QUEUE_WS_EVENTS.TICKET_CALLED](ringPayload);
    });

    expect(ringMedia.playChime).toHaveBeenCalledTimes(1);
    expect(onRing).toHaveBeenCalledTimes(1);
  });

  it("stops vibration and triggers onSeated when ticket:seated is received", () => {
    const onSeated = jest.fn();

    renderHook(() =>
      useCustomerQueueSocket("entry-123", "mock-token", {
        onSeated,
      }),
    );

    act(() => {
      eventHandlers[QUEUE_WS_EVENTS.TICKET_SEATED]({ queueEntryId: "entry-123" });
    });

    expect(ringMedia.stopAll).toHaveBeenCalledTimes(1);
    expect(onSeated).toHaveBeenCalled();
  });

  it("cleans up event listeners and disconnects on unmount", () => {
    const { unmount } = renderHook(() => useCustomerQueueSocket("entry-123", "mock-token"));

    unmount();

    expect(mockSocket.off).toHaveBeenCalledWith(
      QUEUE_WS_EVENTS.TICKET_CALLED,
      expect.any(Function),
    );
    expect(mockSocket.disconnect).toHaveBeenCalledTimes(1);
    expect(ringMedia.stopAll).toHaveBeenCalledTimes(1);
  });
});
