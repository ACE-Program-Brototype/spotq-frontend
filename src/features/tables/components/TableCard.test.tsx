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
    tableShape: "CIRCLE",
    currentOccupancy: 0,
    isActive: true,
  };

  const mockTableOccupied: TableItem = {
    id: "table-2",
    tableCode: "T2",
    capacity: 4,
    status: "OCCUPIED",
    sectionId: "sec-1",
    tableShape: "CIRCLE",
    currentOccupancy: 2,
    isActive: true,
  };

  const mockTableMaintenance: TableItem = {
    id: "table-3",
    tableCode: "T3",
    capacity: 6,
    status: "MAINTENANCE",
    sectionId: "sec-1",
    tableShape: "CIRCLE",
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

  it("renders occupancy ratio for occupied table", () => {
    const handleClick = jest.fn();
    render(<TableCard table={mockTableOccupied} onClick={handleClick} />);

    expect(screen.getByText("T2")).toBeInTheDocument();
    expect(screen.getByText("Occupied")).toBeInTheDocument();
    expect(screen.getByText("2/4")).toBeInTheDocument();
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

  it("hides three-dot actions trigger for available or maintenance tables or when onRelease is omitted", () => {
    const occupiedTable = {
      ...mockTableAvailable,
      id: "table-occ-1",
      status: "OCCUPIED" as const,
      currentOccupancy: 4,
      capacity: 4,
    };

    const { rerender } = render(
      <TableCard table={mockTableAvailable} onClick={jest.fn()} onRelease={jest.fn()} />,
    );
    expect(
      screen.queryByTestId(`table-actions-trigger-${mockTableAvailable.id}`),
    ).not.toBeInTheDocument();

    rerender(
      <TableCard
        table={{ ...mockTableAvailable, id: "table-maint-1", status: "MAINTENANCE" }}
        onClick={jest.fn()}
        onRelease={jest.fn()}
      />,
    );
    expect(screen.queryByTestId("table-actions-trigger-table-maint-1")).not.toBeInTheDocument();

    rerender(<TableCard table={occupiedTable} onClick={jest.fn()} />);
    expect(
      screen.queryByTestId(`table-actions-trigger-${occupiedTable.id}`),
    ).not.toBeInTheDocument();
  });

  it("opens actions menu and calls onRelease without triggering card onClick", () => {
    const handleClick = jest.fn();
    const handleRelease = jest.fn();
    const partialTable = {
      ...mockTableAvailable,
      id: "table-partial-1",
      status: "PARTIAL_OCCUPIED" as const,
      currentOccupancy: 2,
      capacity: 4,
    };

    render(<TableCard table={partialTable} onClick={handleClick} onRelease={handleRelease} />);

    const trigger = screen.getByTestId(`table-actions-trigger-${partialTable.id}`);
    fireEvent.click(trigger);

    expect(handleClick).not.toHaveBeenCalled();
    const menu = screen.getByTestId(`table-actions-menu-${partialTable.id}`);
    expect(menu).toBeInTheDocument();

    const releaseBtn = screen.getByTestId(`release-table-action-${partialTable.id}`);
    expect(releaseBtn).toHaveTextContent("Release Table");

    fireEvent.click(releaseBtn);
    expect(handleRelease).toHaveBeenCalledWith(partialTable);
    expect(handleClick).not.toHaveBeenCalled();
    expect(screen.queryByTestId(`table-actions-menu-${partialTable.id}`)).not.toBeInTheDocument();
  });

  it("closes actions menu on Escape key and outside click", () => {
    const occupiedTable = {
      ...mockTableAvailable,
      id: "table-occ-2",
      status: "OCCUPIED" as const,
      currentOccupancy: 4,
      capacity: 4,
    };

    render(
      <div>
        <div data-testid="outside-area">Outside</div>
        <TableCard table={occupiedTable} onClick={jest.fn()} onRelease={jest.fn()} />
      </div>,
    );

    const trigger = screen.getByTestId(`table-actions-trigger-${occupiedTable.id}`);
    fireEvent.click(trigger);
    expect(screen.getByTestId(`table-actions-menu-${occupiedTable.id}`)).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByTestId(`table-actions-menu-${occupiedTable.id}`)).not.toBeInTheDocument();

    fireEvent.click(trigger);
    expect(screen.getByTestId(`table-actions-menu-${occupiedTable.id}`)).toBeInTheDocument();

    fireEvent.mouseDown(screen.getByTestId("outside-area"));
    expect(screen.queryByTestId(`table-actions-menu-${occupiedTable.id}`)).not.toBeInTheDocument();
  });
});
