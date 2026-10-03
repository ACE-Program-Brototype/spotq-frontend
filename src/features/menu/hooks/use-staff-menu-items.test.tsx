import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { staffMenuService } from "../services/staff-menu.service";
import { useStaffMenuItems } from "./use-staff-menu-items";

jest.mock("../services/staff-menu.service", () => ({
  staffMenuService: {
    getStaffMenuItems: jest.fn(),
  },
}));

describe("useStaffMenuItems", () => {
  let queryClient: QueryClient;

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  const mockStaffItems = [
    {
      id: "item-1",
      name: "Chicken Biriyani",
      sku: "CHK-01",
      description: "Flavorful biriyani",
      basePrice: 200,
      categoryId: "cat-1",
      categoryName: "Main Course",
      displayOrder: 1,
      isActive: true,
      isAvailable: true,
      unavailabilityReason: null,
      autoResetAt: null,
      variantCount: 1,
      hasVariants: true,
      variants: [
        {
          id: "v-1",
          name: "Regular",
          sku: "CHK-01-R",
          price: 200,
          isDefault: true,
          isAvailable: true,
        },
      ],
      updatedAt: "2026-10-02T10:00:00.000Z",
    },
    {
      id: "item-2",
      name: "Chocolate Mousse",
      sku: "DES-01",
      description: "Rich chocolate dessert",
      basePrice: 120,
      categoryId: "cat-2",
      categoryName: "Desserts",
      displayOrder: 2,
      isActive: true,
      isAvailable: false,
      unavailabilityReason: "Out of dairy ingredients",
      autoResetAt: "2026-10-02T18:00:00.000Z",
      variantCount: 0,
      hasVariants: false,
      variants: [],
      updatedAt: "2026-10-02T10:00:00.000Z",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    useAuthStore.setState({
      user: {
        id: "staff-1",
        name: "Test Staff",
        email: "staff@spotq.com",
        role: "STAFF",
        restaurantId: "rest-123",
      },
      isAuthenticated: true,
    });

    (staffMenuService.getStaffMenuItems as jest.Mock).mockResolvedValue({
      restaurantId: "rest-123",
      page: 1,
      limit: 12,
      totalCount: 2,
      totalPages: 1,
      items: mockStaffItems,
    });
  });

  it("fetches and returns staff menu items and computed metrics", async () => {
    const { result } = renderHook(() => useStaffMenuItems(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.items).toHaveLength(2);
    expect(result.current.totalCount).toBe(2);
    expect(result.current.availableCount).toBe(1);
    expect(result.current.outOfStockCount).toBe(1);
    expect(result.current.groupedByCategory).toHaveLength(2);
  });

  it("updates search query with debouncing and resets page to 1", async () => {
    const { result } = renderHook(() => useStaffMenuItems({ searchDebounceMs: 50 }), {
      wrapper,
    });

    act(() => {
      result.current.setPage(2);
    });
    expect(result.current.page).toBe(2);

    act(() => {
      result.current.setSearchQuery("biriyani");
    });
    expect(result.current.searchQuery).toBe("biriyani");
    expect(result.current.page).toBe(1);
  });

  it("updates category and availability filters", async () => {
    const { result } = renderHook(() => useStaffMenuItems(), { wrapper });

    act(() => {
      result.current.setCategoryFilter("cat-1");
    });
    expect(result.current.categoryFilter).toBe("cat-1");

    act(() => {
      result.current.setAvailabilityFilter("UNAVAILABLE");
    });
    expect(result.current.availabilityFilter).toBe("UNAVAILABLE");
  });

  it("toggles sorting direction", async () => {
    const { result } = renderHook(() => useStaffMenuItems(), { wrapper });

    expect(result.current.sortBy).toBe("createdAt");
    expect(result.current.sortOrder).toBe("desc");

    act(() => {
      result.current.toggleSort("createdAt");
    });
    expect(result.current.sortOrder).toBe("asc");

    act(() => {
      result.current.toggleSort("price");
    });
    expect(result.current.sortBy).toBe("price");
    expect(result.current.sortOrder).toBe("asc");
  });

  it("resets page when includeInactive is updated", async () => {
    const { result } = renderHook(() => useStaffMenuItems(), { wrapper });

    act(() => {
      result.current.setPage(3);
    });
    expect(result.current.page).toBe(3);

    act(() => {
      result.current.setIncludeInactive(true);
    });
    expect(result.current.includeInactive).toBe(true);
    expect(result.current.page).toBe(1);
  });

  it("resets all filters back to default", async () => {
    const { result } = renderHook(() => useStaffMenuItems(), { wrapper });

    act(() => {
      result.current.setSearchQuery("cake");
      result.current.setCategoryFilter("cat-2");
      result.current.setAvailabilityFilter("UNAVAILABLE");
      result.current.toggleSort("price");
    });

    act(() => {
      result.current.resetFilters();
    });

    expect(result.current.searchQuery).toBe("");
    expect(result.current.categoryFilter).toBe("ALL");
    expect(result.current.availabilityFilter).toBe("ALL");
    expect(result.current.sortBy).toBe("createdAt");
    expect(result.current.sortOrder).toBe("desc");
    expect(result.current.page).toBe(1);
  });
});
