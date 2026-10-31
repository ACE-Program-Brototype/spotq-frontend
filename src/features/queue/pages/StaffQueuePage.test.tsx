import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { queueService } from "../services/queue.service";
import StaffQueuePage from "./StaffQueuePage";

jest.mock("../services/queue.service");

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
    });
  });

  it("renders Seat, Skip, and Cancel actions for waiting parties and opens modals", async () => {
    const user = userEvent.setup();
    const mockResponse = {
      success: true,
      message: "Walk-in guest successfully registered to queue",
      data: {
        queueEntryId: "queue-entry-777",
        restaurantId: mockRestaurantId,
        userId: null,
        guestName: "Marcus Vance",
        guestPhone: "+919876543211",
        partySize: 2,
        specialNotes: null,
        registrationType: "WALK_IN",
        position: 1,
        estimatedWaitMinutes: 5,
        status: "WAITING",
        joinedAt: "2026-10-16T12:00:00.000Z",
      },
    };

    (queueService.registerWalkIn as jest.Mock).mockResolvedValue(mockResponse);

    renderPage();

    const addBtns = screen.getAllByRole("button", { name: /add to queue/i });
    await user.click(addBtns[0]);

    await user.type(screen.getByLabelText(/guest name/i), "Marcus Vance");
    await user.type(screen.getByLabelText(/phone number/i), "9876543211");
    await user.click(screen.getByRole("button", { name: "Party size 2" }));

    const modal = screen.getByRole("dialog");
    await user.click(within(modal).getByRole("button", { name: /add to queue/i }));

    await waitFor(() => {
      expect(screen.getByText("Marcus Vance")).toBeInTheDocument();
    });

    const seatBtn = screen.getByRole("button", { name: /seat/i });
    const skipBtn = screen.getByRole("button", { name: /skip/i });
    const cancelBtn = screen.getByRole("button", { name: /cancel/i });

    expect(seatBtn).toBeInTheDocument();
    expect(skipBtn).toBeInTheDocument();
    expect(cancelBtn).toBeInTheDocument();

    await user.click(seatBtn);
    expect(screen.getByText("Seat Party")).toBeInTheDocument();
  });
});
