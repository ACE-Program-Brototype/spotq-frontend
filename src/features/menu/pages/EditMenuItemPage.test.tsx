import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { menuService } from "../services/menu.service";
import EditMenuItemPage from "./EditMenuItemPage";

jest.mock("../services/menu.service", () => ({
  menuService: {
    getMenuItem: jest.fn(),
    getCategories: jest.fn(),
    getAddons: jest.fn(),
  },
}));

describe("EditMenuItemPage", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    jest.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });

    useAuthStore.setState({
      user: {
        id: "user-1",
        name: "Test Admin",
        email: "admin@spotq.com",
        role: "RESTAURANT_ADMIN",
        restaurantId: "res-100",
      },
      isAuthenticated: true,
    });

    (menuService.getCategories as jest.Mock).mockResolvedValue([
      { id: "cat-1", restaurantId: "res-100", name: "Burgers", displayOrder: 1, isActive: true },
    ]);
    (menuService.getAddons as jest.Mock).mockResolvedValue([]);
  });

  const renderPage = (itemId = "item-123") => {
    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[`/restaurant/menu/items/${itemId}/edit`]}>
          <Routes>
            <Route path="/restaurant/menu/items/:itemId/edit" element={<EditMenuItemPage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    );
  };

  it("renders loading state while fetching item details", () => {
    (menuService.getMenuItem as jest.Mock).mockReturnValue(new Promise(() => {}));

    renderPage();

    expect(screen.getByText(/loading menu item details\.\.\./i)).toBeInTheDocument();
  });

  it("renders error state when item fetch fails", async () => {
    (menuService.getMenuItem as jest.Mock).mockRejectedValue(new Error("Menu item not found"));

    renderPage();

    expect(await screen.findByText(/failed to load menu item/i)).toBeInTheDocument();
    expect(screen.getByText(/menu item not found/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /return to menu items/i })).toBeInTheDocument();
  });

  it("renders form pre-filled with item details on success", async () => {
    const mockItemDetails = {
      id: "item-123",
      restaurantId: "res-100",
      categoryId: "cat-1",
      categoryName: "Burgers",
      category: { id: "cat-1", name: "Burgers", description: null },
      name: "Truffle Mushroom Burger",
      description: "Sauteed mushrooms with truffle mayo and swiss cheese",
      price: 320,
      preparationTime: 20,
      calories: 650,
      isVegetarian: true,
      isFeatured: true,
      isAvailable: true,
      images: [{ id: "img-1", objectKey: "res-100/truffle.jpg", displayOrder: 0 }],
      variants: [
        {
          id: "var-1",
          name: "Regular (Single Patty)",
          price: 320,
          sku: "TRUF-01",
          isDefault: true,
          isAvailable: true,
        },
      ],
      addons: [],
      createdAt: "2026-10-01T00:00:00.000Z",
      updatedAt: "2026-10-01T00:00:00.000Z",
    };

    (menuService.getMenuItem as jest.Mock).mockResolvedValue(mockItemDetails);

    renderPage();

    expect(await screen.findByDisplayValue("Truffle Mushroom Burger")).toBeInTheDocument();
    expect(screen.getByText(/edit menu item/i)).toBeInTheDocument();
    expect(
      screen.getByDisplayValue("Sauteed mushrooms with truffle mayo and swiss cheese"),
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue("Single Patty")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^update menu item$/i })).toBeInTheDocument();
  });
});
