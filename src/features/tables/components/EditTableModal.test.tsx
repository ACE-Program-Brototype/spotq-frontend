import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { TABLE_SHAPE, TABLE_STATUS } from "../constants/table.constants";
import type { RestaurantTableDetails } from "../types/table.types";
import { EditTableModal } from "./EditTableModal";

jest.mock("../hooks/useTableSections", () => ({
  useTableSections: jest.fn(() => ({
    sections: [
      { id: "sec-1", name: "Patio" },
      { id: "sec-2", name: "Main Dining" },
    ],
    isLoading: false,
    isError: false,
  })),
}));

describe("EditTableModal", () => {
  const restaurantId = "rest-123";
  const mockTable: RestaurantTableDetails = {
    tableId: "table-1",
    restaurantId: "rest-123",
    tableCode: "T-01",
    capacity: 4,
    status: TABLE_STATUS.AVAILABLE,
    sectionId: "sec-1",
    sectionName: "Patio",
    shape: TABLE_SHAPE.SQUARE,
    currentOccupancy: 0,
    createdAt: new Date().toISOString(),
  };

  const mockOccupiedTable: RestaurantTableDetails = {
    ...mockTable,
    status: TABLE_STATUS.OCCUPIED,
    currentOccupancy: 3,
  };

  it("renders with pre-populated values when open", () => {
    render(
      <EditTableModal
        table={mockTable}
        isOpen={true}
        onClose={jest.fn()}
        restaurantId={restaurantId}
        onSubmit={jest.fn()}
      />,
    );

    expect(screen.getByText("Edit Table T-01")).toBeInTheDocument();
    expect(screen.getByDisplayValue("T-01")).toBeInTheDocument();
    expect(screen.getByDisplayValue("4")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Patio")).toBeInTheDocument();
  });

  it("displays warning note when table is occupied", () => {
    render(
      <EditTableModal
        table={mockOccupiedTable}
        isOpen={true}
        onClose={jest.fn()}
        restaurantId={restaurantId}
        onSubmit={jest.fn()}
      />,
    );

    expect(screen.getByRole("note")).toBeInTheDocument();
    expect(screen.getByText(/This table is currently occupied by guests/i)).toBeInTheDocument();
  });

  it("submits updated values when form is changed and submitted", async () => {
    const onSubmit = jest.fn().mockResolvedValue(true);
    const onClose = jest.fn();

    render(
      <EditTableModal
        table={mockTable}
        isOpen={true}
        onClose={onClose}
        restaurantId={restaurantId}
        onSubmit={onSubmit}
      />,
    );

    const capacityInput = screen.getByLabelText(/Seating Capacity/i);
    fireEvent.change(capacityInput, { target: { value: "8" } });

    const submitBtn = screen.getByRole("button", { name: "Save Changes" });
    expect(submitBtn).toBeEnabled();
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith("table-1", {
        tableCode: "T-01",
        sectionId: "sec-1",
        capacity: 8,
        tableShape: TABLE_SHAPE.SQUARE,
      });
      expect(onClose).toHaveBeenCalled();
    });
  });

  it("closes modal when Cancel is clicked", () => {
    const onClose = jest.fn();

    render(
      <EditTableModal
        table={mockTable}
        isOpen={true}
        onClose={onClose}
        restaurantId={restaurantId}
        onSubmit={jest.fn()}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onClose).toHaveBeenCalled();
  });
});
