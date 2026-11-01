import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { ACTIVE_QUEUE_STORAGE_KEY } from "../constants/websocket.constants";
import { useCustomerQueueSocket } from "../hooks/use-customer-queue-socket";
import type { CustomerRingPayload } from "../types/ring-alert.types";
import { CustomerRingAlertContainer } from "./CustomerRingAlertContainer";

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

describe("CustomerRingAlertContainer", () => {
  let mockSocketCallbacks: {
    onRing?: (payload: CustomerRingPayload) => void;
    onSeated?: (payload?: unknown) => void;
    onCancelled?: (payload?: unknown) => void;
  };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    mockSocketCallbacks = {};

    (useCustomerQueueSocket as jest.Mock).mockImplementation((_queueEntryId, _token, options) => {
      mockSocketCallbacks = options || {};
      return { isConnected: true };
    });

    useAuthStore.setState({
      accessToken: "test-token",
      user: { email: "customer@example.com", role: "CUSTOMER" },
      isAuthenticated: true,
    });
  });

  it("does not render modal initially when no ring event occurred", () => {
    localStorage.setItem(
      ACTIVE_QUEUE_STORAGE_KEY,
      JSON.stringify({ queueEntryId: "entry-101", restaurantId: "rest-1" }),
    );

    render(<CustomerRingAlertContainer />);

    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });

  it("opens modal when onRing callback is triggered from socket hook", () => {
    render(<CustomerRingAlertContainer queueEntryId="entry-101" restaurantId="rest-1" />);

    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();

    act(() => {
      mockSocketCallbacks.onRing?.({
        event: "ticket:called",
        queueEntryId: "entry-101",
        restaurantId: "rest-1",
        ringCount: 1,
        message: "Your table is ready!",
        assignedTableIds: ["T-12"],
      });
    });

    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
    expect(screen.getByText("Your Table is Ready!")).toBeInTheDocument();
    expect(screen.getByText("T-12")).toBeInTheDocument();
  });

  it("closes modal when clicking I'm Heading Over", async () => {
    const user = userEvent.setup();

    render(<CustomerRingAlertContainer queueEntryId="entry-101" restaurantId="rest-1" />);

    act(() => {
      mockSocketCallbacks.onRing?.({
        event: "ticket:called",
        queueEntryId: "entry-101",
        restaurantId: "rest-1",
        ringCount: 1,
        message: "Your table is ready!",
      });
    });

    expect(screen.getByRole("alertdialog")).toBeInTheDocument();

    const closeBtn = screen.getByRole("button", { name: /I'm Heading Over/i });
    await user.click(closeBtn);

    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });

  it("closes modal and clears storage when onSeated event is triggered", () => {
    localStorage.setItem(
      ACTIVE_QUEUE_STORAGE_KEY,
      JSON.stringify({ queueEntryId: "entry-101", restaurantId: "rest-1" }),
    );

    render(<CustomerRingAlertContainer />);

    act(() => {
      mockSocketCallbacks.onRing?.({
        event: "ticket:called",
        queueEntryId: "entry-101",
        restaurantId: "rest-1",
      });
    });

    expect(screen.getByRole("alertdialog")).toBeInTheDocument();

    act(() => {
      mockSocketCallbacks.onSeated?.();
    });

    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    expect(localStorage.getItem(ACTIVE_QUEUE_STORAGE_KEY)).toBeNull();
  });
});
