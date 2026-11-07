import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { toast } from "sonner";
import { CUSTOMER_ROUTES } from "@/app/router/routes.constants";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { CART_MESSAGES } from "@/features/cart/constants/cart.constants";
import { useCartStore } from "@/features/cart/store/cart.store";
import { CartPage } from "./CartPage";

const mockBatchAddToCart = jest.fn();
const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("@/features/cart/hooks/useBatchAddToCart", () => ({
  useBatchAddToCart: () => ({
    batchAddToCart: mockBatchAddToCart,
    isPending: false,
  }),
}));

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe("CartPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    useCartStore.getState().clearCart();
    useAuthStore.setState({ isAuthenticated: true });
  });

  it("renders empty state when cart is empty", () => {
    render(
      <MemoryRouter>
        <CartPage />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("cart-empty-state")).toBeInTheDocument();
    expect(screen.getByText(CART_MESSAGES.EMPTY_TITLE)).toBeInTheDocument();
    expect(screen.getByText(CART_MESSAGES.EXPLORE_RESTAURANTS)).toBeInTheDocument();
  });

  it("renders restaurant name, cart items, and order summary when items are present", () => {
    useCartStore.getState().addItem({
      restaurantId: "rest-101",
      restaurantName: "Biryani House",
      menuItemId: "menu-1",
      name: "Hyderabadi Dum Biryani",
      basePrice: 280,
      isVegetarian: false,
      selectedVariant: { id: "v1", name: "Family Pack", price: 500 },
      selectedAddons: [{ id: "a1", name: "Raita", price: 30 }],
      quantity: 2,
    });

    render(
      <MemoryRouter>
        <CartPage />
      </MemoryRouter>,
    );

    expect(screen.getAllByText("Biryani House")[0]).toBeInTheDocument();
    expect(screen.getByText("Hyderabadi Dum Biryani")).toBeInTheDocument();
    expect(screen.getByText(/Family Pack/)).toBeInTheDocument();
    expect(screen.getByText(/Raita/)).toBeInTheDocument();

    // 500 + 30 = 530 unit price * 2 = 1060
    expect(screen.getByTestId("summary-subtotal")).toHaveTextContent("1,060");
    expect(screen.getByTestId("summary-total-amount")).toHaveTextContent("1,060");
    expect(screen.getByTestId("summary-total-count")).toHaveTextContent("2 items");
  });

  it("allows incrementing and decrementing item quantities", async () => {
    const user = userEvent.setup();

    useCartStore.getState().addItem({
      restaurantId: "rest-101",
      restaurantName: "Biryani House",
      menuItemId: "menu-1",
      name: "Chicken Biryani",
      basePrice: 200,
      isVegetarian: false,
      selectedVariant: null,
      selectedAddons: [],
      quantity: 1,
    });

    render(
      <MemoryRouter>
        <CartPage />
      </MemoryRouter>,
    );

    const plusBtn = screen.getByLabelText(CART_MESSAGES.INCREASE_QUANTITY);
    await user.click(plusBtn);

    expect(screen.getByTestId("summary-total-count")).toHaveTextContent("2 items");
    expect(screen.getByTestId("summary-total-amount")).toHaveTextContent("400");

    const minusBtn = screen.getByLabelText(CART_MESSAGES.DECREASE_QUANTITY);
    await user.click(minusBtn);

    expect(screen.getByTestId("summary-total-count")).toHaveTextContent("1 item");
    expect(screen.getByTestId("summary-total-amount")).toHaveTextContent("200");
  });

  it("allows removing an item directly via delete button", async () => {
    const user = userEvent.setup();

    useCartStore.getState().addItem({
      restaurantId: "rest-101",
      restaurantName: "Biryani House",
      menuItemId: "menu-1",
      name: "Chicken Biryani",
      basePrice: 200,
      isVegetarian: false,
      selectedVariant: null,
      selectedAddons: [],
      quantity: 1,
    });

    render(
      <MemoryRouter>
        <CartPage />
      </MemoryRouter>,
    );

    const deleteBtn = screen.getByLabelText(CART_MESSAGES.DELETE_ITEM);
    await user.click(deleteBtn);

    expect(screen.getByTestId("cart-empty-state")).toBeInTheDocument();
  });

  it("clears the entire cart when Clear Cart button is clicked", async () => {
    const user = userEvent.setup();

    useCartStore.getState().addItem({
      restaurantId: "rest-101",
      restaurantName: "Biryani House",
      menuItemId: "menu-1",
      name: "Chicken Biryani",
      basePrice: 200,
      isVegetarian: false,
      selectedVariant: null,
      selectedAddons: [],
      quantity: 1,
    });

    render(
      <MemoryRouter>
        <CartPage />
      </MemoryRouter>,
    );

    const clearBtn = screen.getByRole("button", {
      name: new RegExp(CART_MESSAGES.CLEAR_CART, "i"),
    });
    await user.click(clearBtn);

    expect(screen.getByTestId("cart-empty-state")).toBeInTheDocument();
  });

  it("calls batchAddToCart when Proceed to Checkout button is clicked while authenticated", async () => {
    const user = userEvent.setup();

    useCartStore.getState().addItem({
      restaurantId: "rest-101",
      restaurantName: "Biryani House",
      menuItemId: "menu-1",
      name: "Chicken Biryani",
      basePrice: 200,
      isVegetarian: false,
      selectedVariant: null,
      selectedAddons: [],
      quantity: 1,
    });

    render(
      <MemoryRouter>
        <CartPage />
      </MemoryRouter>,
    );

    const proceedBtn = screen.getByRole("button", {
      name: new RegExp(CART_MESSAGES.PROCEED_TO_CHECKOUT, "i"),
    });
    await user.click(proceedBtn);

    expect(mockBatchAddToCart).toHaveBeenCalledWith({
      restaurantId: "rest-101",
      items: [
        {
          menuItemId: "menu-1",
          quantity: 1,
          variantId: null,
          addonIds: [],
        },
      ],
    });
  });

  it("prompts to login and redirects when unauthenticated user clicks Proceed to Checkout", async () => {
    const user = userEvent.setup();
    useAuthStore.setState({ isAuthenticated: false });

    useCartStore.getState().addItem({
      restaurantId: "rest-101",
      restaurantName: "Biryani House",
      menuItemId: "menu-1",
      name: "Chicken Biryani",
      basePrice: 200,
      isVegetarian: false,
      selectedVariant: null,
      selectedAddons: [],
      quantity: 1,
    });

    render(
      <MemoryRouter>
        <CartPage />
      </MemoryRouter>,
    );

    const proceedBtn = screen.getByRole("button", {
      name: new RegExp(CART_MESSAGES.PROCEED_TO_CHECKOUT, "i"),
    });
    await user.click(proceedBtn);

    expect(toast.error).toHaveBeenCalledWith(CART_MESSAGES.LOGIN_REQUIRED_CHECKOUT);
    expect(mockNavigate).toHaveBeenCalledWith(CUSTOMER_ROUTES.AUTH.LOGIN);
    expect(mockBatchAddToCart).not.toHaveBeenCalled();
  });
});
