import type { ApiResponse } from "@/features/auth/services/auth.service";

export interface RestaurantOverviewDetails {
  name: string;
  phone: string;
  ownerName: string;
}

export interface RestaurantProfileDetails {
  logo: string | null;
  coverImage: string | null;
  description: string | null;
  cuisineType: string | null;
  averageCost: number;
}

export interface RestaurantSettingsDetails {
  acceptsQueue: boolean;
  acceptsQrOrders: boolean;
  loyaltyEnabled: boolean;
  autoAcceptQueue: boolean;
}

export interface BusinessHoursItem {
  dayOfWeek: number;
  openTime: string | null;
  closeTime: string | null;
  isClosed: boolean;
}

export interface RestaurantProfileData {
  restaurant: RestaurantOverviewDetails;
  profile: RestaurantProfileDetails;
  settings: RestaurantSettingsDetails;
  businessHours: BusinessHoursItem[];
}

export type RestaurantProfileApiResponse = ApiResponse<RestaurantProfileData>;
