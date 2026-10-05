/**
 * Menu Feature Constants
 * Centralized API endpoints, dietary options, validation messages, and UI labels.
 */

export const MENU_ENDPOINTS = {
  ITEMS: (restaurantId: string) => `restaurants/${restaurantId}/menu/items`,
  STAFF_ITEMS: (restaurantId: string) => `restaurants/${restaurantId}/staff/menu/items`,
  STAFF_CATEGORIES: (restaurantId: string) => `restaurants/${restaurantId}/staff/menu/categories`,
  ITEM_DETAIL: (restaurantId: string, itemId: string) =>
    `restaurants/${restaurantId}/menu/items/${itemId}`,
  ITEM_STATUS: (restaurantId: string, itemId: string) =>
    `restaurants/${restaurantId}/menu/items/${itemId}/status`,
  CATEGORIES: (restaurantId: string) => `restaurants/${restaurantId}/menu/categories`,
  CATEGORY_DETAIL: (restaurantId: string, categoryId: string) =>
    `restaurants/${restaurantId}/menu/categories/${categoryId}`,
  CATEGORY_UPDATE: (restaurantId: string, categoryId: string) =>
    `restaurants/${restaurantId}/menu/categories/${categoryId}`,
  ADDONS: (restaurantId: string) => `restaurants/${restaurantId}/addons`,
  ADDON_DETAIL: (restaurantId: string, addonId: string) =>
    `restaurants/${restaurantId}/addons/${addonId}`,
} as const;

export const MENU_ITEM_DETAIL_QUERY_KEY = "menu-item-detail" as const;

export const DIETARY_TYPES = ["VEG", "NON_VEG", "EGG"] as const;
export type DietaryType = (typeof DIETARY_TYPES)[number];

export const DIETARY_OPTIONS: Array<{
  value: DietaryType;
  label: string;
  badgeClass: string;
  activeBorder: string;
  description: string;
  dotColor: string;
  borderColor: string;
}> = [
  {
    value: "VEG",
    label: "Veg",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    activeBorder: "border-emerald-600 bg-emerald-50/50",
    description: "Contains plant-based and dairy ingredients, 100% vegetarian",
    dotColor: "bg-emerald-600",
    borderColor: "border-emerald-600",
  },
  {
    value: "NON_VEG",
    label: "Non-Veg",
    badgeClass: "bg-rose-50 text-rose-700 border-rose-200",
    activeBorder: "border-rose-600 bg-rose-50/50",
    description: "Contains meat, poultry, seafood, or animal by-products",
    dotColor: "bg-rose-600",
    borderColor: "border-rose-600",
  },
  {
    value: "EGG",
    label: "Contains Egg",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
    activeBorder: "border-amber-600 bg-amber-50/50",
    description: "Vegetarian preparation containing egg ingredients",
    dotColor: "bg-amber-500",
    borderColor: "border-amber-500",
  },
];

