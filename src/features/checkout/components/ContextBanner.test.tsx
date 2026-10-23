import { fireEvent, render, screen } from "@testing-library/react";
import type { DiningContext } from "../types/checkout.types";
import { ContextBanner } from "./ContextBanner";

describe("ContextBanner", () => {
  const baseContext: DiningContext = {
    flow: "SELF_SERVICE_TABLE",
    tableNumber: "04",
    restaurantName: "Spice Garden Cafe",
    restaurantId: "rest-123",
    queueToken: "#Q-24",
    estimatedWaitMinutes: 25,
  };

  it("renders verified Table Number and Self-Service Pro banner when in table flow", () => {
    render(<ContextBanner context={baseContext} />);

    expect(screen.getByText(/Table 04 \| Spice Garden Cafe/i)).toBeInTheDocument();
    expect(screen.getByText(/Verified Table QR/i)).toBeInTheDocument();
    expect(screen.getByText(/Self-Service Pro/i)).toBeInTheDocument();
  });

  it("renders Queue Token and ETA when customer is in Queue Pro waitlist", () => {
    const queueContext: DiningContext = {
      ...baseContext,
      flow: "QUEUE_PRE_ORDER",
    };

    render(<ContextBanner context={queueContext} />);

    expect(screen.getByText(/Queue Token #Q-24/i)).toBeInTheDocument();
    expect(screen.getByText(/Pre-Order for Seating/i)).toBeInTheDocument();
    expect(screen.getByText(/~25 mins/i)).toBeInTheDocument();
  });

  it("highlights Priority Delivery when in Running Add-on re-order flow", () => {
    const addonContext: DiningContext = {
      ...baseContext,
      flow: "RUNNING_ADDON",
    };

    render(<ContextBanner context={addonContext} />);

    expect(
      screen.getByText(/⚡ Priority Delivery: Dispatched to kitchen immediately/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Table 04 Add-on/i)).toBeInTheDocument();
  });

  it("calls onSwitchFlow when quick switcher tabs are clicked", () => {
    const mockSwitch = jest.fn();
    render(<ContextBanner context={baseContext} onSwitchFlow={mockSwitch} />);

    const queueTab = screen.getByRole("button", { name: /Queue Pro/i });
    fireEvent.click(queueTab);

    expect(mockSwitch).toHaveBeenCalledWith("QUEUE_PRE_ORDER");

    const addonTab = screen.getByRole("button", { name: /Running Add-on/i });
    fireEvent.click(addonTab);

    expect(mockSwitch).toHaveBeenCalledWith("RUNNING_ADDON");
  });
});
