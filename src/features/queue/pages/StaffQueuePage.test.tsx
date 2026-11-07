import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { useTables } from "@/features/tables/hooks/useTables";
import { queueService } from "../services/queue.service";
import StaffQueuePage from "./StaffQueuePage";

jest.mock("../services/queue.service");
jest.mock("@/features/tables/hooks/useTables");

describe("StaffQueuePage", () => {
  let queryClient: QueryClient;
  const mockRestaurantId = "rest-queue-123";

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
  });

  const renderPage = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <StaffQueuePage />
      </QueryClientProvider>,
    );
  };

  it("renders page title and empty waitlist state initially", () => {
    renderPage();

    expect(screen.getByRole("heading", { name: "Queue Management" })).toBeInTheDocument();
    expect(screen.getByText("No Guests in Waitlist")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /add to queue/i }).length).toBeGreaterThanOrEqual(
      1,
    );
  });

  it("opens Add to Queue modal when clicking Add to Queue button", async () => {
    const user = userEvent.setup();
    renderPage();

    const addBtns = screen.getAllByRole("button", { name: /add to queue/i });
    await user.click(addBtns[0]);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByLabelText(/guest name/i)).toBeInTheDocument();
  });

  it("adds the registered party to the waitlist table on successful modal submission", async () => {
    const user = userEvent.setup();
    const mockResponse = {
      success: true,
      message: "Walk-in guest successfully registered to queue",
      data: {
        queueEntryId: "queue-entry-555",
        restaurantId: mockRestaurantId,
        userId: null,
        guestName: "Samantha Reed",
        guestPhone: "+919876543210",
        partySize: 4,
        specialNotes: "High chair needed",
        registrationType: "WALK_IN",
        position: 1,
        estimatedWaitMinutes: 10,
        status: "WAITING",
        joinedAt: "2026-10-16T12:00:00.000Z",
      },
    };

    (queueService.registerWalkIn as jest.Mock).mockResolvedValue(mockResponse);

    renderPage();

    const addBtns = screen.getAllByRole("button", { name: /add to queue/i });
    await user.click(addBtns[0]);

    await user.type(screen.getByLabelText(/guest name/i), "Samantha Reed");
    await user.type(screen.getByLabelText(/phone number/i), "9876543210");
    await user.click(screen.getByRole("button", { name: "Party size 4" }));
    await user.type(screen.getByLabelText(/special notes/i), "High chair needed");

    const modal = screen.getByRole("dialog");
    const modalSubmitBtn = within(modal).getByRole("button", {
      name: /add to queue/i,
    });
    await user.click(modalSubmitBtn);

    await waitFor(() => {
      expect(screen.getByText("Samantha Reed")).toBeInTheDocument();
      expect(screen.getByText("+919876543210")).toBeInTheDocument();
      expect(screen.getByText("High chair needed")).toBeInTheDocument();
      expect(screen.getByText("WAITING")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /assign table/i })).toBeInTheDocument();
    });
  });

  it("opens Assign Table modal when clicking Assign Table and updates party status to SEATED on completion", async () => {
    const user = userEvent.setup();
    const mockRegisterResponse = {
      success: true,
      message: "Walk-in registered",
      data: {
        queueEntryId: "queue-entry-999",
        restaurantId: mockRestaurantId,
        userId: null,
        guestName: "Marcus Sterling",
        guestPhone: "+919123456789",
        partySize: 4,
        specialNotes: null,
        registrationType: "WALK_IN",
        position: 1,
        estimatedWaitMinutes: 5,
        status: "WAITING",
        joinedAt: "2026-10-16T12:00:00.000Z",
      },
    };

    const mockAssignResponse = {
      success: true,
      message: "Tables assigned and party seated successfully",
      data: {
        queueEntryId: "queue-entry-999",
        restaurantId: mockRestaurantId,
        tableIds: ["table-1"],
        status: "SEATED",
        seatedAt: "2026-10-16T12:10:00.000Z",
      },
    };

    (queueService.registerWalkIn as jest.Mock).mockResolvedValue(mockRegisterResponse);
    (queueService.assignTables as jest.Mock).mockResolvedValue(mockAssignResponse);

    renderPage();

    // 1. Add walk-in
    const addBtns = screen.getAllByRole("button", { name: /add to queue/i });
    await user.click(addBtns[0]);

    await user.type(screen.getByLabelText(/guest name/i), "Marcus Sterling");
    await user.type(screen.getByLabelText(/phone number/i), "9123456789");
    await user.click(screen.getByRole("button", { name: "Party size 4" }));

    const walkInModal = screen.getByRole("dialog");
    await user.click(within(walkInModal).getByRole("button", { name: /add to queue/i }));

    // Wait for row to appear
    await waitFor(() => {
      expect(screen.getByText("Marcus Sterling")).toBeInTheDocument();
    });

    // 2. Click Assign Table button on the row
    const assignBtn = screen.getByRole("button", { name: /assign table/i });
    await user.click(assignBtn);

    // 3. Verify Assign Table dialog opens
    expect(screen.getByRole("heading", { name: "Assign Table & Seat Party" })).toBeInTheDocument();
    expect(screen.getByText("Table T1")).toBeInTheDocument();

    // Select Table T1
    await user.click(screen.getByText("Table T1"));

    // Confirm assignment
    const confirmBtn = screen.getByRole("button", { name: /confirm & seat party/i });
    await user.click(confirmBtn);

    // 4. Verify assignment API was invoked and UI shows Seated
    await waitFor(() => {
      expect(queueService.assignTables).toHaveBeenCalledWith("queue-entry-999", {
        tables: [{ tableId: "table-1", count: 4 }],
      });
      expect(screen.getByText("SEATED")).toBeInTheDocument();
      expect(screen.getByText("Seated")).toBeInTheDocument();
    });
  });
});
