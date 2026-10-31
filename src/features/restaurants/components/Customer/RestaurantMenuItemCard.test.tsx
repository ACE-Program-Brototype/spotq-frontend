import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";
import { CART_MESSAGES } from "@/features/cart/constants/cart.constants";
import { useCartStore } from "@/features/cart/store/cart.store";
import type {
  CustomerRestaurantDetails,
  CustomerRestaurantMenuItem,
} from "../../types/customer-restaurant.types";
import { RestaurantMenuItemCard } from "./RestaurantMenuItemCard";

jest.mock("@/hooks/usePresignedUrl", () => ({
  usePresignedUrl: jest.fn(() => ({ data: null })),
}));

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const unavailableItem: CustomerRestaurantMenuItem = {
  id: "item-1",
  name: "Paneer Tikka",
  price: 280,
  isVegetarian: true,
  isFeatured: false,
  isAvailable: false,
  images: [],
  variants: [{ id: "variant-1", name: "Regular", price: 280, isDefault: true, isAvailable: true }],
  addons: [],
};

const availableItem: CustomerRestaurantMenuItem = {
  id: "item-2",
  name: "Butter Chicken",
  price: 320,
  isVegetarian: false,
  isFeatured: true,
  isAvailable: true,
  images: [],
  variants: [
    { id: "var-half", name: "Half", price: 220, isDefault: false, isAvailable: true },
    { id: "var-full", name: "Full", price: 380, isDefault: true, isAvailable: true },
  ],
  addons: [
    {
      id: "addon-1",
      addonId: "ext-1",
      name: "Extra Butter",
      price: 25,
      isAvailable: true,
    },
  ],
};

const baseRestaurant: CustomerRestaurantDetails = {
  restaurantId: "rest-101",
  restaurantName: "Curry House",
  type: "SELF_PRO",
  phone: "1234567890",
  email: "curry@example.com",
  description: "Delicious curries",
  coverImage: "cover.jpg",
  city: "Kochi",
  state: "Kerala",
  cuisineType: "North Indian",
  averageCost: 500,
  isOpened: true,
  isPreorder: false,
  acceptsQueue: false,
  address: {
    id: "addr-1",
    addressLine1: "Street 1",
    addressLine2: null,
    city: "Kochi",
    state: "Kerala",
    country: "India",
    pincode: "682001",
    latitude: 9.9312,
    longitude: 76.2673,
  },
};

