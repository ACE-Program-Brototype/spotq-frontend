import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import type { MenuItemSummary } from "@/features/menu/types/menu-item.types";
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

    expect(screen.getAllByText("Paneer Tikka")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Butter Chicken")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Appetizers")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Main Course")[0]).toBeInTheDocument();
    expect(screen.getAllByText("₹250.00")[0]).toBeInTheDocument();
    expect(screen.getAllByText("₹380.00")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Veg")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Non-Veg")[0]).toBeInTheDocument();
    expect(screen.getAllByText("In Stock")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Out of Stock")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Featured")[0]).toBeInTheDocument();

    // Verify Action eye links
    expect(screen.getAllByRole("link", { name: "View details for Paneer Tikka" })[0]).toHaveAttribute(
      "href",
      "/restaurant/menu/items/item-1",
    );

    // Verify Action edit links
    expect(screen.getAllByRole("link", { name: "Edit Paneer Tikka" })[0]).toHaveAttribute(
      "href",
      "/restaurant/menu/items/item-1/edit",
    );
  });

  it("renders empty state message when no items are found", () => {
    renderWithProviders(<MenuItemTable items={[]} />);

    expect(screen.getAllByText("No menu items found")[0]).toBeInTheDocument();
    expect(
      screen.getAllByText("No dishes or beverages match the selected filter criteria.")[0],
    ).toBeInTheDocument();
  });

  it("switches to fallback icon declaratively when image fails to load", async () => {
    renderWithProviders(<MenuItemTable items={mockItems} />);

    const imageElements = await screen.findAllByAltText("Butter Chicken");
    expect(imageElements[0]).toBeInTheDocument();

    // Trigger image loading error on all instances
    for (const img of imageElements) {
      fireEvent.error(img);
    }

    // Image element is removed and fallback is rendered
    expect(screen.queryByAltText("Butter Chicken")).not.toBeInTheDocument();
  });

  it("renders delete button and triggers onDelete callback when clicked", () => {
    const onDeleteMock = jest.fn();

    renderWithProviders(<MenuItemTable items={mockItems} onDelete={onDeleteMock} />);

    const deleteBtn = screen.getAllByRole("button", { name: "Delete Paneer Tikka" })[0];
    expect(deleteBtn).toBeInTheDocument();

    fireEvent.click(deleteBtn);
    expect(onDeleteMock).toHaveBeenCalledWith(mockItems[0]);
  });
});
