import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { CART_STORAGE_KEYS } from "../constants/cart.constants";

export interface CartState {
  cartId: string | null;
  isDrawerOpen: boolean;
  isBadgePulsing: boolean;
  setCartId: (cartId: string | null) => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  resetCart: () => void;
  triggerBadgePulse: () => void;
}

let pulseTimer: ReturnType<typeof setTimeout> | null = null;

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cartId: null,
      isDrawerOpen: false,
      isBadgePulsing: false,
      setCartId: (cartId) => set({ cartId }),
      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),
      toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),
      resetCart: () => set({ cartId: null, isDrawerOpen: false, isBadgePulsing: false }),
      triggerBadgePulse: () => {
        if (pulseTimer) {
          clearTimeout(pulseTimer);
        }
        set({ isBadgePulsing: true });
        pulseTimer = setTimeout(() => {
          set({ isBadgePulsing: false });
          pulseTimer = null;
        }, 1200);
      },
    }),
    {
      name: CART_STORAGE_KEYS.CART_ID,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ cartId: state.cartId }),
    },
  ),
);

if (typeof window !== "undefined" && import.meta.env.DEV) {
  (window as unknown as { cartStore: typeof useCartStore }).cartStore = useCartStore;
}
