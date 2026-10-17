import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { queueService } from "../services/queue.service";
import { WalkInRegistrationModal } from "./WalkInRegistrationModal";

jest.mock("../services/queue.service");

describe("WalkInRegistrationModal", () => {
  let queryClient: QueryClient;
  const mockRestaurantId = "rest-test-456";

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
        email: "staff@restaurant.com",
        restaurantId: mockRestaurantId,
        role: "STAFF",
      },
      isAuthenticated: true,
      accessToken: "mock-token",
    });
  });

  const renderModal = (props: {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: jest.Mock;
    restaurantId?: string;
  }) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <WalkInRegistrationModal {...props} />
      </QueryClientProvider>,
    );
  };

  it("does not render when isOpen is false", () => {
    renderModal({ isOpen: false, onClose: jest.fn() });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders modal with all form controls when isOpen is true", () => {
    renderModal({ isOpen: true, onClose: jest.fn() });

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Add to Queue" })).toBeInTheDocument();
    expect(screen.getByLabelText(/guest name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByText("Party Size")).toBeInTheDocument();
    expect(screen.getByLabelText(/special notes/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /add to queue/i })).toBeInTheDocument();
  });

  it("applies autoFocus to guest name input without stealing focus from other inputs", async () => {
    const user = userEvent.setup();
    renderModal({ isOpen: true, onClose: jest.fn() });

    const guestNameInput = screen.getByLabelText(/guest name/i);
    expect(guestNameInput).toHaveFocus();

    const phoneInput = screen.getByLabelText(/phone number/i);
    await user.click(phoneInput);
    expect(phoneInput).toHaveFocus();
  });

  it("updates party size when preset buttons are clicked", async () => {
    const user = userEvent.setup();
    renderModal({ isOpen: true, onClose: jest.fn() });

    const preset4 = screen.getByRole("button", { name: "Party size 4" });
    expect(preset4).toHaveAttribute("aria-pressed", "false");
    await user.click(preset4);

    expect(preset4).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("4 Guests")).toBeInTheDocument();
  });

  it("shows custom counter when 6+ preset is clicked", async () => {
    const user = userEvent.setup();
    renderModal({ isOpen: true, onClose: jest.fn() });

    const preset6Plus = screen.getByRole("button", { name: "Party size 6+" });
    await user.click(preset6Plus);

    expect(screen.getByText("Exact Party Size:")).toBeInTheDocument();

    const increaseBtn = screen.getByRole("button", { name: "Increase party size" });
    await user.click(increaseBtn);

    expect(screen.getByText("7 Guests")).toBeInTheDocument();
  });

  it("validates empty form submission and shows validation errors", async () => {
    const user = userEvent.setup();
    renderModal({ isOpen: true, onClose: jest.fn() });

    const submitBtn = screen.getByRole("button", { name: /add to queue/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("Guest name is required")).toBeInTheDocument();
      expect(screen.getByText("Phone number is required")).toBeInTheDocument();
    });
  });

  it("submits the form successfully and triggers onClose and onSuccess", async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    const onSuccess = jest.fn();

    const mockResponse = {
      success: true,
      message: "Walk-in guest successfully registered to queue",
      data: {
        queueEntryId: "queue-entry-888",
        restaurantId: mockRestaurantId,
        userId: null,
        guestName: "David Miller",
        guestPhone: "+919876543210",
        partySize: 2,
        specialNotes: "Prefers booth",
        registrationType: "WALK_IN",
        position: 1,
        estimatedWaitMinutes: 10,
        status: "WAITING",
        joinedAt: "2026-10-16T12:00:00.000Z",
      },
    };

    (queueService.registerWalkIn as jest.Mock).mockResolvedValue(mockResponse);

    renderModal({ isOpen: true, onClose, onSuccess });

    await user.type(screen.getByLabelText(/guest name/i), "David Miller");
    await user.type(screen.getByLabelText(/phone number/i), "9876543210");
    await user.type(screen.getByLabelText(/special notes/i), "Prefers booth");

    await user.click(screen.getByRole("button", { name: /add to queue/i }));

    await waitFor(() => {
      expect(queueService.registerWalkIn).toHaveBeenCalledWith(
        mockRestaurantId,
        expect.objectContaining({
          guestName: "David Miller",
          guestPhone: "9876543210",
          partySize: 2,
          specialNotes: "Prefers booth",
        }),
      );
      expect(onClose).toHaveBeenCalled();
      expect(onSuccess).toHaveBeenCalledWith(mockResponse.data);
    });
  });

  it("calls onClose when Cancel button is clicked", async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    renderModal({ isOpen: true, onClose });

    const cancelBtn = screen.getByRole("button", { name: /cancel/i });
    await user.click(cancelBtn);

    expect(onClose).toHaveBeenCalled();
  });
});
