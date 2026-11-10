import { fireEvent, render, screen } from "@testing-library/react";
import { PaymentFilterTabs } from "./PaymentFilterTabs";

describe("PaymentFilterTabs", () => {
  it("renders all four filter tabs with active selection", () => {
    const handleSelect = jest.fn();
    render(<PaymentFilterTabs selectedStatus="ALL" onSelect={handleSelect} />);

    expect(screen.getByText("All")).toBeInTheDocument();
    expect(screen.getByText("Success")).toBeInTheDocument();
    expect(screen.getByText("Failed")).toBeInTheDocument();
    expect(screen.getByText("Refunded")).toBeInTheDocument();

    const allTab = screen.getByTestId("payment-filter-tab-all");
    expect(allTab).toHaveAttribute("aria-selected", "true");
    expect(allTab.className).toContain("bg-[#ff6b00]");

    const successTab = screen.getByTestId("payment-filter-tab-success");
    expect(successTab).toHaveAttribute("aria-selected", "false");
  });

  it("calls onSelect when clicking a filter tab", () => {
    const handleSelect = jest.fn();
    render(<PaymentFilterTabs selectedStatus="ALL" onSelect={handleSelect} />);

    fireEvent.click(screen.getByTestId("payment-filter-tab-failed"));
    expect(handleSelect).toHaveBeenCalledWith("FAILED");
  });
});
