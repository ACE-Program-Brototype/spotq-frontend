import { fireEvent, render, screen } from "@testing-library/react";
import { OrderStatusDistributionCard } from "../components/overview/OrderStatusDistributionCard";
import type { OrderStatusBreakdownResultDto } from "../types/restaurant-analytics.types";

describe("OrderStatusDistributionCard", () => {
  const mockBreakdown: OrderStatusBreakdownResultDto = {
    status: "AVAILABLE",
    totalOrdersTracked: 23,
    distribution: [
      {
        status: "CONFIRMED",
        count: 4,
        percentage: 17.39,
        amountRupees: 1722,
      },
      {
        status: "CANCELLED",
        count: 3,
        percentage: 13.04,
        amountRupees: 718.5,
      },
      {
        status: "PLACED",
        count: 2,
        percentage: 8.7,
        amountRupees: 529.75,
      },
      {
        status: "SERVED",
        count: 2,
        percentage: 8.7,
        amountRupees: 619,
      },
      {
        status: "PREPARING",
        count: 3,
        percentage: 13.04,
        amountRupees: 850,
      },
      {
        status: "COMPLETED",
        count: 9,
        percentage: 39.13,
        amountRupees: 2500,
      },
    ],
  };

  it("renders pie chart SVG and status legend breakdown", () => {
    render(<OrderStatusDistributionCard breakdown={mockBreakdown} />);

    expect(screen.getByText("Order Fulfillment")).toBeInTheDocument();
    expect(screen.getByText("23 tracked")).toBeInTheDocument();

    // Verify SVG is rendered with pie chart role
    const svg = screen.getByRole("img", { name: "Order status pie chart" });
    expect(svg).toBeInTheDocument();

    // Verify statuses in legend
    expect(screen.getByText("Completed Orders")).toBeInTheDocument();
    expect(screen.getByText("Cancelled Orders")).toBeInTheDocument();
    expect(screen.getByText("Confirmed")).toBeInTheDocument();
    expect(screen.getByText("Preparing")).toBeInTheDocument();

    // Verify amounts
    expect(screen.getByText(/₹1,722/)).toBeInTheDocument();
    expect(screen.getByText(/₹718.50/)).toBeInTheDocument();
  });

  it("toggles between pie and donut chart modes", () => {
    render(<OrderStatusDistributionCard breakdown={mockBreakdown} />);

    const donutButton = screen.getByRole("button", { name: /donut/i });
    fireEvent.click(donutButton);

    // In donut mode, center text displays total orders
    expect(screen.getByText("Total Orders")).toBeInTheDocument();

    const pieButton = screen.getByRole("button", { name: /pie/i });
    fireEvent.click(pieButton);

    // In pie mode, center text is not present
    expect(screen.queryByText("Total Orders")).not.toBeInTheDocument();
  });

  it("handles empty orders gracefully with zero-state message", () => {
    const emptyBreakdown: OrderStatusBreakdownResultDto = {
      status: "AVAILABLE",
      totalOrdersTracked: 0,
      distribution: [],
    };

    render(<OrderStatusDistributionCard breakdown={emptyBreakdown} />);
    expect(screen.getByText("No Orders")).toBeInTheDocument();
    expect(screen.getByText("Zero orders in this period")).toBeInTheDocument();
  });

  it("returns null when status is UNAVAILABLE", () => {
    const unavailableBreakdown: OrderStatusBreakdownResultDto = {
      status: "UNAVAILABLE",
      error: { code: "SERVICE_DOWN", message: "Down" },
    };

    const { container } = render(
      <OrderStatusDistributionCard breakdown={unavailableBreakdown} />,
    );
    expect(container).toBeEmptyDOMElement();
  });
});
