import { fireEvent, render, screen } from "@testing-library/react";
import type { TableItem } from "../types/table.types";
import { DeleteTableDialog } from "./DeleteTableDialog";

describe("DeleteTableDialog", () => {
  const mockTableAvailable: TableItem = {
    id: "table-1",
    tableCode: "T-01",
    capacity: 4,
    status: "AVAILABLE",
    sectionId: "sec-1",
    tableShape: "SQUARE",
    currentOccupancy: 0,
    isActive: true,
  };

  const mockTableOccupied: TableItem = {
    id: "table-2",
    tableCode: "T-02",
    capacity: 6,
    status: "OCCUPIED",
    sectionId: "sec-1",
    tableShape: "CIRCLE",
    currentOccupancy: 4,
    isActive: true,
  };

  it("renders confirmation dialog when table is available", () => {
    const onConfirm = jest.fn();
    const onClose = jest.fn();

    render(
      <DeleteTableDialog
        table={mockTableAvailable}
        isOpen={true}
        onClose={onClose}
        onConfirm={onConfirm}
      />,
    );

    expect(screen.getByText('Delete Table "T-01"?')).toBeInTheDocument();
    expect(
      screen.getByText(/Historical orders, receipts, and revenue reports remain intact/i),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Delete Table" })).toBeInTheDocument();
  });

  it("calls onConfirm with tableId when Delete Table is clicked", () => {
    const onConfirm = jest.fn();
    const onClose = jest.fn();

    render(
      <DeleteTableDialog
        table={mockTableAvailable}
        isOpen={true}
        onClose={onClose}
        onConfirm={onConfirm}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Delete Table" }));
    expect(onConfirm).toHaveBeenCalledWith("table-1");
  });

  it("blocks deletion and displays warning when table is occupied", () => {
    const onConfirm = jest.fn();
    const onClose = jest.fn();

    render(
      <DeleteTableDialog
        table={mockTableOccupied}
        isOpen={true}
        onClose={onClose}
        onConfirm={onConfirm}
      />,
    );

    expect(screen.getByText("Cannot Delete Table T-02")).toBeInTheDocument();
    expect(
      screen.getByText(/Tables with active dining parties cannot be removed/i),
    ).toBeInTheDocument();
    // Destructive delete action should NOT be present
    expect(screen.queryByRole("button", { name: "Delete Table" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Understood" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Understood" }));
    expect(onClose).toHaveBeenCalled();
    expect(onConfirm).not.toHaveBeenCalled();
  });
});
