import { fireEvent, render, screen } from "@testing-library/react";
import { SubscriberFilters } from "./SubscriberFilters";

describe("SubscriberFilters", () => {
  const defaultProps = {
    search: "",
    onSearchChange: jest.fn(),
    status: "ALL" as const,
    onStatusChange: jest.fn(),
    sortOrder: "desc" as const,
    onToggleSort: jest.fn(),
    onClearFilters: jest.fn(),
    isFiltered: false,
    disabled: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render all status filter tabs and search input", () => {
    render(<SubscriberFilters {...defaultProps} />);

    expect(screen.getByTestId("subscriber-filters")).toBeInTheDocument();
    expect(screen.getByTestId("subscriber-filter-tab-all")).toBeInTheDocument();
    expect(screen.getByTestId("subscriber-filter-tab-active")).toBeInTheDocument();
    expect(screen.getByTestId("subscriber-filter-tab-pending")).toBeInTheDocument();
    expect(screen.getByTestId("subscriber-filter-tab-expired")).toBeInTheDocument();
    expect(screen.getByTestId("subscriber-filter-tab-cancelled")).toBeInTheDocument();
    expect(screen.getByTestId("subscriber-filter-tab-past_due")).toBeInTheDocument();
    expect(screen.getByTestId("subscriber-search-input")).toBeInTheDocument();
  });

  it("should trigger onStatusChange when a tab is clicked", () => {
    render(<SubscriberFilters {...defaultProps} />);

    fireEvent.click(screen.getByTestId("subscriber-filter-tab-active"));
    expect(defaultProps.onStatusChange).toHaveBeenCalledWith("ACTIVE");
  });

  it("should trigger onSearchChange when typing in the search box", () => {
    render(<SubscriberFilters {...defaultProps} />);

    fireEvent.change(screen.getByTestId("subscriber-search-input"), {
      target: { value: "pizza" },
    });
    expect(defaultProps.onSearchChange).toHaveBeenCalledWith("pizza");
  });

  it("should trigger onToggleSort when sort button is clicked", () => {
    render(<SubscriberFilters {...defaultProps} />);

    fireEvent.click(screen.getByTestId("subscriber-sort-toggle"));
    expect(defaultProps.onToggleSort).toHaveBeenCalledTimes(1);
  });

  it("should render clear filters button when isFiltered is true and trigger onClearFilters", () => {
    render(<SubscriberFilters {...defaultProps} isFiltered={true} search="pizza" />);

    const clearBtn = screen.getByTestId("clear-filters-button");
    expect(clearBtn).toBeInTheDocument();

    fireEvent.click(clearBtn);
    expect(defaultProps.onClearFilters).toHaveBeenCalledTimes(1);
  });
});
