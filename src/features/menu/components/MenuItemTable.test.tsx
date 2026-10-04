import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import type { MenuItemSummary } from "../types/menu-item.types";
import { MenuItemTable } from "./MenuItemTable";

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>,
  );
}

const mockItems: MenuItemSummary[] = [
  {
    id: "item-1",
    restaurantId: "rest-1",
    categoryId: "cat-1",
    categoryName: "Appetizers",
    name: "Paneer Tikka",
    price: 250,
    isVegetarian: true,
    isFeatured: true,
    isAvailable: true,
    image: null,
    createdAt: "2026-09-29T10:00:00.000Z",
    updatedAt: "2026-09-29T10:00:00.000Z",
  },
  {
    id: "item-2",
    restaurantId: "rest-1",
    categoryId: "cat-2",
    categoryName: "Main Course",
    name: "Butter Chicken",
    price: 380,
    isVegetarian: false,
    isFeatured: false,
    isAvailable: false,
    image: "https://example.com/butter-chicken.jpg",
    createdAt: "2026-09-28T10:00:00.000Z",
    updatedAt: "2026-09-28T10:00:00.000Z",
  },
];

describe("MenuItemTable", () => {
  it("renders menu items in the reusable data table with actions", () => {
    renderWithProviders(<MenuItemTable items={mockItems} />);

    expect(screen.getByText("Paneer Tikka")).toBeInTheDocument();
    expect(screen.getByText("Butter Chicken")).toBeInTheDocument();
    expect(screen.getByText("Appetizers")).toBeInTheDocument();
    expect(screen.getByText("Main Course")).toBeInTheDocument();
    expect(screen.getByText("₹250.00")).toBeInTheDocument();
    expect(screen.getByText("₹380.00")).toBeInTheDocument();
    expect(screen.getByText("Veg")).toBeInTheDocument();
    expect(screen.getByText("Non-Veg")).toBeInTheDocument();
    expect(screen.getByText("In Stock")).toBeInTheDocument();
    expect(screen.getByText("Out of Stock")).toBeInTheDocument();
    expect(screen.getByText("Featured")).toBeInTheDocument();

    // Verify Action eye links
    expect(screen.getByRole("link", { name: "View details for Paneer Tikka" })).toHaveAttribute(
      "href",
      "/restaurant/menu/items/item-1",
    );

    // Verify Action edit links
    expect(screen.getByRole("link", { name: "Edit Paneer Tikka" })).toHaveAttribute(
      "href",
      "/restaurant/menu/items/item-1/edit",
    );
  });

  it("renders empty state message when no items are found", () => {
    renderWithProviders(<MenuItemTable items={[]} />);

    expect(screen.getByText("No menu items found")).toBeInTheDocument();
    expect(
      screen.getByText("No dishes or beverages match the selected filter criteria."),
    ).toBeInTheDocument();
  });

  it("switches to fallback icon declaratively when image fails to load", async () => {
    renderWithProviders(<MenuItemTable items={mockItems} />);

    const imageElement = await screen.findByAltText("Butter Chicken");
    expect(imageElement).toBeInTheDocument();

    // Trigger image loading error
    fireEvent.error(imageElement);

    // Image element is removed and fallback is rendered
    expect(screen.queryByAltText("Butter Chicken")).not.toBeInTheDocument();
  });

  it("renders delete button and triggers onDelete callback when clicked", () => {
    const onDeleteMock = jest.fn();

    renderWithProviders(<MenuItemTable items={mockItems} onDelete={onDeleteMock} />);

    const deleteBtn = screen.getByRole("button", { name: "Delete Paneer Tikka" });
    expect(deleteBtn).toBeInTheDocument();

    fireEvent.click(deleteBtn);
    expect(onDeleteMock).toHaveBeenCalledWith(mockItems[0]);
  });
});
