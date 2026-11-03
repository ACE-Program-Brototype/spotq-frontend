import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { useJoinQueue } from "../hooks/use-join-queue";
import { useQueueEta } from "../hooks/use-queue-eta";
import { setActiveCustomerTicket } from "../utils/active-queue.utils";
import { JoinQueueModal } from "./JoinQueueModal";

jest.mock("../hooks/use-queue-eta");
jest.mock("../hooks/use-join-queue");
jest.mock("../utils/active-queue.utils", () => ({
  ...jest.requireActual("../utils/active-queue.utils"),
  setActiveCustomerTicket: jest.fn(),
}));

describe("JoinQueueModal", () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    restaurantId: "rest-test-999",
    restaurantName: "The Grand Bistro",
    onSuccess: jest.fn(),
  };

  const mockMutateAsync = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useQueueEta as jest.Mock).mockReturnValue({
      data: {
        success: true,
        data: {
          estimatedWaitMinutes: 15,
          partiesAhead: 2,
          partySize: 2,
        },
      },
      isLoading: false,
      isError: false,
    });

    (useJoinQueue as jest.Mock).mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
      error: null,
    });

    useAuthStore.setState({
      user: null,
      accessToken: null,
      isAuthenticated: false,
    });
  });

  const renderComponent = (props = defaultProps) => {
    return render(
      <BrowserRouter>
        <JoinQueueModal {...props} />
      </BrowserRouter>,
    );
  };

  it("does not render when isOpen is false", () => {
    renderComponent({ ...defaultProps, isOpen: false });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders modal with restaurant name, form fields, and ETA preview", () => {
    renderComponent();

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Join the Queue")).toBeInTheDocument();
    expect(screen.getByText("The Grand Bistro")).toBeInTheDocument();
    expect(screen.getByLabelText(/Guest Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone Number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Country Dial Code/i)).toBeInTheDocument();
    expect(screen.getByText(/Live Wait Estimate/i)).toBeInTheDocument();
    expect(screen.getByText(/~15 minutes/i)).toBeInTheDocument();
    expect(screen.getByText(/2 parties ahead/i)).toBeInTheDocument();
  });

  it("pre-populates guest name and phone for authenticated user", () => {
    useAuthStore.setState({
      user: {
        id: "user-1",
        name: "Jessica Jones",
        email: "jessica@example.com",
        phone: "+919876543210",
        role: "CUSTOMER",
      },
      isAuthenticated: true,
      accessToken: "token",
    });

    renderComponent();

    expect(screen.getByLabelText(/Guest Name/i)).toHaveValue("Jessica Jones");
    expect(screen.getByLabelText(/Phone Number/i)).toHaveValue("9876543210");
  });

  it("updates party size when preset button is clicked", async () => {
    const user = userEvent.setup();
    renderComponent();

    const partySize4Btn = screen.getByRole("button", { name: /Party size 4/i });
    await user.click(partySize4Btn);

    expect(screen.getByText("4 Guests")).toBeInTheDocument();
  });

  it("displays loading state for ETA preview", () => {
    (useQueueEta as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true,
      isError: false,
    });

    renderComponent();
    expect(screen.getByTestId("eta-loading")).toBeInTheDocument();
    expect(screen.getByText(/Calculating estimated wait time/i)).toBeInTheDocument();
  });

  it("displays fallback message if ETA calculation fails without blocking form", () => {
    (useQueueEta as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      isError: true,
    });

    renderComponent();
    expect(screen.getByTestId("eta-fallback")).toBeInTheDocument();
    expect(screen.getByText(/Live wait time currently unavailable/i)).toBeInTheDocument();
  });

  it("validates form and blocks submission on empty or invalid inputs", async () => {
    const user = userEvent.setup();
    renderComponent();

    const submitBtn = screen.getByRole("button", { name: /^Join Queue$/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("Guest name is required")).toBeInTheDocument();
      expect(screen.getByText("Phone number is required")).toBeInTheDocument();
    });

    expect(mockMutateAsync).not.toHaveBeenCalled();
  });

  it("submits valid form, sets active ticket, triggers callback, and closes modal", async () => {
    const user = userEvent.setup();
    const mockCreatedEntry = {
      queueEntryId: "entry-abc-123",
      restaurantId: "rest-test-999",
      guestName: "Marcus Vance",
      guestPhone: "+919876543210",
      partySize: 2,
      position: 1,
      estimatedWaitMinutes: 10,
      status: "WAITING",
      queueNumber: "Q-001",
    };

    mockMutateAsync.mockResolvedValue({
      success: true,
      data: mockCreatedEntry,
    });

    renderComponent();

    await user.type(screen.getByLabelText(/Guest Name/i), "Marcus Vance");
    await user.type(screen.getByLabelText(/Phone Number/i), "9876543210");
    await user.type(screen.getByLabelText(/Special Requests/i), "Booth seat please");

    const submitBtn = screen.getByRole("button", { name: /^Join Queue$/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        guestName: "Marcus Vance",
        guestPhone: "+919876543210",
        partySize: 2,
        specialNotes: "Booth seat please",
      });
    });

    expect(setActiveCustomerTicket).toHaveBeenCalledWith({
      queueEntryId: "entry-abc-123",
      restaurantId: "rest-test-999",
      queueNumber: "Q-001",
      status: "WAITING",
    });

    expect(defaultProps.onSuccess).toHaveBeenCalledWith(mockCreatedEntry);
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it("closes dialog on Escape key", () => {
    renderComponent();
    fireEvent.keyDown(window, { key: "Escape" });
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it("closes dialog on cancel button click", async () => {
    const user = userEvent.setup();
    renderComponent();

    const cancelBtn = screen.getByRole("button", { name: /Cancel/i });
    await user.click(cancelBtn);

    expect(defaultProps.onClose).toHaveBeenCalled();
  });
});
