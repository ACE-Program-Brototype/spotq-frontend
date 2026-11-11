import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { io } from "socket.io-client";
import { ACTIVE_QUEUE_STORAGE_KEY, QUEUE_WS_EVENTS } from "../constants/websocket.constants";
import { queueService } from "../services/queue.service";
import { ringMedia } from "../utils/ring-sound.utils";
import CustomerQueueTrackerPage from "./CustomerQueueTrackerPage";

jest.mock("socket.io-client");
jest.mock("../services/queue.service");
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

jest.mock("@/features/auth/store/auth.store", () => ({
  useAuthStore: (
    selector: (state: { accessToken: string | null; isAuthenticated: boolean }) => unknown,
  ) => selector({ accessToken: "customer-jwt-token", isAuthenticated: true }),
}));

describe("CustomerQueueTrackerPage integration (HTTP + WebSocket lifecycle)", () => {
  let eventHandlers: Record<string, (...args: unknown[]) => void>;
  let mockSocket: {
    on: jest.Mock;
    off: jest.Mock;
    emit: jest.Mock;
    disconnect: jest.Mock;
    io: { on: jest.Mock; off: jest.Mock };
  };

  const backendWaitingSnapshot = {
    success: true,
    statusCode: 200,
    message: "Customer queue status fetched",
    data: {
      queueEntryId: "entry-999",
      restaurantId: "rest-abc",
      restaurantName: "Saffron Kitchen",
      queueNumber: "Q-018",
      guestName: "Jordan",
      partySize: 4,
      position: 4,
      totalWaitingParties: 7,
      estimatedWaitMinutes: 20,
      status: "WAITING" as const,
      registrationType: "ONLINE" as const,
      joinedAt: "2026-11-11T04:00:00.000Z",
      updatedAt: "2026-11-11T04:05:00.000Z",
      lastRingAt: null,
      responseDeadline: null,
      assignedTableId: null,
    },
  };

  const renderTrackerIntegration = (
    route = "/restaurants/rest-abc/queue/status?queueEntryId=entry-999",
  ) => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[route]}>
          <Routes>
            <Route
              path="/restaurants/:restaurantId/queue/status"
              element={<CustomerQueueTrackerPage />}
            />
            <Route
              path="/restaurants/:id"
              element={<div data-testid="restaurant-detail-page">Restaurant Detail</div>}
            />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    localStorage.setItem(
      ACTIVE_QUEUE_STORAGE_KEY,
      JSON.stringify({
        queueEntryId: "entry-999",
        restaurantId: "rest-abc",
        queueNumber: "Q-018",
        status: "WAITING",
      }),
    );

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
      io: {
        on: jest.fn((event: string, handler: (...args: unknown[]) => void) => {
          eventHandlers[`io:${event}`] = handler;
        }),
        off: jest.fn((event: string) => {
          delete eventHandlers[`io:${event}`];
        }),
      },
    };
    (io as unknown as jest.Mock).mockReturnValue(mockSocket);
    (queueService.getCustomerQueueStatus as jest.Mock).mockResolvedValue(backendWaitingSnapshot);
    (queueService.leaveQueue as jest.Mock).mockResolvedValue({
      success: true,
      statusCode: 200,
      message: "Left restaurant queue successfully",
      data: {
        queueEntryId: "entry-999",
        restaurantId: "rest-abc",
        status: "CANCELLED",
        cancelledAt: "2026-11-11T04:15:00.000Z",
      },
    });
  });

  it("loads backend snapshot without peopleAhead, connects socket, and transitions across position, skip, ring, and seated WS events", async () => {
    renderTrackerIntegration();

    await waitFor(() => {
      expect(screen.getByText("#Q-018")).toBeInTheDocument();
    });

    expect(queueService.getCustomerQueueStatus).toHaveBeenCalledWith("rest-abc", "entry-999");
    expect(screen.getByText("4th")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText(/parties ahead of you/i)).toBeInTheDocument();
    expect(screen.getByText("~20 mins remaining")).toBeInTheDocument();
    expect(screen.getByText("25%")).toBeInTheDocument();
    expect(screen.getByText("Connecting...")).toBeInTheDocument();

    act(() => {
      eventHandlers[QUEUE_WS_EVENTS.CONNECT]();
    });

    expect(mockSocket.emit).toHaveBeenCalledWith(
      QUEUE_WS_EVENTS.JOIN_TICKET,
      { ticketId: "entry-999" },
      expect.any(Function),
    );
    expect(screen.getByText("Live")).toBeInTheDocument();

    // Ignore position update targeting another ticket
    act(() => {
      eventHandlers[QUEUE_WS_EVENTS.QUEUE_POSITION_UPDATED]({
        queueEntryId: "other-ticket",
        position: 1,
        estimatedWaitMinutes: 0,
      });
    });
    expect(screen.getByText("4th")).toBeInTheDocument();

    // Real position update
    act(() => {
      eventHandlers[QUEUE_WS_EVENTS.QUEUE_POSITION_UPDATED]({
        event: "queue:position-updated",
        queueEntryId: "entry-999",
        restaurantId: "rest-abc",
        position: 2,
        estimatedWaitMinutes: 8,
      });
    });

    expect(screen.getByText("2nd")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText(/party ahead of you/i)).toBeInTheDocument();
    expect(screen.getByText("~8 mins remaining")).toBeInTheDocument();

    // Skip with reposition -> dismiss -> second skip
    act(() => {
      eventHandlers[QUEUE_WS_EVENTS.QUEUE_ENTRY_SKIPPED]({
        queueEntryId: "entry-999",
        status: "WAITING",
        reason: "Temporarily passed",
        position: 3,
      });
    });
    expect(screen.getByText("Party Skipped")).toBeInTheDocument();
    expect(screen.getByText("3rd")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /dismiss banner/i }));
    expect(screen.queryByText("Party Skipped")).not.toBeInTheDocument();

    // Socket disconnect / reconnect indicator check
    act(() => {
      eventHandlers[QUEUE_WS_EVENTS.CONNECT_ERROR](new Error("timeout"));
    });
    expect(screen.getByText("Reconnecting...")).toBeInTheDocument();

    act(() => {
      eventHandlers[QUEUE_WS_EVENTS.DISCONNECT]("io server disconnect");
    });
    expect(screen.getByText("Disconnected")).toBeInTheDocument();

    // Ring alert
    act(() => {
      eventHandlers[QUEUE_WS_EVENTS.TICKET_CALLED]({
        event: "ticket:called",
        queueEntryId: "entry-999",
        restaurantId: "rest-abc",
        ringCount: 1,
        message: "Table for 4 is ready!",
      });
    });

    expect(ringMedia.playChime).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
    expect(screen.getByText("Table Ready — Please Head to the Host Stand")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /I'm Heading Over/i }));
    expect(ringMedia.stopAll).toHaveBeenCalled();
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();

    // Seated event closes active state, clears storage, and shows seated card
    act(() => {
      eventHandlers[QUEUE_WS_EVENTS.TICKET_SEATED]({
        event: "ticket:seated",
        queueEntryId: "entry-999",
        tableIds: ["f81d4fae-7dec-11d0-a765-00a0c91e6bf6"],
      });
    });

    expect(screen.getByText("You are Seated!")).toBeInTheDocument();
    expect(screen.queryByText(/f81d4fae/)).not.toBeInTheDocument();
    expect(localStorage.getItem(ACTIVE_QUEUE_STORAGE_KEY)).toBeNull();
  });

  it("handles QUEUE_ENTRY_NO_SHOW WebSocket cancellation cleanly", async () => {
    renderTrackerIntegration();
    await waitFor(() => expect(screen.getByText("#Q-018")).toBeInTheDocument());

    act(() => {
      eventHandlers[QUEUE_WS_EVENTS.QUEUE_ENTRY_NO_SHOW]({
        event: "QUEUE_ENTRY_NO_SHOW",
        queueEntryId: "entry-999",
        status: "NO_SHOW",
        reason: "No show after ring deadline",
      });
    });

    expect(screen.getByText("Queue Entry Cancelled")).toBeInTheDocument();
    expect(screen.getByText("No show after ring deadline")).toBeInTheDocument();
    expect(localStorage.getItem(ACTIVE_QUEUE_STORAGE_KEY)).toBeNull();
  });

  it("handles terminal QUEUE_ENTRY_SKIPPED event without position and hides Leave Queue", async () => {
    renderTrackerIntegration();
    await waitFor(() => expect(screen.getByText("#Q-018")).toBeInTheDocument());

    act(() => {
      eventHandlers[QUEUE_WS_EVENTS.QUEUE_ENTRY_SKIPPED]({
        event: "QUEUE_ENTRY_SKIPPED",
        queueEntryId: "entry-999",
        status: "SKIPPED",
        reason: "Party missed turn",
      });
    });

    expect(screen.getByText("Turn Skipped")).toBeInTheDocument();
    expect(screen.getByText("Party missed turn")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /leave queue/i })).not.toBeInTheDocument();
    expect(localStorage.getItem(ACTIVE_QUEUE_STORAGE_KEY)).toBeNull();
  });

  it("executes Leave Queue mutation and navigates back to restaurant detail page", async () => {
    renderTrackerIntegration();
    await waitFor(() => expect(screen.getByText("#Q-018")).toBeInTheDocument());

    fireEvent.click(screen.getByRole("button", { name: /leave queue/i }));
    const leaveButtons = screen.getAllByRole("button", { name: /leave queue/i });
    fireEvent.click(leaveButtons[leaveButtons.length - 1]);

    await waitFor(() => {
      expect(queueService.leaveQueue).toHaveBeenCalledWith("rest-abc", "entry-999");
      expect(screen.getByTestId("restaurant-detail-page")).toBeInTheDocument();
    });
    expect(localStorage.getItem(ACTIVE_QUEUE_STORAGE_KEY)).toBeNull();
  });
});
