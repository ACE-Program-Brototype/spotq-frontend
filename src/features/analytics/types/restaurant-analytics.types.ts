/**
 * Restaurant Analytics Types
 * Strict typing reflecting backend SCRUM-1251 BFF response model.
 */

export const ANALYTICS_PERIODS = {
  DAY: "DAY",
  WEEK: "WEEK",
  MONTH: "MONTH",
  YEAR: "YEAR",
} as const;

export type AnalyticsPeriod = (typeof ANALYTICS_PERIODS)[keyof typeof ANALYTICS_PERIODS];

export const ORDER_STATUS_FILTERS = {
  ALL: "ALL",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const;

export type OrderStatusFilter = (typeof ORDER_STATUS_FILTERS)[keyof typeof ORDER_STATUS_FILTERS];

export const ANALYTICS_SECTION_STATUSES = {
  AVAILABLE: "AVAILABLE",
  UNAVAILABLE: "UNAVAILABLE",
} as const;

export type AnalyticsSectionStatus =
  (typeof ANALYTICS_SECTION_STATUSES)[keyof typeof ANALYTICS_SECTION_STATUSES];

export const PRODUCT_CLASSIFICATIONS = {
  ZERO_SALES: "ZERO_SALES",
  LOW_VOLUME: "LOW_VOLUME",
  NORMAL: "NORMAL",
} as const;

export type ProductClassification =
  (typeof PRODUCT_CLASSIFICATIONS)[keyof typeof PRODUCT_CLASSIFICATIONS];

export interface SectionErrorDto {
  code: string;
  message: string;
}

export interface RevenueMetricDto {
  netSalesRupees: number;
  discountRupees: number;
  totalBillAmountRupees: number;
  growthPercentage: number;
}

export type RevenueSectionResultDto =
  | ({ status: "AVAILABLE" } & RevenueMetricDto)
  | { status: "UNAVAILABLE"; error: SectionErrorDto };

export interface OrderMetricDto {
  totalOrderCount: number;
  dineInCount: number;
  takeawayCount: number;
  growthPercentage: number;
}

export type OrderSectionResultDto =
  | ({ status: "AVAILABLE" } & OrderMetricDto)
  | { status: "UNAVAILABLE"; error: SectionErrorDto };

export interface OperationMetricDto {
  dinersServedCount: number;
  uniqueCustomersCount: number;
}

export type OperationSectionResultDto =
  | ({ status: "AVAILABLE" } & OperationMetricDto)
  | { status: "UNAVAILABLE"; error: SectionErrorDto };

export interface OrderStatusDistributionDto {
  status: string;
  count: number;
  percentage: number;
  amountRupees: number;
}

export interface OrderStatusBreakdownDto {
  totalOrdersTracked: number;
  distribution: OrderStatusDistributionDto[];
}

export type OrderStatusBreakdownResultDto =
  | ({ status: "AVAILABLE" } & OrderStatusBreakdownDto)
  | { status: "UNAVAILABLE"; error: SectionErrorDto };

export interface ProductItemDto {
  menuItemId: string;
  name: string;
  quantitySold: number;
  salesRupees: number;
  isAvailable: boolean;
  percentageOfTotalSales?: number;
  classification?: ProductClassification;
}

export interface ProductRankingPaginationDto {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ProductSectionAvailableDto {
  status: "AVAILABLE";
  totalProductsCount: number;
  topSelling: {
    items: ProductItemDto[];
    pagination: ProductRankingPaginationDto;
  };
  slowMoving: {
    items: ProductItemDto[];
    pagination: ProductRankingPaginationDto;
  };
}

export type ProductSectionResultDto =
  | ProductSectionAvailableDto
  | { status: "UNAVAILABLE"; error: SectionErrorDto };

export interface RestaurantAnalyticsDashboardFiltersDto {
  interval: AnalyticsPeriod;
  day?: number | null;
  month: number;
  year: number;
  status: OrderStatusFilter;
  page: number;
  limit: number;
}

export interface RestaurantAnalyticsDashboardResponseDto {
  restaurantId: string;
  overview: {
    revenue: RevenueSectionResultDto;
    orders: OrderSectionResultDto;
    operations: OperationSectionResultDto;
  };
  orderStatusBreakdown: OrderStatusBreakdownResultDto;
  products: ProductSectionResultDto;
  filters: RestaurantAnalyticsDashboardFiltersDto;
  generatedAt: string;
}

export interface RestaurantAnalyticsQueryParams {
  interval?: AnalyticsPeriod;
  day?: number;
  month?: number;
  year?: number;
  status?: OrderStatusFilter;
  page?: number;
  limit?: number;
}
