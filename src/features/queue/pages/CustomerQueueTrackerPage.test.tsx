import { act, fireEvent, render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { ACTIVE_QUEUE_STORAGE_KEY } from "../constants/websocket.constants";
import { useCustomerQueueSocket } from "../hooks/use-customer-queue-socket";
import { useCustomerQueueStatus } from "../hooks/use-customer-queue-status";
import { ringMedia } from "../utils/ring-sound.utils";
import CustomerQueueTrackerPage from "./CustomerQueueTrackerPage";

jest.mock("../hooks/use-customer-queue-status");
jest.mock("../hooks/use-customer-queue-socket");
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

const mockLeaveQueueMutate = jest.fn();
jest.mock("../hooks/use-leave-queue", () => ({
  useLeaveQueue: (options?: { onSuccess?: () => void }) => ({
    mutate: (vars: unknown) => {
      mockLeaveQueueMutate(vars);
      options?.onSuccess?.();
    },
    isPending: false,
  }),
}));

const mockNavigate = jest.fn();
let mockParams = { restaurantId: "rest-123" };
let mockSearchParams = new URLSearchParams({ queueEntryId: "entry-456" });
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => mockParams,
  useSearchParams: () => [mockSearchParams],
  useNavigate: () => mockNavigate,
}));

