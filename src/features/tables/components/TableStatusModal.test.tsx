import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type React from "react";
import { tableService } from "../services/table.service";
import type { TableItem } from "../types/table.types";
import { TableStatusModal } from "./TableStatusModal";

jest.mock("../services/table.service", () => ({
  tableService: {
    updateTableStatus: jest.fn(),
  },
}));

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe("TableStatusModal", () => {
  const restaurantId = "23193584-340b-40bf-963e-ac67cbbebd08";

  const availableTable: TableItem = {
    id: "table-1",
    tableCode: "T1",
    capacity: 4,
    status: "AVAILABLE",
    sectionId: "sec-1",
    tableShape: "CIRCLE",
    currentOccupancy: 0,
    isActive: true,
  };

  const maintenanceTable: TableItem = {
    id: "table-2",
    tableCode: "T2",
    capacity: 2,
    status: "MAINTENANCE",
    sectionId: "sec-1",
    tableShape: "CIRCLE",
    currentOccupancy: 0,
    isActive: false,
  };

  const occupiedTable: TableItem = {
    id: "table-3",
    tableCode: "T3",
    capacity: 6,
    status: "OCCUPIED",
    sectionId: "sec-1",
    tableShape: "CIRCLE",
    currentOccupancy: 4,
    isActive: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("does not render when isOpen is false", () => {
    render(
      <TableStatusModal
        table={availableTable}
        isOpen={false}
        onClose={jest.fn()}
        restaurantId={restaurantId}
      />,
      { wrapper: createWrapper() },
    );

    expect(screen.queryByText("Table T1")).not.toBeInTheDocument();
  });

  it("shows 'Mark for Maintenance' when table is AVAILABLE", async () => {
    (tableService.updateTableStatus as jest.Mock).mockResolvedValue({
      success: true,
      statusCode: 200,
    });
    const handleClose = jest.fn();

    render(
      <TableStatusModal
        table={availableTable}
        isOpen={true}
        onClose={handleClose}
        restaurantId={restaurantId}
      />,
      { wrapper: createWrapper() },
    );

    expect(screen.getByText("Table T1")).toBeInTheDocument();
    expect(screen.getByText("Set to Maintenance")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Set to Maintenance"));

    await waitFor(() => {
      expect(tableService.updateTableStatus).toHaveBeenCalledWith(
        restaurantId,
        "table-1",
        "MAINTENANCE",
      );
      expect(handleClose).toHaveBeenCalled();
    });
  });

  it("shows 'Set as Available' when table is in MAINTENANCE", async () => {
    (tableService.updateTableStatus as jest.Mock).mockResolvedValue({
      success: true,
      statusCode: 200,
    });
    const handleClose = jest.fn();

    render(
      <TableStatusModal
        table={maintenanceTable}
        isOpen={true}
        onClose={handleClose}
        restaurantId={restaurantId}
      />,
      { wrapper: createWrapper() },
    );

    expect(screen.getByText("Table T2")).toBeInTheDocument();
    expect(screen.getByText("Set to Available")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Set to Available"));

    await waitFor(() => {
      expect(tableService.updateTableStatus).toHaveBeenCalledWith(
        restaurantId,
        "table-2",
        "AVAILABLE",
      );
      expect(handleClose).toHaveBeenCalled();
    });
  });

  it("restricts manual change when table is OCCUPIED", () => {
    render(
      <TableStatusModal
        table={occupiedTable}
        isOpen={true}
        onClose={jest.fn()}
        restaurantId={restaurantId}
      />,
      { wrapper: createWrapper() },
    );

    expect(screen.getByText("Table T3")).toBeInTheDocument();
    expect(screen.getByText("Manual Update Restricted")).toBeInTheDocument();
    expect(screen.queryByText("Set to Maintenance")).not.toBeInTheDocument();
    expect(screen.queryByText("Set to Available")).not.toBeInTheDocument();
  });

  it("calls onClose when Cancel button or X is clicked", () => {
    const handleClose = jest.fn();
    render(
      <TableStatusModal
        table={availableTable}
        isOpen={true}
        onClose={handleClose}
        restaurantId={restaurantId}
      />,
      { wrapper: createWrapper() },
    );

    fireEvent.click(screen.getByText("Cancel"));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("dismisses modal when Escape key is pressed", () => {
    const handleClose = jest.fn();
    render(
      <TableStatusModal
        table={availableTable}
        isOpen={true}
        onClose={handleClose}
        restaurantId={restaurantId}
      />,
      { wrapper: createWrapper() },
    );

    fireEvent.keyDown(window, { key: "Escape" });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("does not call onClose on other key presses", () => {
    const handleClose = jest.fn();
    render(
      <TableStatusModal
        table={availableTable}
        isOpen={true}
        onClose={handleClose}
        restaurantId={restaurantId}
      />,
      { wrapper: createWrapper() },
    );

    fireEvent.keyDown(window, { key: "Enter" });
    expect(handleClose).not.toHaveBeenCalled();
  });
});
