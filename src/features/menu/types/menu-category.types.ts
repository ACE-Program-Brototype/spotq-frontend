/**
 * Menu Category Type Definitions
 * Represents category domain entities, API payloads, and form values.
 */

export interface MenuCategory {
  id: string;
  restaurantId: string;
  name: string;
  description: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateMenuCategoryPayload {
  name?: string;
  description?: string | null;
  displayOrder?: number;
  isActive?: boolean;
}

export interface MenuCategoryFormValues {
  name: string;
  description: string;
  displayOrder: number;
  isActive: boolean;
}

export interface MenuCategoryApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: MenuCategory;
}

export interface MenuCategoriesListApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: MenuCategory[];
}
