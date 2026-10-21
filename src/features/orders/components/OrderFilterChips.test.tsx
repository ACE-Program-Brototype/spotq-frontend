import { fireEvent, render, screen } from "@testing-library/react";
import { OrderFilterChips } from "./OrderFilterChips";

describe("OrderFilterChips", () => {
  it("renders status chips including All, Completed, Preparing, Ready, and Cancelled", () => {
    render(<OrderFilterChips selectedStatus="ALL" onSelect={jest.fn()} />);

    expect(screen.getByRole("tab", { name: "Filter by All" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Filter by Placed" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Filter by Confirmed" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Filter by Preparing" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Filter by Ready" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Filter by Served" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Filter by Completed" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Filter by Cancelled" })).toBeInTheDocument();
  });

  it("marks the selected chip with aria-selected=true", () => {
    render(<OrderFilterChips selectedStatus="COMPLETED" onSelect={jest.fn()} />);

    const completedTab = screen.getByRole("tab", { name: "Filter by Completed" });
    const allTab = screen.getByRole("tab", { name: "Filter by All" });

    expect(completedTab).toHaveAttribute("aria-selected", "true");
    expect(allTab).toHaveAttribute("aria-selected", "false");
  });

  it("triggers onSelect callback when clicking a chip", () => {
    const handleSelect = jest.fn();
    render(<OrderFilterChips selectedStatus="ALL" onSelect={handleSelect} />);

    fireEvent.click(screen.getByRole("tab", { name: "Filter by Completed" }));
    expect(handleSelect).toHaveBeenCalledWith("COMPLETED");

    fireEvent.click(screen.getByRole("tab", { name: "Filter by Cancelled" }));
    expect(handleSelect).toHaveBeenCalledWith("CANCELLED");
  });
});
