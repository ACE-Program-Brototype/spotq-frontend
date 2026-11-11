import type { RestaurantAnalyticsDashboardResponseDto } from "../types/restaurant-analytics.types";

export const mockAnalyticsDashboardData: RestaurantAnalyticsDashboardResponseDto = {
  restaurantId: "3dc35af0-3ff5-4ee9-a60a-fbb47124731b",
  overview: {
    revenue: {
      status: "AVAILABLE",
      netSalesRupees: 184500,
      discountRupees: 15500,
      totalBillAmountRupees: 200000,
      growthPercentage: 14.2,
    },
    orders: {
      status: "AVAILABLE",
      totalOrderCount: 450,
      dineInCount: 320,
      takeawayCount: 130,
      growthPercentage: 9.8,
    },
    operations: {
      status: "AVAILABLE",
      dinersServedCount: 0,
      uniqueCustomersCount: 380,
    },
  },
  orderStatusBreakdown: {
    status: "AVAILABLE",
    totalOrdersTracked: 450,
    distribution: [
      {
        status: "COMPLETED",
        count: 425,
        percentage: 94.44,
        amountRupees: 178000,
      },
      {
        status: "CANCELLED",
        count: 25,
        percentage: 5.56,
        amountRupees: 6500,
      },
    ],
  },
  products: {
    status: "AVAILABLE",
    totalProductsCount: 36,
    topSelling: {
      items: [
        {
          menuItemId: "item-1",
          name: "Butter Chicken",
          quantitySold: 120,
          salesRupees: 48000,
          isAvailable: true,
          percentageOfTotalSales: 26.0,
          classification: "NORMAL",
        },
        {
          menuItemId: "item-2",
          name: "Garlic Naan",
          quantitySold: 210,
          salesRupees: 14700,
          isAvailable: true,
          percentageOfTotalSales: 8.0,
          classification: "NORMAL",
        },
      ],
      pagination: {
        totalItems: 12,
        totalPages: 2,
        currentPage: 1,
        limit: 10,
        hasNextPage: true,
        hasPrevPage: false,
      },
    },
    slowMoving: {
      items: [
        {
          menuItemId: "item-3",
          name: "Truffle Pasta",
          quantitySold: 2,
          salesRupees: 1200,
          isAvailable: true,
          percentageOfTotalSales: 0.6,
          classification: "LOW_VOLUME",
        },
        {
          menuItemId: "item-4",
          name: "Dragon Fruit Cooler",
          quantitySold: 0,
          salesRupees: 0,
          isAvailable: false,
          percentageOfTotalSales: 0,
          classification: "ZERO_SALES",
        },
      ],
      pagination: {
        totalItems: 5,
        totalPages: 1,
        currentPage: 1,
        limit: 10,
        hasNextPage: false,
        hasPrevPage: false,
      },
    },
  },
  filters: {
    interval: "MONTH",
    day: null,
    month: 11,
    year: 2026,
    status: "ALL",
    page: 1,
    limit: 10,
  },
  generatedAt: "2026-11-11T02:00:00.000Z",
};

export const mockDegradedAnalyticsData: RestaurantAnalyticsDashboardResponseDto = {
  restaurantId: "3dc35af0-3ff5-4ee9-a60a-fbb47124731b",
  overview: {
    revenue: {
      status: "UNAVAILABLE",
      error: {
        code: "ORDER_SERVICE_UNAVAILABLE",
        message: "Revenue metrics unavailable",
      },
    },
    orders: {
      status: "UNAVAILABLE",
      error: {
        code: "ORDER_SERVICE_UNAVAILABLE",
        message: "Order metrics unavailable",
      },
    },
    operations: {
      status: "UNAVAILABLE",
      error: {
        code: "ORDER_SERVICE_UNAVAILABLE",
        message: "Operations metrics unavailable",
      },
    },
  },
  orderStatusBreakdown: {
    status: "UNAVAILABLE",
    error: {
      code: "ORDER_SERVICE_UNAVAILABLE",
      message: "Order status breakdown unavailable",
    },
  },
  products: {
    status: "UNAVAILABLE",
    error: {
      code: "ORDER_SERVICE_UNAVAILABLE",
      message: "Product performance metrics unavailable",
    },
  },
  filters: {
    interval: "MONTH",
    day: null,
    month: 11,
    year: 2026,
    status: "ALL",
    page: 1,
    limit: 10,
  },
  generatedAt: "2026-11-11T02:00:00.000Z",
};
