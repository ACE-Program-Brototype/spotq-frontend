import { fireEvent, render, screen } from "@testing-library/react";
import { TransactionFilters } from "./TransactionFilters";

describe("TransactionFilters", () => {
  const defaultProps = {
    searchInput: "",
    onSearchChange: jest.fn(),
    status: "ALL",
    onStatusChange: jest.fn(),
    method: "ALL",
    onMethodChange: jest.fn(),
    datePreset: "ALL",
    onDatePresetChange: jest.fn(),
    customStartDate: "",
    onCustomStartDateChange: jest.fn(),
    customEndDate: "",
    onCustomEndDateChange: jest.fn(),
    isFiltered: false,
    onResetFilters: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders search input, status, method, and date dropdowns", () => {
    render(<TransactionFilters {...defaultProps} />);

    expect(
      screen.getByPlaceholderText("Search by Order #, Customer, or Payment ID..."),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Status")).toBeInTheDocument();
    expect(screen.getByLabelText("Payment Method")).toBeInTheDocument();
    expect(screen.getByLabelText("Date Range")).toBeInTheDocument();
  });

  it("calls onSearchChange when user types in search bar", () => {
    render(<TransactionFilters {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText(
      "Search by Order #, Customer, or Payment ID...",
    );
    fireEvent.change(searchInput, { target: { value: "SQ-98214" } });

    expect(defaultProps.onSearchChange).toHaveBeenCalledWith("SQ-98214");
  });

  it("calls onStatusChange when status dropdown changes", () => {
    render(<TransactionFilters {...defaultProps} />);

    const statusSelect = screen.getByLabelText("Status");
    fireEvent.change(statusSelect, { target: { value: "SUCCESS" } });

    expect(defaultProps.onStatusChange).toHaveBeenCalledWith("SUCCESS");
  });

  it("calls onMethodChange when method dropdown changes", () => {
    render(<TransactionFilters {...defaultProps} />);

    const methodSelect = screen.getByLabelText("Payment Method");
    fireEvent.change(methodSelect, { target: { value: "UPI" } });

    expect(defaultProps.onMethodChange).toHaveBeenCalledWith("UPI");
  });

  it("shows reset filters button and triggers callback when isFiltered is true", () => {
    render(<TransactionFilters {...defaultProps} isFiltered={true} />);

    const resetButton = screen.getByTitle("Reset Filters");
    expect(resetButton).toBeInTheDocument();

    fireEvent.click(resetButton);
    expect(defaultProps.onResetFilters).toHaveBeenCalledTimes(1);
  });

  it("shows custom date inputs when datePreset is CUSTOM", () => {
    render(<TransactionFilters {...defaultProps} datePreset="CUSTOM" />);

    expect(screen.getByText("Start Date:")).toBeInTheDocument();
    expect(screen.getByText("End Date:")).toBeInTheDocument();
  });
});
