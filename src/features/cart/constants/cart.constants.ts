export const CART_ENDPOINTS = {
  BASE: "orders/carts",
  BY_ID: (cartId: string) => `orders/carts/${cartId}`,
} as const;

export const CART_STORAGE_KEYS = {
  CART_ID: "spotq_cart_id",
} as const;

export const CART_UI_MESSAGES = {
  DRAWER_TITLE: "Your Cart",
  DRAWER_SUBTITLE: "Review your items and proceed to checkout",
  EMPTY_TITLE: "Your cart is empty",
  EMPTY_DESCRIPTION: "Explore dishes from your favorite restaurants and add them to your order.",
  BROWSE_MENU: "Browse Menu",
  LOADING_TEXT: "Loading your cart...",
  ITEMS_HEADING: "Order Items",
  ADDONS_LABEL: "Add-ons",
  SPECIAL_INSTRUCTIONS_LABEL: "Note",
  BILL_SUMMARY_HEADING: "Bill Details",
  ITEM_TOTAL: "Item Total",
  TAXES_AND_CHARGES: "Taxes & Platform Fees",
  GRAND_TOTAL: "To Pay",
  PROCEED_TO_CHECKOUT: "Proceed to Checkout",
  CLOSE_DRAWER_ARIA: "Close Cart Drawer",
  EXPIRED_TITLE: "Cart Expired",
  EXPIRED_MESSAGE: "Your cart session has expired. Please add items again to start a new order.",
  ERROR_LOADING_TITLE: "Unable to load cart",
  ERROR_LOADING_DESCRIPTION: "We encountered an issue fetching your cart items.",
  RETRY_BUTTON: "Try Again",
  FROM_RESTAURANT: "Restaurant",
  TABLE_LABEL: "Table",
  ITEM_COUNT_SINGLE: "item",
  ITEM_COUNT_PLURAL: "items",
  ESTIMATED_TIME: "Est. Prep Time",
  FREE_CHARGES: "Free",
} as const;
