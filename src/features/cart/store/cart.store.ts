import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { CART_STORAGE_KEYS } from "../constants/cart.constants";

export interface CartState {
  cartId: string | null;
  isDrawerOpen: boolean;
  setCartId: (cartId: string | null) => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  resetCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cartId: null,
      isDrawerOpen: false,
      setCartId: (cartId) => set({ cartId }),
      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),
      toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),
      resetCart: () => set({ cartId: null, isDrawerOpen: false }),
    }),
    {
      name: CART_STORAGE_KEYS.CART_ID,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ cartId: state.cartId }),
    },
  ),
);

if (typeof window !== "undefined") {
  (window as unknown as { cartStore: typeof useCartStore }).cartStore = useCartStore;
}
