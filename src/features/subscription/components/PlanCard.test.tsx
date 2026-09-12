import { fireEvent, render, screen } from "@testing-library/react";
import { PlanCard } from "./PlanCard";

describe("PlanCard", () => {
  const mockPlan = {
    id: "plan-1",
    code: "QUEUE_PRO",
    name: "Queue Pro",
    description: "Best for busy walk-in restaurants",
    pricePaise: 149900,
    priceInRupees: 1499,
    currency: "INR",
    billingCycle: "MONTHLY" as const,
    features: ["Smart Waitlist Management", "SMS & WhatsApp Queue Alerts"],
  };

  it("renders plan details, price and features correctly", () => {
    render(<PlanCard plan={mockPlan} onSelect={jest.fn()} />);

    expect(screen.getByText("Queue Pro")).toBeInTheDocument();
    expect(screen.getByText("Best for busy walk-in restaurants")).toBeInTheDocument();
    expect(screen.getByText("₹1,499")).toBeInTheDocument();
    expect(screen.getByText("/monthly")).toBeInTheDocument();
    expect(screen.getByText("Smart Waitlist Management")).toBeInTheDocument();
    expect(screen.getByText("SMS & WhatsApp Queue Alerts")).toBeInTheDocument();
    expect(screen.getByText("Most Popular")).toBeInTheDocument();
  });

  it("calls onSelect with plan ID when button is clicked", () => {
    const onSelect = jest.fn();
    render(<PlanCard plan={mockPlan} onSelect={onSelect} />);

    const button = screen.getByTestId("btn-select-plan-queue_pro");
    fireEvent.click(button);

    expect(onSelect).toHaveBeenCalledWith("plan-1");
  });

  it("disables button and shows loading state when isLoading is true", () => {
    render(<PlanCard plan={mockPlan} isLoading={true} onSelect={jest.fn()} />);

    const button = screen.getByTestId("btn-select-plan-queue_pro");
    expect(button).toBeDisabled();
    expect(screen.getByText("Processing Order...")).toBeInTheDocument();
  });

  it("disables button when disabled prop is true", () => {
    render(<PlanCard plan={mockPlan} disabled={true} onSelect={jest.fn()} />);

    const button = screen.getByTestId("btn-select-plan-queue_pro");
    expect(button).toBeDisabled();
    expect(screen.getByText("Get Started with Queue Pro")).toBeInTheDocument();
  });
});
