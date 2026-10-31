export const CART_STORAGE_KEY = "spotq-cart-storage";

export const CART_MESSAGES = {
  RESTAURANT_MISMATCH_CONFIRMATION:
    "You already have items from another restaurant in your cart. Would you like to clear your current cart and add items from this restaurant?",
  QUEUE_REQUIRED: "You need to join the queue before adding items to your cart.",
  QUEUE_ALREADY_IN_OTHER:
    "You are already in a queue. Leave your current queue before ordering here.",
  ITEM_UNAVAILABLE: "This item is currently unavailable.",
  VARIANT_REQUIRED: "Please select a variant before adding this item to your cart.",
  ITEM_ADDED: "Item added to cart.",
  ITEM_UPDATED: "Cart updated.",
  ITEM_REMOVED: "Item removed from cart.",
  CART_CLEARED: "Cart has been cleared.",
  EMPTY_TITLE: "Your cart is empty",
  EMPTY_DESCRIPTION: "Explore our partnered restaurants and add delicious dishes to your cart.",
  CONTINUE_SHOPPING: "Continue Shopping",
  EXPLORE_RESTAURANTS: "Explore Restaurants",
  CLEAR_CART: "Clear Cart",
  PROCEED_TO_CHECKOUT: "Proceed to Checkout",
  ORDER_SUMMARY: "Order Summary",
  ITEMS: "Items",
  SUBTOTAL: "Subtotal",
  TOTAL: "Total",
  CONFIRM_TITLE: "Replace cart items?",
  CONFIRM_BUTTON: "Clear & Add Item",
  CANCEL_BUTTON: "Keep Existing Cart",
  RESTAURANT_LABEL: "Ordering from",
  VEGETARIAN: "Vegetarian",
  NON_VEGETARIAN: "Non-Vegetarian",
  DELETE_ITEM: "Remove item",
  INCREASE_QUANTITY: "Increase quantity",
  DECREASE_QUANTITY: "Decrease quantity",
  ITEM_COUNT_SINGULAR: "item",
  ITEM_COUNT_PLURAL: "items",
} as const;

export const RESTAURANT_TYPES = {
  QUEUE_PRO: "QUEUE_PRO",
  SELF_PRO: "SELF_PRO",
} as const;
