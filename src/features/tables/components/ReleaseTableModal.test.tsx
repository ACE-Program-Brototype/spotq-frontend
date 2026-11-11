import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { toast } from "sonner";
import { TABLE_MESSAGES } from "../constants/table.constants";
import { tableService } from "../services/table.service";
import type { TableItem } from "../types/table.types";
import { ReleaseTableModal } from "./ReleaseTableModal";

jest.mock("../services/table.service", () => ({
  tableService: {
    releaseTables: jest.fn(),
  },
}));

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockOccupiedTable: TableItem = {
  id: "table-123",
  tableCode: "T-04",
  capacity: 6,
  status: "OCCUPIED",
  sectionId: "sec-1",
  tableShape: "SQUARE",
  currentOccupancy: 4,
  isActive: true,
  sectionName: "Main Hall",
};

function renderModal(props?: Partial<React.ComponentProps<typeof ReleaseTableModal>>) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  const onClose = props?.onClose ?? jest.fn();

  return {
    onClose,
    ...render(
      <QueryClientProvider client={queryClient}>
        <ReleaseTableModal
          table={mockOccupiedTable}
          isOpen={true}
          onClose={onClose}
          restaurantId="rest-1"
          {...props}
        />
      </QueryClientProvider>,
    ),
  };
}

describe("ReleaseTableModal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders nothing when isOpen is false", () => {
    renderModal({ isOpen: false });
    expect(screen.queryByTestId("release-table-modal")).not.toBeInTheDocument();
  });

  it("defaults seats to currentOccupancy and updates helper preview on stepper and preset clicks", () => {
    renderModal();

    expect(screen.getByText("Release Table T-04")).toBeInTheDocument();
    const input = screen.getByTestId("occupancy-to-release-input") as HTMLInputElement;
    expect(input.value).toBe("4");
    expect(screen.getByText("Table will become Available (0/6 occupied).")).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("Decrease seats to release"));
    expect(input.value).toBe("3");
    expect(
      screen.getByText("Remaining occupancy after release: 1/6 (Partially Occupied)."),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("Increase seats to release"));
    expect(input.value).toBe("4");

    fireEvent.change(input, { target: { value: "2" } });
    expect(input.value).toBe("2");

    fireEvent.click(screen.getByRole("button", { name: "Release All (4)" }));
    expect(input.value).toBe("4");
  });

  it("shows validation error for invalid, out-of-range, or decimal occupancy values", () => {
    renderModal();

    const input = screen.getByTestId("occupancy-to-release-input");
    const submitBtn = screen.getByTestId("confirm-release-table-btn");

    fireEvent.change(input, { target: { value: "0" } });
    fireEvent.click(submitBtn);
    expect(screen.getByTestId("release-validation-error")).toHaveTextContent(
      "Enter a whole number between 1 and 4.",
    );

    fireEvent.change(input, { target: { value: "5" } });
    fireEvent.click(submitBtn);
    expect(screen.getByTestId("release-validation-error")).toHaveTextContent(
      "Enter a whole number between 1 and 4.",
    );

    fireEvent.change(input, { target: { value: "2.5" } });
    fireEvent.click(submitBtn);
    expect(screen.getByTestId("release-validation-error")).toHaveTextContent(
      "Enter a whole number between 1 and 4.",
    );

    expect(tableService.releaseTables).not.toHaveBeenCalled();
  });

  it("submits releaseTables payload, shows success toast, and closes modal", async () => {
    (tableService.releaseTables as jest.Mock).mockResolvedValue({
      releasedTables: [
        {
          tableId: "table-123",
          tableCode: "T-04",
          status: "PARTIAL_OCCUPIED",
          currentOccupancy: 2,
          capacity: 6,
        },
      ],
    });

    const onClose = jest.fn();
    renderModal({ onClose });

    const input = screen.getByTestId("occupancy-to-release-input");
    fireEvent.change(input, { target: { value: "2" } });
    fireEvent.click(screen.getByTestId("confirm-release-table-btn"));

    await waitFor(() => {
      expect(tableService.releaseTables).toHaveBeenCalledWith("rest-1", {
        tables: [{ tableId: "table-123", occupancyToRelease: 2 }],
      });
    });

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(TABLE_MESSAGES.RELEASE_SUCCESS("T-04", 2));
      expect(onClose).toHaveBeenCalled();
    });
  });

  it("displays API error alert and error toast when releaseTables fails", async () => {
    (tableService.releaseTables as jest.Mock).mockRejectedValue(new Error("Release failed"));

    const onClose = jest.fn();
    renderModal({ onClose });

    fireEvent.click(screen.getByTestId("confirm-release-table-btn"));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("Release failed");
      expect(toast.error).toHaveBeenCalledWith("Release failed");
    });

    expect(onClose).not.toHaveBeenCalled();
  });
});
