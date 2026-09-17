import { fireEvent, render, screen } from "@testing-library/react";
import { CustomerFilters } from "./CustomerFilters";

describe("CustomerFilters", () => {
  const defaultProps = {
    search: "",
    onSearchChange: jest.fn(),
    status: "ALL" as const,
    onStatusChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render filter tabs and search input", () => {
    render(<CustomerFilters {...defaultProps} />);

    expect(screen.getByText("Filter Status:")).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "All Users" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tab", { name: "Active" })).toHaveAttribute("aria-selected", "false");
    expect(screen.getByRole("tab", { name: "Inactive" })).toHaveAttribute("aria-selected", "false");
    expect(screen.getByRole("tab", { name: "Blocked" })).toHaveAttribute("aria-selected", "false");
    expect(screen.getByPlaceholderText("Search by name, email...")).toBeInTheDocument();
  });

  it("should trigger onStatusChange when tab is clicked", () => {
    render(<CustomerFilters {...defaultProps} />);

    fireEvent.click(screen.getByRole("tab", { name: "Blocked" }));
    expect(defaultProps.onStatusChange).toHaveBeenCalledWith("BLOCKED");
  });

  it("should trigger onSearchChange when input changes", () => {
    render(<CustomerFilters {...defaultProps} />);

    const input = screen.getByPlaceholderText("Search by name, email...");
    fireEvent.change(input, { target: { value: "Jane" } });
    expect(defaultProps.onSearchChange).toHaveBeenCalledWith("Jane");
  });

  it("should show clear search button and clear value on click", () => {
    render(<CustomerFilters {...defaultProps} search="Jane" />);

    const clearButton = screen.getByRole("button", { name: "Clear search" });
    expect(clearButton).toBeInTheDocument();

    fireEvent.click(clearButton);
    expect(defaultProps.onSearchChange).toHaveBeenCalledWith("");
  });
  it("should render sort toggle button and trigger onToggleSort", () => {
    const onToggleSort = jest.fn();
    render(<CustomerFilters {...defaultProps} sortOrder="DESC" onToggleSort={onToggleSort} />);

    const sortButton = screen.getByRole("button", { name: "Newest First" });
    expect(sortButton).toBeInTheDocument();

    fireEvent.click(sortButton);
    expect(onToggleSort).toHaveBeenCalledTimes(1);
  });
});
