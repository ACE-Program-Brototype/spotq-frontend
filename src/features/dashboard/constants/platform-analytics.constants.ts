import {
  ANALYTICS_PERIOD_VALUES,
  ANALYTICS_SECTION_STATUSES,
  type AnalyticsPeriod,
  BILLING_CYCLE_VALUES,
  type BillingCycle,
  ONBOARDING_FUNNEL_STAGES,
  type PlatformDashboardFilters,
} from "@/features/dashboard/types/platform-analytics.types";

export {
  ANALYTICS_PERIOD_VALUES,
  ANALYTICS_SECTION_STATUSES,
  BILLING_CYCLE_VALUES,
  ONBOARDING_FUNNEL_STAGES,
};

export const PLATFORM_ANALYTICS_ENDPOINTS = {
  DASHBOARD: "restaurants/admin/analytics/dashboard",
} as const;

export const PLATFORM_ANALYTICS_QUERY_KEYS = {
  all: ["admin", "analytics"] as const,
  dashboard: (filters: PlatformDashboardFilters) =>
    [...PLATFORM_ANALYTICS_QUERY_KEYS.all, "dashboard", filters] as const,
};

export const ANALYTICS_PERIODS: { label: string; value: AnalyticsPeriod }[] = [
  { label: "Daily", value: ANALYTICS_PERIOD_VALUES.DAY },
  { label: "Weekly", value: ANALYTICS_PERIOD_VALUES.WEEK },
  { label: "Monthly", value: ANALYTICS_PERIOD_VALUES.MONTH },
  { label: "Yearly", value: ANALYTICS_PERIOD_VALUES.YEAR },
];

export const BILLING_CYCLES: { label: string; value: BillingCycle }[] = [
  { label: "All Cycles", value: BILLING_CYCLE_VALUES.ALL },
  { label: "Monthly", value: BILLING_CYCLE_VALUES.MONTHLY },
  { label: "Yearly", value: BILLING_CYCLE_VALUES.YEARLY },
];

export { MONTH_OPTIONS, type MonthOption } from "@/lib/constants/date.constants";

export const getYearOptions = (currentYear: number = new Date().getFullYear()) => [
  currentYear,
  currentYear - 1,
  currentYear - 2,
  currentYear - 3,
];

export const getDefaultFilters = (): PlatformDashboardFilters => {
  const now = new Date();
  return {
    period: ANALYTICS_PERIOD_VALUES.MONTH,
    month: now.getMonth() + 1,
    year: now.getFullYear(),
    billingCycle: BILLING_CYCLE_VALUES.ALL,
  };
};

export const EXPORT_REPORT_TYPES = {
  FINANCE: "finance",
  GROWTH: "growth",
  CUSTOMERS: "customers",
} as const;

export type ExportReportType = (typeof EXPORT_REPORT_TYPES)[keyof typeof EXPORT_REPORT_TYPES];

export const EXPORT_FORMATS = {
  CSV: "csv",
  PDF: "pdf",
} as const;

export type ExportFormat = (typeof EXPORT_FORMATS)[keyof typeof EXPORT_FORMATS];

export const PLATFORM_ANALYTICS_MESSAGES = {
  PAGE_TITLE: "Platform Analytics & Executive Dashboard",
  PAGE_SUBTITLE: "Real-time metrics, revenue performance, and restaurant growth analytics",
  REFRESH_BUTTON: "Refresh Analytics",
  EXPORT_BUTTON: "Export reports",
  ERROR_TITLE: "Failed to load platform analytics",
  ERROR_DESCRIPTION:
    "There was an error communicating with the analytics aggregator. Please check your network and try again.",
  RETRY: "Retry",
  PAYMENT_SERVICE_UNAVAILABLE: "Payment Service revenue metrics are temporarily unavailable",
  USER_SERVICE_UNAVAILABLE: "User Service customer growth metrics are temporarily unavailable",
} as const;

export const REVENUE_TIMELINE_CONSTANTS = {
  TITLE: "Revenue & Growth Timeline",
  SUBTITLE: "Subscription revenue performance & dynamic revenue run-rate",
  UNAVAILABLE_TITLE: "Subscription Revenue Metrics Unavailable",
  UNAVAILABLE_SERVICE: "spotq-payment-service",
  EMPTY_TIMELINE: "No revenue activity recorded in selected timeframe.",
  FOOTER_TIMEZONE: "Timeline breakdown (Asia/Kolkata)",
  LEGEND_GROSS: "Gross Revenue",
  GROSS_REVENUE_LABEL: "Gross Subscription Revenue",
  MRR_LABEL: "Monthly Revenue",
  ARR_LABEL: "Annual Revenue",
  TOOLTIP_GROSS: "Gross Revenue:",
  TOOLTIP_MRR: "Monthly Revenue:",
  TOOLTIP_NEW_SUBSCRIPTIONS: "New Subscriptions:",
} as const;

