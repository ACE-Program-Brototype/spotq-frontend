/**
 * Customer Restaurant Details Data Types
 * Matches the backend CustomerRestaurantDetailsOutputDTO contract from spotq-restaurant-service.
 */

export interface CustomerRestaurantAddress {
  id: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  country: string;
  pincode: string;
  latitude: number;
  longitude: number;
}

export interface CustomerRestaurantSettings {
  isOpened: boolean;
  isPreorder: boolean;
  acceptsQueue: boolean;
  acceptsQrOrders: boolean;
}

export interface CustomerRestaurantOperatingHour {
  id: string;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  isOpen: boolean;
  openTime: string | null;
  closeTime: string | null;
}

export interface CustomerRestaurantImage {
  id: string;
  objectKey: string;
  displayOrder: number;
}

export interface CustomerRestaurantVariant {
  id: string;
  name: string;
  price: number;
  isDefault: boolean;
  isAvailable: boolean;
}

export interface CustomerRestaurantAddon {
  id: string;
  addonId: string;
  name: string;
  description: string | null;
  price: number;
  imageKey: string | null;
  isAvailable: boolean;
}

export interface CustomerRestaurantMenuItemImage {
  id: string;
  objectKey: string;
  displayOrder: number;
}

export interface CustomerRestaurantMenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  preparationTime: number | null;
  calories: number | null;
  isVegetarian: boolean;
  isFeatured: boolean;
  isAvailable: boolean;
  images: CustomerRestaurantMenuItemImage[];
  variants: CustomerRestaurantVariant[];
  addons: CustomerRestaurantAddon[];
}

export interface CustomerRestaurantMenuCategory {
  id: string;
  name: string;
  description: string | null;
  displayOrder: number;
  items: CustomerRestaurantMenuItem[];
}

export interface CustomerRestaurantDetails {
  id: string;
  restaurantName: string;
  phone: string;
  email: string;
  description: string | null;
  cuisineType: string | null;
  averageCost: number | null;
  coverImage: string | null;
  address: CustomerRestaurantAddress | null;
  settings: CustomerRestaurantSettings | null;
  operatingHours: CustomerRestaurantOperatingHour[];
  images: CustomerRestaurantImage[];
  menu: CustomerRestaurantMenuCategory[];
}
