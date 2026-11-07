import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type React from "react";
import { useTables } from "@/features/tables/hooks/useTables";
import type { TableItem } from "@/features/tables/types/table.types";
import { queueService } from "../services/queue.service";
import type { QueueEntry } from "../types/queue.types";
import { AssignTableModal } from "./AssignTableModal";

jest.mock("@/features/tables/hooks/useTables");
jest.mock("../services/queue.service");
jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe("AssignTableModal", () => {
  let queryClient: QueryClient;
  const restaurantId = "rest-test-999";

  const mockQueueEntry: QueueEntry = {
    queueEntryId: "entry-101",
    restaurantId,
    userId: null,
    guestName: "Alice Wonderland",
    guestPhone: "+919876543210",
    partySize: 4,
    specialNotes: "Window seat please",
    registrationType: "WALK_IN",
    position: 2,
    estimatedWaitMinutes: 15,
    status: "WAITING",
    joinedAt: "2026-11-07T10:00:00.000Z",
  };

  const mockTables: TableItem[] = [
    {
      id: "table-1",
      tableCode: "T1",
      capacity: 4,
      status: "AVAILABLE",
      sectionId: "sec-1",
      sectionName: "Main Dining",
      tableShape: "SQUARE",
      currentOccupancy: 0,
      isActive: true,
    },
    {
      id: "table-2",
      tableCode: "T2",
      capacity: 2,
      status: "AVAILABLE",
      sectionId: "sec-1",
      sectionName: "Main Dining",
      tableShape: "SQUARE",
      currentOccupancy: 0,
      isActive: true,
    },
    {
      id: "table-3",
      tableCode: "T3",
      capacity: 4,
      status: "OCCUPIED",
      sectionId: "sec-2",
      sectionName: "Patio",
      tableShape: "CIRCLE",
      currentOccupancy: 4,
      isActive: true,
    },
    {
      id: "table-4",
      tableCode: "T4",
      capacity: 4,
      status: "MAINTENANCE",
      sectionId: "sec-2",
      sectionName: "Patio",
      tableShape: "SQUARE",
      currentOccupancy: 0,
      isActive: true,
    },
    {
      id: "table-vip-1",
      tableCode: "VIP-1",
      capacity: 6,
      status: "AVAILABLE",
      sectionId: "sec-vip",
      tableShape: "CIRCLE",
      currentOccupancy: 0,
      isActive: true,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    (useTables as jest.Mock).mockReturnValue({
      allTables: mockTables,
      sections: ["Main Dining", "Patio", "VIP"],
      tablesBySection: {
        "Main Dining": [mockTables[0], mockTables[1]],
        Patio: [mockTables[2], mockTables[3]],
        VIP: [mockTables[4]],
      },
      isLoading: false,
      isError: false,
      error: null,
      refetch: jest.fn(),
    });
  });

  const renderModal = (props?: Partial<React.ComponentProps<typeof AssignTableModal>>) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <AssignTableModal
          isOpen={true}
          onClose={jest.fn()}
          restaurantId={restaurantId}
          queueEntry={mockQueueEntry}
          onSuccess={jest.fn()}
          {...props}
        />
      </QueryClientProvider>,
    );
  };

  it("does not render when isOpen is false or queueEntry is null", () => {
    const { rerender } = render(
      <QueryClientProvider client={queryClient}>
        <AssignTableModal
          isOpen={false}
          onClose={jest.fn()}
          restaurantId={restaurantId}
          queueEntry={mockQueueEntry}
        />
      </QueryClientProvider>,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    rerender(
      <QueryClientProvider client={queryClient}>
        <AssignTableModal
          isOpen={true}
          onClose={jest.fn()}
          restaurantId={restaurantId}
          queueEntry={null}
        />
      </QueryClientProvider>,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders guest information, party size, and available tables", () => {
    renderModal();

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Alice Wonderland")).toBeInTheDocument();
    expect(screen.getByText("#2 in line")).toBeInTheDocument();
    expect(screen.getByText(/Party of 4 Guests/i)).toBeInTheDocument();
    expect(screen.getByText("Window seat please")).toBeInTheDocument();

    expect(screen.getByText("Table T1")).toBeInTheDocument();
    expect(screen.getByText("Table T2")).toBeInTheDocument();
    expect(screen.getByText("Table T3")).toBeInTheDocument();
    expect(screen.getByText("Table T4")).toBeInTheDocument();

    // Confirm button is disabled initially since 0 tables are selected
    const confirmBtn = screen.getByRole("button", { name: /confirm & seat party/i });
    expect(confirmBtn).toBeDisabled();
  });

  it("selects a table, calculates capacity, and enables confirm button when capacity satisfied", async () => {
    const user = userEvent.setup();
    renderModal();

    const confirmBtn = screen.getByRole("button", { name: /confirm & seat party/i });
    expect(confirmBtn).toBeDisabled();

    // Click Table T1 (capacity 4)
    const tableT1 = screen.getByText("Table T1");
    await user.click(tableT1);

    // Capacity is 4 / 4 -> satisfied
    expect(screen.getByText("Capacity Requirement Satisfied")).toBeInTheDocument();
    expect(confirmBtn).toBeEnabled();
  });

  it("handles combining multiple tables to satisfy a larger party", async () => {
    const user = userEvent.setup();
    renderModal();

    // Select Table T2 (capacity 2)
    const tableT2 = screen.getByText("Table T2");
    await user.click(tableT2);

    // Only 2 of 4 seats selected -> warning alert
    expect(screen.getByText("Insufficient Capacity Selected")).toBeInTheDocument();
    expect(screen.getByText(/Need 2 more seats to accommodate 4 guests/i)).toBeInTheDocument();

    const confirmBtn = screen.getByRole("button", { name: /confirm & seat party/i });
    expect(confirmBtn).toBeDisabled();

    // Now select Table T1 as well
    const tableT1 = screen.getByText("Table T1");
    await user.click(tableT1);

    // Now capacity is 4 / 4 or more -> satisfied
    expect(screen.getByText("Capacity Requirement Satisfied")).toBeInTheDocument();
    expect(confirmBtn).toBeEnabled();
  });

  it("allows incrementing and decrementing seat counts within available capacity", async () => {
    const user = userEvent.setup();
    renderModal();

    // Select Table T1
    await user.click(screen.getByText("Table T1"));

    // Find stepper decrease button
    const decreaseBtn = screen.getByRole("button", { name: "Decrease seats for table T1" });
    const increaseBtn = screen.getByRole("button", { name: "Increase seats for table T1" });

    // Decrease from 4 to 3
    await user.click(decreaseBtn);
    expect(screen.getAllByText("3").length).toBeGreaterThanOrEqual(1);

    // Now 3 of 4 seats -> Insufficient capacity
    expect(screen.getByText("Insufficient Capacity Selected")).toBeInTheDocument();

    // Increase back to 4
    await user.click(increaseBtn);
    expect(screen.getAllByText("4").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Capacity Requirement Satisfied")).toBeInTheDocument();
  });

  it("submits table assignment and triggers onSuccess callback", async () => {
    const user = userEvent.setup();
    const onSuccess = jest.fn();
    const onClose = jest.fn();

    const mockApiResponse = {
      success: true,
      message: "Tables assigned and party seated successfully",
      data: {
        queueEntryId: "entry-101",
        restaurantId,
        tableIds: ["table-1"],
        status: "SEATED",
        seatedAt: "2026-11-07T12:00:00.000Z",
      },
    };

    (queueService.assignTables as jest.Mock).mockResolvedValue(mockApiResponse);

    renderModal({ onSuccess, onClose });

    // Select Table T1
    await user.click(screen.getByText("Table T1"));

    const confirmBtn = screen.getByRole("button", { name: /confirm & seat party/i });
    await user.click(confirmBtn);

    await waitFor(() => {
      expect(queueService.assignTables).toHaveBeenCalledWith("entry-101", {
        tables: [{ tableId: "table-1", count: 4 }],
      });
      expect(onSuccess).toHaveBeenCalledWith(
        expect.objectContaining({
          queueEntryId: "entry-101",
          status: "SEATED",
        }),
        ["table-1"],
      );
      expect(onClose).toHaveBeenCalled();
    });
  });

  it("closes modal on cancel click or close button", async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();

    renderModal({ onClose });

    const cancelBtn = screen.getByRole("button", { name: /cancel/i });
    await user.click(cancelBtn);
    expect(onClose).toHaveBeenCalledTimes(1);

    const closeIconBtn = screen.getByRole("button", { name: /close dialog/i });
    await user.click(closeIconBtn);
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it("filters tables correctly when clicking a section filter such as VIP", async () => {
    const user = userEvent.setup();
    renderModal();

    // Click VIP section filter chip
    const vipFilterChip = screen.getByRole("button", { name: "VIP" });
    await user.click(vipFilterChip);

    // Only VIP tables should be visible
    expect(screen.getByText("Table VIP-1")).toBeInTheDocument();
    expect(screen.queryByText("Table T1")).not.toBeInTheDocument();
  });

  it("closes the modal when table assignment fails on error (e.g. table is occupied)", async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();

    (queueService.assignTables as jest.Mock).mockRejectedValue(new Error("Table Not Available"));

    renderModal({ onClose });

    // Select Table T1
    await user.click(screen.getByText("Table T1"));

    const confirmBtn = screen.getByRole("button", { name: /confirm & seat party/i });
    await user.click(confirmBtn);

    await waitFor(() => {
      expect(queueService.assignTables).toHaveBeenCalled();
      expect(onClose).toHaveBeenCalled();
    });
  });
});
