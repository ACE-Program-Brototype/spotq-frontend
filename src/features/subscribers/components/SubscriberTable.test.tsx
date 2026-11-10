import { fireEvent, render, screen } from "@testing-library/react";
import type { SubscriberSummary } from "../types/subscriber.types";
import { SubscriberTable } from "./SubscriberTable";

const mockSubscribers: SubscriberSummary[] = [
  {
    id: "sub-1",
    restaurantId: "rest-1",
    restaurantName: "The Grand Diner",
    subscriberName: "Bob Smith",
    subscriberEmail: "bob@example.com",
    planName: "Pro Tier",
    planCode: "PRO",
    billingCycle: "MONTHLY",
    price: 499900,
    currency: "INR",
    status: "ACTIVE",
    currentPeriodStart: "2026-11-01T00:00:00.000Z",
    currentPeriodEnd: "2026-12-01T00:00:00.000Z",
    createdAt: "2026-11-01T00:00:00.000Z",
  },
];

describe("SubscriberTable", () => {
  const defaultProps = {
    subscribers: mockSubscribers,
    onViewDetails: jest.fn(),
    isFiltered: false,
    onResetFilters: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render table headers and subscriber data", () => {
    render(<SubscriberTable {...defaultProps} />);

    expect(screen.getByTestId("subscriber-table")).toBeInTheDocument();
    expect(screen.getByText("The Grand Diner")).toBeInTheDocument();
    expect(screen.getByText("bob@example.com")).toBeInTheDocument();
    expect(screen.getByText("Pro Tier")).toBeInTheDocument();
    expect(screen.getByText("Monthly")).toBeInTheDocument();
    expect(screen.getByTestId("subscriber-status-badge")).toBeInTheDocument();
  });

  it("should call onViewDetails when View Details button is clicked", () => {
    render(<SubscriberTable {...defaultProps} />);

    const viewBtn = screen.getByTestId("view-subscriber-btn-sub-1");
    fireEvent.click(viewBtn);

    expect(defaultProps.onViewDetails).toHaveBeenCalledWith(mockSubscribers[0]);
  });

  it("should render empty state when no subscribers are present", () => {
    render(<SubscriberTable {...defaultProps} subscribers={[]} isFiltered={false} />);

    expect(screen.getByTestId("subscriber-empty-state")).toBeInTheDocument();
  });

  it("should render filtered empty state with reset button when filtered", () => {
    render(<SubscriberTable {...defaultProps} subscribers={[]} isFiltered={true} />);

    expect(screen.getByTestId("subscriber-filtered-empty-state")).toBeInTheDocument();
    const resetBtn = screen.getByTestId("reset-filters-btn");
    fireEvent.click(resetBtn);
    expect(defaultProps.onResetFilters).toHaveBeenCalledTimes(1);
  });

  it("should invoke onSort with backend sortKey when clicking sortable column headers", () => {
    const onSort = jest.fn();
    render(
      <SubscriberTable {...defaultProps} sortBy="createdAt" sortOrder="desc" onSort={onSort} />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Sort by Renewal / Expiry" }));
    expect(onSort).toHaveBeenCalledWith("currentPeriodEnd", "asc");
  });
});
