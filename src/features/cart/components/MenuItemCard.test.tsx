import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import type { MenuItemDetail } from "@/features/menu/types/menu-item.types";
import { useCartStore } from "../store/cart.store";
import { MenuItemCard } from "./MenuItemCard";

const mockSimpleItem: MenuItemDetail = {
  id: "dish-simple-1",
  restaurantId: "rest-1",
  categoryId: "cat-1",
  name: "Classic Garlic Naan",
  description: "Freshly baked clay oven flatbread brushed with garlic butter.",
  isVegetarian: true,
  price: 60,
  isAvailable: true,
  variants: [],
  addons: [],
};

const mockCustomItem: MenuItemDetail = {
  id: "dish-custom-1",
  restaurantId: "rest-1",
  categoryId: "cat-1",
  name: "Paneer Tikka Pizza",
  description: "Thin crust pizza topped with spiced cottage cheese.",
  isVegetarian: true,
  price: 250,
  isAvailable: true,
  variants: [
    {
      id: "var-med",
      name: "Medium",
      price: 250,
      isDefault: true,
      isAvailable: true,
    },
  ],
  addons: [
    {
      id: "add-rel-1",
      addonId: "addon-chilli",
      name: "Green Chillies",
      price: 15,
      isAvailable: true,
    },
  ],
};

const mockUnavailableItem: MenuItemDetail = {
  ...mockSimpleItem,
  id: "dish-out-of-stock",
  name: "Mango Lassi",
  isAvailable: false,
};

const mockMutate = jest.fn();

jest.mock("../hooks/use-add-to-cart", () => ({
  useAddToCart: () => ({
    mutate: (vars: unknown) => mockMutate(vars),
    isPending: false,
  }),
}));

describe("MenuItemCard component", () => {
  let queryClient: QueryClient;

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  beforeEach(() => {
    queryClient = new QueryClient();
    useCartStore.getState().resetCart();
    useCartStore.getState().setCartId("cart-123");
    jest.clearAllMocks();
  });

  it("renders simple dish card details and triggers quick add on click", () => {
    render(<MenuItemCard item={mockSimpleItem} restaurantId="rest-1" />, {
      wrapper,
    });

    expect(screen.getByText("Classic Garlic Naan")).toBeInTheDocument();
    expect(screen.getByText("VEG")).toBeInTheDocument();
    expect(screen.getByText("₹60.00")).toBeInTheDocument();

    const addButton = screen.getByTestId("add-item-button-dish-simple-1");
    fireEvent.click(addButton);

    expect(mockMutate).toHaveBeenCalledWith({
      restaurantId: "rest-1",
      menuItemId: "dish-simple-1",
      quantity: 1,
      targetCartId: undefined,
    });
  });

  it("opens customization modal when clicking Add on an item with variants/addons", () => {
    render(<MenuItemCard item={mockCustomItem} restaurantId="rest-1" />, {
      wrapper,
    });

    expect(screen.getByText("Paneer Tikka Pizza")).toBeInTheDocument();
    expect(screen.getByText("Customisable")).toBeInTheDocument();

    const addButton = screen.getByTestId("add-item-button-dish-custom-1");
    fireEvent.click(addButton);

    // Customization modal should open
    expect(screen.getByTestId("add-to-cart-modal")).toBeInTheDocument();
    expect(screen.getByText("Green Chillies")).toBeInTheDocument();
  });

  it("renders disabled button when item is out of stock", () => {
    render(<MenuItemCard item={mockUnavailableItem} restaurantId="rest-1" />, {
      wrapper,
    });

    expect(screen.getByText("Mango Lassi")).toBeInTheDocument();
    const buttons = screen.getAllByText("Out of Stock");
    expect(buttons.length).toBeGreaterThan(0);
    const addButton = screen.getByTestId("add-item-button-dish-out-of-stock");
    expect(addButton).toBeDisabled();

    fireEvent.click(addButton);
    expect(mockMutate).not.toHaveBeenCalled();
  });
});
