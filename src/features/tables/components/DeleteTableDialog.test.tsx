import { fireEvent, render, screen } from "@testing-library/react";
import { TABLE_SHAPE, TABLE_STATUS } from "../constants/table.constants";
import type { RestaurantTableDetails } from "../types/table.types";
import { DeleteTableDialog } from "./DeleteTableDialog";

describe("DeleteTableDialog", () => {
  const mockTableAvailable: RestaurantTableDetails = {
    tableId: "table-1",
    restaurantId: "rest-1",
    tableCode: "T-01",
    capacity: 4,
    status: TABLE_STATUS.AVAILABLE,
    sectionId: "sec-1",
    sectionName: "Main",
    shape: TABLE_SHAPE.SQUARE,
    currentOccupancy: 0,
    createdAt: new Date().toISOString(),
  };

  const mockTableOccupied: RestaurantTableDetails = {
    tableId: "table-2",
    restaurantId: "rest-1",
    tableCode: "T-02",
    capacity: 6,
    status: TABLE_STATUS.OCCUPIED,
    sectionId: "sec-1",
    sectionName: "Main",
    shape: TABLE_SHAPE.CIRCLE,
    currentOccupancy: 4,
    createdAt: new Date().toISOString(),
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
      screen.getByText(/This will remove it from your active floor layout/i),
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
