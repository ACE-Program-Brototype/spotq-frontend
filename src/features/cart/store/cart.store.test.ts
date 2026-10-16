import { CART_STORAGE_KEYS } from "../constants/cart.constants";
import { useCartStore } from "./cart.store";

describe("useCartStore", () => {
  beforeEach(() => {
    localStorage.clear();
    useCartStore.getState().resetCart();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("initializes with default state", () => {
    const state = useCartStore.getState();
    expect(state.cartId).toBeNull();
    expect(state.isDrawerOpen).toBe(false);
    expect(state.isBadgePulsing).toBe(false);
  });

  it("updates cartId and persists to localStorage", () => {
    useCartStore.getState().setCartId("cart-uuid-123");
    expect(useCartStore.getState().cartId).toBe("cart-uuid-123");

    const stored = localStorage.getItem(CART_STORAGE_KEYS.CART_ID);
    expect(stored).not.toBeNull();
    const parsed = JSON.parse(stored as string);
    expect(parsed.state.cartId).toBe("cart-uuid-123");
  });

  it("handles drawer open, close, and toggle actions", () => {
    expect(useCartStore.getState().isDrawerOpen).toBe(false);

    useCartStore.getState().openDrawer();
    expect(useCartStore.getState().isDrawerOpen).toBe(true);

    useCartStore.getState().closeDrawer();
    expect(useCartStore.getState().isDrawerOpen).toBe(false);

    useCartStore.getState().toggleDrawer();
    expect(useCartStore.getState().isDrawerOpen).toBe(true);

    useCartStore.getState().toggleDrawer();
    expect(useCartStore.getState().isDrawerOpen).toBe(false);
  });

  it("resets cart state on resetCart", () => {
    useCartStore.getState().setCartId("cart-uuid-123");
    useCartStore.getState().openDrawer();

    useCartStore.getState().resetCart();

    const state = useCartStore.getState();
    expect(state.cartId).toBeNull();
    expect(state.isDrawerOpen).toBe(false);
    expect(state.isBadgePulsing).toBe(false);
  });

  it("handles triggerBadgePulse and auto-resets after delay", () => {
    jest.useFakeTimers();

    expect(useCartStore.getState().isBadgePulsing).toBe(false);
    useCartStore.getState().triggerBadgePulse();
    expect(useCartStore.getState().isBadgePulsing).toBe(true);

    jest.advanceTimersByTime(1200);
    expect(useCartStore.getState().isBadgePulsing).toBe(false);
  });
});
