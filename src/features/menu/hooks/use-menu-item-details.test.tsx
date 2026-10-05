import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { menuService } from "../services/menu.service";
import { useMenuItemDetails } from "./use-menu-item-details";

jest.mock("../services/menu.service", () => ({
  menuService: {
    getMenuItem: jest.fn(),
  },
}));

describe("useMenuItemDetails", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    jest.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it("fetches and returns menu item details", async () => {
    const mockItem = {
      id: "item-123",
      restaurantId: "rest-1",
      name: "Truffle Fries",
      price: 180,
    };
    (menuService.getMenuItem as jest.Mock).mockResolvedValue(mockItem);

    const { result } = renderHook(() => useMenuItemDetails("rest-1", "item-123"), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(menuService.getMenuItem).toHaveBeenCalledWith("rest-1", "item-123");
    expect(result.current.item).toEqual(mockItem);
    expect(result.current.isError).toBe(false);
  });

  it("handles query error state", async () => {
    (menuService.getMenuItem as jest.Mock).mockRejectedValue(new Error("Item not found"));

    const { result } = renderHook(() => useMenuItemDetails("rest-1", "item-999"), { wrapper });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error?.message).toBe("Item not found");
  });
});