describe("RestaurantMenuItemCard", () => {
  beforeEach(() => {
    localStorage.clear();
    useCartStore.getState().clearCart();
    jest.clearAllMocks();
  });

  it("shows unavailable items while hiding their customization controls", () => {
    render(<RestaurantMenuItemCard item={unavailableItem} restaurant={baseRestaurant} />);

    expect(screen.getByRole("heading", { name: "Paneer Tikka" })).toBeInTheDocument();
    expect(screen.getByText("Currently unavailable")).toBeInTheDocument();
    expect(screen.queryByText("Choose a size")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /add to cart/i })).not.toBeInTheDocument();
  });

  it("allows selecting variants, add-ons, increasing quantity and adding to cart (Self-Service Pro)", async () => {
    const user = userEvent.setup();
    render(<RestaurantMenuItemCard item={availableItem} restaurant={baseRestaurant} />);

    // Default variant is Full (380), quantity 1
    const addToCartBtn = screen.getByRole("button", { name: /add to cart/i });
    expect(addToCartBtn).toHaveTextContent("₹380");

    // Increase quantity
    const plusBtn = screen.getByLabelText(CART_MESSAGES.INCREASE_QUANTITY);
    await user.click(plusBtn);

    expect(screen.getByTestId(`quantity-selector-${availableItem.id}`)).toHaveTextContent("2");
    expect(addToCartBtn).toHaveTextContent("₹760");

    // Add to cart
    await user.click(addToCartBtn);

    const cartState = useCartStore.getState();
    expect(cartState.items).toHaveLength(1);
    expect(cartState.items[0]?.name).toBe("Butter Chicken");
    expect(cartState.items[0]?.quantity).toBe(2);
    expect(cartState.items[0]?.subtotal).toBe(760);
    expect(toast.success).toHaveBeenCalledWith(CART_MESSAGES.ITEM_ADDED);
  });

  it("blocks Queue Pro restaurant item addition if customer has not joined a queue", async () => {
    const user = userEvent.setup();
    const queueProRestaurant: CustomerRestaurantDetails = {
      ...baseRestaurant,
      restaurantId: "rest-queue-1",
      type: "QUEUE_PRO",
      queue: {
        isGuestUser: false,
        hasJoinedAnyQueue: false,
        hasJoinedThisRestaurantQueue: false,
      },
    };

    render(<RestaurantMenuItemCard item={availableItem} restaurant={queueProRestaurant} />);

    const addToCartBtn = screen.getByRole("button", { name: /add to cart/i });
    await user.click(addToCartBtn);

    expect(toast.error).toHaveBeenCalledWith(CART_MESSAGES.QUEUE_REQUIRED);
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it("blocks Queue Pro restaurant item addition if customer is joined in another restaurant queue", async () => {
    const user = userEvent.setup();
    const queueProRestaurant: CustomerRestaurantDetails = {
      ...baseRestaurant,
      restaurantId: "rest-queue-1",
      type: "QUEUE_PRO",
      queue: {
        isGuestUser: false,
        hasJoinedAnyQueue: true,
        hasJoinedThisRestaurantQueue: false,
      },
    };

    render(<RestaurantMenuItemCard item={availableItem} restaurant={queueProRestaurant} />);

    const addToCartBtn = screen.getByRole("button", { name: /add to cart/i });
    await user.click(addToCartBtn);

    expect(toast.error).toHaveBeenCalledWith(CART_MESSAGES.QUEUE_ALREADY_IN_OTHER);
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it("allows Queue Pro restaurant item addition if customer is actively joined in this queue", async () => {
    const user = userEvent.setup();
    const queueProRestaurant: CustomerRestaurantDetails = {
      ...baseRestaurant,
      restaurantId: "rest-queue-1",
      type: "QUEUE_PRO",
      queue: {
        isGuestUser: false,
        hasJoinedAnyQueue: true,
        hasJoinedThisRestaurantQueue: true,
      },
    };

    render(<RestaurantMenuItemCard item={availableItem} restaurant={queueProRestaurant} />);

    const addToCartBtn = screen.getByRole("button", { name: /add to cart/i });
    await user.click(addToCartBtn);

    expect(toast.success).toHaveBeenCalledWith(CART_MESSAGES.ITEM_ADDED);
    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().restaurantId).toBe("rest-queue-1");
  });

  it("triggers confirmation dialog on restaurant mismatch and confirms switch", async () => {
    const user = userEvent.setup();

    // First, populate cart with another restaurant
    useCartStore.getState().addItem({
      restaurantId: "other-rest",
      restaurantName: "Other Resto",
      menuItemId: "item-x",
      name: "Existing Item",
      basePrice: 100,
      isVegetarian: true,
      selectedVariant: null,
      selectedAddons: [],
      quantity: 1,
    });

    render(<RestaurantMenuItemCard item={availableItem} restaurant={baseRestaurant} />);

    const addToCartBtn = screen.getByRole("button", { name: /add to cart/i });
    await user.click(addToCartBtn);

    // Mismatch dialog appears
    expect(screen.getByText(CART_MESSAGES.RESTAURANT_MISMATCH_CONFIRMATION)).toBeInTheDocument();

    // Confirm switch
    const confirmBtn = screen.getByText(CART_MESSAGES.CONFIRM_BUTTON);
    await user.click(confirmBtn);

    const cartState = useCartStore.getState();
    expect(cartState.restaurantId).toBe("rest-101");
    expect(cartState.items).toHaveLength(1);
    expect(cartState.items[0]?.name).toBe("Butter Chicken");
  });
});
