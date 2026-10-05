import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/auth.store";
import type { User } from "@/features/auth/types/auth.types";
import { RestaurantMenuItemDetailPage } from "@/features/menu/pages/RestaurantMenuItemDetailPage";
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
  id: "dish-555",
  restaurantId: "rest-101",
  categoryId: "cat-1",
  categoryName: "Pizzas",
  name: "Margherita Supreme",
  description:
    "Artisan sourdough crust with San Marzano tomatoes, fresh buffalo mozzarella, and basil.",
  dietaryType: "VEG",
  isVegetarian: true,
  price: 349,
  preparationTime: 18,
  imageUrl: "https://example.com/margherita.jpg",
  isAvailable: true,
  isFeatured: true,
  variants: [
    {
      id: "var-small",
      name: 'Small (10")',
      portion: "1 Person",
      price: 249,
      sku: "PIZ-MAR-SM",
      isDefault: false,
      isAvailable: true,
    },
    {
      id: "var-large",
      name: 'Large (14")',
      portion: "2-3 Persons",
      price: 349,
      sku: "PIZ-MAR-LG",
      isDefault: true,
      isAvailable: true,
    },
  ],
  addons: [
    {
      id: "addon-ch",
      addonId: "addon-cheese",
      name: "Extra Buffalo Mozzarella",
      description: "Grated fresh buffalo mozzarella",
      price: 60,
      isAvailable: true,
    },
  ],
  createdAt: "2026-09-29T10:00:00.000Z",
  updatedAt: "2026-09-30T12:00:00.000Z",
};

function renderPage(itemId = "dish-555") {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[`/restaurant/menu/items/${itemId}`]}>
        <Routes>
          <Route path="/restaurant/menu/items/:itemId" element={<RestaurantMenuItemDetailPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("RestaurantMenuItemDetailPage", () => {
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

  it("renders menu item details with hero metadata, portion variants, and add-ons", async () => {
    renderPage();

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "Margherita Supreme", level: 1 }),
      ).toBeInTheDocument();
    });

    // Check Header Timestamps & ID
    expect(screen.getByText("dish-555")).toBeInTheDocument();
    expect(screen.getByText(/Created:/i)).toBeInTheDocument();
    expect(screen.getByText(/Updated:/i)).toBeInTheDocument();

    // Check Hero Info
    expect(screen.getByText("Pizzas")).toBeInTheDocument();
    expect(screen.getByText(/Artisan sourdough crust/i)).toBeInTheDocument();
    expect(screen.getByText("18 mins")).toBeInTheDocument();
    expect(screen.getAllByText("₹349.00").length).toBeGreaterThanOrEqual(1);

    // Check Variants
    expect(screen.getByText('Small (10")')).toBeInTheDocument();
    expect(screen.getByText('Large (14")')).toBeInTheDocument();
    expect(screen.getByText("PIZ-MAR-SM")).toBeInTheDocument();
    expect(screen.getByText("PIZ-MAR-LG")).toBeInTheDocument();

    // Check Add-ons
    expect(screen.getByText("Extra Buffalo Mozzarella")).toBeInTheDocument();
    expect(screen.getByText("+₹60.00")).toBeInTheDocument();
  });

  it("handles availability toggle for menu item", async () => {
    (menuItemService.updateMenuItemAvailability as jest.Mock).mockResolvedValue({
      isAvailable: false,
    });

    renderPage();

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "Margherita Supreme", level: 1 }),
      ).toBeInTheDocument();
    });

    const itemToggle = screen.getByRole("checkbox", {
      name: "Toggle availability for Margherita Supreme",
    });
    fireEvent.click(itemToggle);

    await waitFor(() => {
      expect(menuItemService.updateMenuItemAvailability).toHaveBeenCalledWith(
        "rest-101",
        "dish-555",
        false,
      );
    });
  });

  it("renders error state when item fetch fails", async () => {
    (menuItemService.getMenuItemById as jest.Mock).mockRejectedValue(new Error("Item not found"));

    renderPage("invalid-id");

    await waitFor(() => {
      expect(screen.getByText("Menu Item Not Found")).toBeInTheDocument();
    });

    expect(screen.getByRole("button", { name: /Retry/i })).toBeInTheDocument();
  });

  it("opens confirmation dialog and deletes item", async () => {
    const user = userEvent.setup();
    (menuItemService.deleteMenuItem as jest.Mock).mockResolvedValue(undefined);

    renderPage();

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "Margherita Supreme", level: 1 }),
      ).toBeInTheDocument();
    });

    const deleteBtn = screen.getByRole("button", { name: /Delete/i });
    await user.click(deleteBtn);

    // Confirm dialog appears
    await waitFor(() => {
      expect(screen.getByText(/Are you sure you want to delete/i)).toBeInTheDocument();
    });

    // Confirm action
    const confirmDeleteBtn = screen.getByRole("button", { name: /^Delete$/i });
    await user.click(confirmDeleteBtn);

    await waitFor(() => {
      expect(menuItemService.deleteMenuItem).toHaveBeenCalledWith("rest-101", "dish-555");
    });
  });
});
