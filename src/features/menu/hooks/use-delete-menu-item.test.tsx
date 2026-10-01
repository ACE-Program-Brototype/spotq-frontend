import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { toast } from "sonner";
import { MENU_MESSAGES } from "../constants/menu.constants";
import { menuItemService } from "../services/menu-item.service";
import { useDeleteMenuItem } from "./use-delete-menu-item";

jest.mock("../services/menu-item.service", () => ({
  menuItemService: {
    deleteMenuItem: jest.fn(),
  },
}));

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe("useDeleteMenuItem", () => {
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

  it("successfully deletes a menu item and shows success toast", async () => {
    (menuItemService.deleteMenuItem as jest.Mock).mockResolvedValue(undefined);
    const invalidateSpy = jest.spyOn(queryClient, "invalidateQueries");
    const onSuccessMock = jest.fn();

    const { result } = renderHook(
      () =>
        useDeleteMenuItem({
          restaurantId: "rest-123",
          onSuccess: onSuccessMock,
        }),
      { wrapper },
    );

    await act(async () => {
      await result.current.mutateAsync("item-123");
    });

    expect(menuItemService.deleteMenuItem).toHaveBeenCalledWith("rest-123", "item-123");
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ["menu-items"],
    });
    expect(toast.success).toHaveBeenCalledWith(MENU_MESSAGES.ITEM_DELETED_SUCCESS);
    expect(onSuccessMock).toHaveBeenCalled();
  });

  it("handles 403 forbidden error gracefully", async () => {
    const errorWithStatus = Object.assign(new Error("Forbidden"), { status: 403 });
    (menuItemService.deleteMenuItem as jest.Mock).mockRejectedValue(errorWithStatus);
    const onErrorMock = jest.fn();

    const { result } = renderHook(
      () =>
        useDeleteMenuItem({
          restaurantId: "rest-123",
          onError: onErrorMock,
        }),
      { wrapper },
    );

    await act(async () => {
      try {
        await result.current.mutateAsync("item-123");
      } catch {
        // expected mutation rejection
      }
    });

    expect(toast.error).toHaveBeenCalledWith(MENU_MESSAGES.ITEM_FORBIDDEN);
    expect(onErrorMock).toHaveBeenCalledWith(errorWithStatus);
  });

  it("handles 404 not found error gracefully", async () => {
    const errorWithStatus = Object.assign(new Error("Not Found"), { status: 404 });
    (menuItemService.deleteMenuItem as jest.Mock).mockRejectedValue(errorWithStatus);

    const { result } = renderHook(
      () =>
        useDeleteMenuItem({
          restaurantId: "rest-123",
        }),
      { wrapper },
    );

    await act(async () => {
      try {
        await result.current.mutateAsync("item-999");
      } catch {
        // expected mutation rejection
      }
    });

    expect(toast.error).toHaveBeenCalledWith(MENU_MESSAGES.ITEM_NOT_FOUND);
  });
});
