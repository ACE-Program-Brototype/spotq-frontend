import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { type ReactNode, StrictMode } from "react";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { menuItemService } from "../services/menu-item.service";
import { useMenuItems } from "./use-menu-items";

jest.mock("../services/menu-item.service", () => ({
  menuItemService: {
    getMenuItems: jest.fn(),
  },
}));

describe("useMenuItems", () => {
  let queryClient: QueryClient;

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

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
        id: "user-1",
        name: "Test Admin",
        email: "admin@spotq.com",
        role: "RESTAURANT_ADMIN",
        restaurantId: "rest-123",
      },
      isAuthenticated: true,
    });

    (menuItemService.getMenuItems as jest.Mock).mockResolvedValue({
      stats: {
        totalCategories: 2,
        totalMenuItems: 30,
        availableItems: 25,
        outOfStockItems: 5,
      },
      items: [
        {
          id: "item-1",
          restaurantId: "rest-123",
          categoryId: "cat-1",
          categoryName: "Appetizers",
          name: "Crispy Corn",
          price: 199,
          isVegetarian: true,
          isFeatured: true,
          isAvailable: true,
          image: null,
          createdAt: "2026-09-29T10:00:00.000Z",
          updatedAt: "2026-09-29T10:00:00.000Z",
        },
      ],
      pagination: {
        page: 1,
        limit: 10,
        total: 30,
        totalPages: 3,
        hasNextPage: true,
        hasPrevPage: false,
      },
    });
  });

  it("initializes with default page 1 and limit 10", async () => {
    const { result } = renderHook(() => useMenuItems(), { wrapper });

    expect(result.current.page).toBe(1);
    expect(result.current.limit).toBe(10);
    expect(result.current.categoryFilter).toBe("ALL");
    expect(result.current.statusFilter).toBe("ALL");
    expect(result.current.vegFilter).toBe("ALL");

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });

  it("resets page to 1 when changing limit / page size from a later page", async () => {
    const { result } = renderHook(() => useMenuItems(), { wrapper });

    // Move to page 3
    act(() => {
      result.current.setPage(3);
    });
    expect(result.current.page).toBe(3);

    // Change page size / limit to 20
    act(() => {
      result.current.setLimit(20);
    });

    // Page must reset to 1 to prevent out-of-range requests
    expect(result.current.page).toBe(1);
    expect(result.current.limit).toBe(20);
  });

  it("resets page to 1 when setPageSize is called from a later page", async () => {
    const { result } = renderHook(() => useMenuItems(), { wrapper });

    // Move to page 4
    act(() => {
      result.current.setPage(4);
    });
    expect(result.current.page).toBe(4);

    // Change page size via setPageSize
    act(() => {
      result.current.setPageSize(50);
    });

    expect(result.current.page).toBe(1);
    expect(result.current.limit).toBe(50);
  });

  it("resets page to 1 on filter changes and sorting", async () => {
    const { result } = renderHook(() => useMenuItems(), { wrapper });

    act(() => {
      result.current.setPage(3);
    });
    expect(result.current.page).toBe(3);

    // Search change
    act(() => {
      result.current.setSearchQuery("paneer");
    });
    expect(result.current.page).toBe(1);
    expect(result.current.searchQuery).toBe("paneer");

    // Move to page 2 and change category
    act(() => {
      result.current.setPage(2);
      result.current.setCategoryFilter("cat-2");
    });
    expect(result.current.page).toBe(1);
    expect(result.current.categoryFilter).toBe("cat-2");

    // Move to page 2 and change status
    act(() => {
      result.current.setPage(2);
      result.current.setStatusFilter("AVAILABLE");
    });
    expect(result.current.page).toBe(1);
    expect(result.current.statusFilter).toBe("AVAILABLE");

    // Move to page 2 and change veg filter
    act(() => {
      result.current.setPage(2);
      result.current.setVegFilter("VEG");
    });
    expect(result.current.page).toBe(1);
    expect(result.current.vegFilter).toBe("VEG");

    // Move to page 2 and sort
    act(() => {
      result.current.setPage(2);
      result.current.toggleSort("price");
    });
    expect(result.current.page).toBe(1);
    expect(result.current.sortBy).toBe("price");
  });

  it("resets all filters and resets page to 1 on resetFilters", async () => {
    const { result } = renderHook(() => useMenuItems(), { wrapper });

    act(() => {
      result.current.setPage(3);
      result.current.setSearchQuery("cake");
      result.current.setCategoryFilter("cat-1");
      result.current.setStatusFilter("OUT_OF_STOCK");
      result.current.setVegFilter("NON_VEG");
      result.current.toggleSort("price");
    });

    act(() => {
      result.current.resetFilters();
    });

    expect(result.current.page).toBe(1);
    expect(result.current.searchQuery).toBe("");
    expect(result.current.categoryFilter).toBe("ALL");
    expect(result.current.statusFilter).toBe("ALL");
    expect(result.current.vegFilter).toBe("ALL");
    expect(result.current.sortBy).toBe("createdAt");
    expect(result.current.sortOrder).toBe("desc");
  });

  it("handles consecutive toggleSort clicks atomically on the same column under StrictMode", () => {
    const strictWrapper = ({ children }: { children: ReactNode }) => (
      <StrictMode>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </StrictMode>
    );

    const { result } = renderHook(() => useMenuItems(), { wrapper: strictWrapper });

    // Initial state: createdAt desc
    expect(result.current.sortBy).toBe("createdAt");
    expect(result.current.sortOrder).toBe("desc");

    // Click 'price' column -> switches to price asc
    act(() => {
      result.current.toggleSort("price");
    });
    expect(result.current.sortBy).toBe("price");
    expect(result.current.sortOrder).toBe("asc");

    // Click 'price' again -> switches to price desc
    act(() => {
      result.current.toggleSort("price");
    });
    expect(result.current.sortBy).toBe("price");
    expect(result.current.sortOrder).toBe("desc");

    // Click 'price' third time -> switches to price asc
    act(() => {
      result.current.toggleSort("price");
    });
    expect(result.current.sortBy).toBe("price");
    expect(result.current.sortOrder).toBe("asc");

    // Click different column 'name' -> switches to name asc
    act(() => {
      result.current.toggleSort("name");
    });
    expect(result.current.sortBy).toBe("name");
    expect(result.current.sortOrder).toBe("asc");
  });

  it("debounces rapid typing burst in search so only one request is triggered after delay", async () => {
    jest.useFakeTimers();
    try {
      const { result } = renderHook(() => useMenuItems({ searchDebounceMs: 300 }), {
        wrapper,
      });

      const initialCallCount = (menuItemService.getMenuItems as jest.Mock).mock.calls.length;

      // Simulate rapid typing burst
      act(() => {
        result.current.setSearchQuery("p");
      });
      act(() => {
        result.current.setSearchQuery("pa");
      });
      act(() => {
        result.current.setSearchQuery("pan");
      });
      act(() => {
        result.current.setSearchQuery("paneer");
      });

      // Input state updates immediately
      expect(result.current.searchQuery).toBe("paneer");

      // No additional API call before debounce duration
      act(() => {
        jest.advanceTimersByTime(200);
      });
      expect(menuItemService.getMenuItems).toHaveBeenCalledTimes(initialCallCount);

      // Advance past debounce duration
      act(() => {
        jest.advanceTimersByTime(150);
      });

      // Exactly 1 new request made with the debounced search value
      expect(menuItemService.getMenuItems).toHaveBeenCalledTimes(initialCallCount + 1);
      expect(menuItemService.getMenuItems).toHaveBeenLastCalledWith(
        "rest-123",
        expect.objectContaining({
          search: "paneer",
        }),
      );
    } finally {
      jest.useRealTimers();
    }
  });
});
