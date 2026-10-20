import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { tableService } from "../services/table.service";
import StaffTablePage from "./StaffTablePage";

jest.mock("../services/table.service", () => ({
  tableService: {
    getTablesBySection: jest.fn(),
    updateTableStatus: jest.fn(),
  },
}));

jest.mock("@/features/auth/store/auth.store", () => ({
  useAuthStore: jest.fn(),
}));

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <StaffTablePage />
    </QueryClientProvider>,
  );
}

describe("StaffTablePage", () => {
  const mockSections = {
    "Main Dining": [
      {
        id: "table-1",
        tableCode: "T1",
        capacity: 4,
        status: "AVAILABLE",
        sectionId: "sec-1",
        tableShape: "SQUARE",
        currentOccupancy: 0,
        isActive: true,
      },
      {
        id: "table-2",
        tableCode: "T2",
        capacity: 4,
        status: "OCCUPIED",
        sectionId: "sec-1",
        tableShape: "SQUARE",
        currentOccupancy: 2,
        isActive: true,
      },
      {
        id: "table-4",
        tableCode: "T4",
        capacity: 4,
        status: "PARTIAL_OCCUPIED",
        sectionId: "sec-1",
        tableShape: "SQUARE",
        currentOccupancy: 1,
        isActive: true,
      },
    ],
    "Open Dining": [
      {
        id: "table-3",
        tableCode: "T3",
        capacity: 6,
        status: "MAINTENANCE",
        sectionId: "sec-2",
        tableShape: "SQUARE",
        currentOccupancy: 0,
        isActive: false,
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuthStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        user: {
          restaurantId: "test-restaurant-id",
          name: "Staff User",
          role: "STAFF",
        },
      }),
    );
  });

  it("renders page header, summary bar, section tabs, and table cards", async () => {
    (tableService.getTablesBySection as jest.Mock).mockResolvedValue(mockSections);

    renderPage();

    expect(screen.getByText("Table Management")).toBeInTheDocument();
    expect(screen.getByText("Manage layout, status, and active orders.")).toBeInTheDocument();
    expect(screen.getByText("Live Floor Grid")).toBeInTheDocument();

    expect(await screen.findByText("Main Dining")).toBeInTheDocument();
    expect(screen.getByText("Open Dining")).toBeInTheDocument();

    // Tables in Main Dining
    expect(await screen.findByText("T1")).toBeInTheDocument();
    expect(screen.getByText("T2")).toBeInTheDocument();
    expect(screen.getByText("T4")).toBeInTheDocument();
  });

  it("switches sections when clicking a section tab", async () => {
    (tableService.getTablesBySection as jest.Mock).mockResolvedValue(mockSections);

    renderPage();

    expect(await screen.findByText("T1")).toBeInTheDocument();

    // Click Open Dining tab
    fireEvent.click(screen.getByRole("tab", { name: /Open Dining/i }));

    expect(await screen.findByText("T3")).toBeInTheDocument();
    expect(screen.queryByText("T1")).not.toBeInTheDocument();
  });

  it("opens status modal when clicking a table card", async () => {
    (tableService.getTablesBySection as jest.Mock).mockResolvedValue(mockSections);

    renderPage();

    const cardT1 = await screen.findByText("T1");
    fireEvent.click(cardT1);

    expect(await screen.findByText("Table T1")).toBeInTheDocument();
    expect(screen.getByText("Set to Maintenance")).toBeInTheDocument();
  });

  it("filters tables by code search", async () => {
    (tableService.getTablesBySection as jest.Mock).mockResolvedValue(mockSections);

    renderPage();

    expect(await screen.findByText("T1")).toBeInTheDocument();
    expect(screen.getByText("T2")).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText(/Search table code/i);
    fireEvent.change(searchInput, { target: { value: "T2" } });

    expect(screen.getByText("T2")).toBeInTheDocument();
    expect(screen.queryByText("T1")).not.toBeInTheDocument();
  });

  it("displays both OCCUPIED and PARTIAL_OCCUPIED tables when Occupied filter is selected", async () => {
    (tableService.getTablesBySection as jest.Mock).mockResolvedValue(mockSections);

    renderPage();

    expect(await screen.findByText("T1")).toBeInTheDocument();
    expect(screen.getByText("T2")).toBeInTheDocument();
    expect(screen.getByText("T4")).toBeInTheDocument();

    // Click "Occupied" filter chip
    fireEvent.click(screen.getByRole("button", { name: "Occupied" }));

    // T2 (OCCUPIED) and T4 (PARTIAL_OCCUPIED) should remain visible
    expect(screen.getByText("T2")).toBeInTheDocument();
    expect(screen.getByText("T4")).toBeInTheDocument();
    // T1 (AVAILABLE) should be filtered out
    expect(screen.queryByText("T1")).not.toBeInTheDocument();
  });

  it("shows no restaurant message and does not fetch tables if user has no restaurantId", () => {
    (useAuthStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        user: {
          restaurantId: undefined,
          name: "Unassigned Staff",
          role: "STAFF",
        },
      }),
    );

    renderPage();

    expect(screen.getByText("No restaurant assigned")).toBeInTheDocument();
    expect(tableService.getTablesBySection).not.toHaveBeenCalled();
  });
});
