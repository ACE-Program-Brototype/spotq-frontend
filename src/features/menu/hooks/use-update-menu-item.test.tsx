import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { toast } from "sonner";
import { MENU_MESSAGES } from "../constants/menu.constants";
import { menuService } from "../services/menu.service";
import { useUpdateMenuItem } from "./use-update-menu-item";

jest.mock("../services/menu.service", () => ({
  menuService: {
    updateMenuItem: jest.fn(),
  },
}));

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe("useUpdateMenuItem", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    jest.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it("successfully updates a menu item and shows success toast", async () => {
    const mockUpdatedItem = {
      id: "item-123",
      restaurantId: "rest-123",
      name: "Updated Burger",
    };
    (menuService.updateMenuItem as jest.Mock).mockResolvedValue(mockUpdatedItem);
    const invalidateSpy = jest.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useUpdateMenuItem("rest-123", "item-123"), { wrapper });

    await act(async () => {
      await result.current.updateMenuItem({ name: "Updated Burger" });
    });

    expect(menuService.updateMenuItem).toHaveBeenCalledWith("rest-123", "item-123", {
      name: "Updated Burger",
    });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ["menu-items", "rest-123"],
    });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ["menu-items", "rest-123", "item-123"],
    });
    expect(toast.success).toHaveBeenCalledWith(MENU_MESSAGES.ITEM_UPDATED_SUCCESS);
  });

  it("handles error and displays error toast", async () => {
    (menuService.updateMenuItem as jest.Mock).mockRejectedValue(new Error("Validation failed"));

    const { result } = renderHook(() => useUpdateMenuItem("rest-123", "item-123"), { wrapper });

    await act(async () => {
      try {
        await result.current.updateMenuItem({ name: "Invalid" });
      } catch {
        // expected
      }
    });

    expect(toast.error).toHaveBeenCalledWith("Validation failed");
  });
});
