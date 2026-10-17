import { fireEvent, render, screen } from "@testing-library/react";
import type { TableItem } from "../types/table.types";
import { TableCard } from "./TableCard";

describe("TableCard", () => {
  const mockTableAvailable: TableItem = {
    id: "table-1",
    tableCode: "T1",
    capacity: 4,
    status: "AVAILABLE",
    sectionId: "sec-1",
    tableShape: "SQUARE",
    currentOccupancy: 0,
    isActive: true,
  };

  const mockTableOccupied: TableItem = {
    id: "table-2",
    tableCode: "T2",
    capacity: 4,
    status: "OCCUPIED",
    sectionId: "sec-1",
    tableShape: "SQUARE",
    currentOccupancy: 2,
    isActive: true,
    occupiedDurationMinutes: 45,
  };

  const mockTableMaintenance: TableItem = {
    id: "table-3",
    tableCode: "T3",
    capacity: 6,
    status: "MAINTENANCE",
    sectionId: "sec-1",
    tableShape: "SQUARE",
    currentOccupancy: 0,
    isActive: false,
  };

  it("renders table code, status badge, and seat count for available table", () => {
    const handleClick = jest.fn();
    render(<TableCard table={mockTableAvailable} onClick={handleClick} />);

    expect(screen.getByText("T1")).toBeInTheDocument();
    expect(screen.getByText("Available")).toBeInTheDocument();
    expect(screen.getByText("4 Seats")).toBeInTheDocument();
  });

  it("renders occupancy ratio and duration for occupied table", () => {
    const handleClick = jest.fn();
    render(<TableCard table={mockTableOccupied} onClick={handleClick} />);

    expect(screen.getByText("T2")).toBeInTheDocument();
    expect(screen.getByText("Occupied")).toBeInTheDocument();
    expect(screen.getByText("2/4")).toBeInTheDocument();
    expect(screen.getByText("45m")).toBeInTheDocument();
  });

  it("renders maintenance status badge and capacity for maintenance table", () => {
    const handleClick = jest.fn();
    render(<TableCard table={mockTableMaintenance} onClick={handleClick} />);

    expect(screen.getByText("T3")).toBeInTheDocument();
    expect(screen.getByText("Maintenance")).toBeInTheDocument();
    expect(screen.getByText("6 Seats")).toBeInTheDocument();
  });

  it("invokes onClick when clicked", () => {
    const handleClick = jest.fn();
    render(<TableCard table={mockTableAvailable} onClick={handleClick} />);

    const card = screen.getByRole("button");
    fireEvent.click(card);
    expect(handleClick).toHaveBeenCalledWith(mockTableAvailable);
  });
});
