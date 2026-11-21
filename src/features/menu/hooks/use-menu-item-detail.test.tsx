import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { toast } from "sonner";
import { useAuthStore } from "@/features/auth/store/auth.store";
import type { User } from "@/features/auth/types/auth.types";
import { useMenuItemDetail } from "@/features/menu/hooks/use-menu-item-detail";
import { menuItemService } from "@/features/menu/services/menu-item.service";
import type { MenuItemDetail } from "@/features/menu/types/menu-item.types";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("@/features/menu/services/menu-item.service", () => ({
  menuItemService: {
    getMenuItemById: jest.fn(),
    updateMenuItemAvailability: jest.fn(),
    deleteMenuItem: jest.fn(),
  },
}));

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockItem: MenuItemDetail = {
  id: "item-101",
  restaurantId: "rest-101",
  categoryId: "cat-1",
  categoryName: "Main Course",
  name: "Butter Chicken",
  description: "Tender chicken pieces simmered in rich creamy tomato gravy.",
  dietaryType: "NON_VEG",
  isVegetarian: false,
  price: 380,
  preparationTime: 25,
  imageUrl: "https://example.com/butter-chicken.jpg",
  isAvailable: true,
  isFeatured: true,
  variants: [
    {
      id: "var-1",
      name: "Half Portion",
      portion: "1-2 Persons",
      price: 240,
      sku: "BC-HALF",
      isDefault: false,
      isAvailable: true,
    },
    {
      id: "var-2",
      name: "Full Portion",
      portion: "3-4 Persons",
      price: 380,
      sku: "BC-FULL",
      isDefault: true,
      isAvailable: true,
    },
  ],
  addons: [
    {
      id: "addon-1",
      addonId: "addon-naan",
      name: "Butter Naan",
      description: "Crispy tandoori naan with butter",
      price: 45,
      isAvailable: true,
    },
  ],
};

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe("useMenuItemDetail", () => {
  const mockUser: User = {
    id: "user-1",
    email: "owner@restaurant.com",
    role: "RESTAURANT_ADMIN",
    status: "ACTIVE",
    restaurantId: "rest-101",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.setState({ user: mockUser });
    (menuItemService.getMenuItemById as jest.Mock).mockResolvedValue(mockItem);
  });

  it("fetches single menu item detail", async () => {
    const { result } = renderHook(() => useMenuItemDetail({ itemId: "item-101" }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.item?.name).toBe("Butter Chicken");
    expect(result.current.item?.variants).toHaveLength(2);
    expect(result.current.item?.addons).toHaveLength(1);
    expect(menuItemService.getMenuItemById).toHaveBeenCalledWith("rest-101", "item-101");
  });

  it("handles toggle item availability mutation successfully", async () => {
    (menuItemService.updateMenuItemAvailability as jest.Mock).mockResolvedValue({
      isAvailable: false,
    });

    const { result } = renderHook(() => useMenuItemDetail({ itemId: "item-101" }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.item).toBeDefined();
    });

    await act(async () => {
      result.current.handleToggleItemAvailability();
    });

    await waitFor(() => {
      expect(menuItemService.updateMenuItemAvailability).toHaveBeenCalledWith(
        "rest-101",
        "item-101",
        false,
      );
      expect(toast.success).toHaveBeenCalledWith("Item marked as out of stock");
    });
  });

  it("handles delete menu item mutation and redirects", async () => {
    (menuItemService.deleteMenuItem as jest.Mock).mockResolvedValue(undefined);

    const { result } = renderHook(() => useMenuItemDetail({ itemId: "item-101" }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.item).toBeDefined();
    });

    await act(async () => {
      result.current.handleDeleteItem();
    });

    await waitFor(() => {
      expect(menuItemService.deleteMenuItem).toHaveBeenCalledWith("rest-101", "item-101");
      expect(toast.success).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith("/restaurant/menu/items", { replace: true });
    });
  });
});
