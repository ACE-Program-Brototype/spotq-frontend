import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { useTables } from "@/features/tables/hooks/useTables";
import { queueService } from "../services/queue.service";
import type { StaffLiveQueueEntry } from "../types/queue.types";
import StaffQueuePage from "./StaffQueuePage";

jest.mock("../services/queue.service");
jest.mock("@/features/tables/hooks/useTables");

describe("StaffQueuePage", () => {
  let queryClient: QueryClient;
  const mockRestaurantId = "rest-queue-123";

  const mockEntry1: StaffLiveQueueEntry = {
    queueEntryId: "entry-1",
    queueNumber: "Q-001",
    position: 1,
    guestName: "Samantha Reed",
    guestPhone: "+919876543210",
    partySize: 4,
    specialNotes: "High chair needed",
    registrationType: "WALK_IN",
    status: "WAITING",
    assignedTableId: null,
    joinedAt: "2026-11-09T12:00:00.000Z",
    ringCount: 0,
    lastRingAt: null,
    responseDeadline: null,
    waitDurationMinutes: 15,
  };

  const mockEntry2: StaffLiveQueueEntry = {
    queueEntryId: "entry-2",
    queueNumber: "Q-002",
    position: 2,
    guestName: "Alice Walker",
    guestPhone: "+919123456789",
    partySize: 2,
    specialNotes: null,
    registrationType: "ONLINE",
    status: "WAITING",
    assignedTableId: null,
    joinedAt: "2026-11-09T12:05:00.000Z",
    ringCount: 1,
    lastRingAt: "2026-11-09T12:20:00.000Z",
    responseDeadline: new Date(Date.now() + 180_000).toISOString(),
    waitDurationMinutes: 18,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    useAuthStore.setState({
      user: {
        email: "host@restaurant.com",
        restaurantId: mockRestaurantId,
        role: "STAFF",
      },
      isAuthenticated: true,
      accessToken: "mock-token",
    });

    (useTables as jest.Mock).mockReturnValue({
      allTables: [
        {
          id: "table-1",
          tableCode: "T1",
          capacity: 4,
          status: "AVAILABLE",
          sectionId: "sec-1",
          sectionName: "Main Dining",
          currentOccupancy: 0,
          isActive: true,
        },
      ],
      sections: ["Main Dining"],
      tablesBySection: {
        "Main Dining": [],
      },
      isLoading: false,
      isError: false,
      error: null,
      refetch: jest.fn(),
    });

    (queueService.getStaffLiveQueue as jest.Mock).mockResolvedValue({
      success: true,
      message: "Queue retrieved",
      data: {
        restaurantId: mockRestaurantId,
        totalWaiting: 2,
        entries: [mockEntry1, mockEntry2],
      },
    });

    (queueService.ringCustomer as jest.Mock).mockResolvedValue({
      success: true,
      message: "Customer notified that table is ready",
      data: {
        queueEntryId: "entry-1",
        status: "WAITING",
        ringCount: 1,
        lastRingAt: new Date().toISOString(),
        responseDeadline: new Date(Date.now() + 180_000).toISOString(),
      },
    });

    (queueService.skipParty as jest.Mock).mockResolvedValue({
      success: true,
      message: "Queue entry skipped successfully",
      data: {
        queueEntryId: "entry-1",
        status: "SKIPPED",
        newPosition: 3,
      },
    });

    (queueService.cancelQueueEntry as jest.Mock).mockResolvedValue({
      success: true,
      message: "Queue entry marked as no-show successfully",
      data: {
        queueEntryId: "entry-1",
        status: "NO_SHOW",
      },
    });

    (queueService.assignTables as jest.Mock).mockResolvedValue({
      success: true,
      message: "Tables assigned and party seated successfully",
      data: {
        queueEntryId: "entry-1",
        restaurantId: mockRestaurantId,
        tableIds: ["table-1"],
        status: "SEATED",
        seatedAt: new Date().toISOString(),
      },
    });
  });

  const renderPage = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <StaffQueuePage />
      </QueryClientProvider>,
    );
  };

  it("renders page title, live sync status, statistics, and live queue table", async () => {
    renderPage();

    expect(screen.getByRole("heading", { name: "Queue Management" })).toBeInTheDocument();
    expect(screen.getByTestId("queue-statistics-bar")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Samantha Reed")).toBeInTheDocument();
      expect(screen.getByText("Alice Walker")).toBeInTheDocument();
      expect(screen.getByText("#Q-001")).toBeInTheDocument();
      expect(screen.getByText("#Q-002")).toBeInTheDocument();
    });

    // Statistics should reflect 2 waiting parties and 1 ringing party
    expect(screen.getByTestId("stat-waiting-parties")).toHaveTextContent("2");
    expect(screen.getByTestId("stat-waiting-people")).toHaveTextContent("6");
    expect(screen.getByTestId("stat-ringing-parties")).toHaveTextContent("1");
    expect(screen.getByTestId("stat-ringing-people")).toHaveTextContent("2");
  });

  it("renders empty state when there are no queue entries", async () => {
    (queueService.getStaffLiveQueue as jest.Mock).mockResolvedValue({
      success: true,
      message: "Queue retrieved",
      data: {
        restaurantId: mockRestaurantId,
        totalWaiting: 0,
        entries: [],
      },
    });

    renderPage();

    await waitFor(() => {
      expect(screen.getByTestId("queue-empty-state")).toBeInTheDocument();
      expect(screen.getByText("No Guests in Queue")).toBeInTheDocument();
    });
  });

  it("filters live queue by registration type", async () => {
    const user = userEvent.setup();
    renderPage();

    await waitFor(() => {
      expect(screen.getByText("Samantha Reed")).toBeInTheDocument();
      expect(screen.getByText("Alice Walker")).toBeInTheDocument();
    });

    // Filter to Online only
    await user.click(screen.getByTestId("filter-registration-online"));
    expect(screen.queryByText("Samantha Reed")).not.toBeInTheDocument();
    expect(screen.getByText("Alice Walker")).toBeInTheDocument();

    // Filter to Walk-In only
    await user.click(screen.getByTestId("filter-registration-walk-in"));
    expect(screen.getByText("Samantha Reed")).toBeInTheDocument();
    expect(screen.queryByText("Alice Walker")).not.toBeInTheDocument();
  });

  it("filters live queue by party size bucket", async () => {
    const user = userEvent.setup();
    renderPage();

    await waitFor(() => {
      expect(screen.getByText("Samantha Reed")).toBeInTheDocument(); // 4 guests (Medium)
      expect(screen.getByText("Alice Walker")).toBeInTheDocument(); // 2 guests (Small)
    });

    // Small (1–2)
    await user.click(screen.getByTestId("filter-party-size-small"));
    expect(screen.queryByText("Samantha Reed")).not.toBeInTheDocument();
    expect(screen.getByText("Alice Walker")).toBeInTheDocument();

    // Medium (3–4)
    await user.click(screen.getByTestId("filter-party-size-medium"));
    expect(screen.getByText("Samantha Reed")).toBeInTheDocument();
    expect(screen.queryByText("Alice Walker")).not.toBeInTheDocument();
  });

  it("filters live queue by search query", async () => {
    const user = userEvent.setup();
    renderPage();

    await waitFor(() => {
      expect(screen.getByText("Samantha Reed")).toBeInTheDocument();
    });

    const searchInput = screen.getByTestId("queue-search-input");
    await user.type(searchInput, "Alice");

    expect(screen.queryByText("Samantha Reed")).not.toBeInTheDocument();
    expect(screen.getByText("Alice Walker")).toBeInTheDocument();
  });

  it("triggers Ring Customer action only for ONLINE guests and hides it for WALK_IN", async () => {
    const user = userEvent.setup();
    renderPage();

    await waitFor(() => {
      // WALK_IN guest should NOT have ring button
      expect(screen.queryByTestId("action-ring-entry-1")).not.toBeInTheDocument();
      // ONLINE guest should have ring button
      expect(screen.getByTestId("action-ring-entry-2")).toBeInTheDocument();
    });

    await user.click(screen.getByTestId("action-ring-entry-2"));

    await waitFor(() => {
      expect(queueService.ringCustomer).toHaveBeenCalledWith("entry-2");
    });
  });

  it("opens Assign Table modal when clicking Assign button", async () => {
    const user = userEvent.setup();
    renderPage();

    await waitFor(() => {
      expect(screen.getByTestId("action-assign-entry-1")).toBeInTheDocument();
    });

    await user.click(screen.getByTestId("action-assign-entry-1"));

    expect(screen.getByRole("heading", { name: "Assign Table & Seat Party" })).toBeInTheDocument();
    expect(screen.getByText("Table T1")).toBeInTheDocument();

    // Select Table T1
    await user.click(screen.getByText("Table T1"));

    // Confirm assignment
    const confirmBtn = screen.getByRole("button", { name: /confirm & seat party/i });
    await user.click(confirmBtn);

    await waitFor(() => {
      expect(queueService.assignTables).toHaveBeenCalledWith("entry-1", {
        tables: [{ tableId: "table-1", count: 4 }],
      });
    });
  });

  it("opens Skip Party modal and submits skip mutation", async () => {
    const user = userEvent.setup();
    renderPage();

    await waitFor(() => {
      expect(screen.getByTestId("action-skip-entry-1")).toBeInTheDocument();
    });

    await user.click(screen.getByTestId("action-skip-entry-1"));

    expect(screen.getByTestId("skip-queue-entry-modal")).toBeInTheDocument();
    expect(screen.getByText("Skip Party in Queue")).toBeInTheDocument();

    // Select a preset reason
    await user.click(screen.getByText("Guest requested more time"));

    // Click confirm skip
    await user.click(screen.getByTestId("confirm-skip-button"));

    await waitFor(() => {
      expect(queueService.skipParty).toHaveBeenCalledWith(mockRestaurantId, "entry-1", {
        skipPositions: 2,
        reason: "Guest requested more time",
      });
    });
  });

  it("opens Cancel / No-Show modal and submits cancel mutation", async () => {
    const user = userEvent.setup();
    renderPage();

    await waitFor(() => {
      expect(screen.getByTestId("action-cancel-entry-1")).toBeInTheDocument();
    });

    await user.click(screen.getByTestId("action-cancel-entry-1"));

    expect(screen.getByTestId("cancel-queue-entry-modal")).toBeInTheDocument();
    expect(screen.getByText("Mark as No-Show")).toBeInTheDocument();

    // Submit
    await user.click(screen.getByTestId("confirm-cancel-button"));

    await waitFor(() => {
      expect(queueService.cancelQueueEntry).toHaveBeenCalledWith(mockRestaurantId, "entry-1", {
        reason: "NO_SHOW",
        notes: undefined,
      });
    });
  });

  it("opens Queue Entry Detail Drawer on row click and allows actions inside drawer", async () => {
    const user = userEvent.setup();
    renderPage();

    await waitFor(() => {
      expect(screen.getByText("Alice Walker")).toBeInTheDocument();
    });

    // Click on row for Alice Walker (ONLINE guest)
    await user.click(screen.getByTestId("queue-row-entry-2"));

    const drawer = screen.getByTestId("queue-entry-detail-drawer");
    expect(within(drawer).getByText("Ticket #Q-002")).toBeInTheDocument();

    // Click Ring in drawer
    await user.click(within(drawer).getByTestId("drawer-ring-button"));
    expect(queueService.ringCustomer).toHaveBeenCalledWith("entry-2");
  });
});
