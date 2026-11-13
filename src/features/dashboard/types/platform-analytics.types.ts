export const ANALYTICS_PERIOD_VALUES = {
  DAY: "DAY",
  WEEK: "WEEK",
  MONTH: "MONTH",
  YEAR: "YEAR",
} as const;

export type AnalyticsPeriod =
  (typeof ANALYTICS_PERIOD_VALUES)[keyof typeof ANALYTICS_PERIOD_VALUES];

export const BILLING_CYCLE_VALUES = {
  ALL: "ALL",
  MONTHLY: "MONTHLY",
  YEARLY: "YEARLY",
} as const;

export type BillingCycle = (typeof BILLING_CYCLE_VALUES)[keyof typeof BILLING_CYCLE_VALUES];

export const ANALYTICS_SECTION_STATUSES = {
  AVAILABLE: "AVAILABLE",
  UNAVAILABLE: "UNAVAILABLE",
} as const;

export type AnalyticsSectionStatus =
  (typeof ANALYTICS_SECTION_STATUSES)[keyof typeof ANALYTICS_SECTION_STATUSES];

export const ONBOARDING_FUNNEL_STAGES = {
  REGISTERED: "REGISTERED",
  APPROVED_ACTIVE: "APPROVED_ACTIVE",
  APPROVED: "APPROVED",
} as const;

export type OnboardingFunnelStage =
  (typeof ONBOARDING_FUNNEL_STAGES)[keyof typeof ONBOARDING_FUNNEL_STAGES];

export interface PlatformDashboardFilters {
  period: AnalyticsPeriod;
  day?: number | null;
  month?: number;
  year?: number;
  billingCycle: BillingCycle;
  from?: string | null;
  to?: string | null;
}

export interface SectionError {
  code: string;
  message: string;
}

export interface PlatformOverview {
  totalRestaurants: number;
  activeSubscribedRestaurants: number | null;
  subscriptionTierDistribution: Record<string, number> | null;
}

export interface CustomerGrowthSection {
  status: AnalyticsSectionStatus;
  totalRegisteredCustomers?: number;
  newCustomersInPeriod?: number;
  error?: SectionError;
}

export interface RevenueTimelinePoint {
  bucketLabel: string;
  grossRevenueRupees: number;
  mrrRupees: number;
  newSubscriptionsCount: number;
}

export interface RevenueSection {
  status: AnalyticsSectionStatus;
  grossSubscriptionRevenueRupees?: number;
  currentMrrRupees?: number;
  currentArrRupees?: number;
  growthPercentage?: number | null;
  timeline?: RevenueTimelinePoint[];
  error?: SectionError;
}

export interface FunnelStageItem {
  stage: string;
  count: number;
  label: string;
}

export interface OnboardingTrendItem {
  period: string;
  count: number;
}

export interface PlatformGrowth {
  onboardingFunnel: FunnelStageItem[];
  onboardingTrend: OnboardingTrendItem[];
}

export interface PlatformDashboardAnalyticsResponse {
  overview: PlatformOverview;
  customerGrowth: CustomerGrowthSection;
  revenue: RevenueSection;
  growth: PlatformGrowth;
  filters: {
    period: AnalyticsPeriod;
    day: number | null;
    month: number;
    year: number;
    billingCycle: BillingCycle;
    from?: string | null;
    to?: string | null;
  };
  generatedAt: string;
}
