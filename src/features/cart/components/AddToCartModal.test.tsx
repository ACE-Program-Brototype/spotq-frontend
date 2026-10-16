import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import type { MenuItemDetail } from "@/features/menu/types/menu-item.types";
import { useCartStore } from "../store/cart.store";
import { AddToCartModal } from "./AddToCartModal";

const mockItemWithCustomizations: MenuItemDetail = {
  id: "dish-biryani-1",
  restaurantId: "rest-1",
  categoryId: "cat-1",
  name: "Hyderabadi Chicken Biryani",
  description: "Fragrant basmati rice cooked with tender marinated chicken.",
  isVegetarian: false,
  price: 220,
  isAvailable: true,
  variants: [
    {
      id: "var-half",
      name: "Half",
      portion: "Serves 1",
      price: 220,
      isDefault: true,
      isAvailable: true,
    },
    {
      id: "var-full",
      name: "Full",
      portion: "Serves 2",
      price: 380,
      isDefault: false,
      isAvailable: true,
    },
  ],
  addons: [
    {
      id: "add-rel-1",
      addonId: "addon-raitha",
      name: "Extra Raitha",
      price: 25,
      isAvailable: true,
    },
    {
      id: "add-rel-2",
      addonId: "addon-salan",
      name: "Mirchi Ka Salan",
      price: 40,
      isAvailable: true,
    },
  ],
};

const mockMutate = jest.fn();

jest.mock("../hooks/use-add-to-cart", () => ({
  useAddToCart: (options?: { onConflict?: () => void; onSuccess?: () => void }) => ({
    mutate: (vars: unknown) => {
      mockMutate(vars);
      if ((vars as { menuItemId?: string })?.menuItemId === "dish-conflict") {
        options?.onConflict?.();
      }
    },
    isPending: false,
  }),
}));

describe("AddToCartModal component", () => {
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

  it("renders null when isOpen is false", () => {
    const { container } = render(
      <AddToCartModal
        isOpen={false}
        onClose={jest.fn()}
        item={mockItemWithCustomizations}
        restaurantId="rest-1"
      />,
      { wrapper },
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders item header, variants, addons, instructions, and dynamic price", () => {
    render(
      <AddToCartModal
        isOpen={true}
        onClose={jest.fn()}
        item={mockItemWithCustomizations}
        restaurantId="rest-1"
      />,
      { wrapper },
    );

    expect(screen.getByText("Hyderabadi Chicken Biryani")).toBeInTheDocument();
    expect(screen.getByText("NON-VEG")).toBeInTheDocument();
    expect(screen.getByText("Half")).toBeInTheDocument();
    expect(screen.getByText("Full")).toBeInTheDocument();
    expect(screen.getByText("Extra Raitha")).toBeInTheDocument();

    // Default variant is "Half" (₹220), quantity 1
    expect(screen.getByTestId("modal-total-price")).toHaveTextContent("₹220.00");
  });

  it("dynamically recalculates price when switching variant", () => {
    render(
      <AddToCartModal
        isOpen={true}
        onClose={jest.fn()}
        item={mockItemWithCustomizations}
        restaurantId="rest-1"
      />,
      { wrapper },
    );

    fireEvent.click(screen.getByTestId("variant-option-var-full"));
    expect(screen.getByTestId("modal-total-price")).toHaveTextContent("₹380.00");
  });

  it("dynamically recalculates price when toggling addons", () => {
    render(
      <AddToCartModal
        isOpen={true}
        onClose={jest.fn()}
        item={mockItemWithCustomizations}
        restaurantId="rest-1"
      />,
      { wrapper },
    );

    // Initial default: Half (₹220)
    expect(screen.getByTestId("modal-total-price")).toHaveTextContent("₹220.00");

    // Add Extra Raitha (+₹25) -> ₹245.00
    fireEvent.click(screen.getByTestId("addon-option-addon-raitha"));
    expect(screen.getByTestId("modal-total-price")).toHaveTextContent("₹245.00");

    // Add Salan (+₹40) -> ₹285.00
    fireEvent.click(screen.getByTestId("addon-option-addon-salan"));
    expect(screen.getByTestId("modal-total-price")).toHaveTextContent("₹285.00");

    // Untoggle Raitha (-₹25) -> ₹260.00
    fireEvent.click(screen.getByTestId("addon-option-addon-raitha"));
    expect(screen.getByTestId("modal-total-price")).toHaveTextContent("₹260.00");
  });

  it("updates quantity and multiplies total price", () => {
    render(
      <AddToCartModal
        isOpen={true}
        onClose={jest.fn()}
        item={mockItemWithCustomizations}
        restaurantId="rest-1"
      />,
      { wrapper },
    );

    // Initial: 1x Half = ₹220
    expect(screen.getByTestId("quantity-display")).toHaveTextContent("1");
    expect(screen.getByTestId("modal-total-price")).toHaveTextContent("₹220.00");

    // Increase to 2 -> ₹440
    fireEvent.click(screen.getByTestId("increase-quantity-button"));
    expect(screen.getByTestId("quantity-display")).toHaveTextContent("2");
    expect(screen.getByTestId("modal-total-price")).toHaveTextContent("₹440.00");

    // Increase to 3 -> ₹660
    fireEvent.click(screen.getByTestId("increase-quantity-button"));
    expect(screen.getByTestId("quantity-display")).toHaveTextContent("3");
    expect(screen.getByTestId("modal-total-price")).toHaveTextContent("₹660.00");

    // Decrease to 2 -> ₹440
    fireEvent.click(screen.getByTestId("decrease-quantity-button"));
    expect(screen.getByTestId("quantity-display")).toHaveTextContent("2");
    expect(screen.getByTestId("modal-total-price")).toHaveTextContent("₹440.00");
  });

  it("submits customizations and calls addToCart with payload", () => {
    render(
      <AddToCartModal
        isOpen={true}
        onClose={jest.fn()}
        item={mockItemWithCustomizations}
        restaurantId="rest-1"
        cartId="cart-123"
      />,
      { wrapper },
    );

    // Switch to Full, add Raitha, and add cooking instructions
    fireEvent.click(screen.getByTestId("variant-option-var-full"));
    fireEvent.click(screen.getByTestId("addon-option-addon-raitha"));

    const instructionsInput = screen.getByPlaceholderText(
      "E.g. Less spicy, crispy, sauce on the side...",
    );
    fireEvent.change(instructionsInput, {
      target: { value: "Extra spicy, well cooked" },
    });

    fireEvent.click(screen.getByTestId("add-to-cart-submit-button"));

    expect(mockMutate).toHaveBeenCalledWith({
      restaurantId: "rest-1",
      menuItemId: "dish-biryani-1",
      variantId: "var-full",
      addonIds: ["addon-raitha"],
      quantity: 1,
      specialInstructions: "Extra spicy, well cooked",
      targetCartId: "cart-123",
    });
  });

  it("opens RestaurantMismatchDialog when conflict occurs", () => {
    const conflictItem: MenuItemDetail = {
      ...mockItemWithCustomizations,
      id: "dish-conflict",
    };

    render(
      <AddToCartModal
        isOpen={true}
        onClose={jest.fn()}
        item={conflictItem}
        restaurantId="rest-other"
      />,
      { wrapper },
    );

    fireEvent.click(screen.getByTestId("add-to-cart-submit-button"));

    expect(screen.getByTestId("restaurant-mismatch-dialog")).toBeInTheDocument();
  });
});