describe("CustomerQueueTrackerPage", () => {
  let capturedSocketOptions: {
    onPositionUpdated?: (payload: {
      position: number;
      estimatedWaitMinutes: number | null;
    }) => void;
    onRing?: (payload: {
      assignedTableNumber?: string;
      lastRingedAt?: string;
      deadlineMinutes?: number;
      message?: string;
      ringCount?: number;
    }) => void;
    onSkipped?: (payload: { status?: string; reason?: string; position?: number | null }) => void;
    onSeated?: (payload: { tableNumber?: string; tableIds?: string[] }) => void;
    onCancelled?: (payload: { status?: string; reason?: string }) => void;
  };

  const mockSnapshot = {
    success: true,
    message: "Success",
    data: {
      queueEntryId: "entry-456",
      restaurantId: "rest-123",
      restaurantName: "The Grand Bistro",
      queueNumber: "Q-042",
      partySize: 2,
      status: "WAITING" as const,
      position: 3,
      peopleAhead: 2,
      estimatedWaitMinutes: 15,
      estimatedWaitMinutesAtJoin: 20,
      joinedAt: "2026-11-09T10:00:00.000Z",
      assignedTableNumber: null,
      responseDeadline: null,
      canCancel: true,
      serverTime: "2026-11-09T10:05:00.000Z",
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    mockParams = { restaurantId: "rest-123" };
    mockSearchParams = new URLSearchParams({ queueEntryId: "entry-456" });
    capturedSocketOptions = {};

    (useCustomerQueueSocket as jest.Mock).mockImplementation((_id, _token, options) => {
      capturedSocketOptions = options || {};
      return {
        socket: {},
        isConnected: true,
        connectionStatus: "connected",
        lastRingData: null,
      };
    });
  });

  it("renders loading state when initial data is loading", () => {
    (useCustomerQueueStatus as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    });

    const { container } = render(
      <MemoryRouter>
        <CustomerQueueTrackerPage />
      </MemoryRouter>,
    );

    expect(container.querySelectorAll(".animate-pulse").length).toBeGreaterThan(0);
  });

  it("renders error state when status fetch fails", () => {
    (useCustomerQueueStatus as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      refetch: jest.fn(),
      isRefetching: false,
    });

    render(
      <MemoryRouter>
        <CustomerQueueTrackerPage />
      </MemoryRouter>,
    );

    expect(screen.getByText(/Queue Entry Not Found/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /try again/i })).toBeInTheDocument();
  });

  it("renders waiting queue tracker with position and estimated wait time", () => {
    (useCustomerQueueStatus as jest.Mock).mockReturnValue({
      data: mockSnapshot,
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
      isRefetching: false,
    });

    render(
      <MemoryRouter>
        <CustomerQueueTrackerPage />
      </MemoryRouter>,
    );

    expect(screen.getByText("The Grand Bistro")).toBeInTheDocument();
    expect(screen.getByText("#Q-042")).toBeInTheDocument();
    expect(screen.getByText("3rd")).toBeInTheDocument();
    expect(screen.getByText(/parties ahead of you/i)).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText(/~15 mins remaining/i)).toBeInTheDocument();
    expect(screen.getByText("Live")).toBeInTheDocument();
  });

  it("dynamically updates position when onPositionUpdated event is received", () => {
    (useCustomerQueueStatus as jest.Mock).mockReturnValue({
      data: mockSnapshot,
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
      isRefetching: false,
    });

    render(
      <MemoryRouter>
        <CustomerQueueTrackerPage />
      </MemoryRouter>,
    );

    expect(screen.getByText("3rd")).toBeInTheDocument();

    act(() => {
      capturedSocketOptions.onPositionUpdated?.({
        position: 1,
        estimatedWaitMinutes: 2,
      });
    });

    expect(screen.getByText("1st")).toBeInTheDocument();
    expect(screen.getByText("You're Next!")).toBeInTheDocument();
    expect(screen.getByText(/~2 mins remaining/i)).toBeInTheDocument();
  });

  it("displays assigned table badge when onRing event is received", () => {
    (useCustomerQueueStatus as jest.Mock).mockReturnValue({
      data: mockSnapshot,
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
      isRefetching: false,
    });

    render(
      <MemoryRouter>
        <CustomerQueueTrackerPage />
      </MemoryRouter>,
    );

    act(() => {
      capturedSocketOptions.onRing?.({
        assignedTableNumber: "T-04",
        lastRingedAt: new Date().toISOString(),
        deadlineMinutes: 2,
      });
    });

    expect(screen.getByText("Table: T-04")).toBeInTheDocument();
  });

  it("displays skipped banner when onSkipped event is received", () => {
    (useCustomerQueueStatus as jest.Mock).mockReturnValue({
      data: mockSnapshot,
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
      isRefetching: false,
    });

    render(
      <MemoryRouter>
        <CustomerQueueTrackerPage />
      </MemoryRouter>,
    );

    act(() => {
      capturedSocketOptions.onSkipped?.({
        reason: "Customer not present at host stand",
        position: 5,
      });
    });

    expect(screen.getByText("Party Skipped")).toBeInTheDocument();
    expect(screen.getByText(/Customer not present at host stand/i)).toBeInTheDocument();
    expect(screen.getByText("5th")).toBeInTheDocument();
  });

  it("displays seated confirmation card when onSeated event is received", () => {
    (useCustomerQueueStatus as jest.Mock).mockReturnValue({
      data: mockSnapshot,
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
      isRefetching: false,
    });

    render(
      <MemoryRouter>
        <CustomerQueueTrackerPage />
      </MemoryRouter>,
    );

    act(() => {
      capturedSocketOptions.onSeated?.({
        tableNumber: "T-12",
      });
    });

    expect(screen.getByText("You are Seated!")).toBeInTheDocument();
    expect(screen.getByText("Table Number: T-12")).toBeInTheDocument();
  });

  it("displays cancelled card when onCancelled event is received", () => {
    (useCustomerQueueStatus as jest.Mock).mockReturnValue({
      data: mockSnapshot,
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
      isRefetching: false,
    });

    render(
      <MemoryRouter>
        <CustomerQueueTrackerPage />
      </MemoryRouter>,
    );

    act(() => {
      capturedSocketOptions.onCancelled?.({
        reason: "Entry marked as no-show",
      });
    });

    expect(screen.getByText("Queue Entry Cancelled")).toBeInTheDocument();
    expect(screen.getByText(/Entry marked as no-show/i)).toBeInTheDocument();
  });

  it("opens leave confirmation dialog and executes leave queue on confirm", () => {
    (useCustomerQueueStatus as jest.Mock).mockReturnValue({
      data: mockSnapshot,
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
      isRefetching: false,
    });

    render(
      <MemoryRouter>
        <CustomerQueueTrackerPage />
      </MemoryRouter>,
    );

    const leaveButton = screen.getByRole("button", { name: /leave queue/i });
    expect(leaveButton).toBeInTheDocument();
    fireEvent.click(leaveButton);

    expect(screen.getByRole("heading", { name: /leave the queue\?/i })).toBeInTheDocument();
    expect(screen.getByText(/You will lose your current spot in line/i)).toBeInTheDocument();

    const confirmButtons = screen.getAllByRole("button", { name: /leave queue/i });
    fireEvent.click(confirmButtons[confirmButtons.length - 1]);

    expect(mockLeaveQueueMutate).toHaveBeenCalledWith({
      restaurantId: "rest-123",
      queueEntryId: "entry-456",
    });
    expect(mockNavigate).toHaveBeenCalledWith("/restaurants/rest-123");
  });

  it("dismisses confirmation dialog when cancel button is clicked", () => {
    (useCustomerQueueStatus as jest.Mock).mockReturnValue({
      data: mockSnapshot,
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
      isRefetching: false,
    });

    render(
      <MemoryRouter>
        <CustomerQueueTrackerPage />
      </MemoryRouter>,
    );

    const leaveButton = screen.getByRole("button", { name: /leave queue/i });
    fireEvent.click(leaveButton);

    const cancelButton = screen.getByRole("button", { name: /stay in line/i });
    expect(cancelButton).toBeInTheDocument();
    fireEvent.click(cancelButton);

    expect(mockLeaveQueueMutate).not.toHaveBeenCalled();
  });

  it("renders initial position directly on first render frame without flashing position 1", () => {
    (useCustomerQueueStatus as jest.Mock).mockReturnValue({
      data: {
        ...mockSnapshot,
        data: {
          ...mockSnapshot.data,
          position: 15,
          peopleAhead: 14,
        },
      },
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
      isRefetching: false,
    });

    const html = renderToStaticMarkup(
      <MemoryRouter>
        <CustomerQueueTrackerPage />
      </MemoryRouter>,
    );

    expect(html).toContain("15th");
    expect(html).not.toContain("You&#x27;re Next!");
    expect(html).not.toContain(">1st<");
  });

  it("ignores stored localStorage ticket belonging to a different restaurant", () => {
    mockParams = { restaurantId: "rest-b" };
    mockSearchParams = new URLSearchParams();
    localStorage.setItem(
      ACTIVE_QUEUE_STORAGE_KEY,
      JSON.stringify({
        queueEntryId: "ticket-from-rest-a",
        restaurantId: "rest-a",
        queueNumber: "Q-001",
      }),
    );

    (useCustomerQueueStatus as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
      isRefetching: false,
    });

    render(
      <MemoryRouter>
        <CustomerQueueTrackerPage />
      </MemoryRouter>,
    );

    expect(useCustomerQueueStatus).toHaveBeenCalledWith("rest-b", undefined);
    expect(useCustomerQueueSocket).toHaveBeenCalledWith(null, null, expect.any(Object));
    expect(screen.getByText(/Queue Entry Not Found/i)).toBeInTheDocument();
  });

  it("restores stored localStorage ticket when restaurantId matches and query param is omitted", () => {
    mockParams = { restaurantId: "rest-123" };
    mockSearchParams = new URLSearchParams();
    localStorage.setItem(
      ACTIVE_QUEUE_STORAGE_KEY,
      JSON.stringify({
        queueEntryId: "entry-456",
        restaurantId: "rest-123",
        queueNumber: "Q-042",
      }),
    );

    (useCustomerQueueStatus as jest.Mock).mockReturnValue({
      data: mockSnapshot,
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
      isRefetching: false,
    });

    render(
      <MemoryRouter>
        <CustomerQueueTrackerPage />
      </MemoryRouter>,
    );

    expect(useCustomerQueueStatus).toHaveBeenCalledWith("rest-123", "entry-456");
    expect(useCustomerQueueSocket).toHaveBeenCalledWith("entry-456", null, expect.any(Object));
    expect(screen.getByText("The Grand Bistro")).toBeInTheDocument();
  });

  it("derives parties ahead when backend snapshot omits peopleAhead", () => {
    (useCustomerQueueStatus as jest.Mock).mockReturnValue({
      data: {
        success: true,
        statusCode: 200,
        message: "Fetched",
        data: {
          queueEntryId: "entry-456",
          restaurantId: "rest-123",
          restaurantName: "The Grand Bistro",
          queueNumber: "Q-042",
          guestName: "Alex",
          partySize: 2,
          status: "WAITING" as const,
          position: 5,
          totalWaitingParties: 8,
          estimatedWaitMinutes: 25,
          registrationType: "ONLINE" as const,
          joinedAt: "2026-11-09T10:00:00.000Z",
          updatedAt: "2026-11-09T10:05:00.000Z",
          lastRingAt: null,
          responseDeadline: null,
          assignedTableId: null,
        },
      },
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
      isRefetching: false,
    });

    render(
      <MemoryRouter>
        <CustomerQueueTrackerPage />
      </MemoryRouter>,
    );

    expect(screen.getByText("5th")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText(/parties ahead of you/i)).toBeInTheDocument();
  });

  it("displays called banner, alert modal, and silence button when onRing event is received", () => {
    (useCustomerQueueStatus as jest.Mock).mockReturnValue({
      data: mockSnapshot,
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
      isRefetching: false,
    });

    render(
      <MemoryRouter>
        <CustomerQueueTrackerPage />
      </MemoryRouter>,
    );

    act(() => {
      capturedSocketOptions.onRing?.({
        message: "Table for 2 is ready now!",
        ringCount: 2,
      });
    });

    expect(screen.getByText("Table Ready — Please Head to the Host Stand")).toBeInTheDocument();
    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
    expect(screen.getByText("Your Table is Ready!")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /silence alert/i }));
    expect(ringMedia.stopAll).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });

  it("hydrates table ready banner from lastRingAt on snapshot load and renders SkippedStatusCard when terminal skipped", () => {
    (useCustomerQueueStatus as jest.Mock).mockReturnValue({
      data: {
        ...mockSnapshot,
        data: {
          ...mockSnapshot.data,
          lastRingAt: "2026-11-09T10:10:00.000Z",
        },
      },
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
      isRefetching: false,
    });

    render(
      <MemoryRouter>
        <CustomerQueueTrackerPage />
      </MemoryRouter>,
    );

    expect(screen.getByText("Table Ready — Please Head to the Host Stand")).toBeInTheDocument();

    act(() => {
      capturedSocketOptions.onSkipped?.({
        status: "SKIPPED",
        reason: "Guest did not show up at host desk",
        position: null,
      });
    });

    expect(screen.getByText("Turn Skipped")).toBeInTheDocument();
    expect(screen.getByText("Guest did not show up at host desk")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /leave queue/i })).not.toBeInTheDocument();
  });

  it("re-displays skipped banner on consecutive skip events even if previously dismissed", () => {
    (useCustomerQueueStatus as jest.Mock).mockReturnValue({
      data: mockSnapshot,
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
      isRefetching: false,
    });

    render(
      <MemoryRouter>
        <CustomerQueueTrackerPage />
      </MemoryRouter>,
    );

    act(() => {
      capturedSocketOptions.onSkipped?.({
        reason: "First skip",
        position: 4,
      });
    });

    expect(screen.getByText("Party Skipped")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /dismiss banner/i }));
    expect(screen.queryByText("Party Skipped")).not.toBeInTheDocument();

    act(() => {
      capturedSocketOptions.onSkipped?.({
        reason: "Second skip",
        position: 6,
      });
    });

    expect(screen.getByText("Party Skipped")).toBeInTheDocument();
    expect(screen.getByText(/Second skip/i)).toBeInTheDocument();
    expect(screen.getByText("6th")).toBeInTheDocument();
  });
});
