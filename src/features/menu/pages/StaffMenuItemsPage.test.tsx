import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { menuCategoryService } from "../services/menu-category.service";
import { staffMenuService } from "../services/staff-menu.service";
import StaffMenuItemsPage from "./StaffMenuItemsPage";

jest.mock("../services/staff-menu.service", () => ({
  staffMenuService: {
    getStaffMenuItems: jest.fn(),
    getStaffCategories: jest.fn(),
  },
}));

jest.mock("../services/menu-category.service", () => ({
  menuCategoryService: {
    getCategories: jest.fn(),
  },
}));

describe("StaffMenuItemsPage", () => {
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
        id: "staff-1",
        name: "Test Staff",
        email: "staff@spotq.com",
        role: "STAFF",
        restaurantId: "rest-123",
      },
      isAuthenticated: true,
    });

    (staffMenuService.getStaffCategories as jest.Mock).mockResolvedValue([
      {
        id: "cat-1",
        restaurantId: "rest-123",
        name: "Mains",
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

    (menuCategoryService.getCategories as jest.Mock).mockResolvedValue([
      {
        id: "cat-1",
        restaurantId: "rest-123",
        name: "Mains",
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

    (staffMenuService.getStaffMenuItems as jest.Mock).mockResolvedValue({
      restaurantId: "rest-123",
      page: 1,
      limit: 12,
      totalCount: 2,
      totalPages: 1,
      items: [
        {
          id: "item-1",
          name: "Chicken Biriyani",
          sku: "CHK-01",
          description: "Fragrant spiced rice",
          basePrice: 220,
          categoryId: "cat-1",
          categoryName: "Mains",
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
              sku: "CHK-REG",
              price: 220,
              isDefault: true,
              isAvailable: true,
            },
          ],
          updatedAt: "2026-10-02T10:00:00.000Z",
        },
        {
          id: "item-2",
          name: "Mango Kulfi",
          sku: "DES-01",
          description: "Traditional frozen dessert",
          basePrice: 90,
          categoryId: "cat-2",
          categoryName: "Desserts",
          displayOrder: 2,
          isActive: true,
          isAvailable: false,
          unavailabilityReason: "Out of stock",
          autoResetAt: "2026-10-02T18:00:00.000Z",
          variantCount: 0,
          hasVariants: false,
          variants: [],
          updatedAt: "2026-10-02T10:00:00.000Z",
        },
      ],
    });
  });

  it("renders page header, stats cards, and menu items in table", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <StaffMenuItemsPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    // Wait for items to load
    expect(await screen.findByText("Chicken Biriyani")).toBeInTheDocument();
    expect(screen.getByText("Mango Kulfi")).toBeInTheDocument();
    expect(screen.getByText("CHK-01")).toBeInTheDocument();
    expect(screen.getByText("2 Total Items")).toBeInTheDocument();
    expect(screen.getByText("Total Menu Items")).toBeInTheDocument();
    expect(screen.getByText("Currently In Stock")).toBeInTheDocument();
    expect(screen.getAllByText("86'd / Out of Stock").length).toBeGreaterThanOrEqual(1);
  });

  it("renders error alert with retry button when query fails", async () => {
    (staffMenuService.getStaffMenuItems as jest.Mock).mockRejectedValueOnce(
      new Error("Network Error"),
    );

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <StaffMenuItemsPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(await screen.findByTestId("staff-menu-error-alert")).toBeInTheDocument();
    expect(screen.getByText("Network Error")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Try Again" })).toBeInTheDocument();
  });

  it("renders empty state when no items are returned", async () => {
    (staffMenuService.getStaffMenuItems as jest.Mock).mockResolvedValueOnce({
      restaurantId: "rest-123",
      page: 1,
      limit: 12,
      totalCount: 0,
      totalPages: 0,
      items: [],
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <StaffMenuItemsPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(await screen.findByTestId("staff-menu-empty-state")).toBeInTheDocument();
    expect(screen.getByText("No menu items yet")).toBeInTheDocument();
  });
});
