export type AnalyticsPeriod = "DAY" | "WEEK" | "MONTH" | "YEAR";
export type BillingCycle = "ALL" | "MONTHLY" | "YEARLY";
export type AnalyticsSectionStatus = "AVAILABLE" | "UNAVAILABLE";

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
