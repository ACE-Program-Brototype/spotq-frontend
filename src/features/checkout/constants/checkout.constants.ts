import type { CartData, OrderFlowType } from "../types/checkout.types";

export const CHECKOUT_ENDPOINTS = {
  GET_CART: (cartId: string) => `orders/carts/${cartId}`,
  PLACE_ORDER: "orders",
} as const;

export const CHECKOUT_PRICING = {
  PLATFORM_FEE: 0, // ₹0 Platform Fee
  GST_RATE: 0.05, // 5% GST
} as const;

export const CHECKOUT_DEFAULTS = {
  RESTAURANT_ID: "23193584-340b-40bf-963e-ac67cbbebd08",
  RESTAURANT_NAME: "Spice Garden Cafe",
  TABLE_NUMBER: "04",
  QUEUE_TOKEN: "#Q-24",
  QUEUE_ETA_MINUTES: 25,
  ACTIVE_ORDER_NUMBER: "#ORD-8104",
  CART_ID: "48982fbb-d4fb-4275-81a2-bc404bb9c3a8",
  DEFAULT_FLOW: "SELF_SERVICE_TABLE" as OrderFlowType,
} as const;

export const FLOW_CONFIG: Record<
  OrderFlowType,
  {
    title: string;
    badgeLabel: string;
    badgeVariant: "emerald" | "amber" | "orange";
    subtitle: string;
    description: string;
    ctaPrefix: string;
  }
> = {
  SELF_SERVICE_TABLE: {
    title: "Self-Service Pro",
    badgeLabel: "Verified Table QR",
    badgeVariant: "emerald",
    subtitle: `Table ${CHECKOUT_DEFAULTS.TABLE_NUMBER} | ${CHECKOUT_DEFAULTS.RESTAURANT_NAME}`,
    description: "Instant prepay online checkout — food dispatched directly to your table.",
    ctaPrefix: "Pay & Confirm Order",
  },
  QUEUE_PRE_ORDER: {
    title: "Queue Pro Waitlist",
    badgeLabel: "Pre-Order for Seating",
    badgeVariant: "amber",
    subtitle: `Queue Token ${CHECKOUT_DEFAULTS.QUEUE_TOKEN} | ETA ${CHECKOUT_DEFAULTS.QUEUE_ETA_MINUTES} mins`,
    description:
      "Pre-payment checkout completed before table seating. Kitchen will prepare fresh upon seating.",
    ctaPrefix: "Pre-Pay & Lock Order",
  },
  RUNNING_ADDON: {
    title: "Running Add-on",
    badgeLabel: "⚡ Urgent Table Add-on",
    badgeVariant: "orange",
    subtitle: `Active Dining at Table ${CHECKOUT_DEFAULTS.TABLE_NUMBER} | Add Items`,
    description: "⚡ Priority Delivery: Dispatched to kitchen immediately.",
    ctaPrefix: "Add to Dining Tab",
  },
};

export const MOCK_CART_DATA: CartData = {
  cartId: "48982fbb-d4fb-4275-81a2-bc404bb9c3a8",
  restaurantId: "23193584-340b-40bf-963e-ac67cbbebd08",
  restaurantName: "Spice Garden Cafe",
  userId: "911588f8-9ae1-439f-aeeb-c31b67c2b8a8",
  status: "ACTIVE",
  itemCount: 9,
  subtotal: 1820,
  createdAt: "2026-10-23T06:51:44.830Z",
  updatedAt: "2026-10-23T07:09:05.589Z",
  expiresAt: "2026-10-24T07:09:05.588Z",
  items: [
    {
      cartItemId: "2328626e-adfa-4f69-ad98-d239f88e9548",
      menuItemId: "16c471df-514d-43d2-9bdf-1e7dad071eba",
      menuItemName: "Wok-Tossed Hakka Noodles",
      description:
        "Fresh hand-pulled noodles stir-fried with crisp garden vegetables & Asian aromatics",
      variantId: null,
      variantName: "Regular Bowl",
      quantity: 7,
      unitPrice: 200,
      totalPrice: 1400,
      specialInstructions: null,
      addons: [],
      imageUrl:
        "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&auto=format&fit=crop&q=80",
    },
    {
      cartItemId: "ff5e57e3-37e5-4527-b466-0840a3cc2437",
      menuItemId: "16c471df-514d-43d2-9bdf-1e7dad071eba",
      menuItemName: "Wok-Tossed Hakka Noodles (Special)",
      description: "With creamy garlic house dip and extra scallions",
      variantId: null,
      variantName: "Special Chef Edition",
      quantity: 2,
      unitPrice: 200,
      totalPrice: 420,
      specialInstructions: "Extra spicy please",
      addons: [
        {
          addonId: "c0c6a1ba-9194-4020-b3d2-19dbce8cc7b2",
          addonName: "MAYONISE",
          price: 10,
        },
      ],
      imageUrl:
        "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500&auto=format&fit=crop&q=80",
    },
  ],
};
