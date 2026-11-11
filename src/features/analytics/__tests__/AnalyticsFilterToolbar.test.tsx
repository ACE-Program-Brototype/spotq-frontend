import { fireEvent, render, screen } from "@testing-library/react";
import { AnalyticsFilterToolbar } from "../components/common/AnalyticsFilterToolbar";
import { ANALYTICS_PERIODS, ORDER_STATUS_FILTERS } from "../types/restaurant-analytics.types";

describe("AnalyticsFilterToolbar", () => {
  const defaultProps = {
    interval: ANALYTICS_PERIODS.MONTH,
    month: 11,
    year: 2026,
    status: ORDER_STATUS_FILTERS.ALL,
    onIntervalChange: jest.fn(),
    onDayChange: jest.fn(),
    onMonthChange: jest.fn(),
    onYearChange: jest.fn(),
    onStatusChange: jest.fn(),
    onReset: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all interval buttons and active month/year", () => {
    render(<AnalyticsFilterToolbar {...defaultProps} />);

    expect(screen.getByText("Today")).toBeInTheDocument();
    expect(screen.getByText("This Week")).toBeInTheDocument();
    expect(screen.getByText("This Month")).toBeInTheDocument();
    expect(screen.getByText("This Year")).toBeInTheDocument();

    const monthSelect = screen.getByLabelText("Select month");
    expect(monthSelect).toHaveValue("11");

    const yearSelect = screen.getByLabelText("Select year");
    expect(yearSelect).toHaveValue("2026");
  });

  it("calls onIntervalChange when clicking interval buttons", () => {
    render(<AnalyticsFilterToolbar {...defaultProps} />);

    fireEvent.click(screen.getByText("Today"));
    expect(defaultProps.onIntervalChange).toHaveBeenCalledWith(ANALYTICS_PERIODS.DAY);

    fireEvent.click(screen.getByText("This Year"));
    expect(defaultProps.onIntervalChange).toHaveBeenCalledWith(ANALYTICS_PERIODS.YEAR);
  });

  it("renders Day select only when interval is DAY", () => {
    const { rerender } = render(<AnalyticsFilterToolbar {...defaultProps} />);
    expect(screen.queryByLabelText("Select day")).not.toBeInTheDocument();

    rerender(
      <AnalyticsFilterToolbar {...defaultProps} interval={ANALYTICS_PERIODS.DAY} day={10} />,
    );
    expect(screen.getByLabelText("Select day")).toBeInTheDocument();
    expect(screen.getByLabelText("Select day")).toHaveValue("10");
  });

  it("triggers onStatusChange when selecting a status", () => {
    render(<AnalyticsFilterToolbar {...defaultProps} />);

    const statusSelect = screen.getByLabelText("Filter order status");
    fireEvent.change(statusSelect, { target: { value: "COMPLETED" } });

    expect(defaultProps.onStatusChange).toHaveBeenCalledWith("COMPLETED");
  });

  it("triggers onReset when clicking reset button", () => {
    render(<AnalyticsFilterToolbar {...defaultProps} />);

    fireEvent.click(screen.getByTitle("Reset to default filters"));
    expect(defaultProps.onReset).toHaveBeenCalled();
  });
});
