import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { menuCategoryService } from "../services/menu-category.service";
import { menuItemService } from "../services/menu-item.service";
import RestaurantMenuItemsPage from "./RestaurantMenuItemsPage";

jest.mock("../services/menu-item.service", () => ({
  menuItemService: {
    getMenuItems: jest.fn(),
    deleteMenuItem: jest.fn(),
  },
}));

jest.mock("../services/menu-category.service", () => ({
  menuCategoryService: {
    getCategories: jest.fn(),
  },
}));

describe("RestaurantMenuItemsPage", () => {
  let queryClient: QueryClient;

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

    (menuCategoryService.getCategories as jest.Mock).mockResolvedValue([
      {
        id: "cat-1",
        restaurantId: "rest-123",
        name: "Appetizers",
        displayOrder: 1,
        isActive: true,
      },
      {
        id: "cat-2",
        restaurantId: "rest-123",
        name: "Desserts",
        displayOrder: 2,
        isActive: true,
      },
    ]);

    (menuItemService.getMenuItems as jest.Mock).mockResolvedValue({
      stats: {
        totalCategories: 2,
        totalMenuItems: 4,
        availableItems: 3,
        outOfStockItems: 1,
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
        total: 4,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      },
    });
  });

  it("renders page header, stats cards, and menu items in data table", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <RestaurantMenuItemsPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    // Verify Title & Badges
    expect(await screen.findByRole("heading", { name: "Menu Items" })).toBeInTheDocument();
    expect(screen.getByText("Available In-Stock")).toBeInTheDocument();
    expect(screen.getAllByText("Out of Stock").length).toBeGreaterThanOrEqual(1);

    // Verify Create Menu Item Button
    const createButton = screen.getByRole("link", { name: "Create Menu Item" });
    expect(createButton).toBeInTheDocument();
    expect(createButton).toHaveAttribute("href", "/restaurant/menu/items/create");

    // Verify Item in Table
    expect(await screen.findByText("Crispy Corn")).toBeInTheDocument();
    expect(screen.getByText("₹199.00")).toBeInTheDocument();
    expect(screen.getByText("Featured")).toBeInTheDocument();
  });

  it("renders error alert with retry button on query failure", async () => {
    (menuItemService.getMenuItems as jest.Mock).mockRejectedValueOnce(
      new Error("Failed to load menu items."),
    );

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <RestaurantMenuItemsPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(await screen.findByText("Failed to load menu items.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument();
  });

  it("opens confirmation dialog when delete button is clicked and executes deletion", async () => {
    const { fireEvent, waitFor } = await import("@testing-library/react");
    (menuItemService.deleteMenuItem as jest.Mock).mockResolvedValue(undefined);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <RestaurantMenuItemsPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(await screen.findByText("Crispy Corn")).toBeInTheDocument();

    // Click delete action button on the row
    const deleteActionButton = screen.getByRole("button", { name: "Delete Crispy Corn" });
    expect(deleteActionButton).toBeInTheDocument();
    fireEvent.click(deleteActionButton);

    // Verify confirmation modal opens
    expect(screen.getByText("Delete Menu Item")).toBeInTheDocument();
    expect(
      screen.getByText(
        'Are you sure you want to delete "Crispy Corn"? This action will remove the item from customer menus.',
      ),
    ).toBeInTheDocument();

    // Confirm deletion
    const confirmButton = screen.getByRole("button", { name: "Delete" });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(menuItemService.deleteMenuItem).toHaveBeenCalledWith("rest-123", "item-1");
    });
  });
});
