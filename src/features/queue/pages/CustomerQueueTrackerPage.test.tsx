import { act, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { useCustomerQueueSocket } from "../hooks/use-customer-queue-socket";
import { useCustomerQueueStatus } from "../hooks/use-customer-queue-status";
import CustomerQueueTrackerPage from "./CustomerQueueTrackerPage";

jest.mock("../hooks/use-customer-queue-status");
jest.mock("../hooks/use-customer-queue-socket");

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
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({ restaurantId: "rest-123" }),
  useSearchParams: () => [new URLSearchParams({ queueEntryId: "entry-456" })],
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
    }) => void;
    onSkipped?: (payload: { reason?: string; position?: number }) => void;
    onSeated?: (payload: { tableNumber?: string }) => void;
    onCancelled?: (payload: { reason?: string }) => void;
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
});