export const MENU_MESSAGES = {
  CREATE_ITEM_TITLE: "Create Menu Item",
  CREATE_ITEM_SUBTITLE:
    "Add a new dish to your catalog with customizable portion sizes, dietary preferences, and optional add-ons.",
  ITEM_NAME_LABEL: "Item Name",
  ITEM_NAME_PLACEHOLDER: "e.g., Crispy Chicken Burger, Margherita Pizza",
  CATEGORY_LABEL: "Menu Category",
  CATEGORY_PLACEHOLDER: "Select a category...",
  NO_CATEGORIES_FOUND: "No categories created yet. Create one below.",
  ADD_CATEGORY_BTN: "New Category",
  DESCRIPTION_LABEL: "Description",
  DESCRIPTION_PLACEHOLDER: "Describe ingredients, flavor profiles, and any preparation details...",
  DIETARY_TYPE_LABEL: "Dietary Classification",
  PREPARATION_TIME_LABEL: "Preparation Time (minutes)",
  PREPARATION_TIME_PLACEHOLDER: "e.g., 15",
  AVAILABILITY_LABEL: "Availability Status",
  AVAILABILITY_ACTIVE_DESC: "Item is available for customers to order",
  AVAILABILITY_INACTIVE_DESC: "Item is marked as sold out / temporarily unavailable",
  IMAGE_LABEL: "Item Image",
  IMAGE_DROPZONE_TEXT: "Click or drag and drop image here",
  IMAGE_DROPZONE_HINT: "Supported formats: JPG, PNG, WebP up to 5MB",
  IMAGE_UPLOADING: "Uploading image...",
  IMAGE_UPLOAD_SUCCESS: "Image uploaded successfully",
  IMAGE_REMOVE: "Remove image",

  VARIANTS_SECTION_TITLE: "Portion Sizes & Variants",
  VARIANTS_SECTION_DESC:
    "Configure portion sizes and pricing. At least one default variant is required.",
  ADD_VARIANT_BTN: "Add Portion / Variant",
  VARIANT_NAME_LABEL: "Variant Name",
  VARIANT_PORTION_LABEL: "Portion Size",
  VARIANT_PRICE_LABEL: "Price (INR)",
  VARIANT_SKU_LABEL: "SKU / Barcode",
  VARIANT_DEFAULT_LABEL: "Default",
  VARIANT_STATUS_LABEL: "In Stock",
  VARIANT_NAME_PLACEHOLDER: "e.g., Regular, Large (16 inch)",
  VARIANT_PORTION_PLACEHOLDER: "e.g., 1 Person, 2-3 Persons",
  VARIANT_PRICE_PLACEHOLDER: "0.00",
  VARIANT_SKU_PLACEHOLDER: "e.g., BUR-REG-01",

  ADDONS_SECTION_TITLE: "Complementary Add-ons",
  ADDONS_SECTION_DESC:
    "Allow customers to customize their order with extra toppings, sauces, or sides.",
  ADD_ADDON_BTN: "New Add-on",
  NO_ADDONS_FOUND: "No add-ons available. Create one to allow customer customizations.",
  SEARCH_ADDONS_PLACEHOLDER: "Search add-ons...",
  PRICE_OVERRIDE_LABEL: "Custom Price",
  PRICE_OVERRIDE_PLACEHOLDER: "Default price",

  BTN_CANCEL: "Cancel",
  BTN_SUBMIT: "Create Menu Item",
  BTN_SUBMITTING: "Creating Menu Item...",
  ITEM_CREATED_SUCCESS: "Menu item created successfully.",
  ITEM_CREATE_FAILED: "Failed to create menu item. Please check the form and try again.",

  DELETE_ITEM_CONFIRM_TITLE: "Delete Menu Item",
  DELETE_ITEM_CONFIRM_DESCRIPTION: (itemName?: string) =>
    itemName
      ? `Are you sure you want to delete "${itemName}"? This action will remove the item from customer menus and cannot be undone.`
      : "Are you sure you want to delete this menu item? This action will remove the item from customer-facing menus and cannot be undone.",
  BTN_DELETE: "Delete",
  BTN_DELETING: "Deleting...",
  ITEM_DELETED_SUCCESS: "Menu item deleted successfully.",
  ITEM_DELETE_FAILED: "Failed to delete menu item.",
  ITEM_FORBIDDEN: "You do not have permission to delete this menu item.",
  ITEM_NOT_FOUND: "Menu item not found.",

  MODAL_CREATE_CATEGORY_TITLE: "Create Menu Category",
  MODAL_CREATE_CATEGORY_DESC:
    "Organize your menu by creating a new category for appetizers, mains, beverages, etc.",
  CATEGORY_NAME_LABEL: "Category Name",
  CATEGORY_NAME_PLACEHOLDER: "e.g., Starters, Main Course, Beverages",
  CATEGORY_DESC_LABEL: "Description",
  CATEGORY_DESC_PLACEHOLDER: "e.g., Freshly baked appetizers and savory finger foods",
  CATEGORY_ORDER_LABEL: "Display Order",
  CATEGORY_ORDER_PLACEHOLDER: "0",
  CATEGORY_ORDER_HINT: "Controls order of appearance on customer menus (lower numbers first).",
  CATEGORY_STATUS_LABEL: "Active Category",
  CATEGORY_STATUS_HINT: "Category and its items will be visible to customers.",
  BTN_CREATE_CATEGORY: "Create Category",
  BTN_CREATING_CATEGORY: "Creating...",
  CATEGORY_CREATED_SUCCESS: "Menu category created successfully.",
  CATEGORY_CREATE_FAILED: "Failed to create menu category.",

  MODAL_CREATE_ADDON_TITLE: "Create New Add-on",
  MODAL_CREATE_ADDON_DESC:
    "Define a reusable add-on that can be linked across multiple dishes (e.g. Extra Cheese, Garlic Dip).",
  ADDON_NAME_LABEL: "Add-on Name",
  ADDON_NAME_PLACEHOLDER: "e.g., Extra Cheese, Truffle Dip",
  ADDON_DESC_LABEL: "Description",
  ADDON_DESC_PLACEHOLDER: "e.g., Double layer melted mozzarella cheese",
  ADDON_PRICE_LABEL: "Standard Price (INR)",
  ADDON_PRICE_PLACEHOLDER: "50",
  ADDON_STATUS_LABEL: "Available",
  ADDON_STATUS_HINT: "In stock and selectable during checkout.",
  BTN_CREATE_ADDON: "Create Add-on",
  BTN_CREATING_ADDON: "Creating...",
  ADDON_CREATED_SUCCESS: "Add-on created successfully.",
  ADDON_CREATE_FAILED: "Failed to create add-on.",

  VALIDATION_ITEM_NAME_REQUIRED: "Menu item name is required",
  VALIDATION_ITEM_NAME_MAX: "Item name cannot exceed 255 characters",
  VALIDATION_CATEGORY_REQUIRED: "Please select a category",
  VALIDATION_DESCRIPTION_REQUIRED: "Description is required",
  VALIDATION_DESCRIPTION_MAX: "Description cannot exceed 1000 characters",
  VALIDATION_PREP_TIME_REQUIRED: "Preparation time is required",
  VALIDATION_PREP_TIME_POSITIVE: "Preparation time must be a positive number",
  VALIDATION_IMAGE_REQUIRED: "Menu item image is required",
  VALIDATION_VARIANTS_MIN: "At least one variant is required",
  VALIDATION_VARIANT_NAME_REQUIRED: "Variant name is required",
  VALIDATION_VARIANT_PORTION_REQUIRED: "Portion size description is required",
  VALIDATION_VARIANT_PRICE_REQUIRED: "Variant price is required",
  VALIDATION_VARIANT_PRICE_POSITIVE: "Variant price must be greater than 0",
  VALIDATION_VARIANT_PRICE_NON_NEGATIVE: "Price cannot be negative",
  VALIDATION_ONE_DEFAULT_VARIANT: "Exactly one variant must be designated as the default",
  VALIDATION_CATEGORY_NAME_REQUIRED: "Category name is required",
  VALIDATION_CATEGORY_NAME_MAX: "Category name cannot exceed 255 characters",
  VALIDATION_CATEGORY_ORDER_INTEGER: "Display order must be an integer",
  VALIDATION_ADDON_NAME_REQUIRED: "Add-on name is required",
  VALIDATION_ADDON_PRICE_REQUIRED: "Add-on price is required",
  VALIDATION_ADDON_PRICE_NON_NEGATIVE: "Add-on price cannot be negative",

  UPDATE_SUCCESS: "Menu category updated successfully.",
  UPDATE_ERROR: "Unable to update menu category. Please try again.",
  NAME_REQUIRED: "Category name cannot be empty.",
  NAME_MAX_LENGTH: "Category name must not exceed 255 characters.",
  DESCRIPTION_MAX_LENGTH: "Description must not exceed 1000 characters.",
  DISPLAY_ORDER_INVALID: "Display order must be a valid non-negative integer.",
  STATUS_INVALID: "Status must be valid.",
  RESTAURANT_ID_REQUIRED: "Restaurant ID is required.",
  FETCH_ERROR: "Failed to load menu categories.",
  ITEMS_FETCH_ERROR: "Failed to load menu items.",
  STAFF_ITEMS_FETCH_ERROR:
    "Failed to load staff menu items. Please check your connection and try again.",
  STAFF_MENU_TITLE: "Staff Menu Directory",
  STAFF_MENU_SUBTITLE:
    "Real-time menu catalog with live 86'd stock tracking, variant pricing, and category mapping.",
  NO_STAFF_MENU_ITEMS: "No menu items found.",
  NO_STAFF_MENU_ITEMS_DESC: "No menu items match your search or filter criteria.",
  CLEAR_FILTERS_BTN: "Clear Filters",
  ITEM_AVAILABILITY_UPDATE_FAILED: "Failed to update item availability",
  ITEM_MARKED_IN_STOCK: "Item marked as in stock",
  ITEM_MARKED_OUT_OF_STOCK: "Item marked as out of stock",
} as const;

export const MENU_CATEGORIES_QUERY_KEY = "menu-categories" as const;
export const MENU_ITEMS_QUERY_KEY = "menu-items" as const;
export const STAFF_MENU_ITEMS_QUERY_KEY = "staff-menu-items" as const;
